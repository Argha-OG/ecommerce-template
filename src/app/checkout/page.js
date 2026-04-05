"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import Link from "next/link";
import { ChevronLeft, Send, ShieldCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const sku = searchParams.get("sku");
  const { cart, cartTotal, isClient, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const storeWhatsAppNumber = "60123456789"; 
    
    let orderItems = "*Items:*%0A";
    if (cart.length > 0) {
      cart.forEach(item => {
        orderItems += `- ${item.name} (${item.sku}) x${item.quantity} (RM ${(item.price * item.quantity).toFixed(2)})%0A`;
      });
    } else if (sku) {
      orderItems += `- Single Piece: ${sku}%0A`;
    }

    const message = `*NEW ORDER - ZYNZYR*%0A%0A*Customer Info*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email || 'N/A'}%0AAddress: ${formData.address}%0A%0A*Order Details*%0A${orderItems}%0A*Total: RM ${cartTotal.toFixed(2)}*%0A%0ANotes: ${formData.notes || 'None'}%0A%0APlease confirm my order.`;
    
    clearCart(); 
    window.location.href = `https://wa.me/${storeWhatsAppNumber}?text=${message}`;
  };

  if (!isClient) return null; 

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      
      <div className="mb-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
          <ChevronLeft size={16} />
          <span>Return to Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left: Form */}
        <div className="lg:col-span-7">
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-4">Verification</h1>
            <p className="text-zinc-500 max-w-md leading-relaxed text-sm font-medium uppercase tracking-widest">
              Please provide your delivery details to generate your curated order manifest.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full p-4 border border-zinc-200 bg-white rounded-2xl focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-sm" 
                  placeholder="E.g. Argha OG"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">WhatsApp Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+60..." 
                  className="w-full p-4 border border-zinc-200 bg-white rounded-2xl focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Email Address (Optional)</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full p-4 border border-zinc-200 bg-white rounded-2xl focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-sm" 
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Shipping Address</label>
              <textarea 
                required 
                name="address" 
                rows="3" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full p-4 border border-zinc-200 bg-white rounded-2xl focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-sm resize-none" 
                placeholder="Include City, Postal Code, and State"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Special Notes for Courier</label>
              <textarea 
                name="notes" 
                rows="2" 
                value={formData.notes} 
                onChange={handleChange} 
                className="w-full p-4 border border-zinc-200 bg-white rounded-2xl focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-sm resize-none" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-zinc-900 text-white text-sm font-bold py-5 rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <span>Submit via WhatsApp</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32">
           <div className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-8 shadow-sm">
             <h2 className="text-2xl font-serif text-zinc-900 mb-8 tracking-tight border-b border-zinc-200 pb-4">Manifest</h2>
             
             {cart.length > 0 ? (
               <ul className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                 {cart.map((item) => (
                   <li key={item.sku} className="flex justify-between items-start text-sm">
                     <div className="flex flex-col">
                       <span className="font-bold text-zinc-900">{item.name}</span>
                       <span className="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-medium">{item.quantity} × RM {item.price.toFixed(2)}</span>
                     </div>
                     <span className="font-bold text-zinc-900">RM {(item.price * item.quantity).toFixed(2)}</span>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-zinc-500 text-sm mb-8 py-4 px-2 border border-dashed border-zinc-200 rounded-xl text-center">No pieces identified in manifest.</p>
             )}

             <div className="border-t border-zinc-200 pt-6 mt-6">
                <div className="flex justify-between items-center mb-10">
                   <span className="text-lg font-serif text-zinc-900">Total</span>
                   <span className="text-2xl font-bold text-zinc-900 tracking-tight">RM {cartTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      <ShieldCheck size={16} className="text-green-600" />
                      <span>Encrypted Order Data</span>
                   </div>
                   <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      <CreditCard size={16} className="text-zinc-400" />
                      <span>COD / Bank Transfer Available</span>
                   </div>
                </div>
             </div>
           </div>
        </aside>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 font-serif text-2xl tracking-tighter animate-pulse">Initializing Manifest...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

