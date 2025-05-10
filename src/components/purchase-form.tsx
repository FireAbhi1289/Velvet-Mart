
'use client';

import type { Product } from '@/lib/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// useToast import is no longer needed
import { ScrollArea } from '@/components/ui/scroll-area';

const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  socialMedia: z.string().optional().or(z.literal('')),
  pinCode: z.string().regex(/^\d{6}$/, { message: "PIN code must be 6 digits." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  query: z.string().optional().or(z.literal('')),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface PurchaseFormProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PurchaseForm({ product, open, onOpenChange }: PurchaseFormProps) {
  // const { toast } = useToast(); // Toast is no longer used
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      socialMedia: '',
      pinCode: '',
      state: '',
      query: '',
    },
  });

  async function onSubmit(values: PurchaseFormValues) {
    console.log("Purchase Form Submitted:", {
      product: { id: product.id, name: product.name },
      orderDetails: values,
    });
    // Instead of toast, open the confirmation dialog
    setIsConfirmationDialogOpen(true);
    // We will reset form and close main dialog after confirmation dialog is closed
  }

  const handleConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
    form.reset();
    onOpenChange(false); // Close the main purchase form dialog
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) { // if the main dialog is closed (e.g. by clicking outside or X)
            form.reset(); // Reset form if dialog is closed without submitting
        }
        onOpenChange(isOpen);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Purchase: {product.name}</DialogTitle>
            <DialogDescription>
              Please fill out the form below to proceed with your inquiry for {product.name}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} id="purchaseForm" className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="California" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="socialMedia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Account (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., @johndoe (Twitter/Instagram)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Query (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any specific questions or requests?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>
            {/* Submit button now directly uses the form's onSubmit handler */}
            <Button type="submit" form="purchaseForm">
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Submitted!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order request is submitted. We will contact you within 4 hours for confirming order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmationDialogClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
