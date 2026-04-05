"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProductForm({ 
  initialData = null, 
  action, 
  title = "Add New Product" 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await action(formData);
      if (result?.success === false) {
        setError(result.error || "Something went wrong. Please try again.");
      } else {
        // Actions that use redirect() will trigger navigation automatically
        // If not, we manually navigate
        if (!result) return; // createProduct redirects automatically
        router.push("/admin/products");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl border border-zinc-200 p-8 rounded-3xl bg-white shadow-sm">
      <h1 className="text-3xl font-serif mb-8 border-b border-zinc-100 pb-6 text-zinc-900">{title}</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Product Name</label>
            <input 
              required 
              type="text" 
              name="name" 
              defaultValue={initialData?.name || ""}
              className="w-full p-4 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all" 
              placeholder="e.g. Silk Evening Gown"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">SKU</label>
            <input 
              required 
              type="text" 
              name="sku" 
              defaultValue={initialData?.sku || ""}
              className="w-full p-4 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all" 
              placeholder="ZYN-001" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Price (RM)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold">RM</span>
              <input 
                required 
                type="number" 
                step="0.01" 
                name="price" 
                defaultValue={initialData?.price || ""}
                className="w-full p-4 pl-12 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Inventory Stock</label>
            <input 
              required 
              type="number" 
              name="stock" 
              defaultValue={initialData?.stock || ""}
              className="w-full p-4 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Category Tag</label>
            <input 
              required 
              type="text" 
              name="category" 
              defaultValue={initialData?.category || ""}
              className="w-full p-4 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all" 
              placeholder="e.g. Dresses"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Narrative Description</label>
          <textarea 
            required 
            rows="5" 
            name="description" 
            defaultValue={initialData?.description || ""}
            className="w-full p-4 border border-zinc-100 rounded-2xl outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-sm font-medium transition-all resize-none" 
            placeholder="Tell the product's story..."
          />
          <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
             <span className="text-zinc-900 text-lg leading-none">♦</span>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
               The Automatic SEO Engine will instantly digest the first 160 characters into rich index snippets for Google.
             </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Media Asset (Cloudinary)</label>
          <div className="relative w-full p-10 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center bg-zinc-50/30 group hover:bg-zinc-50 transition-colors">
            {initialData?.images?.[0] && !loading && (
              <div className="absolute right-6 top-6 w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 shadow-sm transition-transform group-hover:scale-110">
                <img src={initialData.images[0]} alt="Current" className="w-full h-full object-cover" />
              </div>
            )}
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="block w-full text-xs text-zinc-400 file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-900 file:text-white hover:file:bg-accent transition-all cursor-pointer" 
            />
            <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.2em]">Max limit: 12MB. Current image preserved if left empty.</p>
          </div>
        </div>

        {/* Hidden inputs for editing */}
        {initialData?.images && (
           <input type="hidden" name="existingImages" value={initialData.images.join(",")} />
        )}

        <div className="pt-8 border-t border-zinc-100 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Discard Changes
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-3 bg-zinc-900 text-white px-10 py-5 font-black text-[10px] tracking-widest uppercase rounded-full shadow-2xl hover:bg-accent transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Syncing...
              </>
            ) : (
              initialData ? "Update Product & SEO" : "Publish Product & SEO"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
