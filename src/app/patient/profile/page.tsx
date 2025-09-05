
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientProfileForm } from '@/components/patient/profile-form';

export default function PatientProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Manage Your Profile</h1>
                <p className="text-muted-foreground">Keep your personal information up-to-date.</p>
            </div>
            
            <Card className="max-w-4xl mx-auto shadow-sm">
                <CardHeader>
                    <CardTitle>Edit Your Profile</CardTitle>
                    <CardDescription>
                       This information is used for booking appointments and receiving notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PatientProfileForm />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
