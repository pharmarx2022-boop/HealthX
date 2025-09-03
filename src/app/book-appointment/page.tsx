
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DoctorSearch } from '@/components/booking/doctor-search';

export default function BookAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-headline font-bold">Find a Doctor and Book an Appointment</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">Enter your location to find doctors near you and book your consultation in just a few clicks.</p>
            </div>
            
            <DoctorSearch />

        </div>
      </main>
      <Footer />
    </div>
  );
}
