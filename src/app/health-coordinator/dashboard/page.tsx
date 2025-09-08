
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePercent, Banknote, Briefcase, History, Gift, Loader2, Bot, Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useTransition } from 'react';
import { getCommissionWalletData, requestWithdrawal, type CommissionTransaction } from '@/lib/commission-wallet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NearbySearch } from '@/components/booking/nearby-search';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';
import { AnalyticsDashboard } from '@/components/health-coordinator/analytics-dashboard';
import { suggestTestsForPatients, type TestSuggestion } from '@/ai/flows/suggest-test-flow';

const AITestSuggestions = () => {
    const [suggestions, setSuggestions] = useState<TestSuggestion[]>([]);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGetSuggestions = () => {
        startTransition(async () => {
            try {
                const result = await suggestTestsForPatients();
                setSuggestions(result);
            } catch (e) {
                console.error(e);
                toast({
                    title: "Error fetching suggestions",
                    description: e instanceof Error ? e.message : "An unknown error occurred.",
                    variant: "destructive"
                });
            }
        });
    }

    return (
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
                <Bot className="w-8 h-8 text-primary"/>
                <div>
                    <CardTitle>AI Test Suggestions</CardTitle>
                    <CardDescription>
                        Get AI-powered recommendations for patient lab tests based on their history.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {suggestions.length > 0 ? (
                    <div className="space-y-4">
                        {suggestions.map((suggestion, index) => (
                            <Card key={index} className="bg-slate-50">
                                <CardContent className="p-4">
                                    <p className="font-semibold">{suggestion.patientName}</p>
                                    <p><span className="font-medium">Suggested Test:</span> {suggestion.suggestedTest}</p>
                                    <p className="text-sm text-muted-foreground"><span className="font-medium">Reason:</span> {suggestion.reason}</p>
                                    <Button asChild size="sm" className="mt-2">
                                        <Link href="/book-appointment?service=lab">
                                            <Beaker className="mr-2 h-4 w-4"/> Book Lab Test
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                       Click the button to generate test suggestions for your patients.
                    </div>
                )}
            </CardContent>
             <CardFooter>
                 <Button onClick={handleGetSuggestions} disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="animate-spin mr-2"/> :  <Bot className="mr-2" />}
                    {suggestions.length > 0 ? 'Refresh Suggestions' : 'Get Suggestions'}
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function HealthCoordinatorDashboardPage() {
    const { toast } = useToast();
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
                setCommissionWallet(getCommissionWalletData(u.id));
            }
        }
    }, []);
    
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
                             <AITestSuggestions />
                             <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Gift/> Total Earnings</CardTitle>
                                    <CardDescription>Your earnings from booking appointments and referring new partners.</CardDescription>
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
                                                <History className="mr-2"/> View Earnings History
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Earnings History</DialogTitle>
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
                                    You earn a 5% commission for every appointment you book that is successfully completed. You also earn referral bonuses when partners you refer join the platform.
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
