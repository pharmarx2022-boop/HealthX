
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Separator } from '../ui/separator';

export function Footer() {
  const primaryLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/health-points', label: 'Health Points' },
    { href: '/commissions', label: 'Commissions' },
  ];

  const secondaryLinks = [
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/platform-fees', label: 'Platform Fees' },
  ];

  return (
    <footer className="bg-slate-50 border-t">
        <div className="container mx-auto py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold font-headline">HealthX</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">Your Health, Connected. Easily book appointments with doctors, labs, and pharmacies near you, all while earning valuable rewards.</p>
                </div>
                <div>
                     <h4 className="font-semibold mb-2">Quick Links</h4>
                     <ul className="space-y-2">
                        {primaryLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                     </ul>
                </div>
                 <div>
                     <h4 className="font-semibold mb-2">Legal</h4>
                     <ul className="space-y-2">
                        {secondaryLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
             <Separator className="my-8"/>
             <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>© {new Date().getFullYear()} HealthX. All rights reserved.</p>
                <p className="flex items-center justify-center gap-1.5">
                    Made in West Bengal <Heart className="w-3 h-3 text-red-500 fill-current" />
                </p>
            </div>
        </div>
    </footer>
  );
}
