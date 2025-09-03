
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Edit, History, FileText, Wallet } from 'lucide-react';
import { RedemptionTool } from '@/components/partner/redemption-tool';
import { PartnerProfileForm } from '@/components/partner/partner-profile-form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';


const mockTransactions = [
    {
        id: 'tx1',
        patientName: 'Rohan Sharma',
        date: '2024-08-22T14:30:00Z',
        amount: 150.00,
        status: 'Success'
    },
    {
        id: 'tx2',
        patientName: 'Priya Mehta',
        date: '2024-08-21T18:00:00Z',
        amount: 75.50,
        status: 'Success'
    },
    {
        id: 'tx3',
        patientName: 'Amit Singh',
        date: '2024-08-20T11:15:00Z',
        amount: 220.00,
        status: 'Success'
    }
];

const totalPointsCollected = mockTransactions.reduce((acc, tx) => acc + tx.amount, 0);


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

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Wallet className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Points Collected</CardTitle>
                                <CardDescription>
                                    Total Health Points accumulated from patients.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-3xl font-bold">₹{totalPointsCollected.toFixed(2)}</p>
                        </CardContent>
                    </Card>

                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-6 h-6 text-primary"/>
                                Health Point Transactions
                            </CardTitle>
                             <CardDescription>
                                View your recent Health Point redemption history.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                                {mockTransactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-semibold">Redeemed by {tx.patientName}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(tx.date), 'PP, p')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                             <p className="font-semibold text-green-600">₹{tx.amount.toFixed(2)}</p>
                                             <Badge variant="secondary" className="mt-1">{tx.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                           </div>
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
