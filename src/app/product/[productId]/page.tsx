import { getProductById, products as allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import AddToCartButton from '@/components/add-to-cart-button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

// Function to generate static paths for all products
export async function generateStaticParams() {
  return allProducts.map((product) => ({
    productId: product.id,
  }));
}

// Function to generate metadata dynamically
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.productId);

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


export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.productId);

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

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              priority // Prioritize loading the main product image
              data-ai-hint={product.aiHint}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground text-lg">{product.description}</p>

          <div className="flex items-center gap-4">
            {/* AddToCartButton is a client component */}
             <AddToCartButton product={product} size="lg" className="w-full md:w-auto" />
             {/* Optional: Add quantity selector here */}
          </div>
             <p className="text-sm text-muted-foreground">Category: <Link href={`/${product.category}`} className="hover:underline">{categoryName}</Link></p>
        </div>
      </div>

        {/* Optional: Related Products Section */}
      {/*
      <section>
        <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Render related product cards here */}
        {/* </div>
      </section>
      */}
    </div>
  );
}
