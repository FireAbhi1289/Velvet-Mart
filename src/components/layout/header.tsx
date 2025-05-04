'use client';

import Link from 'next/link';
import { Gem, BookOpen, Smartphone, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useCart } from '@/context/cart-context'; // Cart context no longer needed here
// import { Badge } from '@/components/ui/badge'; // Badge no longer needed here
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  // const { cart } = useCart(); // Cart context no longer needed here
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Cart count no longer needed

  const navLinks = [
    { href: '/jewelry', label: 'Jewelry', icon: Gem },
    { href: '/books', label: 'Books', icon: BookOpen },
    { href: '/gadgets', label: 'Gadgets', icon: Smartphone },
  ];

  // Close sheet on navigation
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          {/* Replace with a proper logo if available */}
          {/* <img src="/logo.svg" alt="Velvet Mart Logo" className="h-6 w-6" /> */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
            <path d="M12 2l3.09 6.3 6.91.99-5 4.86 1.18 6.86L12 18.3l-6.18 3.2L7 14.15l-5-4.86 6.91-.99L12 2zm0 3.54L9.91 9.4l-4.94.71 3.57 3.48-.84 4.92L12 16.18l4.3. 2.26-.84-4.92 3.57-3.48-4.94-.71L12 5.54z"/>
          </svg>
          <span className="font-bold text-lg">Velvet Mart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Removed Cart Link and Icon */}
          {/* <Link href="/cart" passHref legacyBehavior>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link> */}

          {/* Mobile Navigation Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
               <div className="flex justify-between items-center mb-6">
                 <Link href="/" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
                      <path d="M12 2l3.09 6.3 6.91.99-5 4.86 1.18 6.86L12 18.3l-6.18 3.2L7 14.15l-5-4.86 6.91-.99L12 2zm0 3.54L9.91 9.4l-4.94.71 3.57 3.48-.84 4.92L12 16.18l4.3. 2.26-.84-4.92 3.57-3.48-4.94-.71L12 5.54z"/>
                    </svg>
                    <span className="font-bold text-lg">Velvet Mart</span>
                 </Link>
                 <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close Menu</span>
                    </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                   <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 rounded-md p-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                   </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
