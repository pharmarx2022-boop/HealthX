
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, History, Gift, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTransactionHistory, type Transaction } from '@/lib/transactions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { initialDoctors, initialLabs, initialPharmacies } from '@/lib/mock-data';

const DOCTORS_KEY = 'doctorsData';
const LABS_KEY = 'mockLabs';
const PHARMACIES_KEY = 'mockPharmacies';
const TRANSACTIONS_KEY_PREFIX = 'transactions_';

type ReviewTarget = {
    type: 'doctor' | 'lab' | 'pharmacy';
    id: string; // Doctor, Lab, or Pharmacy ID
    name: string;
    transactionId?: string; // Appointment or Transaction ID to mark as reviewed
};

export default function WalletPage() {
    const [user, setUser] = useState<any | null>(null);
    const [myWallet, setMyWallet] = useState<{ balance: number; transactions: Transaction[] }>({ balance: 0, transactions: [] });
    const { toast } = useToast();

    const fetchData = (userId: string) => {
        setMyWallet(getTransactionHistory(userId));
    }

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                fetchData(u.id);
            }
        }
    }, []);

    const getPartnerName = (type: 'lab' | 'pharmacy', id?: string) => {
        if(!id) return 'Unknown';
        const partners = type === 'lab' ? initialLabs : initialPharmacies;
        return partners.find(p => p.id === id)?.name || 'Unknown';
    }

    const openReviewDialog = (target: ReviewTarget) => {
        // This is a placeholder as the dialog is not in this component.
        // In a real app, you would use a global state manager or component composition.
        toast({ title: "Review flow would open here for " + target.name });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-8 md:py-12">
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Wallet/> Health Points Wallet</CardTitle>
                            <CardDescription>Your transaction history for earning and spending Health Points.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-6">
                             <Alert variant="default" className="bg-green-50 border-green-200 text-green-900">
                                <Gift className="h-4 w-4 !text-green-900" />
                                <AlertTitle>Available Balance</AlertTitle>
                                <AlertDescription className="text-2xl font-bold">INR {myWallet.balance.toFixed(2)}</AlertDescription>
                            </Alert>
                            <Separator />
                            <h3 className="font-semibold flex items-center gap-2"><History /> Transaction History</h3>
                             {myWallet.transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {myWallet.transactions.map((tx, index) => (
                                         <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-slate-50/70 border">
                                            <div className="flex-grow">
                                                <p className="font-medium">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground">{format(new Date(tx.date), 'PP, p')}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                                <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                                    {tx.type === 'credit' ? '+' : '-'} INR {tx.amount.toFixed(2)}
                                                </span>
                                                 {tx.type === 'debit' && tx.partnerType && !tx.reviewed && (
                                                    <Button variant="outline" size="sm" onClick={() => openReviewDialog({type: tx.partnerType!, id: tx.partnerId!, name: getPartnerName(tx.partnerType!, tx.partnerId), transactionId: tx.id })}>
                                                       <Star className="mr-2 h-4 w-4"/> Review
                                                    </Button>
                                                )}
                                            </div>
                                         </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-8 text-muted-foreground">No transactions yet.</p>
                            )}
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
