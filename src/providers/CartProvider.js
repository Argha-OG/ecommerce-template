"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Hydration safety for Next.js SSR
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("zynzyr-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("zynzyr-cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.sku === product.sku);
      if (existing) {
        return prevCart.map((item) =>
          item.sku === product.sku ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (sku) => {
    setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));
  };

  const updateQuantity = (sku, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(sku);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.sku === sku ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isClient }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
