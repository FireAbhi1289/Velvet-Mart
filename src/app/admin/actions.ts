
'use server';

import * as z from 'zod';
import { addProduct, updateProduct, deleteProduct, type Product } from '@/lib/data';
import { revalidatePath } from 'next/cache';

// Schema for server-side validation for adding/updating products
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  category: z.enum(['jewelry', 'books', 'gadgets'], { required_error: "Please select a category." }),
  price: z.coerce.number().min(0.01, "Price must be a positive number."),
  originalPrice: z.coerce.number().optional().transform(val => val === 0 ? undefined : val),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().min(1, "Main image data is missing").startsWith("data:image/", { message: "Invalid main image data. Must be a data URI." }),
  additionalImageUrls: z.array(
    z.string().min(1, "Additional image data is missing").startsWith("data:image/", { message: "Invalid additional image data. Must be a data URI." })
  ).optional(),
  videoUrl: z.string().startsWith("data:video/", { message: "Invalid video data. Must be a data URI." }).optional().or(z.literal('')),
  aiHint: z.string().min(3, "AI Hint must be at least 3 characters."),
  buyUrl: z.string().url({ message: "Please enter a valid URL if provided." }).optional().or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductActionResult {
  success: boolean;
  product?: Product;
  error?: string;
  errors?: z.ZodIssue[];
}

export async function addProductAction(data: ProductFormValues): Promise<ProductActionResult> {
  const validationResult = productSchema.safeParse(data);

  if (!validationResult.success) {
    return { 
      success: false, 
      error: "Validation failed.",
      errors: validationResult.error.errors 
    };
  }

  try {
    const productDataToSave = {
      ...validationResult.data,
      videoUrl: validationResult.data.videoUrl === '' ? undefined : validationResult.data.videoUrl,
      originalPrice: validationResult.data.originalPrice === 0 ? undefined : validationResult.data.originalPrice,
      buyUrl: validationResult.data.buyUrl === '' ? undefined : validationResult.data.buyUrl,
    };

    const newProduct = await addProduct(productDataToSave);
    revalidatePath('/admin'); // Revalidate admin page to show new product
    revalidatePath(`/${newProduct.category}`); // Revalidate category page
    revalidatePath('/'); // Revalidate home page if it lists products
    return { success: true, product: newProduct };
  } catch (e) {
    console.error("Failed to add product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}

export async function updateProductAction(productId: string, data: ProductFormValues): Promise<ProductActionResult> {
  const validationResult = productSchema.safeParse(data);

  if (!validationResult.success) {
    return { 
      success: false, 
      error: "Validation failed.",
      errors: validationResult.error.errors 
    };
  }

  try {
    const productDataToSave = {
      ...validationResult.data,
      videoUrl: validationResult.data.videoUrl === '' ? undefined : validationResult.data.videoUrl,
      originalPrice: validationResult.data.originalPrice === 0 ? undefined : validationResult.data.originalPrice,
      buyUrl: validationResult.data.buyUrl === '' ? undefined : validationResult.data.buyUrl,
    };
    
    const updatedProduct = await updateProduct(productId, productDataToSave);
    if (!updatedProduct) {
      return { success: false, error: "Product not found or failed to update." };
    }
    revalidatePath('/admin');
    revalidatePath(`/product/${productId}`);
    revalidatePath(`/${updatedProduct.category}`);
    revalidatePath('/');
    return { success: true, product: updatedProduct };
  } catch (e) {
    console.error("Failed to update product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to update product: ${errorMessage}` };
  }
}

interface DeleteProductActionResult {
  success: boolean;
  error?: string;
}

export async function deleteProductAction(productId: string): Promise<DeleteProductActionResult> {
  try {
    const product = await deleteProduct(productId);
    if (!product) {
        return { success: false, error: "Product not found or failed to delete." };
    }
    revalidatePath('/admin');
    // Potentially revalidate category and product pages if they could still be accessed
    // For simplicity, we are just revalidating admin. Consider more specific revalidation.
    revalidatePath('/'); // Revalidate all relevant paths
    return { success: true };
  } catch (e) {
    console.error("Failed to delete product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to delete product: ${errorMessage}` };
  }
}
