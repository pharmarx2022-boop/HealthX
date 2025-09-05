
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NearbySearch } from '@/components/booking/nearby-search';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

export default function BookDoctorAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
        <div className="container mx-auto py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-headline font-bold">Book a Doctor Appointment</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">Find a doctor and book an appointment on behalf of a patient.</p>
            </div>
            <NearbySearch allowedServices={['doctor']} />
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
