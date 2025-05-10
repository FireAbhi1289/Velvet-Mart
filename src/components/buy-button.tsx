
'use client';

import type { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import PurchaseForm from '@/components/purchase-form'; // Import the new PurchaseForm

interface BuyButtonProps {
  product: Product;
  showIcon?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
}

export default function BuyButton({
  product,
  showIcon = true,
  variant = "default",
  size = "default",
  className
}: BuyButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleBuyClick = () => {
    setIsFormOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleBuyClick}
      >
        {showIcon && <ShoppingBag className="mr-2 h-4 w-4" />}
        Buy
      </Button>
      {isFormOpen && (
        <PurchaseForm
          product={product}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}
    </>
  );
}
