
import { Mail, Instagram, Phone as PhoneIcon } from 'lucide-react';
import type { Metadata } from 'next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us | Velvet Mart',
  description: 'Get in touch with Velvet Mart. Find our email, Instagram, and phone numbers.',
};

export default function ContactPage() {
  const contactDetails = [
    {
      icon: Mail,
      label: 'Email',
      value: 'velvetmart@protonmail.com',
      href: 'mailto:velvetmart@protonmail.com',
      isJsxValue: false,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@velvetmart.off',
      href: 'https://instagram.com/velvetmart.off',
      isJsxValue: false,
    },
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: (
        <>
          <a 
            href="tel:+919303644204" 
            className="block text-foreground hover:text-primary hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            +91 93036 44204
          </a>
          <a 
            href="tel:+917869224018" 
            className="block text-foreground hover:text-primary hover:underline mt-1"
            target="_blank" 
            rel="noopener noreferrer"
          >
            +91 78692 24018
          </a>
        </>
      ),
      href: '#', // Not used when isJsxValue is true
      isJsxValue: true,
    },
  ];

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
            <BreadcrumbPage>Contact Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          We&apos;d love to hear from you! Reach out through any of the channels below.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed md:grid-cols-2 to md:grid-cols-3 */}
        {contactDetails.map((detail) => (
          <Card key={detail.label} className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3 pt-5">
              <detail.icon className="w-7 h-7 text-primary flex-shrink-0" />
              <CardTitle className="text-xl font-medium">{detail.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {detail.isJsxValue ? (
                <div className="text-base break-words">
                  {detail.value}
                </div>
              ) : (
                <a
                  href={detail.href}
                  target={detail.label === 'Email' ? '_self' : '_blank'}
                  rel={detail.label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="text-base text-foreground hover:text-primary break-words"
                >
                  {detail.value as string}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
