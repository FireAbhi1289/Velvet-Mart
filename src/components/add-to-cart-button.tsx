'use client';

import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  showIcon?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  showIcon = true,
  variant = "default",
  size = "default",
  className
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name}`,
      // action: <ToastAction altText="View Cart">View Cart</ToastAction>, // Optional action
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
    >
      {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
      Add to Cart
    </Button>
  );
}
