
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
  title: 'Shipping Policy | Velvet Mart',
  description: 'Read the shipping policy for Velvet Mart.',
};

export default function ShippingPolicyPage() {
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
            <BreadcrumbPage>Shipping Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Order Processing Time</h2>
          <p>
            Placeholder: All orders are processed within [Number] business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Shipping Rates and Delivery Estimates</h2>
          <p>
            Placeholder: Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <p>
            Placeholder: We offer various shipping options. Estimated delivery times are as follows:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Standard Shipping: [Number] - [Number] business days</li>
            <li>Expedited Shipping: [Number] - [Number] business days</li>
          </ul>
          <p>
            Placeholder: Please note that delivery delays can occasionally occur due to unforeseen circumstances (e.g., weather, carrier delays).
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Shipment to P.O. Boxes</h2>
          <p>
            Placeholder: [Specify if you ship to P.O. boxes or not].
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Shipment Confirmation and Order Tracking</h2>
          <p>
            Placeholder: You will receive a shipment confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within [Number] hours.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Customs, Duties, and Taxes</h2>
          <p>
            Placeholder: Velvet Mart is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
          </p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">6. Damaged Items</h2>
          <p>
            Placeholder: Velvet Mart is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier or our support team directly to file a claim. Please save all packaging material and damaged goods before filing a claim.
          </p>

          <p className="pt-6 font-semibold text-foreground">
            Please replace this placeholder text with your actual Shipping Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
