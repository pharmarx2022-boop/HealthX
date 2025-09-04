
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentProfileForm } from '@/components/agent/profile-form';

export default function AgentProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Manage Your Profile</h1>
                <p className="text-muted-foreground">Keep your professional information up-to-date.</p>
            </div>
            
            <Card className="max-w-4xl mx-auto shadow-sm">
                <CardHeader>
                    <CardTitle>Edit Your Agent Profile</CardTitle>
                    <CardDescription>
                        Use your referral code to onboard new partners and earn commissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AgentProfileForm />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
