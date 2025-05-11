
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface WishieContextType {
  isWishieOpen: boolean;
  selectedCategory: string | null;
  openWishie: (categoryName?: string) => void;
  closeWishie: () => void;
}

const WishieContext = createContext<WishieContextType | undefined>(undefined);

export function WishieProvider({ children }: { children: ReactNode }) {
  const [isWishieOpen, setIsWishieOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const openWishie = useCallback((categoryName?: string) => {
    setSelectedCategory(categoryName || null);
    setIsWishieOpen(true);
  }, []);

  const closeWishie = useCallback(() => {
    setIsWishieOpen(false);
    // Optionally reset category after a small delay to allow fade-out animation
    setTimeout(() => setSelectedCategory(null), 300);
  }, []);

  return (
    <WishieContext.Provider value={{ isWishieOpen, selectedCategory, openWishie, closeWishie }}>
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
