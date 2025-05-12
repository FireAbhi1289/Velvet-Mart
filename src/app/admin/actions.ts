'use server';

import * as z from 'zod';
import { addProduct, type Product } from '@/lib/data';

// Schema for server-side validation. imageUrl now expects a data URI.
const productSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['jewelry', 'books', 'gadgets']),
  price: z.number().min(0.01),
  originalPrice: z.number().optional(),
  description: z.string().min(10),
  // Validate that imageUrl is a string starting with "data:image/"
  imageUrl: z.string().min(1, "Image data is missing").startsWith("data:image/", { message: "Invalid image data. Must be a data URI." }),
  additionalImageUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  aiHint: z.string().min(3),
  buyUrl: z.string().url(),
});

// This type remains the same as it's inferred from the schema above
export type AddProductFormValues = z.infer<typeof productSchema>;

interface AddProductActionResult {
  success: boolean;
  product?: Product;
  error?: string;
  errors?: z.ZodIssue[];
}

export async function addProductAction(data: AddProductFormValues): Promise<AddProductActionResult> {
  const validationResult = productSchema.safeParse(data);

  if (!validationResult.success) {
    return { 
      success: false, 
      error: "Validation failed.",
      errors: validationResult.error.errors 
    };
  }

  try {
    // The data.imageUrl is now a data URI.
    // The addProduct function in lib/data.ts needs to be able to handle this.
    // For now, we assume addProduct saves this string directly.
    // In a production system, you'd upload this data URI to a storage service (e.g., Firebase Storage)
    // and save the resulting URL.
    
    const productDataToSave = {
      ...validationResult.data,
      // imageUrl is already in the correct format (data URI string) from validationResult.data
      videoUrl: validationResult.data.videoUrl === '' ? undefined : validationResult.data.videoUrl,
      originalPrice: validationResult.data.originalPrice === 0 ? undefined : validationResult.data.originalPrice,
    };

    // TODO: In a real application, you would:
    // 1. Parse the data URI (validationResult.data.imageUrl).
    // 2. Decode the base64 content.
    // 3. Upload the image bytes to a cloud storage (e.g., Firebase Storage, AWS S3).
    // 4. Get the public URL of the uploaded image from the storage service.
    // 5. Save *that* public URL in productDataToSave.imageUrl instead of the data URI.
    // For this example, we'll save the data URI directly into products.json via addProduct.
    // This is NOT recommended for production due to the size of data URIs.

    const newProduct = await addProduct(productDataToSave);
    return { success: true, product: newProduct };
  } catch (e) {
    console.error("Failed to add product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
