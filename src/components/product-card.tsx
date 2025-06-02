
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react'; // Import useState for handling image errors

export default function ProductCard({ product }: { product: Product }) {
  // Fallback image if product.imageUrl is problematic
  const fallbackImageUrl = `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name.substring(0,15) || "Product")}`;
  
  // State to manage current image source, initially product.imageUrl or fallback
  const [currentImageUrl, setCurrentImageUrl] = useState(
    (typeof product.imageUrl === 'string' && (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://'))) 
    ? product.imageUrl 
    : fallbackImageUrl
  );

  // Handle image loading errors
  const handleError = () => {
    // If an error occurs, and we're not already showing the fallback, switch to fallback
    if (currentImageUrl !== fallbackImageUrl) {
      setCurrentImageUrl(fallbackImageUrl);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="block group flex-grow flex flex-col">
        <CardHeader className="relative p-0 h-60">
          <Image
            src={currentImageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="transition-opacity duration-300 group-hover:opacity-90"
            data-ai-hint={currentImageUrl === fallbackImageUrl ? "placeholder image" : (product.aiHint || "product image")}
            onError={handleError}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-medium mb-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{product.category}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold text-primary">₹{product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
