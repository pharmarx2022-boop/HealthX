
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center text-white bg-green-600">
      <Image
        src="https://picsum.photos/1600/900"
        alt="Smiling doctor with a patient"
        fill
        className="object-cover"
        data-ai-hint="healthcare rural"
        priority
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative container mx-auto text-center px-4">
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
