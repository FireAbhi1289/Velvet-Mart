
'use client'; // Required because we're using a hook (useWishie)

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, BookOpen, Speaker } from 'lucide-react'; // Changed Headphones to Speaker
import Image from 'next/image';
import SearchBar from '@/components/search-bar';
import { useWishie } from '@/context/wishie-context'; // Import the hook

export default function Home() {
  const { updateWishieCategoryContext } = useWishie(); // Get the new function from context

  const categories = [
    { name: 'Jewelry', href: '/jewelry', icon: Gem, image: 'https://picsum.photos/seed/sparkling-jewelry/600/400', aiHint: 'sparkling necklace'},
    { name: 'Books', href: '/books', icon: BookOpen, image: 'https://picsum.photos/seed/open-book/600/400', aiHint: 'open book' },
    { name: 'Gadgets', href: '/gadgets', icon: Speaker, image: 'https://picsum.photos/seed/audio-gadgets/600/400', aiHint: 'compact speaker' }, // Updated icon and aiHint
  ];

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
             <div key={category.name} className="block group transform transition-transform duration-300 hover:scale-105">
                <Card
                  className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  // Call updateWishieCategoryContext instead of openWishie
                  // The Link component below will handle navigation.
                  // This sets the context for Wishie without opening it.
                  onClick={() => updateWishieCategoryContext(category.name)}
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
