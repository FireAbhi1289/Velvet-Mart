
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
    try {
      return JSON.parse(jsonData) as Product[];
    } catch (parseError) {
      console.error('Error parsing products.json:', parseError);
      // If parsing fails, return an empty array to prevent site crash
      // Optionally, you could try to recover or use a default set of products
      return []; 
    }
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    console.error('Error reading products.json:', nodeError.message);
    if (nodeError.code === 'ENOENT') {
      // If file doesn't exist, create it with an empty array
      await writeProductsToFile([]); 
      return []; // Return an empty array
    }
    // For other read errors, return empty array to prevent crash
    return []; 
  }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products: Product[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(products, null, 2); 
    await fs.writeFile(productsFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing to products.json:', error);
    // Don't rethrow here as it might happen during a read operation's recovery attempt
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

export type AddProductData = Omit<Product, 'id'>;

export async function addProduct(productData: AddProductData): Promise<Product> {
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

export type UpdateProductData = Partial<Omit<Product, 'id'>>;

export async function updateProduct(productId: string, productData: UpdateProductData): Promise<Product | null> {
  const products = await readProductsFromFile();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return null; // Product not found
  }

  // Create a new object for the updated product data to avoid mutating the input
  const safeProductData: UpdateProductData = { ...productData };

  // Ensure buyUrl is set to undefined if it's an empty string, otherwise use its value.
  if (typeof safeProductData.buyUrl === 'string' && safeProductData.buyUrl.trim() === '') {
    safeProductData.buyUrl = undefined;
  }


  const updatedProduct: Product = {
    ...products[productIndex],
    ...safeProductData, // Use the safe copy
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


// This list is used by generateStaticParams. 
// It's kept separate to avoid reading the file during build time for this specific purpose if not needed,
// though currently, pages will call readProductsFromFile anyway.
// For a truly static site with many products, this might come from a build script.
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
    videoUrl: 'https://www.youtube.com/embed/placeholder_video_id_jewelry1', // Placeholder for actual video URL
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
    "videoUrl": 'https://www.youtube.com/embed/placeholder_video_id_gadget1', // Placeholder
    "aiHint": 'wireless earbuds modern sleek',
    "buyUrl": '#',
  },
];
