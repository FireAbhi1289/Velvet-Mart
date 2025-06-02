
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
        <CardContent className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

 <p>
 At Velvet Mart, we aim to deliver your orders quickly and securely. Please review our shipping policy:
 </p>

 <h2 className="text-xl font-semibold text-foreground">1. Order Processing</h2>
          <p>
 Orders are usually processed within 1–2 business days after payment confirmation.
          </p>
 <ul className="list-disc pl-6 space-y-1">
 <li>Processing times may vary during high-volume periods or holidays.</li>
 </ul>

 <h2 className="text-xl font-semibold text-foreground pt-4">2. Shipping Time</h2>
          <p>
 Delivery times depend on your location and logistics partner.
          </p>
          <ul className="list-disc pl-6 space-y-1">
 <li>Estimated delivery is 4–7 business days for most regions.</li>
 <li>We are not responsible for delays caused by third-party logistics, weather, or unforeseen events.</li>
          </ul>

 <h2 className="text-xl font-semibold text-foreground pt-4">3. Shipping Charges</h2>
          <p>
 Shipping fees, if applicable, will be displayed at checkout before confirming the order. In case of promotional free shipping, conditions may apply.
          </p>

 <h2 className="text-xl font-semibold text-foreground pt-4">4. Tracking</h2>
          <p>
 Tracking details (if applicable) will be shared via the communication channel used for your order.
          </p>
 {/* Keep the following placeholder content for now as it might contain other relevant sections you want to keep or adapt later */}
          {/* <h2 className="text-xl font-semibold text-foreground pt-4">4. Shipment Confirmation and Order Tracking</h2>
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

          <p className="pt-6 font-semibold text-foreground"></p> */}
        </CardContent>
      </Card>
    </div>
  );
}
