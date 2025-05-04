'use client';

import type { Product } from '@/lib/data';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type CartItem = Product & {
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'velvet_mart_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial client render
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            return [];
        }
    }
    return []; // Return empty array during SSR or if window is undefined
  });

   // Persist cart to localStorage whenever it changes
   useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
             localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
             console.error("Failed to save cart to localStorage", error);
        }
    }
  }, [cart]);


  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item // Ensure quantity doesn't go below 0
      ).filter(item => item.quantity > 0) // Optionally remove item if quantity is 0
    );
  };

  const clearCart = () => {
    setCart([]);
     if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
     }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
