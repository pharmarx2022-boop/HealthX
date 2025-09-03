
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FlaskConical, Edit, History, FileText, Wallet, Banknote } from 'lucide-react';
import { RedemptionTool } from '@/components/partner/redemption-tool';
import { PartnerProfileForm } from '@/components/partner/partner-profile-form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';


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

const totalPointsCollected = mockTransactions.reduce((acc, tx) => acc + tx.amount, 0);

export default function LabDashboardPage() {
    const { toast } = useToast();
    const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
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
                        </CardHeader>
                        <CardContent>
                             <p>Use the tools on this dashboard to manage your presence on HealthLink Hub.</p>
                        </CardContent>
                    </Card>
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Collect Health Points</CardTitle>
                             <CardDescription>
                                Redeem Health Points for patients via OTP.
                            </CardDescription>
                        </Header>
                        <CardContent>
                           <RedemptionTool partnerType="lab" />
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
                        <CardFooter>
                             <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <Banknote className="mr-2"/> Redeem for Cash
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Redeem Points for Cash</DialogTitle>
                                        <DialogDescription>
                                            Review the details below. A 95% admin commission will be deducted from the total amount.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100">
                                            <span className="text-muted-foreground">Total Points Balance</span>
                                            <span className="font-bold text-lg">₹{totalPointsCollected.toFixed(2)}</span>
                                        </div>
                                         <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100">
                                            <span className="text-muted-foreground">Admin Commission (95%)</span>
                                            <span className="font-medium text-destructive">- ₹{(totalPointsCollected * 0.95).toFixed(2)}</span>
                                        </div>
                                         <div className="flex justify-between items-center p-4 rounded-lg bg-green-100 text-green-800 border border-green-200">
                                            <span className="font-semibold">Final Cash Payout</span>
                                            <span className="font-bold text-xl">₹{(totalPointsCollected * 0.05).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">Funds will be transferred to your registered bank account.</p>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                        <Button onClick={() => {
                                            toast({
                                                title: "Redemption Request Submitted!",
                                                description: `₹${(totalPointsCollected * 0.05).toFixed(2)} will be transferred to your bank account within 3-5 business days.`
                                            });
                                            setIsRedeemDialogOpen(false);
                                        }}>Confirm Redemption</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
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
                                                {isClient && <p className="text-sm text-muted-foreground">{format(new Date(tx.date), 'PP, p')}</p>}
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
