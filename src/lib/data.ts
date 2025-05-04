export type Product = {
  id: string;
  name: string;
  category: 'jewelry' | 'books' | 'gadgets';
  price: number;
  description: string;
  imageUrl: string;
  aiHint: string; // For image generation hint
  buyUrl: string; // Add buyUrl field for redirection
};

export const products: Product[] = [
  // Jewelry
  {
    id: 'jwl1',
    name: 'Silver Necklace',
    category: 'jewelry',
    price: 120.00,
    description: 'Elegant silver necklace with a delicate pendant. Perfect for everyday wear or special occasions.',
    imageUrl: 'https://picsum.photos/seed/jwl1/600/600',
    aiHint: 'silver necklace elegant pendant',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'jwl2',
    name: 'Gold Earrings',
    category: 'jewelry',
    price: 250.00,
    description: 'Classic gold hoop earrings that add a touch of sophistication to any outfit.',
    imageUrl: 'https://picsum.photos/seed/jwl2/600/600',
    aiHint: 'gold hoop earrings classic',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'jwl3',
    name: 'Gemstone Ring',
    category: 'jewelry',
    price: 350.00,
    description: 'A stunning ring featuring a vibrant gemstone set in a platinum band.',
    imageUrl: 'https://picsum.photos/seed/jwl3/600/600',
    aiHint: 'gemstone ring platinum band',
    buyUrl: '#', // Example placeholder URL
  },
   {
    id: 'jwl4',
    name: 'Pearl Bracelet',
    category: 'jewelry',
    price: 180.00,
    description: 'Timeless pearl bracelet with a secure clasp. Adds elegance to any look.',
    imageUrl: 'https://picsum.photos/seed/jwl4/600/600',
    aiHint: 'pearl bracelet elegant timeless',
    buyUrl: '#', // Example placeholder URL
  },

  // Books
  {
    id: 'bk1',
    name: 'The Midnight Library',
    category: 'books',
    price: 15.99,
    description: 'A novel about regrets, hope, and the choices we make, exploring infinite possibilities.',
    imageUrl: 'https://picsum.photos/seed/bk1/600/600',
    aiHint: 'book cover fantasy novel',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'bk2',
    name: 'Sapiens: A Brief History of Humankind',
    category: 'books',
    price: 22.50,
    description: 'A captivating exploration of human history, from the Stone Age to the present day.',
    imageUrl: 'https://picsum.photos/seed/bk2/600/600',
    aiHint: 'book cover non-fiction history',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'bk3',
    name: 'Atomic Habits',
    category: 'books',
    price: 18.00,
    description: 'An easy and proven way to build good habits and break bad ones.',
    imageUrl: 'https://picsum.photos/seed/bk3/600/600',
    aiHint: 'book cover self-help habits',
    buyUrl: '#', // Example placeholder URL
  },
   {
    id: 'bk4',
    name: 'Dune',
    category: 'books',
    price: 19.95,
    description: 'Epic science fiction novel set in the distant future amidst a feudal interstellar society.',
    imageUrl: 'https://picsum.photos/seed/bk4/600/600',
    aiHint: 'book cover science fiction epic',
    buyUrl: '#', // Example placeholder URL
  },

  // Gadgets
  {
    id: 'gdg1',
    name: 'Wireless Earbuds',
    category: 'gadgets',
    price: 89.99,
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    imageUrl: 'https://picsum.photos/seed/gdg1/600/600',
    aiHint: 'wireless earbuds modern sleek',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'gdg2',
    name: 'Smartwatch',
    category: 'gadgets',
    price: 199.00,
    description: 'Feature-packed smartwatch with fitness tracking, notifications, and customizable faces.',
    imageUrl: 'https://picsum.photos/seed/gdg2/600/600',
    aiHint: 'smartwatch fitness tracker technology',
    buyUrl: '#', // Example placeholder URL
  },
  {
    id: 'gdg3',
    name: 'Portable Bluetooth Speaker',
    category: 'gadgets',
    price: 59.50,
    description: 'Compact and powerful Bluetooth speaker with excellent sound quality and water resistance.',
    imageUrl: 'https://picsum.photos/seed/gdg3/600/600',
    aiHint: 'bluetooth speaker portable music',
    buyUrl: '#', // Example placeholder URL
  },
   {
    id: 'gdg4',
    name: 'E-Reader',
    category: 'gadgets',
    price: 129.00,
    description: 'Lightweight e-reader with a glare-free display, perfect for reading anywhere.',
    imageUrl: 'https://picsum.photos/seed/gdg4/600/600',
    aiHint: 'e-reader digital reading technology',
    buyUrl: '#', // Example placeholder URL
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(product => product.category === category);
}
