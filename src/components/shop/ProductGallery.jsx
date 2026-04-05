"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ProductGallery({ images, fallbackName, category }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLightboxOpen]);

  // If no images exist from db
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-3/4 bg-zinc-50 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl">
         <span className="font-serif text-4xl mb-2 text-zinc-300 tracking-tighter">ZYNZYR</span>
         <span className="text-sm uppercase tracking-widest text-zinc-400">{category || "Apparel"}</span>
      </div>
    );
  }

  const nextImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Main Image */}
      <div 
        className="w-full aspect-3/4 bg-zinc-50 overflow-hidden relative rounded-2xl cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            src={images[activeIndex]}
            alt={`${fallbackName} - View ${activeIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        </AnimatePresence>

        {/* Zoom Hint Icon */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
          <Maximize2 size={20} strokeWidth={1.5} />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-24 h-32 overflow-hidden rounded-xl transition-all duration-300 ring-offset-2 ${
                activeIndex === idx 
                  ? 'ring-2 ring-zinc-900 shadow-md transform scale-100' 
                  : 'ring-0 opacity-60 hover:opacity-100 scale-95 hover:scale-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)} // clicking bg closes
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-50"
            >
               <X size={32} strokeWidth={1.5} />
            </button>

            {/* Main Lightbox Image */}
            <div className="relative w-full max-w-7xl h-full md:h-[85vh] flex items-center justify-center p-4">
               <AnimatePresence mode="wait">
                 <motion.img
                   key={activeIndex}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                   src={images[activeIndex]}
                   className="max-w-full max-h-full object-contain pointer-events-none"
                   alt="Fullscreen view"
                 />
               </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
               <>
                 <button 
                   onClick={prevImage}
                   className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 rounded-full hover:bg-white/10"
                 >
                   <ChevronLeft size={48} strokeWidth={1} />
                 </button>
                 <button 
                   onClick={nextImage}
                   className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 rounded-full hover:bg-white/10"
                 >
                   <ChevronRight size={48} strokeWidth={1} />
                 </button>
               </>
            )}

            {/* Lightbox Mini Thumbnails */}
            {images.length > 1 && (
              <div 
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto pb-4 max-w-[90vw] px-4"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking thumbnails container
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative shrink-0 w-14 h-20 md:w-16 md:h-24 overflow-hidden rounded-lg transition-all duration-300 ${
                      activeIndex === idx 
                        ? 'ring-2 ring-white opacity-100 scale-110 shadow-lg' 
                        : 'opacity-40 hover:opacity-100 scale-95 hover:scale-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
