"use client"

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteCustomerButton({ id, name, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const isConfirmed = confirm(`Are you sure you want to delete ${name}? This action is permanent and will remove all their lifetime value data and order history from the CRM.`);
    
    if (isConfirmed) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/crm/${id}`, {
          method: "DELETE",
        });
        
        const result = await res.json();
        if (result.success) {
          if (onDeleted) onDeleted();
        } else {
          alert(result.error || "Failed to delete customer");
        }
      } catch (err) {
        alert("An error occurred while deleting the customer");
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
      title="Delete Customer"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} strokeWidth={1.5} />}
    </button>
  );
}
