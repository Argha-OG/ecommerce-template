"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductSuggestions({ products, currentSku, category }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Exclude the currently viewed product
    const otherProducts = products.filter(p => p.sku !== currentSku);
    
    // Prioritize products from the same category
    const sameCategory = otherProducts.filter(p => p.category === category);
    const diffCategory = otherProducts.filter(p => p.category !== category);

    // Shuffle arrays for random selection
    const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

    let selected = shuffleArray(sameCategory);
    
    // If we don't have 4 products in the same category, pad with other categories
    if (selected.length < 4) {
      const paddingNeeded = 4 - selected.length;
      selected = [...selected, ...shuffleArray(diffCategory).slice(0, paddingNeeded)];
    }

    setSuggestions(selected.slice(0, 4));
  }, [products, currentSku, category]);

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <section className="mt-24 pt-16 border-t border-zinc-200">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Curated For You</span>
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 tracking-tight">You May Also Like</h2>
        </div>
        <Link href="/collections/all" className="hidden sm:block text-sm font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-1 hover:text-accent transition-colors">
          View Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {suggestions.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", bounce: 0.2 }}
            className="group flex flex-col h-full bg-white p-3 rounded-3xl border border-transparent hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
          >
            <Link href={`/product/${product.sku}`} className="flex flex-col h-full">
              <div className="w-full aspect-3/4 bg-zinc-100 mb-5 overflow-hidden relative rounded-2xl border border-zinc-200/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 font-serif bg-zinc-50">
                      <span className="text-3xl mb-2 tracking-tighter">ZYNZYR</span>
                      <span className="text-xs uppercase tracking-widest">{product.category || 'Apparel'}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="font-serif text-lg md:text-xl mb-1 truncate text-zinc-900 group-hover:text-accent transition-colors px-1">{product.name}</h3>
              <div className="pt-2 font-medium flex items-center justify-between text-zinc-600 px-1 mb-4">
                  <span>RM {product.price.toFixed(2)}</span>
                  {product.stock <= 3 && product.stock > 0 && <span className="text-[10px] text-red-600 font-bold tracking-wide uppercase bg-red-50 px-2 py-1 rounded-md whitespace-nowrap">Only {product.stock} left</span>}
                  {product.stock === 0 && <span className="text-[10px] text-zinc-500 uppercase tracking-wide bg-zinc-100 px-2 py-1 rounded-md">Out of Stock</span>}
              </div>
            </Link>
            
            <div className="mt-auto pt-2">
              <AddToCartButton product={product} variant="card" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-10 sm:hidden text-center">
        <Link href="/collections/all" className="inline-block px-8 py-3 bg-zinc-900 text-white text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-zinc-800 transition-colors">
          View Collection
        </Link>
      </div>
    </section>
  );
}
