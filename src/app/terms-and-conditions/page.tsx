
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
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Introduction</h2>
          <p>
            Welcome to Velvet Mart! These terms and conditions outline the rules and regulations for the use of Velvet Mart's Website, located at [Your Website URL].
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Velvet Mart if you do not agree to take all of the terms and conditions stated on this page.
          </p>

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
          
          <h2 className="text-xl font-semibold text-foreground pt-4">4. Your Content</h2>
           <p>
            In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Velvet Mart a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </p>
          <p>
            Your Content must be your own and must not be invading any third-party’s rights. Velvet Mart reserves the right to remove any of Your Content from this Website at any time without notice.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Limitation of liability</h2>
          <p>
            In no event shall Velvet Mart, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Velvet Mart, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Governing Law & Jurisdiction</h2>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws of [Your State/Country], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your City/Country] for the resolution of any disputes.
          </p>
          
          <p className="pt-6 font-semibold text-foreground">
            Please replace this placeholder text with your actual Terms & Conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
