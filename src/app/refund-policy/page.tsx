
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
          <p>At Velvet Mart, we take pride in delivering quality products at unbeatable prices. Please read the following policy carefully before placing an order:</p>

          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">No Refunds</h2>
          <p>All sales are final. We do not offer refunds for any reason, including:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Change of mind</li>
            <li>Incorrect purchase</li>
            <li>Unexpected delay in shipping</li>
            <li>Product variations (color, packaging, etc.)</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">No Replacements</h2>
          <p>
 We do not provide product replacements or exchanges. Customers are advised to carefully review product descriptions, specifications, and images before completing their order.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">No Order Cancellations</h2>
          <p>All sales are final. We do not offer refunds for any reason, including:</p>
            Once an order is placed and payment is confirmed, it cannot be canceled or altered. Please ensure all your order details are accurate before confirming.

          <h2 className="text-xl font-semibold text-foreground pt-4">Damaged or Defective Items</h2>
          <p>
            In rare cases of visibly damaged items on delivery, please contact us within 24 hours of receiving the package with unboxing proof (video mandatory). Resolution will be at our sole discretion and may include assistance through the courier or logistics partner.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
