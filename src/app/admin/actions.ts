
'use server';

import * as z from 'zod';
import { addProduct, type Product } from '@/lib/data';

// Schema should match the form validation schema
const productSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['jewelry', 'books', 'gadgets']),
  price: z.number().min(0.01),
  originalPrice: z.number().optional(),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  additionalImageUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
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
    // Ensure optional fields that are empty strings are converted to undefined if your addProduct expects that
    const productDataToSave = {
      ...validationResult.data,
      videoUrl: validationResult.data.videoUrl === '' ? undefined : validationResult.data.videoUrl,
      originalPrice: validationResult.data.originalPrice === 0 ? undefined : validationResult.data.originalPrice,
    };

    const newProduct = await addProduct(productDataToSave);
    return { success: true, product: newProduct };
  } catch (e) {
    console.error("Failed to add product:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return { success: false, error: `Failed to add product: ${errorMessage}` };
  }
}
