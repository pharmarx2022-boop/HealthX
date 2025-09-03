
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { PatientList } from '@/components/doctor/patient-list';

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Manage your appointments and patient interactions.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Stethoscope className="w-8 h-8 text-primary"/>
                    <div>
                        <CardTitle>Welcome, Doctor!</CardTitle>
                        <CardDescription>
                           Here you can manage your schedule, view patient records, and handle consultations.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <PatientList />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
