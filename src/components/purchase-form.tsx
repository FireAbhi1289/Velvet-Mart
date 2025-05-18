
'use client';

import type { Product } from '@/lib/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useRef } from 'react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
// Removed import for saveUserDataAction
import { notifyOrderViaTelegram, type OrderDetailsForTelegram } from '@/app/actions/telegram-actions';
import { useToast } from '@/hooks/use-toast';

// Schema for the form values (client-side)
const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  phone: z.string().regex(/^\d{10,15}$/, { message: "Phone number must be 10-15 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  socialMedia: z.string().optional().or(z.literal('')),
  pinCode: z.string().regex(/^\d{6}$/, { message: "PIN code must be 6 digits." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  query: z.string().optional().or(z.literal('')),
});

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface PurchaseFormProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PurchaseForm({ product, open, onOpenChange }: PurchaseFormProps) {
  const { toast } = useToast();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("Your order request is submitted. We will contact you within 3 hours for confirming order.");
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  async function onSubmit(values: PurchaseFormValues) {
    setIsSubmitting(true);
    
    // Prepare data for Telegram notification
    const telegramOrderDetails: OrderDetailsForTelegram = {
      ...values, // user form input
      productName: product.name,
      productId: product.id,
      timestamp: new Date().toISOString(), // generate timestamp
    };

    const telegramResult = await notifyOrderViaTelegram(telegramOrderDetails);

    if (telegramResult.success) {
      setConfirmationMessage("Order submitted successfully! We'll contact you within 3 hours for confirming order.");
      setIsConfirmationDialogOpen(true); // Show confirmation dialog only on success
    } else {
      // If Telegram notification fails, show an error toast and do not show the confirmation dialog.
      toast({
          variant: "destructive",
          title: "Order Submission Error",
          description: telegramResult.message || "Could not send your order. Please try again or contact support.",
          duration: 7000, 
      });
      console.error("Telegram Notification Error:", telegramResult.message, telegramResult.error);
    }
    setIsSubmitting(false);
  }

  const handleConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
    form.reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            if (!isConfirmationDialogOpen) form.reset(); 
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
                        <Input placeholder="John Doe" {...field} ref={nameInputRef} />
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
              <Button type="button" variant="outline" onClick={() => { form.reset(); onOpenChange(false);}} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="purchaseForm" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Submission</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
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
