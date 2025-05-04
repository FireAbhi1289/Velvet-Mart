import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react'; // Using a different icon for product

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <PackageX className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, the product you are looking for does not exist or is unavailable.
      </p>
      <Button asChild>
        <Link href="/">Go back to Home</Link>
      </Button>
    </div>
  );
}
