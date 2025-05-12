
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
  imageUrl: string; // Data URI
  additionalImageUrls?: string[]; // Array of Data URIs
  videoUrl?: string; // Data URI
  aiHint: string;
  buyUrl?: string;
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
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // If file doesn't exist, create it with an empty array
      await writeProductsToFile([]); 
      return []; // Return an empty array
    }
    // For other errors, rethrow them
    throw error; 
  }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products: Product[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(products, null, 2); 
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

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const products = await readProductsFromFile();
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    buyUrl: productData.buyUrl === '' ? undefined : productData.buyUrl,
  };
  products.push(newProduct);
  await writeProductsToFile(products);
  return newProduct;
}

export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  const products = await readProductsFromFile();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return null; // Product not found
  }

  const updatedProductData = { ...productData };
  // Ensure buyUrl is set to undefined if it's an empty string, otherwise use its value.
  if (typeof productData.buyUrl === 'string' && productData.buyUrl.trim() === '') {
    updatedProductData.buyUrl = undefined;
  }


  const updatedProduct = {
    ...products[productIndex],
    ...updatedProductData,
  };
  products[productIndex] = updatedProduct;
  await writeProductsToFile(products);
  return updatedProduct;
}

export async function deleteProduct(productId: string): Promise<Product | null> {
  let products = await readProductsFromFile();
  const productToDelete = products.find(p => p.id === productId);
  
  if (!productToDelete) {
    return null; // Product not found
  }

  products = products.filter(p => p.id !== productId);
  await writeProductsToFile(products);
  return productToDelete; // Return the deleted product
}


export const productsForStaticGeneration: Product[] = [
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

// Removed the IIFE that was causing fs/promises issues on client-side imports.
// The products.json file creation is handled by readProductsFromFile if it doesn't exist.
