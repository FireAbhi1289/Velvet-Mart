'use server';

import * as z from 'zod';
import { addProduct, type Product } from '@/lib/data';

// Schema for server-side validation. 
// imageUrl, additionalImageUrls, and videoUrl now expect data URIs.
const productSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['jewelry', 'books', 'gadgets']),
  price: z.number().min(0.01),
  originalPrice: z.number().optional(),
  description: z.string().min(10),
  imageUrl: z.string().min(1, "Main image data is missing").startsWith("data:image/", { message: "Invalid main image data. Must be a data URI." }),
  additionalImageUrls: z.array(
    z.string().min(1, "Additional image data is missing").startsWith("data:image/", { message: "Invalid additional image data. Must be a data URI." })
  ).optional(),
  videoUrl: z.string().startsWith("data:video/", { message: "Invalid video data. Must be a data URI." }).optional().or(z.literal('')),
  aiHint: z.string().min(3),
  buyUrl: z.string().url(),
});

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
    // Data URIs for images and video are already in validationResult.data
    // In a production system, you'd upload these data URIs to a storage service
    // and save the resulting URLs. For this example, we save data URIs directly.
    
    const productDataToSave = {
      ...validationResult.data,
      videoUrl: validationResult.data.videoUrl === '' ? undefined : validationResult.data.videoUrl,
      originalPrice: validationResult.data.originalPrice === 0 ? undefined : validationResult.data.originalPrice,
      // additionalImageUrls is already an array of data URIs or undefined
    };

    const newProduct = await addProduct(productDataToSave);
    return { success: true, product: newProduct };
  } catch (e) {
    console.error("Failed to add product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
