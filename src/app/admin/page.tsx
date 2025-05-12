
import { getAllProducts, type Product } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react'; // Icons for actions
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
                <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {/* Future enhancement: Edit and Delete buttons */}
                {/* <Button variant="outline" size="icon" disabled title="Edit (coming soon)">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" disabled title="Delete (coming soon)">
                  <Trash2 className="h-4 w-4" />
                </Button> */}
                 <p className="text-xs text-muted-foreground">Edit/Delete coming soon</p>
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
