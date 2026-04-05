"use client"

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProduct } from "@/actions/product";

export default function DeleteProductButton({ id, sku }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const isConfirmed = confirm(`Are you sure you want to delete ${sku}? This action is permanent and will remove all associated inventory data.`);
    
    if (isConfirmed) {
      setLoading(true);
      try {
        const result = await deleteProduct(id);
        if (result.success === false) {
           alert(result.error || "Failed to delete product.");
        }
      } catch (err) {
        alert("An error occurred while deleting the product.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${loading ? 'opacity-50' : 'text-zinc-300 hover:text-red-600 hover:bg-red-50'}`}
      title="Delete Product"
    >
      {loading ?<Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} strokeWidth={1.5} />}
    </button>
  );
}
