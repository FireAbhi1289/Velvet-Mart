
import { v4 as uuidv4 } from 'uuid';

export type Product = {
  id: string;
  name: string;
  category: 'jewelry' | 'books' | 'gadgets';
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string; // Data URI or URL
  additionalImageUrls?: string[]; // Array of Data URIs or URLs
  videoUrl?: string; // Data URI or URL
  aiHint: string;
  buyUrl?: string;
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'products.json';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const API_BASE_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`;

interface GitHubFileResponse {
  content?: string; // Base64 encoded content
  sha?: string;
  message?: string; // For errors
}

// Helper to fetch products.json and its SHA from GitHub
async function fetchProductsFromGitHub(): Promise<{ products: Product[]; sha: string | null }> {
  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    console.error("GitHub environment variables not configured!");
    throw new Error("GitHub repository details not configured on the server.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}?ref=${GITHUB_BRANCH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (response.status === 404) {
      // File doesn't exist, return empty products and null SHA
      console.warn(`products.json not found in GitHub repository (${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_FILE_PATH} on branch ${GITHUB_BRANCH}). Assuming empty product list.`);
      return { products: [], sha: null };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse GitHub API error response' }));
      console.error(`Error fetching products from GitHub: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Failed to fetch products from GitHub: ${errorData.message || response.statusText}`);
    }

    const data: GitHubFileResponse = await response.json();
    if (!data.content) {
      // This case might happen if the file is empty but exists.
      console.warn('products.json exists in GitHub but is empty or content is missing.');
      return { products: [], sha: data.sha || null };
    }

    const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    const products = JSON.parse(decodedContent) as Product[];
    if (!Array.isArray(products)) {
      console.error('Content of products.json from GitHub is not an array. Initializing as empty. Please ensure it contains a valid JSON array.');
      return { products: [], sha: data.sha || null };
    }
    return { products, sha: data.sha || null };

  } catch (error) {
    console.error('Error in fetchProductsFromGitHub:', error);
    // Fallback to empty list on other errors to prevent site crash, but log issue.
    // Consider if re-throwing is better for certain error types.
    return { products: [], sha: null };
  }
}

// Helper to write products.json back to GitHub
async function writeProductsToGitHub(products: Product[], sha: string | null, commitMessage: string): Promise<boolean> {
   if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    console.error("GitHub environment variables not configured!");
    throw new Error("GitHub repository details not configured on the server for writing.");
  }
  try {
    const contentBase64 = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
    
    const body: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: commitMessage,
      content: contentBase64,
      branch: GITHUB_BRANCH,
    };

    if (sha) { // SHA is required for updating an existing file
      body.sha = sha;
    }
    // If sha is null, GitHub API creates the file if it doesn't exist.

    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse GitHub API error response during write' }));
      console.error(`Error writing products to GitHub: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Failed to write products to GitHub: ${errorData.message || response.statusText}`);
    }
    // Optionally, verify the response from GitHub to confirm the new SHA, etc.
    // For simplicity, we assume 200/201 means success.
    return true;
  } catch (error) {
    console.error('Error in writeProductsToGitHub:', error);
    return false;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const { products } = await fetchProductsFromGitHub();
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { products } = await fetchProductsFromGitHub();
  return products.find(product => product.id === id);
}

export async function getProductsByCategory(category: Product['category']): Promise<Product[]> {
  const { products } = await fetchProductsFromGitHub();
  return products.filter(product => product.category === category);
}

export async function getProductsBySearchTerm(term: string): Promise<Product[]> {
  if (!term) {
    return [];
  }
  const { products } = await fetchProductsFromGitHub();
  const lowerCaseTerm = term.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerCaseTerm) ||
    product.description.toLowerCase().includes(lowerCaseTerm) ||
    product.category.toLowerCase().includes(lowerCaseTerm)
  );
}

export type AddProductData = Omit<Product, 'id'>;

export async function addProduct(productData: AddProductData): Promise<Product | null> {
  const { products, sha } = await fetchProductsFromGitHub();
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    buyUrl: productData.buyUrl === '' ? undefined : productData.buyUrl,
  };
  const updatedProducts = [...products, newProduct];
  const success = await writeProductsToGitHub(updatedProducts, sha, `feat: Add product ${newProduct.name}`);
  return success ? newProduct : null;
}

export type UpdateProductData = Partial<Omit<Product, 'id'>>;

export async function updateProduct(productId: string, productData: UpdateProductData): Promise<Product | null> {
  const { products, sha } = await fetchProductsFromGitHub();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    console.warn(`Product with ID ${productId} not found for update.`);
    return null; // Product not found
  }

  const safeProductData: UpdateProductData = { ...productData };
  if (typeof safeProductData.buyUrl === 'string' && safeProductData.buyUrl.trim() === '') {
    safeProductData.buyUrl = undefined;
  }

  const updatedProduct: Product = {
    ...products[productIndex],
    ...safeProductData,
  };
  const updatedProducts = [...products];
  updatedProducts[productIndex] = updatedProduct;

  const success = await writeProductsToGitHub(updatedProducts, sha, `fix: Update product ${updatedProduct.name}`);
  return success ? updatedProduct : null;
}

export async function deleteProduct(productId: string): Promise<Product | null> {
  const { products, sha } = await fetchProductsFromGitHub();
  const productToDelete = products.find(p => p.id === productId);
  
  if (!productToDelete) {
    console.warn(`Product with ID ${productId} not found for deletion.`);
    return null; // Product not found
  }

  const updatedProducts = products.filter(p => p.id !== productId);
  const success = await writeProductsToGitHub(updatedProducts, sha, `feat: Delete product ${productToDelete.name}`);
  return success ? productToDelete : null;
}


// This list might be outdated if data is purely dynamic.
// Consider how generateStaticParams should work if data comes from GitHub.
// For now, it's left as is but might not be fully utilized if pages fetch fresh data.
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
  // ... other example products if needed for static generation fallback ...
];
    