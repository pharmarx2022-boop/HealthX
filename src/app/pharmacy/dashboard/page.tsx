
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Edit } from 'lucide-react';
import { RedemptionTool } from '@/components/partner/redemption-tool';
import { PartnerProfileForm } from '@/components/partner/partner-profile-form';

export default function PharmacyDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Manage your pharmacy's offers and wallet rules.</p>
            </div>
            
             <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Pill className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Welcome, Pharmacy Partner!</CardTitle>
                                <CardDescription>
                                    Manage your inventory, list offers, and connect with patients.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>Use the tools on this dashboard to manage your presence on HealthLink Hub.</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Collect Health Points</CardTitle>
                             <CardDescription>
                                Redeem Health Points for patients via OTP verification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <RedemptionTool partnerType="pharmacy" />
                        </CardContent>
                    </Card>
                </div>

                 <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Edit className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Manage Your Listing</CardTitle>
                            <CardDescription>
                                Update your public profile and redemption offers.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <PartnerProfileForm partnerType="pharmacy" />
                    </CardContent>
                </Card>
            </div>


        </div>
      </main>
      <Footer />
    </div>
  );
}
