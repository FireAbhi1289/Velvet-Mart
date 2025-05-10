import { getProductById, products as allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
// Image component from next/image is no longer directly used here for main display, handled by gallery
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import BuyButton from '@/components/buy-button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import ProductMediaGallery from '@/components/product-media-gallery'; // Import the new gallery component

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    productId: product.id,
  }));
}

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

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Replace single image with ProductMediaGallery */}
        <ProductMediaGallery product={product} />

        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
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

      {/* Optional: Related Products Section */}
      {/*
      <section>
        <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {* Render related product cards here *}
        </div>
      </section>
      */}
    </div>
  );
}