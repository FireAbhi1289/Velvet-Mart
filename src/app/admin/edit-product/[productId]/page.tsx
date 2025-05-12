
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
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Video, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductById, type Product } from '@/lib/data'; 
import Link from 'next/link';

// Client-side schema (can be same as server if no file objects involved directly)
const productSchemaClient = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  category: z.enum(['jewelry', 'books', 'gadgets'], { required_error: "Please select a category." }),
  price: z.coerce.number().min(0.01, { message: "Price must be a positive number." }),
  originalPrice: z.coerce.number().optional().transform(val => val === 0 ? undefined : val),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  imageUrl: z.string({ required_error: "Please upload a main image." }).min(1, { message: "Please upload a main image." }), // Data URI
  additionalImageUrls: z.array(z.string().min(1, "Each additional image requires data.")).optional(), // Array of Data URIs
  videoUrl: z.string().optional().or(z.literal('')), // Data URI or empty
  aiHint: z.string().min(3, {message: "AI Hint must be at least 3 characters."}),
  buyUrl: z.string().url({ message: "Please enter a valid URL if provided." }).optional().or(z.literal('')),
});

type ProductFormValuesClient = z.infer<typeof productSchemaClient>;

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [videoFilePreviewName, setVideoFilePreviewName] = useState<string | null>(null); // Stores Data URI for videos for preview consistency

  const form = useForm<ProductFormValuesClient>({
    resolver: zodResolver(productSchemaClient),
    defaultValues: {
      name: '',
      price: 0,
      originalPrice: undefined,
      description: '',
      imageUrl: '', 
      additionalImageUrls: [],
      videoUrl: '',
      aiHint: '',
      buyUrl: '',
    },
  });

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setIsLoadingProduct(true);
        // Fetch product data - NOTE: getProductById is async and fetches from fs.
        // In a real app with a DB, this would be an API call.
        // For this example, we'll simulate it if data.ts is adapted, otherwise use static.
        const product = await getProductById(productId);

        if (product) {
          form.reset({
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || undefined,
            description: product.description,
            imageUrl: product.imageUrl, // This is a Data URI or URL
            additionalImageUrls: product.additionalImageUrls || [], // Data URIs or URLs
            videoUrl: product.videoUrl || '', // Data URI or URL
            aiHint: product.aiHint,
            buyUrl: product.buyUrl || '',
          });
          setMainImagePreview(product.imageUrl); // Assuming imageUrl is a data URI or accessible URL
          setAdditionalImagePreviews(product.additionalImageUrls || []); // Assuming these are data URIs or accessible URLs
          if (product.videoUrl) {
            // If videoUrl is a data URI, we might not be able to get a "name" for it easily
            // For now, let's indicate a video is present
            setVideoFilePreviewName(product.videoUrl ? "Uploaded Video" : null);
          }
        } else {
          setProductNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load product data."});
        setProductNotFound(true);
      } finally {
        setIsLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [productId, form, toast]);


  useEffect(() => {
    // Revoke object URLs on unmount
    return () => {
        // Only revoke if they are blob URLs from createObjectURL
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      additionalImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [mainImagePreview, additionalImagePreviews]);


  const handleMainImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
       if (mainImagePreview && mainImagePreview.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
      form.setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const handleAdditionalImagesUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      
      additionalImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });

      const fileReadPromises = Array.from(files).map(file => {
        newPreviews.push(URL.createObjectURL(file));
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      try {
        const dataUris = await Promise.all(fileReadPromises);
        setAdditionalImagePreviews(newPreviews); // Set blob URLs for preview
        form.setValue('additionalImageUrls', dataUris, { shouldValidate: true }); // Set data URIs for form
      } catch (error) {
        console.error("Error reading additional images:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not read additional images." });
      }
    } else {
      // Clear if no files selected
      additionalImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      setAdditionalImagePreviews([]);
      form.setValue('additionalImageUrls', [], { shouldValidate: true });
    }
  };

  const handleVideoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFilePreviewName(file.name); // Show file name
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('videoUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setVideoFilePreviewName(null);
      form.setValue('videoUrl', '', { shouldValidate: true });
    }
  };
  
  async function onSubmit(values: ProductFormValuesClient) {
    try {
      // The values already contain data URIs from the handlers
      const result = await updateProductAction(productId, values as ServerProductFormValues);
      if (result.success && result.product) {
        toast({
          title: "Product Updated!",
          description: `${result.product.name} has been successfully updated.`,
        });
        router.push('/admin'); 
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

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (productNotFound) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you are trying to edit does not exist.
        </p>
        <Button asChild>
          <Link href="/admin">Go back to Product List</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
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
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} />
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
                  <FormLabel>Original Price ($) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 59.99" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
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
            render={({ fieldState }) => ( // field is not directly used, use fieldState for errors
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
                    />
                    <label
                      htmlFor="mainImageUpload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
                        fieldState.error ? "border-destructive" : "border-input"
                      )}
                    >
                      {mainImagePreview ? (
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
                    />
                    <label
                      htmlFor="additionalImagesUpload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
                        fieldState.error ? "border-destructive" : "border-input"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload additional images</span>
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
                      </div>
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
            render={({ fieldState }) => (
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
                      {videoFilePreviewName ? ( // If videoUrl is a data URI, it implies a video is set
                        <div className="flex flex-col items-center justify-center text-center">
                           <Video className="w-10 h-10 mb-2 text-muted-foreground" />
                           <p className="text-sm text-muted-foreground font-semibold">Video Selected:</p>
                           <p className="text-xs text-muted-foreground truncate max-w-xs">{videoFilePreviewName === "Uploaded Video" && form.getValues("videoUrl") ? "Uploaded Video" : videoFilePreviewName}</p>
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
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : "Update Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin')} className="flex-1">
                Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
