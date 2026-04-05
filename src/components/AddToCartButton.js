"use client";

import { useCart } from "@/providers/CartProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartButton({ product, variant = "full" }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product);
    router.push("/checkout");
  };

  const isCard = variant === "card";

  if (product.stock < 1) {
    return (
      <button 
        disabled
        className={`w-full bg-zinc-100 text-zinc-400 font-bold tracking-widest uppercase cursor-not-allowed border border-zinc-200 ${isCard ? 'py-2.5 text-[10px]' : 'py-4 rounded-full'}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`flex ${isCard ? 'flex-row gap-2' : 'flex-col sm:flex-row gap-4'} w-full`}>
      <button 
        onClick={handleAddToCart}
        className={`flex-1 bg-white text-zinc-900 border-2 border-zinc-900 font-bold tracking-widest uppercase hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${isCard ? 'py-2 px-1 text-[10px] rounded-lg' : 'py-4 rounded-full'}`}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="added"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-1 text-green-600"
            >
              <Check size={isCard ? 14 : 20} strokeWidth={2.5} />
              <span>Added</span>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-1"
            >
              <ShoppingBag size={isCard ? 14 : 20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              <span className={isCard ? 'hidden min-[400px]:inline' : ''}>Add to Cart</span>
              <span className={isCard ? 'inline min-[400px]:hidden' : 'hidden'}>Add</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <button 
        onClick={handleBuyNow}
        className={`flex-1 bg-zinc-900 text-white font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${isCard ? 'py-2 px-1 text-[10px] rounded-lg' : 'py-4 rounded-full'}`}
      >
        <CreditCard size={isCard ? 14 : 20} strokeWidth={1.5} />
        <span className={isCard ? 'hidden min-[400px]:inline' : ''}>Buy Now</span>
        <span className={isCard ? 'inline min-[400px]:hidden' : 'hidden'}>Buy</span>
      </button>
    </div>
  );
}


