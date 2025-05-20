
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const fallbackImageUrl = `https://placehold.co/600x600.png?text=${encodeURIComponent(product.name.substring(0,15))}`;
  const imageUrlToDisplay = product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : fallbackImageUrl;

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="block group flex-grow flex flex-col">
        <CardHeader className="relative p-0 h-60">
          <Image
            src={imageUrlToDisplay}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 group-hover:opacity-90"
            data-ai-hint={imageUrlToDisplay === fallbackImageUrl ? "placeholder image" : product.aiHint}
            onError={(e) => {
              // If ImgBB URL fails, try to set to fallback directly (though next/image handles this internally too)
              // This is more for explicit debugging if needed.
              if ((e.target as HTMLImageElement).src !== fallbackImageUrl) {
                (e.target as HTMLImageElement).src = fallbackImageUrl;
              }
            }}
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
