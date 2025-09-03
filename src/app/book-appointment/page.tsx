
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NearbySearch } from '@/components/booking/nearby-search';

export default function BookAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-headline font-bold">Find Nearby Healthcare Services</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">Allow location access to discover doctors, pharmacies, and labs near you.</p>
            </div>
            
            <NearbySearch />

        </div>
      </main>
      <Footer />
    </div>
  );
}
