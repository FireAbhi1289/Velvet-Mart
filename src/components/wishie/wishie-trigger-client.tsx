
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image'; // Import next/image
import { useWishie } from '@/context/wishie-context';
import { usePathname } from 'next/navigation'; 

export default function WishieTriggerClient() {
  const { openWishie, isWishieOpen, hasCategoryInteracted } = useWishie();
  const pathname = usePathname(); 

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
      onClick={() => openWishie()} 
      className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out flex items-center justify-center p-0 overflow-hidden"
      aria-label="Open Wishie"
      size="icon"
    >
      {/* Replace Sparkles with Image component */}
      <Image 
        src="/wishie-avatar.png" 
        alt="Wishie Avatar" 
        width={56} // Button is h-14 w-14 (56px), image can fill it or be slightly smaller
        height={56}
        className="rounded-full object-cover" 
      />
    </Button>
  );
}
