
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
  title: 'Privacy Policy | Velvet Mart',
  description: 'Read the privacy policy for Velvet Mart.',
};

export default function PrivacyPolicyPage() {
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
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">🔒 Privacy Policy</h2>
          <p>
            Your privacy is important to us. This Privacy Policy explains how Velvet Mart collects, uses, and protects your information.
          </p>

          <h3 className="text-lg font-semibold text-foreground pt-4">1. Information Collection</h3>
          <p>We may collect the following:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, email, phone number</li>
            <li>Delivery address</li>
            <li>Order details</li>
            <li>Communication history (e.g., via chat or email)</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground pt-4">2. Use of Information</h3>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fulfill and ship your orders</li>
            <li>Provide customer support</li>
            <li>Improve our services and offerings</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground pt-4">3. Data Protection</h3>
          <p>
            We take necessary measures to safeguard your data. However, no method of electronic transmission is 100% secure. We cannot guarantee absolute security but strive to protect your information to the best of our ability.
          </p>

          <h3 className="text-lg font-semibold text-foreground pt-4">4. Third-Party Sharing</h3>
          <p>
            We do not sell or trade your information. However, we may share it with logistics and payment providers to fulfill your order.
          </p>

          <h3 className="text-lg font-semibold text-foreground pt-4">5. Consent</h3>
          <p>
            By using our website or placing an order, you consent to our privacy practices.
          </p>
          <h3 className="text-lg font-semibold text-foreground pt-4">6. Updates to Policy</h3>
          <p>This policy may be updated at any time. Continued use of our services after updates signifies your agreement to the revised policy.</p>
        </CardContent>
      </Card>
    </div>
  );
}
