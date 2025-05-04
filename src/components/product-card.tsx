import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddToCartButton from './add-to-cart-button'; // Import the client component

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="block group">
        <CardHeader className="relative p-0 h-60">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 group-hover:opacity-90"
            data-ai-hint={product.aiHint}
          />
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/product/${product.id}`} className="block">
          <CardTitle className="text-lg font-medium mb-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 capitalize">{product.category}</p>
         <p className="text-base font-semibold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         {/* Use the client component for the button */}
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
