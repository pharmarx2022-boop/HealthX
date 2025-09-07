
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-6 px-6 md:px-12 border-t bg-slate-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HealthX. All rights reserved.
            </p>
             <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                Made in West Bengal <Heart className="w-4 h-4 text-red-500 fill-current" />
            </p>
        </div>
        <nav className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center">
           <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
            About Us
          </Link>
           <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
          <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
