'use client';

import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react'; // Changed icon

interface BuyButtonProps {
  product: Product;
  showIcon?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
}

export default function BuyButton({
  product,
  showIcon = true, // Keep icon by default for now
  variant = "default",
  size = "default",
  className
}: BuyButtonProps) {

  const handleBuyClick = () => {
    // Redirect to the product's buy URL
    if (product.buyUrl) {
      window.location.href = product.buyUrl;
    } else {
      // Handle case where buyUrl is not defined (optional)
      console.warn(`Buy URL not defined for product: ${product.name}`);
      alert("Purchase link is not available for this product yet.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBuyClick}
    >
      {showIcon && <ShoppingBag className="mr-2 h-4 w-4" />}
      Buy
    </Button>
  );
}
