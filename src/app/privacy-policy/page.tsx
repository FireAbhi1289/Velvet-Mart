
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

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
          <p>
            Placeholder: We collect information that you provide directly to us. For example, we collect information when you create an account, place an order, subscribe to our newsletter, or communicate with us. This information may include your name, email address, postal address, phone number, payment information, and any other information you choose to provide.
          </p>
          <p>
            Placeholder: We also automatically collect certain information when you visit, use, or navigate the Website. This information may include device and usage information, such as your IP address, browser type, operating system, referring URLs, pages viewed, and dates/times of access.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
          <p>
            Placeholder: We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, operate, and maintain our Website;</li>
            <li>Improve, personalize, and expand our Website;</li>
            <li>Understand and analyze how you use our Website;</li>
            <li>Develop new products, services, features, and functionality;</li>
            <li>Process your transactions and manage your orders;</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Website, and for marketing and promotional purposes;</li>
            <li>Send you emails;</li>
            <li>Find and prevent fraud.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Sharing Your Information</h2>
          <p>
            Placeholder: We do not sell your personal information. We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Security of Your Information</h2>
          <p>
            Placeholder: We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">5. Your Data Protection Rights</h2>
          <p>
            Placeholder: Depending on your location, you may have the following rights regarding your personal information:
          </p>
           <ul className="list-disc pl-6 space-y-1">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
           </ul>
           <p>
            Placeholder: If you would like to exercise any of these rights, please contact us at [Your Contact Email].
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Changes to This Privacy Policy</h2>
          <p>
            Placeholder: We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <p className="pt-6 font-semibold text-foreground">
            Please replace this placeholder text with your actual Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
