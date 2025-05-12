
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react'; 

export default function EditProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <PackageX className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The product you are trying to edit could not be found. It might have been deleted or the ID is incorrect.
      </p>
      <Button asChild>
        <Link href="/admin-panel">Go to Product List</Link>
      </Button>
    </div>
  );
}
