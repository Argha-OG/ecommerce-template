"use server";

import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "./upload"; // Import Cloudinary handler

export async function createProduct(formData) {
  try {
    await dbConnect();

    // 1. Process Image Upload via Cloudinary Server Action directly
    const imageFile = formData.get("image");
    let uploadedImageUrls = [];
    
    if (imageFile && imageFile.size > 0) {
      // Create a dedicated mini FormData specifically for the media server action
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      
      const uploadResult = await uploadImage(uploadData);
      
      if (uploadResult.success) {
         uploadedImageUrls.push(uploadResult.url);
      } else {
         console.error("Cloudinary upload rejected:", uploadResult.error);
         // Gracefully continue with no image or throw depending on strictness
      }
    }

    const productData = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
      description: formData.get("description"),
      images: uploadedImageUrls
    };

    // Construct Product (the Mongoose schema pre-save hook will automatically populate seoTitle and seoDescription)
    const newProduct = new Product(productData);
    await newProduct.save();

    // Revalidate paths to instantly show new inventory and SEO metadata across the storefront
    revalidatePath("/");
    revalidatePath("/collections/all");
    revalidatePath("/admin/products");

  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }

  redirect("/admin/products");
}

export async function getProducts(page = 1, limit = 10, q = "", sortBy = "createdAt", order = "desc") {
  try {
    await dbConnect();
    
    const skip = (page - 1) * limit;
    
    // Build search filter
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { sku: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } }
        ]
      };
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default fallback
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    
    // Convert Mongoose _id to string for Server Components
    return {
      products: JSON.parse(JSON.stringify(products)),
      totalPages,
      totalCount,
      currentPage: page
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      products: [],
      totalPages: 0,
      totalCount: 0,
      currentPage: page
    };
  }
}

export async function getProductById(id) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function updateProduct(id, formData) {
  try {
    await dbConnect();
    
    // 1. Process potential image update (if a new file is provided)
    const imageFile = formData.get("image");
    let finalImages = formData.get("existingImages")?.split(",") || [];

    if (imageFile && imageFile.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadResult = await uploadImage(uploadData);
      if (uploadResult.success) {
         finalImages = [uploadResult.url]; 
      }
    }

    const updateData = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
      description: formData.get("description"),
      images: finalImages
    };

    await Product.findByIdAndUpdate(id, updateData, { new: true });

    revalidatePath("/");
    revalidatePath("/collections/all");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id) {
  try {
    await dbConnect();
    await Product.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/collections/all");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}



