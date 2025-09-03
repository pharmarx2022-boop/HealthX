
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicManager } from '@/components/doctor/clinic-manager';

export default function DoctorClinicsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Manage Your Clinics</h1>
                <p className="text-muted-foreground">Add, edit, and manage your clinic locations and schedules.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Your Clinics</CardTitle>
                    <CardDescription>
                        Here you can manage all your practice locations and their availability.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ClinicManager />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
