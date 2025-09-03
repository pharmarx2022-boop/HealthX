
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';
import { RedemptionTool } from '@/components/partner/redemption-tool';

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
            
            <div className="grid md:grid-cols-2 gap-8">
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
                        <p>Pharmacy-specific content and tools will be displayed here.</p>
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


        </div>
      </main>
      <Footer />
    </div>
  );
}
