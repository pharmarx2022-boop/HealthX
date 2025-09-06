
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePercent, Banknote, Briefcase, History, Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getHealthCoordinatorData, convertPointsToCash, type HealthCoordinatorTransaction } from '@/lib/health-coordinator-data';
import { getCommissionWalletData, requestWithdrawal, type CommissionTransaction } from '@/lib/commission-wallet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NearbySearch } from '@/components/booking/nearby-search';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';
import { AnalyticsDashboard } from '@/components/health-coordinator/analytics-dashboard';


export default function HealthCoordinatorDashboardPage() {
    const { toast } = useToast();
    const [healthCoordinatorData, setHealthCoordinatorData] = useState<{ balance: number; transactions: HealthCoordinatorTransaction[] }>({ balance: 0, transactions: [] });
    const [commissionWallet, setCommissionWallet] = useState<{ balance: number; transactions: CommissionTransaction[] }>({ balance: 0, transactions: [] });
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState<any | null>(null);


    useEffect(() => {
        setIsClient(true);
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                setHealthCoordinatorData(getHealthCoordinatorData(u.id));
                setCommissionWallet(getCommissionWalletData(u.id));
            }
        }
    }, []);

    const handleConversionRequest = () => {
        const conversionAmount = healthCoordinatorData.balance;
        if (conversionAmount <= 0) {
            toast({
                title: "No Points to Convert",
                description: "You need to collect Health Points before you can request a cash conversion.",
                variant: "destructive"
            });
            return;
        }

        convertPointsToCash(user.id);
        setHealthCoordinatorData(getHealthCoordinatorData(user.id));

        toast({
            title: "Conversion Request Sent!",
            description: `Your request to convert INR ${conversionAmount.toFixed(2)} has been sent to the admin. The amount will be transferred to your bank account soon.`
        });
    };
    
    const handleWithdrawalRequest = () => {
        const withdrawalAmount = commissionWallet.balance;
         if (withdrawalAmount < 1000) {
            toast({
                title: "Minimum Withdrawal Amount",
                description: "You need a minimum balance of INR 1000 to request a withdrawal.",
                variant: "destructive"
            });
            return;
        }
        requestWithdrawal(user.id, user.fullName, withdrawalAmount);
        setCommissionWallet(getCommissionWalletData(user.id));
    }


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
                <div className="container mx-auto py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold">Health Coordinator Dashboard</h1>
                        <p className="text-muted-foreground">Book appointments and manage your commissions.</p>
                    </div>

                    <AnalyticsDashboard />
                    
                    <div className="grid lg:grid-cols-3 gap-8 items-start mt-8">
                        <div className="lg:col-span-2 space-y-8">
                             <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Briefcase className="w-8 h-8 text-primary"/>
                                    <div>
                                        <CardTitle>Book an Appointment</CardTitle>
                                        <CardDescription>
                                           Find doctors, labs, and pharmacies for your patients.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                     <NearbySearch />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Collected Health Points</CardTitle>
                                    <CardDescription>Your total earnings available for conversion.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">INR {isClient ? healthCoordinatorData.balance.toFixed(2) : '0.00'}</p>
                                    <p className="text-sm text-muted-foreground mt-1">1 Health Point = 1 INR</p>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-4">
                                    <Button className="w-full" onClick={handleConversionRequest} disabled={!isClient || healthCoordinatorData.balance <= 0}>
                                        <Banknote className="mr-2"/> Request Cash Conversion
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto self-center">
                                                <History className="mr-2"/> View History
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Earning History</DialogTitle>
                                                <DialogDescription>A record of your collected points and conversions.</DialogDescription>
                                            </DialogHeader>
                                            <div className="max-h-[50vh] overflow-y-auto -mx-6 px-6">
                                                <ul className="space-y-4 py-4">
                                                    {isClient && healthCoordinatorData.transactions.length > 0 ? (
                                                        healthCoordinatorData.transactions.map((tx, index) => (
                                                            <li key={index} className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium">{tx.description}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(tx.date), 'PP, p')}</p>
                                                                </div>
                                                                <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                                                    {tx.type === 'credit' ? '+' : '-'} INR {tx.amount.toFixed(2)}
                                                                </span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <p className="text-center text-muted-foreground py-4">No transactions yet.</p>
                                                    )}
                                                </ul>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                             <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Gift/> Referral Commissions</CardTitle>
                                    <CardDescription>Your earnings from referring new partners.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold">INR {isClient ? commissionWallet.balance.toFixed(2) : '0.00'}</p>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-4">
                                    <Button className="w-full" onClick={handleWithdrawalRequest} disabled={!isClient || commissionWallet.balance < 1000}>
                                        <Banknote className="mr-2"/> Request Withdrawal (Min. INR 1000)
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto self-center">
                                                <History className="mr-2"/> View Commission History
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Commission History</DialogTitle>
                                                <DialogDescription>A record of your referral earnings and withdrawals.</DialogDescription>
                                            </DialogHeader>
                                            <div className="max-h-[50vh] overflow-y-auto -mx-6 px-6">
                                                <ul className="space-y-4 py-4">
                                                    {isClient && commissionWallet.transactions.length > 0 ? (
                                                        commissionWallet.transactions.map((tx, index) => (
                                                            <li key={index} className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium">{tx.description}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(tx.date), 'PP, p')}</p>
                                                                </div>
                                                                <span className={`font-semibold capitalize ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                                                    {tx.type === 'credit' ? '+' : '-'} INR {tx.amount.toFixed(2)} <span className="text-muted-foreground">({tx.status})</span>
                                                                </span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <p className="text-center text-muted-foreground py-4">No commission transactions yet.</p>
                                                    )}
                                                </ul>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                             <Alert variant="outline" className="w-full">
                                <BadgePercent className="h-4 w-4" />
                                <AlertTitle>How Earnings Work</AlertTitle>
                                <AlertDescription>
                                    You earn Health Points for every appointment you book. You can request to convert these points to cash at any time. You earn Referral Commissions separately when partners you refer join the platform.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <BottomNavBar />
        </div>
    );
}
