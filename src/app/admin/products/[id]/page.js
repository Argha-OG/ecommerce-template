import { getProductById, updateProduct } from "@/actions/product";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Pre-bind the ID to the server action
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="flex justify-center py-10 px-4">
      <ProductForm 
        initialData={product} 
        action={updateProductWithId} 
        title={`Edit Product: ${product.sku}`}
      />
    </div>
  );
}
