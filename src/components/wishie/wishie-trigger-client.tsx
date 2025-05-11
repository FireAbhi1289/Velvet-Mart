
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useWishie } from '@/context/wishie-context';

export default function WishieTriggerClient() {
  const { openWishie, isWishieOpen } = useWishie();

  if (isWishieOpen) {
    return null; // Don't show trigger if widget is already open
  }

  return (
    <Button
      onClick={() => openWishie()}
      className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out"
      aria-label="Open Wishie"
      size="icon"
    >
      <Sparkles className="h-7 w-7" />
    </Button>
  );
}
