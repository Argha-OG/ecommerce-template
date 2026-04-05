"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddToCartButton from '@/components/AddToCartButton';

export default function ShopClient({ initialProducts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [initialProducts]);

  // Reset pagination when filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const processedProducts = useMemo(() => {
    let result = initialProducts.filter(p => {
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    // "newest" preserves db initial array order assuming `fetchExternalProducts` sorts by createdAt

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortOption]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Filters & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60 shadow-sm">
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(setSelectedCategory, cat)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-zinc-900 text-white shadow-md transform scale-105' 
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          
          <div className="relative w-full sm:w-auto min-w-[160px] group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-hover:text-zinc-900 transition-colors">
              <SlidersHorizontal size={16} strokeWidth={2} />
            </div>
            <select
              value={sortOption}
              onChange={(e) => handleFilterChange(setSortOption, e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-white border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm text-sm appearance-none font-medium text-zinc-700 cursor-pointer"
            >
              <option value="newest">Latest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              <Search size={18} strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid Status */}
      <div className="mb-6 text-sm font-medium tracking-wide text-zinc-500 uppercase flex justify-between items-center">
        <span>Showing {paginatedProducts.length} of {processedProducts.length} pieces</span>
      </div>

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 min-h-[40vh]">
        <AnimatePresence mode="popLayout">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2, delay: idx * 0.05 }}
                className="group flex flex-col h-full bg-white p-3 rounded-3xl border border-transparent hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
              >
                <Link href={`/product/${product.sku}`} className="flex flex-col h-full">
                  <div className="w-full aspect-3/4 bg-zinc-100 mb-5 overflow-hidden relative rounded-2xl border border-zinc-200/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
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
                  
                  <h3 className="font-serif text-xl mb-1 truncate text-zinc-900 group-hover:text-accent transition-colors px-1">{product.name}</h3>
                  <div className="pt-2 font-medium flex items-center justify-between text-zinc-600 px-1 mb-4">
                      <span>RM {product.price.toFixed(2)}</span>
                      {product.stock <= 3 && product.stock > 0 && <span className="text-[10px] text-red-600 font-bold tracking-wide uppercase bg-red-50 px-2 py-1 rounded-md whitespace-nowrap">Only {product.stock} left</span>}
                      {product.stock === 0 && <span className="text-[10px] text-zinc-500 uppercase tracking-wide bg-zinc-100 px-2 py-1 rounded-md">Out of Stock</span>}
                  </div>
                </Link>
                
                {/* Compact Actions */}
                <div className="mt-auto pt-2">
                  <AddToCartButton product={product} variant="card" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-32 border border-dashed border-zinc-300 bg-zinc-50/50 rounded-3xl"
            >
              <h3 className="text-3xl font-serif mb-4 text-zinc-900">No Pieces Found</h3>
              <p className="text-zinc-500 max-w-md mx-auto text-center text-lg leading-relaxed">
                We couldn't find anything matching your filter criteria. Try viewing 'All' categories or removing your search.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortOption("newest"); }}
                className="mt-8 px-8 py-3 bg-zinc-900 text-white font-medium uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-full"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Viewing Collection Page {currentPage}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            
            <div className="flex gap-2 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                    currentPage === i + 1 
                      ? 'bg-zinc-900 text-white shadow-md' 
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
