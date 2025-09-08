
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/doctor/profile-form';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

export default function DoctorProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Manage Your Profile</h1>
                <p className="text-muted-foreground">This information is visible to patients on your public profile.</p>
            </div>
            
            <Card className="max-w-4xl mx-auto shadow-sm">
                <CardHeader>
                    <CardTitle>Edit Your Public Profile</CardTitle>
                    <CardDescription>
                        Keep your professional information up-to-date to attract more patients.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
