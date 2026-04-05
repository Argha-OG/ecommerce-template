"use client"

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

export default function OrderStatusSelect({ id, currentStatus, onUpdate }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ["Pending", "Completed", "Cancelled"];

  async function updateStatus(newStatus) {
    if (newStatus === status) return;
    
    setLoading(true);
    setIsOpen(false);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await res.json();
      if (result.success) {
        setStatus(newStatus);
        if (onUpdate) onUpdate();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (err) {
      alert("An error occurred while updating status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full border transition-all ${
          loading ? 'opacity-50' : ''
        } ${
          status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 
          status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' :
          'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
        }`}
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : status}
        <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-32 bg-white border border-zinc-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                s === status ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
