
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
// CRITICAL: These environment variables MUST be set correctly in your .env.local file
// AND in your Vercel (or other hosting provider) project settings.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'products.json';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// **Critical Check for Environment Variables**
if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
  const missingVars = [
    !GITHUB_TOKEN && "GITHUB_TOKEN (Ensure it's a valid Personal Access Token with 'repo' scope for private repos)",
    !GITHUB_REPO_OWNER && "GITHUB_REPO_OWNER (Your GitHub username or organization)",
    !GITHUB_REPO_NAME && "GITHUB_REPO_NAME (The name of your repository)",
  ].filter(Boolean).join(", ");

  const errorMessage = `CRITICAL ERROR: Essential GitHub environment variables are not configured. Please set them in your .env.local and deployment environment. Missing or issues with: ${missingVars || 'None (check logic if this appears incorrectly)'}. The application cannot manage product data. A 401 Unauthorized error typically means GITHUB_TOKEN is invalid, expired, or lacks 'repo' scope.`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const API_BASE_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`;

interface GitHubFileResponse {
  content?: string; // Base64 encoded content
  sha?: string;
  message?: string; // For errors from GitHub API
  documentation_url?: string; // Often included in GitHub API error responses
}

// Helper to fetch products.json and its SHA from GitHub
async function fetchProductsFromGitHub(): Promise<{ products: Product[]; sha: string | null }> {
  try {
    const response = await fetch(`${API_BASE_URL}?ref=${GITHUB_BRANCH}`, {
      method: 'GET',
      headers: {
        // CRITICAL: The GITHUB_TOKEN is used here for authentication.
        // A 401 Unauthorized error means this token is likely invalid, expired,
        // or does not have the 'repo' scope for accessing your private repository.
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      console.warn(`File not found at ${API_BASE_URL}?ref=${GITHUB_BRANCH}. Assuming empty product list. Please ensure the file exists and is accessible, or it will be created on the first write attempt if the token has write permissions.`);
      return { products: [], sha: null };
    }

    if (!response.ok) {
      // Try to parse error message from GitHub for more details
      const errorData: GitHubFileResponse = await response.json().catch(() => ({ message: 'Failed to parse GitHub API error response body.' }));
      console.error(`Error fetching products from GitHub (${response.status} ${response.statusText}):`, errorData);
      let detailedMessage = errorData.message || `Status: ${response.status} ${response.statusText}`;
      if (response.status === 401) {
        detailedMessage = "GitHub API Authentication Failed (401 Unauthorized). Check your GITHUB_TOKEN: ensure it's correct, active, and has the 'repo' scope for private repositories.";
      }
      if (errorData.documentation_url) {
        detailedMessage += ` See: ${errorData.documentation_url}`;
      }
      throw new Error(`Failed to fetch products from GitHub: ${detailedMessage}`);
    }

    const data: GitHubFileResponse = await response.json();
    if (data.message && response.status !== 200) { // Handle cases where GitHub API returns an error message within a 2xx response (should be rare for GET file)
        console.error('GitHub API returned an error message while fetching file:', data.message);
        throw new Error(`GitHub API error: ${data.message}`);
    }
    if (!data.content) {
      console.warn(`File at ${API_BASE_URL}?ref=${GITHUB_BRANCH} exists but is empty or content is missing. Initializing as an empty array.`);
      return { products: [], sha: data.sha || null };
    }

    const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    let products;
    try {
      products = JSON.parse(decodedContent) as Product[];
    } catch (parseError) {
      console.error('Failed to parse products.json content from GitHub. Content was:', decodedContent, 'Error:', parseError);
      throw new Error('Invalid JSON format in products.json from GitHub. Ensure it contains a valid JSON array (e.g., [] if empty).');
    }
    
    if (!Array.isArray(products)) {
      console.error('Content of products.json from GitHub is not an array. Current content:', products, 'Please ensure it contains a valid JSON array (e.g., [] if empty). This will be treated as an empty list, and the next write will attempt to overwrite it with a correct array structure.');
      return { products: [], sha: data.sha || null };
    }
    return { products, sha: data.sha || null };

  } catch (error) {
    console.error('Network or unexpected error in fetchProductsFromGitHub:', error);
    throw new Error(`A network or unexpected error occurred while fetching product data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper to write products.json back to GitHub
async function writeProductsToGitHub(products: Product[], sha: string | null, commitMessage: string): Promise<boolean> {
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

    if (sha) { 
      body.sha = sha;
    }

    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        // CRITICAL: The GITHUB_TOKEN is used here for authentication.
        // A 401 Unauthorized error means this token is likely invalid, expired,
        // or does not have the 'repo' scope with write permissions for your private repository.
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData: GitHubFileResponse = await response.json().catch(() => ({ message: 'Failed to parse GitHub API error response during write' }));
      console.error(`Error writing products to GitHub (${response.status} ${response.statusText}):`, errorData);
      let detailedMessage = errorData.message || `Status: ${response.status} ${response.statusText}`;
      if (response.status === 401) {
        detailedMessage = "GitHub API Authentication Failed (401 Unauthorized) during write. Check your GITHUB_TOKEN: ensure it's correct, active, and has 'repo' scope with write permissions.";
      }
      if (errorData.documentation_url) {
        detailedMessage += ` See: ${errorData.documentation_url}`;
      }
      // Do not throw here for write, let the calling function decide based on 'false' return
      console.error(`Full error from writeProductsToGitHub: ${detailedMessage}`);
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
  let { products, sha } = await fetchProductsFromGitHub();
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
  
  products[productIndex] = updatedProduct;

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

// This list is primarily a fallback or for initial static generation if GitHub fetch fails during build.
// For generateStaticParams, it's better to fetch live data.
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
