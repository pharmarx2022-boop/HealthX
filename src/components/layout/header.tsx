'use client';

import Link from 'next/link';
import { HeartPulse, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-6 md:px-12 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">
            HealthLink Hub
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/book-appointment"><Calendar />Book Appointment</Link>
          </Button>
          <div className="h-6 border-l mx-2"></div>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register/patient">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
