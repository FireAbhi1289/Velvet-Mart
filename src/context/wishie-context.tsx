
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface WishieContextType {
  isWishieOpen: boolean;
  selectedCategory: string | null;
  hasCategoryInteracted: boolean; // New state
  openWishie: (categoryName?: string) => void;
  closeWishie: () => void;
}

const WishieContext = createContext<WishieContextType | undefined>(undefined);

export function WishieProvider({ children }: { children: ReactNode }) {
  const [isWishieOpen, setIsWishieOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasCategoryInteracted, setHasCategoryInteracted] = useState(false); // Initialize new state

  const openWishie = useCallback((categoryName?: string) => {
    if (categoryName !== undefined) {
      setSelectedCategory(categoryName); // Update if a new category is explicitly given
      setHasCategoryInteracted(true);    // Mark that a category interaction has occurred
    }
    // If categoryName is undefined (e.g. from generic trigger),
    // selectedCategory remains as it was, preserving the context.
    setIsWishieOpen(true);
  }, []); // Dependencies remain empty as we are setting state based on args or current state

  const closeWishie = useCallback(() => {
    setIsWishieOpen(false);
    // selectedCategory is not reset here, so Wishie remembers it if reopened via trigger.
  }, []);

  return (
    <WishieContext.Provider value={{ isWishieOpen, selectedCategory, hasCategoryInteracted, openWishie, closeWishie }}>
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

