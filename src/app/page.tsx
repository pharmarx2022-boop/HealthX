
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { RoleCards } from '@/components/home/role-cards';
import { HowItWorks } from '@/components/home/how-it-works';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <RoleCards />
      </main>
      <Footer />
    </div>
  );
}
