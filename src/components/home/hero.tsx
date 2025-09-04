
import { Button } from '../ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-primary text-primary-foreground flex items-center justify-center py-24 md:py-32">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
          Your Health, Connected.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Easily book appointments with doctors, labs, and pharmacies near you.
        </p>
         <Button asChild size="lg" variant="secondary" className="mt-8 text-lg">
            <Link href="#roles">
                Get Started
            </Link>
         </Button>
      </div>
    </section>
  );
}
