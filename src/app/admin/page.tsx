
import { getAllProducts, type Product } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DeleteProductButton from '@/components/admin/delete-product-button';

export default async function AdminDashboardPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/add-product">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="relative h-40 w-full mb-2">
                  <Image 
                    src={product.imageUrl || "https://picsum.photos/seed/placeholder/300/200"} 
                    alt={product.name} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-md"
                    data-ai-hint={product.aiHint || "product image"}
                  />
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                    </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" asChild title="Edit Product">
                  <Link href={`/admin/edit-product/${product.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No products found. Add your first product!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
