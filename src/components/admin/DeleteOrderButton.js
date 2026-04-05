"use client"

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteOrderButton({ id, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const isConfirmed = confirm(`Are you sure you want to delete this order? This action is permanent and should only be used for duplicates or errors.`);
    
    if (isConfirmed) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "DELETE",
        });
        
        const result = await res.json();
        if (result.success) {
          if (onDeleted) onDeleted();
        } else {
          alert(result.error || "Failed to delete order");
        }
      } catch (err) {
        alert("An error occurred while deleting the order");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${loading ? 'opacity-50' : 'text-zinc-300 hover:text-red-500 hover:bg-red-50'}`}
      title="Delete Order"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={1.5} />}
    </button>
  );
}
