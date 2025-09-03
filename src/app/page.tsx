
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { RoleCards } from '@/components/home/role-cards';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <section id="book" className="py-16 md:py-24 bg-white">
             <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-4xl font-headline font-bold text-gray-800">Find and Book Healthcare</h2>
                 <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Search for doctors, labs, and pharmacies near you. It's fast and easy.
                 </p>
                 <Button asChild size="lg" className="mt-8 text-lg">
                    <Link href="/book-appointment">
                        Start Booking Now <ArrowRight className="ml-2"/>
                    </Link>
                 </Button>
             </div>
        </section>
        <RoleCards />
      </main>
      <Footer />
    </div>
  );
}
