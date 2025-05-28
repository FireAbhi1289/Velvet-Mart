
'use client'; // Make it a client component to use usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on admin panel paths
  if (pathname.startsWith('/admin-panel')) {
    return null;
  }

  const footerLinks = [
    { href: '/contact', label: 'Contact Us' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/refund-policy', label: 'Refund & Cancellation Policy' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-muted/60 text-muted-foreground border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Velvet Mart</h3>
            <p>
              Your destination for fine jewelry, captivating books, and cutting-edge gadgets.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href={footerLinks[0].href} className="hover:text-primary transition-colors">
                  {footerLinks[0].label}
                </Link>
              </li>
              <li>
                <Link href={footerLinks[2].href} className="hover:text-primary transition-colors">
                  {footerLinks[2].label}
                </Link>
              </li>
               <li>
                <Link href={footerLinks[3].href} className="hover:text-primary transition-colors">
                  {footerLinks[3].label}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href={footerLinks[1].href} className="hover:text-primary transition-colors">
                  {footerLinks[1].label}
                </Link>
              </li>
              <li>
                <Link href={footerLinks[4].href} className="hover:text-primary transition-colors">
                  {footerLinks[4].label}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-muted pt-6">
          <p>&copy; {currentYear} Velvet Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
