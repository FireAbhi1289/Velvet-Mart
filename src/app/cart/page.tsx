'use client';

import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders cart state on the client
    // avoiding hydration mismatches.
    setIsClient(true);
  }, []);


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Add logic for tax and shipping if needed
  const total = subtotal; // Placeholder

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isClient) {
     // Optionally return a loading state or null during server render/initial client render
     return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
             <p className="text-muted-foreground">Loading cart...</p>
        </div>
     );
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[50px]"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="hidden md:table-cell">
                           <Link href={`/product/${item.id}`}>
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint={item.aiHint}
                              />
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                           <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                             {item.name}
                           </Link>
                           <p className="text-sm text-muted-foreground md:hidden">
                              ${item.price.toFixed(2)}
                           </p>
                        </TableCell>
                        <TableCell className="text-center">
                           <div className="flex items-center justify-center gap-2">
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                               <Minus className="h-4 w-4" />
                               <span className="sr-only">Decrease quantity</span>
                              </Button>
                             <span className="w-8 text-center">{item.quantity}</span>
                            {/* <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 h-9 text-center"
                            /> */}
                             <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                               <Plus className="h-4 w-4" />
                               <span className="sr-only">Increase quantity</span>
                              </Button>
                           </div>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                 {/* Add Shipping and Tax lines here if needed */}
                 {/*
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>$8.32</span>
                </div>
                */}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={() => alert('Proceeding to checkout (not implemented)')}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}


// Helper component for cart icon (could be moved)
function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
    </svg>
  )
}
