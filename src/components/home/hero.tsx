import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-white">
      <Image
        src="https://picsum.photos/1600/900"
        alt="Doctors and patients in a modern clinic"
        fill
        className="object-cover"
        data-ai-hint="healthcare team"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
          Your Health, Connected.
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
          HealthLink Hub is a revolutionary platform connecting patients, doctors, pharmacies, labs, and agents for a seamless healthcare experience.
        </p>
      </div>
    </section>
  );
}
