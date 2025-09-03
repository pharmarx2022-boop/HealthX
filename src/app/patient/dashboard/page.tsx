
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function PatientDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Patient Dashboard</h1>
                <p className="text-muted-foreground">Manage your appointments and health records.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <User className="w-8 h-8 text-primary"/>
                    <div>
                        <CardTitle>Welcome!</CardTitle>
                        <CardDescription>
                            Book new appointments, view your upcoming visits, and manage your wallet.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>Patient-specific content and tools will be displayed here, like upcoming appointments.</p>
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
