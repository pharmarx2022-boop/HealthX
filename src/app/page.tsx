
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <section className="py-20 md:py-24 bg-slate-50/50">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Get Started Today</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Ready to take control of your health journey? Register as a patient or login to access your account.</p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/register/patient">Register as Patient</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
