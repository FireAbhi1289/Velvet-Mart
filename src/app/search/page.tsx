

import { getProductsBySearchTerm, type Product } from '@/lib/data'; // Updated import
import ProductCard from '@/components/product-card';
import type { Metadata } from 'next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import SearchBar from '@/components/search-bar';
import { Suspense } from 'react';

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const searchTerm = searchParams?.q || '';
  if (searchTerm) {
    return {
      title: `Search results for "${searchTerm}" | Velvet Mart`,
      description: `Find products matching "${searchTerm}" at Velvet Mart.`,
    };
  }
  return {
    title: 'Search | Velvet Mart',
    description: 'Search for products at Velvet Mart.',
  };
}

async function SearchResults({ searchTerm }: { searchTerm: string }) {
  const products = await getProductsBySearchTerm(searchTerm); // Now async

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center col-span-full">
          No products found matching your search criteria.
        </p>
      )}
    </>
  );
}


export default function SearchPage({ searchParams }: SearchPageProps) {
  const searchTerm = searchParams?.q || '';

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search Results</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {searchTerm ? `Results for "${searchTerm}"` : 'Search Products'}
        </h1>
        <div className="w-full md:w-auto">
          <SearchBar />
        </div>
      </div>
      
      <Suspense fallback={<p className="text-center text-muted-foreground">Loading search results...</p>}>
        {searchTerm ? (
          <SearchResults searchTerm={searchTerm} />
        ) : (
          <p className="text-muted-foreground text-center">
            Please enter a search term to find products.
          </p>
        )}
      </Suspense>
    </div>
  );
}
