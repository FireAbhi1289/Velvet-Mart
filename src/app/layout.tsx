import type {Metadata} from 'next';
import {Inter as FontSans, Merriweather} from 'next/font/google'; // Using Inter for sans-serif, Merriweather for serif example
import './globals.css';
import {cn} from '@/lib/utils';
import Header from '@/components/layout/header';
import {Toaster} from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';

// Using Inter as the main sans-serif font
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans', // Changed variable name
});

// Example of adding a serif font (Merriweather) for body text if desired
const fontSerif = Merriweather({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '700'] // Include weights you might use
});


export const metadata: Metadata = {
  title: 'Velvet Mart',
  description: 'Shop for Jewelry, Books, and Gadgets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased', // Use font-sans as default
          fontSans.variable,
          fontSerif.variable // Make serif available if needed via 'font-serif' class
        )}
      >
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            {/* Optional Footer can be added here */}
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
