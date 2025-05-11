'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface WishieContextType {
  isWishieOpen: boolean;
  selectedCategory: string | null;
  hasCategoryInteracted: boolean;
  updateWishieCategoryContext: (categoryName: string) => void; // New function to set context
  openWishie: () => void; // No longer takes categoryName
  closeWishie: () => void;
}

const WishieContext = createContext<WishieContextType | undefined>(undefined);

export function WishieProvider({ children }: { children: ReactNode }) {
  const [isWishieOpen, setIsWishieOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasCategoryInteracted, setHasCategoryInteracted] = useState(false);

  const updateWishieCategoryContext = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
    setHasCategoryInteracted(true);
    // Does NOT open the widget
  }, []);

  const openWishie = useCallback(() => {
    // This function now solely opens the widget.
    // It relies on selectedCategory being set by updateWishieCategoryContext if needed.
    // hasCategoryInteracted should be true if this is called via the trigger.
    setIsWishieOpen(true);
  }, []);

  const closeWishie = useCallback(() => {
    setIsWishieOpen(false);
  }, []);

  return (
    <WishieContext.Provider value={{ isWishieOpen, selectedCategory, hasCategoryInteracted, updateWishieCategoryContext, openWishie, closeWishie }}>
      {children}
    </WishieContext.Provider>
  );
}

export function useWishie(): WishieContextType {
  const context = useContext(WishieContext);
  if (context === undefined) {
    throw new Error('useWishie must be used within a WishieProvider');
  }
  return context;
}
