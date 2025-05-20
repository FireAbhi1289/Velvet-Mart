
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateProductAction, type ProductFormValues as ServerProductFormValues } from '../../actions';
import { uploadImageToImgBB } from '@/app/actions/imageUploadActions';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Video, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/data';

// Client-side schema updated for image URLs
const productSchemaClient = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  category: z.enum(['jewelry', 'books', 'gadgets'], { required_error: "Please select a category." }),
  price: z.coerce.number().min(0.01, { message: "Price must be a positive number." }),
  originalPrice: z.coerce.number().optional().transform(val => val === 0 ? undefined : val),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please upload a main image and ensure it's a valid URL." }).min(1, { message: "Main image URL is required." }),
  additionalImageUrls: z.array(z.string().url({ message: "Each additional image must be a valid URL." })).optional(),
  videoUrl: z.string().startsWith("data:video/", { message: "Invalid video data. Must be a data URI." }).optional().or(z.literal('')),
  aiHint: z.string().min(3, {message: "AI Hint must be at least 3 characters."}),
  buyUrl: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val), 
    z.string().url({ message: "Please enter a valid URL if provided." }).optional()
  ),
});

type ProductFormValuesClient = z.infer<typeof productSchemaClient>;

interface EditProductClientFormProps {
  product: Product;
}

export default function EditProductClientForm({ product }: EditProductClientFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(product.imageUrl || null);
  const [isMainImageUploading, setIsMainImageUploading] = useState(false);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(product.additionalImageUrls || []);
  const [areAdditionalImagesUploading, setAreAdditionalImagesUploading] = useState(false);
  const [videoFilePreviewName, setVideoFilePreviewName] = useState<string | null>(null);

  const form = useForm<ProductFormValuesClient>({
    resolver: zodResolver(productSchemaClient),
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        description: product.description,
        imageUrl: product.imageUrl, // This will be an ImgBB URL
        additionalImageUrls: product.additionalImageUrls || [], // These will be ImgBB URLs
        videoUrl: product.videoUrl || '',
        aiHint: product.aiHint,
        buyUrl: product.buyUrl && product.buyUrl.trim() !== '' ? product.buyUrl : undefined,
      });
      setMainImagePreview(product.imageUrl); 
      setAdditionalImagePreviews(product.additionalImageUrls || []);
      if (product.videoUrl) {
        setVideoFilePreviewName(product.videoUrl.startsWith("data:video/") ? "Uploaded Video" : product.videoUrl);
      }
    }
  }, [product, form]);

  useEffect(() => {
    return () => {
      if (mainImagePreview?.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      additionalImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [mainImagePreview, additionalImagePreviews]);

  const handleMainImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mainImagePreview?.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      const localPreviewUrl = URL.createObjectURL(file);
      setMainImagePreview(localPreviewUrl);
      setIsMainImageUploading(true);
      form.setValue('imageUrl', ''); // Clear previous URL

      const formData = new FormData();
      formData.append('image', file);

      try {
        const result = await uploadImageToImgBB(formData);
        if (result.success && result.url) {
          form.setValue('imageUrl', result.url, { shouldValidate: true });
          setMainImagePreview(result.url); // Update preview to ImgBB URL
          toast({ title: "Main image updated!", description: "Image successfully uploaded to ImgBB." });
        } else {
          throw new Error(result.error || "Failed to upload main image to ImgBB.");
        }
      } catch (error: any) {
        console.error("Main image upload error:", error);
        toast({ variant: "destructive", title: "Upload Error", description: error.message || "Could not upload main image." });
        // Revert to original product image on error
        setMainImagePreview(product.imageUrl || null);
        form.setValue('imageUrl', product.imageUrl || '', { shouldValidate: true });
      } finally {
        setIsMainImageUploading(false);
      }
    } else {
      // If file selection is cancelled, revert to product's original image
      setMainImagePreview(product.imageUrl || null);
      form.setValue('imageUrl', product.imageUrl || '', { shouldValidate: true });
    }
  };

  const handleAdditionalImagesUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setAreAdditionalImagesUploading(true);
      additionalImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      
      const localPreviews: string[] = Array.from(files).map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(localPreviews); // Show local previews immediately
      form.setValue('additionalImageUrls', product.additionalImageUrls || []); // Start with original URLs

      const uploadedUrls: string[] = [];
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('image', file);
          const result = await uploadImageToImgBB(formData);
          if (result.success && result.url) {
            uploadedUrls.push(result.url);
          } else {
            throw new Error(result.error || `Failed to upload image ${file.name}.`);
          }
        }
        form.setValue('additionalImageUrls', uploadedUrls, { shouldValidate: true });
        setAdditionalImagePreviews(uploadedUrls); // Update previews to ImgBB URLs
        toast({ title: "Additional images updated!", description: `${uploadedUrls.length} image(s) successfully uploaded.`});
      } catch (error: any) {
        console.error("Additional images upload error:", error);
        toast({ variant: "destructive", title: "Upload Error", description: error.message || "Could not upload some additional images." });
        // On error, revert to original product images
        setAdditionalImagePreviews(product.additionalImageUrls || []);
        form.setValue('additionalImageUrls', product.additionalImageUrls || [], { shouldValidate: true });
      } finally {
        setAreAdditionalImagesUploading(false);
      }
    } else {
      // If file selection is cancelled, revert to original product images
      setAdditionalImagePreviews(product.additionalImageUrls || []);
      form.setValue('additionalImageUrls', product.additionalImageUrls || [], { shouldValidate: true });
    }
  };
  
  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFilePreviewName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('videoUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setVideoFilePreviewName(product.videoUrl ? (product.videoUrl.startsWith("data:video/") ? "Uploaded Video" : product.videoUrl) : null);
      form.setValue('videoUrl', product.videoUrl || '', { shouldValidate: true });
    }
  };
  
  async function onSubmit(values: ProductFormValuesClient) {
    try {
      const result = await updateProductAction(productId, values as ServerProductFormValues);
      if (result.success && result.product) {
        toast({
          title: "Product Updated!",
          description: `${result.product.name} has been successfully updated.`,
        });
        router.push('/admin-panel'); 
      } else {
        const errorMessages = result.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join('\n') || result.error || "An unknown error occurred.";
        toast({
          variant: "destructive",
          title: "Error updating product",
          description: <pre className="whitespace-pre-wrap">{errorMessages}</pre>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not submit the form. Please try again.",
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product: {product.name}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Elegant Diamond Ring" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="gadgets">Gadgets</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 4999.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (₹) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 5999.00" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                  </FormControl>
                  <FormDescription>Leave empty or 0 if not applicable.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Detailed product description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ fieldState }) => (
              <FormItem>
                <FormLabel>Main Image</FormLabel>
                <FormControl>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="mainImageUpload"
                      className="hidden"
                      onChange={handleMainImageUpload}
                      disabled={isMainImageUploading}
                    />
                    <label
                      htmlFor="mainImageUpload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
                        fieldState.error ? "border-destructive" : "border-input",
                        isMainImageUploading ? "cursor-not-allowed opacity-70" : ""
                      )}
                    >
                      {isMainImageUploading ? (
                         <div className="flex flex-col items-center justify-center">
                          <Loader2 className="w-10 h-10 mb-3 text-muted-foreground animate-spin" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : mainImagePreview ? (
                        <div className="relative w-full h-full">
                           <Image src={mainImagePreview} alt="Main Image Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload main image</span>
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="aiHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Hint for Main Image</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., silver necklace elegant pendant" {...field} />
                </FormControl>
                <FormDescription>Keywords for image search if placeholder is used, or for general classification.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalImageUrls"
             render={({ fieldState }) => (
              <FormItem>
                <FormLabel>Additional Images (Optional)</FormLabel>
                <FormControl>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="additionalImagesUpload"
                      className="hidden"
                      onChange={handleAdditionalImagesUpload}
                      disabled={areAdditionalImagesUploading}
                    />
                    <label
                      htmlFor="additionalImagesUpload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
                        fieldState.error ? "border-destructive" : "border-input",
                        areAdditionalImagesUploading ? "cursor-not-allowed opacity-70" : ""
                      )}
                    >
                     {areAdditionalImagesUploading ? (
                         <div className="flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload additional images</span>
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </FormControl>
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {additionalImagePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={previewUrl} alt={`Additional preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ fieldState }) => ( /* Video upload remains Data URI */
              <FormItem>
                <FormLabel>Product Video (Optional)</FormLabel>
                <FormControl>
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      id="videoUpload"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                    <label
                      htmlFor="videoUpload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
                        fieldState.error ? "border-destructive" : "border-input"
                      )}
                    >
                      {videoFilePreviewName ? ( 
                        <div className="flex flex-col items-center justify-center text-center">
                           <Video className="w-10 h-10 mb-2 text-muted-foreground" />
                           <p className="text-sm text-muted-foreground font-semibold">Video Selected:</p>
                           <p className="text-xs text-muted-foreground truncate max-w-xs">{videoFilePreviewName === "Uploaded Video" && form.getValues("videoUrl")?.startsWith("data:video") ? "Uploaded Video" : videoFilePreviewName}</p>
                           <Button variant="ghost" size="sm" className="mt-1 text-destructive hover:text-destructive-foreground" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVideoFilePreviewName(null); form.setValue('videoUrl', '', { shouldValidate: true }); const input = document.getElementById('videoUpload') as HTMLInputElement; if(input) input.value = '';}}>
                             <XCircle className="mr-1 h-4 w-4"/> Remove
                           </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                           <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload video</span>
                          </p>
                          <p className="text-xs text-muted-foreground">MP4, MOV, AVI etc.</p>
                        </div>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buyUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/product-link" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)} />
                </FormControl>
                <FormDescription>
                  If provided, users might be redirected here. Otherwise, the purchase form will be used.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting || isMainImageUploading || areAdditionalImagesUploading}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (isMainImageUploading || areAdditionalImagesUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Images...
                </>
              ) : "Update Product")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin-panel')} className="flex-1">
                Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
