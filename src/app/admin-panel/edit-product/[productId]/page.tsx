
import { getProductById, type Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import EditProductClientForm from './edit-product-client-form';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

type EditProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.productId);

  if (!product) {
    return {
      title: 'Product Not Found | Velvet Mart Admin',
    };
  }

  return {
    title: `Edit ${product.name} | Velvet Mart Admin`,
    description: `Edit details for ${product.name}.`,
  };
}


export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = params.productId;
  const product = await getProductById(productId);

  if (!product) {
    // This will render the nearest not-found.tsx or a default Next.js 404 page
    // For a more specific "product not found" UI within the admin layout,
    // we could return a custom component here instead of calling notFound(),
    // but calling notFound() is standard for missing data.
    // For this specific case, let's use a custom UI to fit within the admin layout.
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you are trying to edit (ID: {productId}) does not exist.
        </p>
        <Button asChild>
          <Link href="/admin-panel">Go back to Product List</Link>
        </Button>
      </div>
    );
  }

  return <EditProductClientForm product={product} />;
}
