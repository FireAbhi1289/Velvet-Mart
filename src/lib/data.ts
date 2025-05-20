
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

// --- GitHub Configuration ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'products.json'; // Default path
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'; // Default branch

// **Critical Check for Environment Variables**
if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME || !GITHUB_FILE_PATH || !GITHUB_BRANCH) {
  const missingVars = [
    !GITHUB_TOKEN && "GITHUB_TOKEN",
    !GITHUB_REPO_OWNER && "GITHUB_REPO_OWNER",
    !GITHUB_REPO_NAME && "GITHUB_REPO_NAME",
    !GITHUB_FILE_PATH && "GITHUB_FILE_PATH", // GITHUB_FILE_PATH can have a default, but good to ensure it's explicitly set if intended.
    !GITHUB_BRANCH && "GITHUB_BRANCH",     // GITHUB_BRANCH can have a default.
  ].filter(Boolean).join(", ");

  const errorMessage = `CRITICAL ERROR: Essential GitHub environment variables are not configured. Please ensure GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME are set in your .env.local file and deployment environment. Missing or defaults used for: ${missingVars || 'None (check logic if this appears incorrectly)'}. The application cannot manage product data without these core settings.`;
  console.error(errorMessage);
  // This will stop execution if core config is missing, making the issue very clear.
  // This error will be thrown on the server when data.ts is imported and these vars are evaluated.
  throw new Error(errorMessage);
}

const API_BASE_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`;

interface GitHubFileResponse {
  content?: string; // Base64 encoded content
  sha?: string;
  message?: string; // For errors
}

// Helper to fetch products.json and its SHA from GitHub
async function fetchProductsFromGitHub(): Promise<{ products: Product[]; sha: string | null }> {
  // Environment variables are checked at the module level now.

  try {
    const response = await fetch(`${API_BASE_URL}?ref=${GITHUB_BRANCH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (response.status === 404) {
      console.warn(`File not found at ${API_BASE_URL}?ref=${GITHUB_BRANCH}. Assuming empty product list and attempting to create on first write. Ensure the GITHUB_FILE_PATH and GITHUB_BRANCH are correct.`);
      return { products: [], sha: null }; // Treat as empty, will attempt to create on write
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse GitHub API error response' }));
      console.error(`Error fetching products from GitHub (${response.status} ${response.statusText}):`, errorData);
      throw new Error(`Failed to fetch products from GitHub: ${errorData.message || response.statusText} (Status: ${response.status})`);
    }

    const data: GitHubFileResponse = await response.json();
    if (!data.content) {
      // File exists but is empty
      console.warn(`File at ${API_BASE_URL}?ref=${GITHUB_BRANCH} exists but is empty. Initializing as an empty array.`);
      return { products: [], sha: data.sha || null };
    }

    const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    let products;
    try {
      products = JSON.parse(decodedContent) as Product[];
    } catch (parseError) {
      console.error('Failed to parse products.json content from GitHub. Content was:', decodedContent, 'Error:', parseError);
      throw new Error('Invalid JSON format in products.json from GitHub. Please ensure it contains a valid JSON array.');
    }
    
    if (!Array.isArray(products)) {
      console.error('Content of products.json from GitHub is not an array. Current content:', products, 'Please ensure it contains a valid JSON array (e.g., [] if empty).');
      // To prevent further issues, treat as empty and let the next write operation attempt to fix it.
      return { products: [], sha: data.sha || null };
    }
    return { products, sha: data.sha || null };

  } catch (error) {
    console.error('Network or unexpected error in fetchProductsFromGitHub:', error);
    // Re-throw to ensure the calling function knows something went wrong.
    throw new Error(`A network or unexpected error occurred while fetching product data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper to write products.json back to GitHub
async function writeProductsToGitHub(products: Product[], sha: string | null, commitMessage: string): Promise<boolean> {
  // Environment variables checked at module level.
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
    // If sha is null, GitHub API creates the file if it doesn't exist (if response from fetchProductsFromGitHub was 404 and returned sha: null).

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
      console.error(`Error writing products to GitHub (${response.status} ${response.statusText}):`, errorData);
      // Do not throw here, let the calling function decide based on 'false' return
      return false;
    }
    return true;
  } catch (error) {
    console.error('Network or unexpected error in writeProductsToGitHub:', error);
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
  const success = await writeProductsToGitHub(updatedProducts, sha, `feat: Add product ${newProduct.name} (via app)`);
  return success ? newProduct : null;
}

export type UpdateProductData = Partial<Omit<Product, 'id'>>;

export async function updateProduct(productId: string, productData: UpdateProductData): Promise<Product | null> {
  let { products, sha } = await fetchProductsFromGitHub(); // Make products mutable if needed
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    console.warn(`Product with ID ${productId} not found for update.`);
    return null; 
  }

  const safeProductData: UpdateProductData = { ...productData };
  if (typeof safeProductData.buyUrl === 'string' && safeProductData.buyUrl.trim() === '') {
    safeProductData.buyUrl = undefined;
  }

  const updatedProduct: Product = {
    ...products[productIndex],
    ...safeProductData,
  };
  
  products[productIndex] = updatedProduct; // Update the product in the array

  const success = await writeProductsToGitHub(products, sha, `fix: Update product ${updatedProduct.name} (via app)`);
  return success ? updatedProduct : null;
}

export async function deleteProduct(productId: string): Promise<Product | null> {
  const { products, sha } = await fetchProductsFromGitHub();
  const productToDelete = products.find(p => p.id === productId);
  
  if (!productToDelete) {
    console.warn(`Product with ID ${productId} not found for deletion.`);
    return null;
  }

  const updatedProducts = products.filter(p => p.id !== productId);
  const success = await writeProductsToGitHub(updatedProducts, sha, `feat: Delete product ${productToDelete.name} (via app)`);
  return success ? productToDelete : null;
}

// This list is a fallback and might not be actively used if GitHub fetching is primary.
// For generateStaticParams, it's better to fetch live data if possible, or ensure this list is representative.
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
];
    
