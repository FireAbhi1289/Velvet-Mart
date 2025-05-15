
'use client';

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useWishie } from '@/context/wishie-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, User, Phone, UploadCloud, Loader2 } from 'lucide-react'; // Added Loader2
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { notifyWishViaTelegram, type WishieDetailsForTelegram } from '@/app/actions/wishie-telegram-actions'; // Import new action
import { useToast } from '@/hooks/use-toast'; // For displaying errors if Telegram fails

const STEPS = {
  GREET_ITEM_DESCRIPTION: 0,
  IMAGE_UPLOAD: 1,
  USER_DETAILS: 2,
  CONFIRMATION: 3,
};

interface FormData {
  itemDescription: string;
  imageFile: File | null;
  imagePreview: string | null;
  fullName: string;
  contactNumber: string;
}

export default function WishieWidget() {
  const { isWishieOpen, selectedCategory, closeWishie } = useWishie();
  const [currentStep, setCurrentStep] = useState(STEPS.GREET_ITEM_DESCRIPTION);
  const [formData, setFormData] = useState<FormData>({
    itemDescription: '',
    imageFile: null,
    imagePreview: null,
    fullName: '',
    contactNumber: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const [confirmationMessage, setConfirmationMessage] = useState("Your request has been submitted! Wishie will reach out to you within 3 hours!");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isWishieOpen) {
      setIsVisible(true);
      setCurrentStep(STEPS.GREET_ITEM_DESCRIPTION);
      setFormData({
        itemDescription: '',
        imageFile: null,
        imagePreview: null,
        fullName: '',
        contactNumber: '',
      });
      setConfirmationMessage("Your request has been submitted! Wishie will reach out to you within 3 hours!"); // Reset confirmation message
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isWishieOpen, selectedCategory]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
        imagePreview: null,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep === STEPS.GREET_ITEM_DESCRIPTION && !formData.itemDescription.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Please describe the item you're looking for." });
      return;
    }
    if (currentStep === STEPS.USER_DETAILS) {
      if (!formData.fullName.trim()) {
        toast({ variant: "destructive", title: "Oops!", description: "Please enter your full name." });
        return;
      }
      if (!formData.contactNumber.trim() || !/^\+?[0-9\s-()]{7,20}$/.test(formData.contactNumber)) {
        toast({ variant: "destructive", title: "Oops!", description: "Please enter a valid contact number." });
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Please enter your full name." });
      return;
    }
    if (!formData.contactNumber.trim() || !/^\+?[0-9\s-()]{7,20}$/.test(formData.contactNumber)) {
      toast({ variant: "destructive", title: "Oops!", description: "Please enter a valid contact number." });
      return;
    }

    setIsSubmitting(true);

    const wishDetailsForTelegram: WishieDetailsForTelegram = {
      category: selectedCategory,
      itemDescription: formData.itemDescription,
      imageProvided: !!formData.imageFile,
      fullName: formData.fullName,
      contactNumber: formData.contactNumber,
      timestamp: new Date().toISOString(),
    };

    console.log('Wishie Request Submitted:', wishDetailsForTelegram);

    const telegramResult = await notifyWishViaTelegram(wishDetailsForTelegram);

    if (telegramResult.success) {
      setConfirmationMessage("Your request has been submitted! Wishie will reach out to you within 3 hours!");
    } else {
      setConfirmationMessage(`Your request was submitted, but we had trouble sending an instant notification. We'll still get back to you! Error: ${telegramResult.message}`);
      toast({
        variant: "destructive",
        title: "Notification Issue",
        description: `Wish submitted, but Telegram notification failed: ${telegramResult.message}. ${telegramResult.error ? `Details: ${telegramResult.error}` : ''}`,
        duration: 10000,
      });
      console.error("Wishie Telegram Notification Error:", telegramResult.message, telegramResult.error);
    }
    
    setCurrentStep(STEPS.CONFIRMATION); // Move to confirmation regardless of Telegram status for now
    setIsSubmitting(false);
  };

  if (!isVisible && !isWishieOpen) {
    return null;
  }

  const getGreeting = () => {
    if (selectedCategory) {
      return `Hi! I’m Wishie 🧞‍♀️ What item are you wishing for in the ${selectedCategory} category?`;
    }
    return 'Hi! I’m Wishie 🧞‍♀️ What item are you wishing for today?';
  };

  return (
    <div
      className={
        `fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out transform
        ${isWishieOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`
      }
      style={{ willChange: 'opacity, transform' }}
    >
      <Card className="w-[350px] max-w-[90vw] h-[500px] max-h-[80vh] shadow-2xl rounded-lg flex flex-col bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image
              src="/wishie-avatar.png"
              alt="Wishie Avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <CardTitle className="text-lg font-semibold">Wishie</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={closeWishie} aria-label="Close Wishie" disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <ScrollArea className="flex-grow">
          <CardContent className="p-4 space-y-4 text-sm">
            {currentStep === STEPS.GREET_ITEM_DESCRIPTION && (
              <>
                <p className="bg-secondary text-secondary-foreground p-3 rounded-md shadow-sm">{getGreeting()}</p>
                <Textarea
                  name="itemDescription"
                  placeholder="Describe the item you're looking for..."
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="resize-none"
                  required
                />
              </>
            )}

            {currentStep === STEPS.IMAGE_UPLOAD && (
              <>
                <p className="bg-secondary text-secondary-foreground p-3 rounded-md shadow-sm">
                  Do you have a picture of the item? You can upload it here <span className="text-xl">🖼️</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-start gap-2"
                >
                  <UploadCloud className="h-5 w-5" />
                  {formData.imageFile ? formData.imageFile.name : 'Upload Image (Optional)'}
                </Button>
                <Input
                  type="file"
                  name="imageFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {formData.imagePreview && (
                  <div className="mt-2 border rounded-md p-2 flex justify-center">
                    <Image src={formData.imagePreview} alt="Image preview" width={100} height={100} className="rounded-md object-contain max-h-[100px]" />
                  </div>
                )}
              </>
            )}

            {currentStep === STEPS.USER_DETAILS && (
              <>
                <p className="bg-secondary text-secondary-foreground p-3 rounded-md shadow-sm">
                  Just a little more info to make your wish come true!
                </p>
                <form onSubmit={handleSubmit} id="wishieForm" className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="contactNumber"
                      type="tel"
                      placeholder="Contact Number"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </form>
              </>
            )}

            {currentStep === STEPS.CONFIRMATION && (
              <div className="text-center space-y-3 py-8">
                <p className="text-4xl">✅</p>
                <p className="font-semibold text-lg text-primary">Wish Request Submitted!</p>
                <p className="text-muted-foreground">{confirmationMessage}</p>
              </div>
            )}
          </CardContent>
        </ScrollArea>

        <CardFooter className="p-4 border-t">
          {currentStep < STEPS.USER_DETAILS && (
            <Button onClick={nextStep} className="w-full" disabled={isSubmitting}>
              Next <Send className="ml-2 h-4 w-4" />
            </Button>
          )}
           {currentStep === STEPS.USER_DETAILS && (
            <Button form="wishieForm" type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Submitting..." : "Submit Wish"}
            </Button>
          )}
          {currentStep === STEPS.CONFIRMATION && (
            <Button onClick={closeWishie} className="w-full" variant="outline">
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
