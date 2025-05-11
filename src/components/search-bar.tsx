
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mx-auto md:mx-0">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
        aria-label="Search products"
      />
      <Button type="submit" size="icon" aria-label="Submit search">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
