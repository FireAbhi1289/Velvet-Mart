
import { getProductsByCategory, type Product } from '@/lib/data'; // Updated import
import ProductCard from '@/components/product-card';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import SearchBar from '@/components/search-bar';


type CategoryPageProps = {
  params: {
    category: string;
  };
};

// Function to generate static paths for categories
// This might need adjustment if categories become fully dynamic from products.json
export async function generateStaticParams() {
  // For now, keep predefined categories for static generation.
  // If you want this to be dynamic based on products.json,
  // you'd read the file here and extract unique categories.
  const categories = ['jewelry', 'books', 'gadgets'];
  return categories.map((category) => ({
    category,
  }));
}

// Function to generate metadata dynamically
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = params.category;
  const validCategories: Product['category'][] = ['jewelry', 'books', 'gadgets'];

  if (!validCategories.includes(category as Product['category'])) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${categoryName} | Velvet Mart`,
    description: `Shop for ${categoryName} at Velvet Mart.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category as Product['category'];
  const validCategories: Product['category'][] = ['jewelry', 'books', 'gadgets'];

  if (!validCategories.includes(category)) {
    notFound();
  }

  const products = await getProductsByCategory(category); // Now async
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

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
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        <SearchBar />
      </div>


      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No products found in this category yet.</p>
      )}
    </div>
  );
}
