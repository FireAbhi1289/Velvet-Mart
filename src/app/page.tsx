
'use client'; // Required because we're using a hook (useWishie)

import Link from 'next/link'; // Still use Link for navigation, but handle click separately
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, BookOpen, Smartphone } from 'lucide-react';
import Image from 'next/image';
import SearchBar from '@/components/search-bar';
import { useWishie } from '@/context/wishie-context'; // Import the hook

export default function Home() {
  const { openWishie } = useWishie(); // Get the function from context

  const categories = [
    { name: 'Jewelry', href: '/jewelry', icon: Gem, image: 'https://picsum.photos/seed/cat-jewelry/600/400', aiHint: 'elegant jewelry display'},
    { name: 'Books', href: '/books', icon: BookOpen, image: 'https://picsum.photos/seed/cat-books/600/400', aiHint: 'cozy bookstore shelf' },
    { name: 'Gadgets', href: '/gadgets', icon: Smartphone, image: 'https://picsum.photos/seed/cat-gadgets/600/400', aiHint: 'modern gadgets collection' },
  ];

  const handleCategoryClick = (event: React.MouseEvent<HTMLAnchorElement>, categoryName: string) => {
    // event.preventDefault(); // Prevent default navigation if you only want to open Wishie
    // If you want to navigate AND open Wishie, don't preventDefault, but it might be jarring.
    // For now, let's assume clicking category opens Wishie instead of navigating immediately.
    // To navigate as well, you'd need to coordinate this with Next.js router or remove preventDefault.
    // The prompt implies Wishie pops up "when a user taps", so we might want to keep navigation and have Wishie appear on the category page.
    // For now, let's have it open Wishie and still navigate.
    openWishie(categoryName);
  };


  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Velvet Mart</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover our curated collection of fine jewelry, captivating books, and cutting-edge gadgets.</p>
        <div className="flex justify-center">
           <SearchBar />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            // Use Link for navigation, but attach onClick to its child `a` tag if needed or to the Link itself.
            // For simplicity, we'll make the Card itself clickable to open Wishie, and Link handles navigation.
             <div key={category.name} className="block group transform transition-transform duration-300 hover:scale-105">
                <Card 
                  className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => openWishie(category.name)} // Open Wishie on Card click
                >
                  <Link href={category.href} legacyBehavior passHref>
                    <a className="flex flex-col h-full"> {/* Anchor tag wraps content for Link */}
                      <CardHeader className="relative p-0 h-48">
                        <Image
                            src={category.image}
                            alt={category.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-opacity duration-300 group-hover:opacity-90"
                            data-ai-hint={category.aiHint}
                          />
                      </CardHeader>
                      <CardContent className="p-6 flex-grow flex flex-col justify-center items-center">
                        <category.icon className="w-10 h-10 mb-3 text-primary" />
                        <CardTitle className="text-xl font-medium">{category.name}</CardTitle>
                      </CardContent>
                    </a>
                  </Link>
                </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
