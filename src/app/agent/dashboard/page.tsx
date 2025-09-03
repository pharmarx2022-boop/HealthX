
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePercent, Banknote, Briefcase, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getAgentData, convertPointsToCash, type AgentTransaction } from '@/lib/agent-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AgentDashboardPage() {
    const { toast } = useToast();
    const [agentData, setAgentData] = useState<{ balance: number; transactions: AgentTransaction[] }>({ balance: 0, transactions: [] });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // In a real app, you'd fetch this for the logged-in agent.
        // For now, we use a mock agent 'agent_1'.
        setAgentData(getAgentData('agent_1'));
    }, []);

    const handleConversionRequest = () => {
        const conversionAmount = agentData.balance;
        if (conversionAmount <= 0) {
            toast({
                title: "No Points to Convert",
                description: "You need to collect Health Points before you can request a cash conversion.",
                variant: "destructive"
            });
            return;
        }

        convertPointsToCash('agent_1');
        setAgentData(getAgentData('agent_1'));

        toast({
            title: "Conversion Request Sent!",
            description: `Your request to convert ₹${conversionAmount.toFixed(2)} has been sent to the admin. The amount will be transferred to your bank account soon.`
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold">Agent Dashboard</h1>
                        <p className="text-muted-foreground">Book appointments and manage your commissions.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="shadow-sm lg:col-span-2">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Briefcase className="w-8 h-8 text-primary"/>
                                <div>
                                    <CardTitle>Welcome, Agent!</CardTitle>
                                    <CardDescription>
                                        This is your portal to book appointments for patients and track your earnings.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-lg font-semibold">Start booking appointments to earn Health Points!</p>
                                <Button className="mt-4">Book a New Appointment</Button>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Collected Health Points</CardTitle>
                                <CardDescription>Your total earnings available for conversion.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <p className="text-4xl font-bold">₹{isClient ? agentData.balance.toFixed(2) : '0.00'}</p>
                                <p className="text-sm text-muted-foreground mt-1">1 Health Point = ₹1</p>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-4">
                                <Button className="w-full" onClick={handleConversionRequest} disabled={!isClient || agentData.balance <= 0}>
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
                                                {isClient && agentData.transactions.length > 0 ? (
                                                    agentData.transactions.map((tx, index) => (
                                                        <li key={index} className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">{tx.description}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{format(new Date(tx.date), 'PP, p')}</p>
                                                            </div>
                                                            <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
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
                    </div>
                     <Alert variant="outline" className="mt-8">
                        <BadgePercent className="h-4 w-4" />
                        <AlertTitle>How Earnings Work</AlertTitle>
                        <AlertDescription>
                            You earn a commission in Health Points for every appointment you book for a patient. Once you've collected points, you can request a cash conversion. The admin will process your request and transfer the amount to your registered bank account.
                        </AlertDescription>
                    </Alert>
                </div>
            </main>
            <Footer />
        </div>
    );
}
