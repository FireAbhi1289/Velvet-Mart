
import { v4 as uuidv4 } from 'uuid';

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
  buyUrl?: string;
};

// --- GitHub Configuration ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'products.json';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// **Critical Check for Environment Variables**
if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
  const missingVars = [
    !GITHUB_TOKEN && "GITHUB_TOKEN",
    !GITHUB_REPO_OWNER && "GITHUB_REPO_OWNER",
    !GITHUB_REPO_NAME && "GITHUB_REPO_NAME",
  ].filter(Boolean).join(", ");

  const errorMessage = `CRITICAL ERROR: Essential GitHub environment variables are not configured. Please set them in your .env.local and deployment environment. Missing: ${missingVars}. The application cannot manage product data.`;
  console.error(errorMessage);
  // This error will stop the application cold if env vars are missing, which is intended.
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
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store', // Ensure fresh data is fetched
    });

    if (!response.ok) {
      let errorBodyText = ''; // To store raw text if JSON parsing fails
      let parsedErrorData: GitHubFileResponse | null = null;

      try {
        errorBodyText = await response.text(); // Get raw text first
        parsedErrorData = JSON.parse(errorBodyText) as GitHubFileResponse; // Then try to parse
      } catch (e) {
        console.warn(`Failed to parse GitHub API error response as JSON during fetch. Raw text (if available): '${errorBodyText}'`, e);
      }

      const errorToLog = parsedErrorData || { message: errorBodyText || `Status: ${response.status} ${response.statusText}` };
      console.error(`Error fetching products from GitHub (${response.status} ${response.statusText}):`, JSON.stringify(errorToLog, null, 2));

      let detailedMessage = errorToLog.message || `Status: ${response.status} ${response.statusText}`;

      if (response.status === 401) {
        detailedMessage = `GitHub API Authentication Failed (401 Unauthorized). This is almost always due to an invalid or misconfigured GITHUB_TOKEN. 
        Troubleshooting steps:
        1. Verify GITHUB_TOKEN in your .env.local file AND in your Vercel/hosting environment variables.
        2. Ensure the token is correct, active (not expired).
        3. Confirm the token has the 'repo' scope (for full access to private repositories).
        4. Check GITHUB_REPO_OWNER ('${GITHUB_REPO_OWNER}') and GITHUB_REPO_NAME ('${GITHUB_REPO_NAME}') are correct.
        Raw error from GitHub (if available): "${errorBodyText.replace(/"/g, '\\"')}"`; // Escape quotes for better logging
      } else if (response.status === 404) {
         detailedMessage = `GitHub API Error (404 Not Found). The file '${GITHUB_FILE_PATH}' might not exist in the branch '${GITHUB_BRANCH}' of repository '${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}', or the repository itself is not accessible with the provided token. Raw error: ${errorBodyText}`;
      } else if (response.status === 403) {
        detailedMessage = `GitHub API Error (403 Forbidden). The GITHUB_TOKEN might not have sufficient permissions for the operation, or an abuse detection mechanism might have been triggered. Raw error: ${errorBodyText}`;
      }


      if (parsedErrorData?.documentation_url) {
        detailedMessage += ` See: ${parsedErrorData.documentation_url}`;
      }
      throw new Error(`Failed to fetch products from GitHub: ${detailedMessage}`);
    }

    const data: GitHubFileResponse = await response.json();
    if (data.message && response.status !== 200) {
        console.error('GitHub API returned an error message while fetching file:', data.message);
        throw new Error(`GitHub API error: ${data.message}`);
    }
    if (!data.content) {
      // If the file exists but is empty (e.g., newly created)
      if (response.status === 200 && data.sha) {
        console.warn(`File at ${API_BASE_URL}?ref=${GITHUB_BRANCH} exists but is empty. Initializing as an empty array.`);
        return { products: [], sha: data.sha };
      }
      // If the file truly doesn't exist (should have been caught by 404 earlier, but as a safeguard)
      console.error(`File content is missing from GitHub response for ${GITHUB_FILE_PATH}, and response was not a 404. This is unexpected.`);
      throw new Error(`File content missing from GitHub response for ${GITHUB_FILE_PATH}.`);
    }

    const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    let products;
    try {
      products = JSON.parse(decodedContent) as Product[];
    } catch (parseError) {
      console.error('Failed to parse products.json content from GitHub. Ensure it contains a valid JSON array (e.g., [] if empty). Content was:', decodedContent, 'Error:', parseError);
      throw new Error('Invalid JSON format in products.json from GitHub.');
    }
    
    if (!Array.isArray(products)) {
      console.error('Content of products.json from GitHub is not an array. Please ensure it is a valid JSON array (e.g., [] if empty). Current content:', products);
      throw new Error('Content of products.json from GitHub is not an array.');
    }
    return { products, sha: data.sha || null };

  } catch (error) {
    console.error('Network or unexpected error in fetchProductsFromGitHub:', error);
    // Re-throw the error to be caught by the calling function, preserving specific messages if already thrown
    if (error instanceof Error && error.message.startsWith('Failed to fetch products from GitHub:')) {
        throw error;
    }
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
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorBodyText = '';
      let parsedErrorData: GitHubFileResponse | null = null;
      try {
        errorBodyText = await response.text();
        parsedErrorData = JSON.parse(errorBodyText);
      } catch (e) {
        console.warn(`Failed to parse GitHub API error response as JSON during write. Raw text: '${errorBodyText}'`, e);
      }
      const errorToLog = parsedErrorData || { message: errorBodyText || `Status: ${response.status} ${response.statusText}` };
      console.error(`Error writing products to GitHub (${response.status} ${response.statusText}):`, JSON.stringify(errorToLog, null, 2));
      // Do not throw here for write, let the calling function decide based on 'false' return
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
// It's not actively used if GitHub fetch is successful.
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
