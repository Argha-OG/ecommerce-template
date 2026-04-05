"use client";

import { useCart } from "@/providers/CartProvider";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, isClient } = useCart();

  if (!isClient) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-100 shadow-sm">
             <ShoppingBag size={40} className="text-zinc-300" strokeWidth={1} />
          </div>
          <h1 className="text-4xl font-serif mb-4 text-zinc-900 tracking-tight">Your cart is empty</h1>
          <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
            Beautiful pieces are waiting for you in our latest collection.
          </p>
          <Link 
            href="/collections/all" 
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <span>Explore Collection</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <header className="mb-12 md:mb-16 text-center md:text-left">
           <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-4">Shopping Bag</h1>
           <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Verified Collection Piece(s): {cart.length}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Cart List */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  key={item.sku}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col sm:flex-row gap-6 p-1 border-b border-zinc-100 pb-8 last:border-0"
                >
                  <Link href={`/product/${item.sku}`} className="shrink-0">
                    <div className="w-full sm:w-32 aspect-3/4 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200/50 shadow-sm relative group">
                       {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-zinc-200 text-xl tracking-tighter">ZYNZYR</div>
                       )}
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/product/${item.sku}`}>
                          <h3 className="text-xl font-serif text-zinc-900 hover:text-accent transition-colors">{item.name}</h3>
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.sku)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">{item.category || "Apparel"}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-full p-1 w-fit">
                          <button 
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-zinc-600 transition-colors shadow-sm active:scale-90"
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-zinc-600 transition-colors shadow-sm active:scale-90"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                       </div>
                       <div className="text-right">
                          <span className="block text-lg font-medium text-zinc-900">RM {(item.price * item.quantity).toFixed(2)}</span>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">RM {item.price.toFixed(2)} each</span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Column */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
             <div className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-zinc-900 mb-8 tracking-tight">Order Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm">
                   <div className="flex justify-between items-center text-zinc-600 font-medium uppercase tracking-wide">
                      <span>Subtotal</span>
                      <span className="text-zinc-900">RM {cartTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-zinc-600 font-medium uppercase tracking-wide">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">COMPLIMENTARY</span>
                   </div>
                   <div className="border-t border-zinc-200 pt-4 mt-4 flex justify-between items-center">
                      <span className="text-lg font-serif text-zinc-900">Total Pieces</span>
                      <span className="text-2xl font-bold text-zinc-900 leading-none">RM {cartTotal.toFixed(2)}</span>
                   </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full bg-zinc-900 text-white font-bold tracking-widest uppercase py-5 rounded-full flex items-center justify-center gap-3 transition-all hover:bg-zinc-800 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>

                <p className="mt-6 text-center text-xs text-zinc-400 font-medium uppercase tracking-widest leading-relaxed">
                   Complimentary express delivery and seamless returns included.
                </p>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
