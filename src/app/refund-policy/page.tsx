
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Velvet Mart',
  description: 'Read the refund and cancellation policy for Velvet Mart.',
};

export default function RefundPolicyPage() {
  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Refund & Cancellation Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Refund & Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Order Cancellation</h2>
          <p>
            Placeholder: You may cancel your order within [Number] hours of placing it, provided it has not yet been processed or shipped. To cancel an order, please contact us immediately at [Your Contact Email/Phone] with your order details.
          </p>
          <p>
            Placeholder: If the order has already been shipped, it cannot be canceled. In such cases, you may refer to our return policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Returns</h2>
          <p>
            Placeholder: We accept returns for eligible items within [Number] days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.
          </p>
          <p>
            Placeholder: Certain types of items are exempt from being returned, such as perishable goods, custom products, or personal care items. Please check the product description for specific return eligibility.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">3. Refunds</h2>
          <p>
            Placeholder: Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            Placeholder: If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within [Number] business days.
          </p>
          <p>
            Placeholder: Shipping costs are non-refundable. If you receive a refund, the cost of return shipping may be deducted from your refund unless the return is due to our error.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Exchanges</h2>
          <p>
            Placeholder: We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at [Your Contact Email] and send your item to: [Your Return Address].
          </p>
          
          <p className="pt-6 font-semibold text-foreground">
            Please replace this placeholder text with your actual Refund & Cancellation Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
