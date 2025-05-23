
import { getProductById, productsForStaticGeneration as allProducts, type Product } from '@/lib/data'; // Updated import
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import BuyButton from '@/components/buy-button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import ProductMediaGallery from '@/components/product-media-gallery';

export const dynamic = 'force-static'; // Explicitly mark for static generation
export const revalidate = 300; // Revalidate this page at most every 5 minutes

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateStaticParams() {
  // Use the static list for generating params during build
  return allProducts.map((product) => ({
    productId: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.productId); 

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Velvet Mart`,
    description: product.description,
  };
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId); 

  if (!product) {
    notFound();
  }

  const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);

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
             <BreadcrumbLink asChild>
               <Link href={`/${product.category}`}>{categoryName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
           <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductMediaGallery product={product} />

        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-primary">₹{product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xl text-muted-foreground line-through">
                ₹{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 pt-4">
             <BuyButton product={product} size="lg" className="w-full md:w-auto text-lg px-8 py-3" />
          </div>
             <p className="text-sm text-muted-foreground pt-2">Category: <Link href={`/${product.category}`} className="hover:underline text-primary">{categoryName}</Link></p>
        </div>
      </div>
    </div>
  );
}

