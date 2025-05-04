import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Category Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, we couldn't find the product category you were looking for.
      </p>
      <Button asChild>
        <Link href="/">Go back to Home</Link>
      </Button>
    </div>
  );
}
