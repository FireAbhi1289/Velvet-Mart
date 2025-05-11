
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useWishie } from '@/context/wishie-context';
import { usePathname } from 'next/navigation'; // Import usePathname

export default function WishieTriggerClient() {
  const { openWishie, isWishieOpen, hasCategoryInteracted } = useWishie();
  const pathname = usePathname(); // Get the current path

  // Condition 1: Never show on the home page
  if (pathname === '/') {
    return null;
  }

  // Condition 2: Wishie widget itself must NOT be open.
  // Condition 3: A category must have been interacted with at least once.
  if (isWishieOpen || !hasCategoryInteracted) {
    return null;
  }

  return (
    <Button
      onClick={() => openWishie()} // When trigger is clicked, open Wishie (it will use the last selected category or be generic)
      className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out"
      aria-label="Open Wishie"
      size="icon"
    >
      <Sparkles className="h-7 w-7" />
    </Button>
  );
}

