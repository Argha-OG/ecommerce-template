"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/providers/CartProvider';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, isClient } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Shop', href: '/collections/all' },
    { label: 'Categories', href: '/collections/all?view=categories' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'h-16 bg-background/90 backdrop-blur-lg border-b border-border shadow-sm' 
            : 'h-20 bg-background/50 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center h-full flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground hover:text-accent transition-colors p-2 -ml-2"
              aria-label="Open Menu"
            >
              <Menu strokeWidth={1.5} size={28} />
            </button>
          </div>

          {/* Desktop Links (Left) */}
          <div className="hidden md:flex items-center space-x-8 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith('/collections') && link.label === 'Shop');
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`relative font-medium text-sm tracking-wide uppercase transition-colors hover:text-accent ${
                    isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Logo (Center) */}
          <div className="shrink-0 flex justify-center items-center">
            <Link 
              href="/" 
              className="font-serif text-2xl md:text-3xl tracking-tighter hover:opacity-80 transition-opacity"
            >
              ZYNZYR
            </Link>
          </div>
          
          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
             <button aria-label="Search" className="text-foreground hover:text-accent transition-colors">
               <Search strokeWidth={1.5} size={22} />
             </button>
             <Link href="/admin" aria-label="Account" className="text-foreground hover:text-accent transition-colors">
               <User strokeWidth={1.5} size={22} />
             </Link>
             <Link href="/cart" aria-label="Cart" className="text-foreground hover:text-accent transition-colors relative group">
               <ShoppingBag strokeWidth={1.5} size={22} />
               <AnimatePresence>
                 {isClient && cartCount > 0 && (
                   <motion.span 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                   >
                     {cartCount}
                   </motion.span>
                 )}
               </AnimatePresence>
             </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center justify-end space-x-4 flex-1">
             <button aria-label="Search" className="text-foreground hover:text-accent p-2">
               <Search strokeWidth={1.5} size={24} />
             </button>
             <Link href="/cart" aria-label="Cart" className="text-foreground hover:text-accent p-2 -mr-2 relative group">
               <ShoppingBag strokeWidth={1.5} size={24} />
               <AnimatePresence>
                 {isClient && cartCount > 0 && (
                   <motion.span 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                   >
                     {cartCount}
                   </motion.span>
                 )}
               </AnimatePresence>
             </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Drawer (Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-60 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-background shadow-2xl z-70 overflow-y-auto md:hidden border-r border-border"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
                  <span className="font-serif text-2xl tracking-tighter">ZYNZYR</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2"
                  >
                    <X strokeWidth={1.5} size={28} />
                  </button>
                </div>
                
                {/* Drawer Links */}
                <div className="flex flex-col space-y-6 flex-1">
                  {navLinks.map((link, idx) => {
                     const isActive = pathname === link.href || (pathname.startsWith('/collections') && link.label === 'Shop');
                     return (
                       <motion.div
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 + idx * 0.05 }}
                         key={link.label}
                       >
                          <Link 
                            href={link.href} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-2xl font-light tracking-wide transition-colors block uppercase ${
                               isActive ? 'text-accent font-medium' : 'text-foreground hover:text-accent'
                            }`}
                          >
                            {link.label}
                          </Link>
                       </motion.div>
                     );
                  })}
                </div>

                {/* Drawer Footer Utilities */}
                <div className="mt-8 pt-8 border-t border-border flex flex-col space-y-6">
                   <Link 
                      href="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition-colors"
                   >
                      <User strokeWidth={1.5} size={24} />
                      <span className="text-lg font-medium tracking-wide">Account Overview</span>
                   </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
