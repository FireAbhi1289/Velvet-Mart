
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export type Product = {
  id: string;
  name: string;
  category: 'jewelry' | 'books' | 'gadgets';
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  additionalImageUrls?: string[];
  videoUrl?: string;
  aiHint: string;
  buyUrl: string;
};

// Path to the JSON file
const productsFilePath = path.join(process.cwd(), 'src', 'products.json');

// Helper function to read products from JSON file
async function readProductsFromFile(): Promise<Product[]> {
  try {
    const jsonData = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(jsonData) as Product[];
  } catch (error) {
    console.error('Error reading products.json:', error);
    // If file doesn't exist or is empty, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error; // Rethrow other errors
  }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products: Product[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(products, null, 2); // Pretty print JSON
    await fs.writeFile(productsFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing to products.json:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return await readProductsFromFile();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProductsFromFile();
  return products.find(product => product.id === id);
}

export async function getProductsByCategory(category: Product['category']): Promise<Product[]> {
  const products = await readProductsFromFile();
  return products.filter(product => product.category === category);
}

export async function getProductsBySearchTerm(term: string): Promise<Product[]> {
  if (!term) {
    return [];
  }
  const products = await readProductsFromFile();
  const lowerCaseTerm = term.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerCaseTerm) ||
    product.description.toLowerCase().includes(lowerCaseTerm) ||
    product.category.toLowerCase().includes(lowerCaseTerm)
  );
}

// Function to add a new product
export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const products = await readProductsFromFile();
  const newProduct: Product = {
    ...productData,
    id: uuidv4(), // Generate a unique ID
  };
  products.push(newProduct);
  await writeProductsToFile(products);
  return newProduct;
}

// Note: Functions for updating and deleting products would follow a similar pattern:
// 1. Read products from file.
// 2. Find and modify/remove the product.
// 3. Write the updated list back to the file.
// These are not implemented here for brevity but would be needed for full CRUD.

// This is used by generateStaticParams, needs to be synchronous or adapted.
// For now, we'll keep the original static list for param generation,
// but live data will come from the JSON.
// This means new products added via admin won't be statically generated until next build
// unless dynamic rendering is forced or revalidation strategies are used.
export const productsForStaticGeneration: Product[] = [
  // Keep a minimal list or your most common products for static generation
  // This ensures build doesn't fail if products.json is initially empty
  // Or, adjust generateStaticParams to fetch dynamically if possible for your use case
  // For simplicity, I'm copying the initial set.
  // In a real scenario, you might fetch this list once at build time.
    {
    id: 'jwl1',
    name: 'Silver Necklace',
    category: 'jewelry',
    price: 120.00,
    originalPrice: 150.00,
    description: 'Elegant silver necklace with a delicate pendant. Perfect for everyday wear or special occasions.',
    imageUrl: 'https://picsum.photos/seed/jwl1-main/600/600',
    additionalImageUrls: [
      'https://picsum.photos/seed/jwl1-alt1/600/600',
      'https://picsum.photos/seed/jwl1-alt2/600/600',
    ],
    videoUrl: 'https://www.youtube.com/embed/placeholder_video_id_jewelry1',
    aiHint: 'silver necklace elegant pendant',
    buyUrl: '#',
  },
  {
    id: 'bk1',
    name: 'The Midnight Library',
    category: 'books',
    price: 15.99,
    originalPrice: 20.00,
    description: 'A novel about regrets, hope, and the choices we make, exploring infinite possibilities.',
    imageUrl: 'https://picsum.photos/seed/bk1-main/600/600',
    additionalImageUrls: [
      'https://picsum.photos/seed/bk1-alt1/600/600', 
    ],
    aiHint: 'book cover fantasy novel',
    buyUrl: '#',
  },
  {
    id: 'gdg1',
    name: 'Wireless Earbuds',
    "category": 'gadgets',
    "price": 89.99,
    "originalPrice": 110.00,
    "description": 'High-quality wireless earbuds with noise cancellation and long battery life.',
    "imageUrl": 'https://picsum.photos/seed/gdg1-main/600/600',
    "additionalImageUrls": [
      'https://picsum.photos/seed/gdg1-alt1/600/600',
      'https://picsum.photos/seed/gdg1-alt2/600/600',
    ],
    "videoUrl": 'https://www.youtube.com/embed/placeholder_video_id_gadget1',
    "aiHint": 'wireless earbuds modern sleek',
    "buyUrl": '#',
  },
];
