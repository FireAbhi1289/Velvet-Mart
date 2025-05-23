
import { getProductById, type Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BuyButton from '@/components/buy-button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import ProductMediaGallery from '@/components/product-media-gallery';

export const dynamic = 'force-static';
export const revalidate = 300; // Revalidate this page at most every 5 minutes

// Define productsForStaticGeneration directly here
const productsForStaticGeneration: Product[] = [
  {
    id: 'jwl1',
    name: 'Silver Necklace',
    category: 'jewelry',
    price: 120.00,
    originalPrice: 150.00,
    description: 'Elegant silver necklace with a delicate pendant. Perfect for everyday wear or special occasions.',
    imageUrl: 'https://placehold.co/600x600.png?text=Silver+Necklace',
    additionalImageUrls: [
      'https://placehold.co/600x600.png?text=Necklace+Alt+1',
      'https://placehold.co/600x600.png?text=Necklace+Alt+2',
    ],
    aiHint: 'silver necklace elegant pendant',
    buyUrl: '#',
  },
  {
    id: 'bk1',
    name: 'The Midnight Library',
    category: 'books',
    price: 15.99,
    originalPrice: 20.00,
    description: 'A novel about regrets, hope, and the choices we make, exploring infinite possibilities.',
    imageUrl: 'https://placehold.co/600x600.png?text=Midnight+Library',
    aiHint: 'book cover fantasy novel',
  },
  {
    id: 'gdg1',
    name: 'Wireless Earbuds',
    category: 'gadgets',
    price: 89.99,
    originalPrice: 110.00,
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    imageUrl: 'https://placehold.co/600x600.png?text=Wireless+Earbuds',
    aiHint: 'wireless earbuds modern sleek',
  },
  // Add more representative products if needed for initial static generation
];


type ProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateStaticParams() {
  return productsForStaticGeneration.map((product) => ({
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
