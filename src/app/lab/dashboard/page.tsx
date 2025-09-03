
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Edit, History, FileText } from 'lucide-react';
import { RedemptionTool } from '@/components/partner/redemption-tool';
import { PartnerProfileForm } from '@/components/partner/partner-profile-form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';


const mockTransactions = [
    {
        id: 'tx1',
        patientName: 'Rohan Sharma',
        date: '2024-08-18T14:30:00Z',
        amount: 450.00,
        status: 'Success'
    },
    {
        id: 'tx2',
        patientName: 'Anika Desai',
        date: '2024-08-17T10:00:00Z',
        amount: 320.50,
        status: 'Success'
    }
];


export default function LabDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Lab Dashboard</h1>
                <p className="text-muted-foreground">Manage your lab's services and offers.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <FlaskConical className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Welcome, Lab Partner!</CardTitle>
                                <CardDescription>
                                    List your diagnostic services and manage patient requests.
                                </CardDescription>
                            </div>
                        </Header>
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
                           <RedemptionTool partnerType="lab" />
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
                        </Header>
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
                        <PartnerProfileForm partnerType="lab" />
                    </CardContent>
                </Card>

            </div>


        </div>
      </main>
      <Footer />
    </div>
  );
}
