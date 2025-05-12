
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, PlusCircle, List } from 'lucide-react'; // Added List icon

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 p-4 border-r">
        <nav className="space-y-2">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <Link href="/admin-panel" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
            <List className="h-5 w-5" />
            Product List
          </Link>
          <Link href="/admin-panel/add-product" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
            <PlusCircle className="h-5 w-5" />
            Add Product
          </Link>
          <hr className="my-4"/>
          <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
            <Home className="h-5 w-5" />
            Back to Site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
