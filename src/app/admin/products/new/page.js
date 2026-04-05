import { createProduct } from "@/actions/product";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex justify-center py-10 px-4">
      <ProductForm 
        action={createProduct} 
        title="Add New Product"
      />
    </div>
  );
}
