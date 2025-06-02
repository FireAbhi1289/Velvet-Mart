
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
  title: 'Terms & Conditions | Velvet Mart',
  description: 'Read the terms and conditions for using Velvet Mart.',
};

export default function TermsAndConditionsPage() {
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
            <BreadcrumbPage>Terms & Conditions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Introduction</h2>
          <p>
            Welcome to Velvet Mart! These terms and conditions outline the rules and regulations for the use of Velvet Mart's Website, located at [Your Website URL].
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Velvet Mart if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-xl font-semibold text-foreground">📜 Terms & Conditions</h2>
          <p>
            By using our services and placing an order through Velvet Mart, you agree to the terms outlined below:
          </p>

          <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
          <p>
            When you access our website or place an order via social media/our platform, you accept these Terms & Conditions in full.
          </p>

          <h3 className="text-lg font-semibold text-foreground">2. Product Accuracy</h3>
          <p>
            While we strive for accuracy in product listings, images are for illustration only. Actual product colors or packaging may vary due to screen differences or manufacturer updates.
          </p>

          <h3 className="text-lg font-semibold text-foreground">3. Orders & Payment</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Orders are confirmed only after full payment.</li>
            <li>We reserve the right to cancel any order at our discretion.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Intellectual Property Rights</h2>
          <p>
            Other than the content you own, under these Terms, Velvet Mart and/or its licensors own all the intellectual property rights and materials contained in this Website.
            You are granted limited license only for purposes of viewing the material contained on this Website.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Publishing any Website material in any other media.</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
            <li>Publicly performing and/or showing any Website material.</li>
            <li>Using this Website in any way that is or may be damaging to this Website.</li>
            <li>Using this Website in any way that impacts user access to this Website.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Your Content</h2>{/* This heading seems to be a duplicate or misnumbered */}
           <p>
            In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Velvet Mart a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </p>
          <p>
            Your Content must be your own and must not be invading any third-party’s rights. Velvet Mart reserves the right to remove any of Your Content from this Website at any time without notice.
          </p>

          <h3 className="text-lg font-semibold text-foreground">4. No Refunds, Replacements, or Cancellations</h3>{/* This heading is also misnumbered in the original text provided */}
          <p>
            All orders are final. As stated in our Refund & Cancellation Policy, no refunds, exchanges, or cancellations will be entertained.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Limitation of liability</h2>
          <p>
            We are not responsible for any loss, damage, or injury arising from the use of any product purchased from our store.
          </p>
          <p>
            In no event shall Velvet Mart, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Velvet Mart, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>

          {/* This placeholder seems to be redundant after adding the new content */}
          <p className="pt-6 font-semibold text-foreground">
            {/* Please replace this placeholder text with your actual Terms & Conditions. */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
