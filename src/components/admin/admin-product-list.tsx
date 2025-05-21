
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Search } from 'lucide-react'; // Added Search icon
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DeleteProductButton from '@/components/admin/delete-product-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // Added Input for search

interface AdminProductListClientProps {
  initialProducts: Product[];
}

const productCategories: Product['category'][] = ['jewelry', 'books', 'gadgets'];

export default function AdminProductListClient({ initialProducts }: AdminProductListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productsToDisplay = useMemo(() => {
    let filteredProducts = initialProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.description.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    return filteredProducts;
  }, [initialProducts, selectedCategory, searchTerm]);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Placeholder for select */}
          <div className="w-full md:w-[200px] h-10 bg-muted rounded-md animate-pulse"></div>
          {/* Placeholder for search input */}
          <div className="flex-grow h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="flex flex-col animate-pulse">
              <CardHeader><div className="h-40 w-full bg-muted rounded-md mb-2"></div><div className="h-6 w-3/4 bg-muted rounded-md"></div><div className="h-4 w-1/4 bg-muted rounded-md mt-1"></div></CardHeader>
              <CardContent><div className="h-5 w-1/2 bg-muted rounded-md mb-2"></div><div className="h-4 w-full bg-muted rounded-md"></div><div className="h-4 w-5/6 bg-muted rounded-md mt-1"></div></CardContent>
              <CardFooter className="flex justify-end gap-2"><div className="h-10 w-10 bg-muted rounded-md"></div><div className="h-10 w-10 bg-muted rounded-md"></div></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {productCategories.map(category => (
              <SelectItem key={category} value={category} className="capitalize">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {productsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToDisplay.map((product) => {
            const fallbackImageUrl = `https://placehold.co/300x200.png?text=${encodeURIComponent(product.name.substring(0,10))}`;
            const imageUrlToDisplay = (typeof product.imageUrl === 'string' && (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')))
                                      ? product.imageUrl
                                      : fallbackImageUrl;
            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="relative h-40 w-full mb-2">
                    <Image
                      src={imageUrlToDisplay}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      data-ai-hint={imageUrlToDisplay === fallbackImageUrl ? "placeholder image" : (product.aiHint || "product image")}
                      onError={(e) => {
                        if ((e.target as HTMLImageElement).src !== fallbackImageUrl) {
                          (e.target as HTMLImageElement).src = fallbackImageUrl;
                          (e.target as HTMLImageElement).srcset = "";
                        }
                      }}
                    />
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-lg font-semibold text-primary">₹{product.price.toFixed(2)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toFixed(2)}
                      </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild title="Edit Product">
                    <Link href={`/admin-panel/edit-product/${product.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {initialProducts.length === 0 ? "No products found. Add your first product!" : (searchTerm ? "No products match your search and category filters." : "No products found for this category.")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
