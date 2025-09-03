
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Search, User, Wallet, History, BadgePercent, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { initialPharmacies, mockPatientData } from '@/lib/mock-data';
import { getTransactionHistory, recordTransaction, type Transaction } from '@/lib/transactions';
import { getPharmacyData, recordCommission, type PharmacyTransaction } from '@/lib/pharmacy-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PHARMACIES_KEY = 'mockPharmacies';
const PATIENTS_KEY = 'mockPatientsData';

export default function PharmacyDashboardPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<any | null>(null);
    const [patientPhone, setPatientPhone] = useState('');
    const [patient, setPatient] = useState<any | null>(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState('');
    const [patientTransactionHistory, setPatientTransactionHistory] = useState<{ balance: number; transactions: Transaction[] }>({ balance: 0, transactions: [] });
    const [pharmacyData, setPharmacyData] = useState<{ balance: number; transactions: PharmacyTransaction[] }>({ balance: 0, transactions: [] });
    const [pharmacyDetails, setPharmacyDetails] = useState<any>(null);


    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);

                const storedPharmacies = sessionStorage.getItem(PHARMACIES_KEY);
                const allPharmacies = storedPharmacies ? JSON.parse(storedPharmacies) : initialPharmacies;
                const myDetails = allPharmacies.find((p: any) => p.id === u.id);
                setPharmacyDetails(myDetails);
                setPharmacyData(getPharmacyData(u.id));
            }
        }
    }, []);

    const handleSearchPatient = () => {
        const allPatients = JSON.parse(sessionStorage.getItem(PATIENTS_KEY) || JSON.stringify(mockPatientData));
        const foundPatient = allPatients.find((p: any) => p.phone === patientPhone);

        if (foundPatient) {
            setPatient(foundPatient);
            setPatientTransactionHistory(getTransactionHistory(foundPatient.id));
            setOtpSent(false);
            setOtp('');
            setRedeemAmount('');
        } else {
            toast({
                title: "Patient Not Found",
                description: "No patient found with that phone number.",
                variant: "destructive"
            });
            setPatient(null);
        }
    };
    
    const handleSendOtp = () => {
        setOtpSent(true);
        toast({
            title: "OTP Sent",
            description: `An OTP has been sent to the patient's number ending in ${patient.phone.slice(-4)}. For demo, OTP is 123456.`
        });
    }

    const handleRedeem = () => {
        if (otp !== '123456') {
            toast({
                title: "Invalid OTP",
                description: "The OTP you entered is incorrect.",
                variant: "destructive"
            });
            return;
        }

        const amount = parseFloat(redeemAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to redeem.",
                variant: "destructive"
            });
            return;
        }

        if (amount > patientTransactionHistory.balance) {
            toast({
                title: "Insufficient Balance",
                description: `Patient only has ₹${patientTransactionHistory.balance.toFixed(2)} available.`,
                variant: "destructive"
            });
            return;
        }
        
        recordTransaction(patient.id, {
            type: 'debit',
            amount: amount,
            description: `Redeemed at ${pharmacyDetails.name}`,
            date: new Date(),
        });
        
        const discountAmount = amount * (pharmacyDetails.discount / 100);
        const finalAmount = amount - discountAmount;
        const commission = finalAmount * 0.05; // Admin keeps 5%
        const pharmacyPayout = finalAmount - commission;

        recordCommission(user.id, {
            type: 'credit',
            amount: pharmacyPayout,
            description: `Commission from redemption by ${patient.name}`,
            date: new Date(),
        });

        toast({
            title: "Redemption Successful!",
            description: `₹${amount.toFixed(2)} redeemed. Pharmacy payout will be ₹${pharmacyPayout.toFixed(2)}.`,
            duration: 6000
        });

        // Refresh data
        handleSearchPatient();
        setPharmacyData(getPharmacyData(user.id));
        setOtpSent(false);
        setOtp('');
        setRedeemAmount('');
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Manage inventory and redeem patient health points.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Pill className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Welcome, {pharmacyDetails?.name || 'Pharmacy'}!</CardTitle>
                            <CardDescription>
                                Use this portal to manage your operations.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>Inventory management and other pharmacy-specific tools will be available here.</p>
                    </CardContent>
                </Card>

                 <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Collected Commissions</CardTitle>
                        <CardDescription>Your total earnings from redemptions.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-4xl font-bold">₹{pharmacyData.balance.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto self-center">
                                    <History className="mr-2"/> View History
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Commission History</DialogTitle>
                                    <DialogDescription>A record of your collected commissions from patient redemptions.</DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[50vh] overflow-y-auto -mx-6 px-6">
                                    <ul className="space-y-4 py-4">
                                        {pharmacyData.transactions.length > 0 ? (
                                            pharmacyData.transactions.map((tx, index) => (
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

                 <Card className="shadow-sm md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Redeem Health Points</CardTitle>
                        <CardDescription>
                            Help patients pay using their Health Points cashback.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Label htmlFor="patientPhone">Patient Phone Number</Label>
                           <div className="flex gap-2">
                                <Input 
                                    id="patientPhone" 
                                    placeholder="Enter 10-digit number" 
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                />
                                <Button onClick={handleSearchPatient}>
                                    <Search className="mr-2"/> Search
                                </Button>
                           </div>
                        </div>

                        {patient && pharmacyDetails && (
                            <Card className="bg-slate-50 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <User className="text-primary"/>
                                        <p className="font-semibold">{patient.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">₹{patientTransactionHistory.balance.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground -mt-1">Available Balance</p>
                                    </div>
                                </div>
                                
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="p-0 h-auto text-sm mt-1">
                                            <History className="mr-2"/> View Patient History
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Transaction History for {patient.name}</DialogTitle>
                                            <DialogDescription>A record of Health Point earnings and redemptions.</DialogDescription>
                                        </DialogHeader>
                                        <div className="max-h-[50vh] overflow-y-auto -mx-6 px-6">
                                            <ul className="space-y-4 py-4">
                                                {patientTransactionHistory.transactions.map((tx, index) => (
                                                    <li key={index} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{tx.description}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{format(new Date(tx.date), 'PP, p')}</p>
                                                        </div>
                                                        <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                                            {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                
                                {!otpSent ? (
                                     <Button className="w-full mt-4" onClick={handleSendOtp}>Send OTP to Patient</Button>
                                ) : (
                                    <div className="mt-4 pt-4 border-t space-y-4">
                                        <Alert variant="default" className="bg-primary/10 border-primary/20">
                                            <BadgePercent className="h-4 w-4 text-primary" />
                                            <AlertTitle>Discount Applied</AlertTitle>
                                            <AlertDescription>
                                                This transaction will include your pharmacy's discount of <strong>{pharmacyDetails.discount}%</strong> on the redeemed amount.
                                            </AlertDescription>
                                        </Alert>

                                        <div>
                                            <Label htmlFor="redeemAmount">Amount to Redeem (₹)</Label>
                                            <Input id="redeemAmount" placeholder="e.g., 500" type="number" value={redeemAmount} onChange={(e) => setRedeemAmount(e.target.value)}/>
                                        </div>
                                         <div>
                                            <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                                            <Input id="otp" placeholder="Enter OTP from patient" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                        </div>
                                        <Button className="w-full" onClick={handleRedeem}>Confirm & Redeem</Button>
                                    </div>
                                )}
                            </Card>
                        )}

                    </CardContent>
                </Card>
                <div className="md:col-span-2 lg:col-span-3">
                    <Alert variant="outline" className="w-full">
                        <Banknote className="h-4 w-4" />
                        <AlertTitle>Payout Information</AlertTitle>
                        <AlertDescription>
                            For each redemption, the final amount (after your pharmacy's discount) is transferred to the admin. You will receive 95% of this amount in your bank account, with the admin retaining a 5% commission. You only need to collect cash from patients for amounts not covered by Health Points.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
