
import { getAllProducts } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AdminProductListClient from '@/components/admin/admin-product-list'; // New component

export default async function AdminDashboardPage() {
  const allProducts = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin-panel/add-product">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      <AdminProductListClient initialProducts={allProducts} />
    </div>
  );
}
