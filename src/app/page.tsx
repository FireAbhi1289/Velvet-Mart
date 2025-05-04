import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, BookOpen, Smartphone } from 'lucide-react';
import Image from 'next/image';
import SearchBar from '@/components/search-bar'; // Import the SearchBar

export default function Home() {
  const categories = [
    { name: 'Jewelry', href: '/jewelry', icon: Gem, image: 'https://picsum.photos/seed/cat-jewelry/600/400', aiHint: 'elegant jewelry display'},
    { name: 'Books', href: '/books', icon: BookOpen, image: 'https://picsum.photos/seed/cat-books/600/400', aiHint: 'cozy bookstore shelf' },
    { name: 'Gadgets', href: '/gadgets', icon: Smartphone, image: 'https://picsum.photos/seed/cat-gadgets/600/400', aiHint: 'modern gadgets collection' },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Velvet Mart</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover our curated collection of fine jewelry, captivating books, and cutting-edge gadgets.</p>
        {/* Add SearchBar below the welcome text */}
        <div className="flex justify-center">
           <SearchBar />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} legacyBehavior passHref>
              <a className="block group transform transition-transform duration-300 hover:scale-105">
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
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
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
