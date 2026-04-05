import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

export async function fetchExternalProducts(category = null) {
  try {
    await dbConnect();
    
    // Mongoose query filter logic
    const filter = {};
    if (category && category !== "all") {
       filter.category = category;
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
    
  } catch (error) {
    console.error("Live DB Error:", error);
    return [];
  }
}
