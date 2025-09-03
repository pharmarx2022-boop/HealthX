
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Search, User, Wallet, History, BadgePercent, Banknote, IndianRupee } from 'lucide-react';
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
    const [totalBill, setTotalBill] = useState('');
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
            setTotalBill('');
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

    const calculatedAmounts = useMemo(() => {
        const bill = parseFloat(totalBill);
        if (!bill || isNaN(bill) || !pharmacyDetails) {
            return { pointsToPay: 0, cashToPay: 0 };
        }
        const pointsToPay = bill * (pharmacyDetails.discount / 100);
        const cashToPay = bill - pointsToPay;
        return { pointsToPay, cashToPay };
    }, [totalBill, pharmacyDetails]);


    const handleRedeem = () => {
        if (otp !== '123456') {
            toast({
                title: "Invalid OTP",
                description: "The OTP you entered is incorrect.",
                variant: "destructive"
            });
            return;
        }

        const bill = parseFloat(totalBill);
        if (isNaN(bill) || bill <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid total bill amount.",
                variant: "destructive"
            });
            return;
        }

        const { pointsToPay } = calculatedAmounts;

        if (pointsToPay > patientTransactionHistory.balance) {
            toast({
                title: "Insufficient Balance",
                description: `Patient needs ₹${pointsToPay.toFixed(2)} in Health Points but only has ₹${patientTransactionHistory.balance.toFixed(2)}.`,
                variant: "destructive"
            });
            return;
        }
        
        // Debit points from patient
        recordTransaction(patient.id, {
            type: 'debit',
            amount: pointsToPay,
            description: `Paid for bill at ${pharmacyDetails.name}`,
            date: new Date(),
        });
        
        // Credit points to pharmacy
        recordCommission(user.id, {
            type: 'credit',
            amount: pointsToPay,
            description: `Health Points collected from ${patient.name}`,
            date: new Date(),
        });

        toast({
            title: "Payment Successful!",
            description: `₹${pointsToPay.toFixed(2)} collected in Health Points. Please collect ₹${calculatedAmounts.cashToPay.toFixed(2)} in cash.`,
            duration: 6000
        });

        // Refresh data
        handleSearchPatient();
        setPharmacyData(getPharmacyData(user.id));
        setOtpSent(false);
        setOtp('');
        setTotalBill('');
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Manage inventory and process patient payments.</p>
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
                        <CardTitle>Collected Health Points</CardTitle>
                        <CardDescription>Points collected from patient bills.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-4xl font-bold">₹{pharmacyData.balance.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto self-center">
                                    <History className="mr-2"/> View Collection History
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Collection History</DialogTitle>
                                    <DialogDescription>A record of Health Points collected from patient bills.</DialogDescription>
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
                        <CardTitle>Process Patient Bill</CardTitle>
                        <CardDescription>
                            Help patients pay using their Health Points.
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
                                    disabled={!!patient}
                                />
                                <Button onClick={handleSearchPatient} disabled={!!patient}>
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
                                <Button variant="link" className="p-0 h-auto text-sm mt-1" onClick={() => setPatient(null)}>
                                   Search for another patient
                                </Button>
                                
                                {!otpSent ? (
                                     <Button className="w-full mt-4" onClick={handleSendOtp}>Send OTP to Patient</Button>
                                ) : (
                                    <div className="mt-4 pt-4 border-t space-y-4">
                                        <Alert variant="default" className="bg-primary/10 border-primary/20">
                                            <BadgePercent className="h-4 w-4 text-primary" />
                                            <AlertTitle>Your Redemption Offer: {pharmacyDetails.discount}%</AlertTitle>
                                            <AlertDescription>
                                                The patient can pay {pharmacyDetails.discount}% of their bill using Health Points.
                                            </AlertDescription>
                                        </Alert>

                                        <div>
                                            <Label htmlFor="totalBill">Total Bill Amount (₹)</Label>
                                            <Input id="totalBill" placeholder="e.g., 1000" type="number" value={totalBill} onChange={(e) => setTotalBill(e.target.value)}/>
                                        </div>

                                        {calculatedAmounts.pointsToPay > 0 && (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Pay with Health Points:</span>
                                                    <span className="font-medium">₹{calculatedAmounts.pointsToPay.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-muted-foreground">Pay with Cash:</span>
                                                    <span className="font-medium">₹{calculatedAmounts.cashToPay.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                         <div>
                                            <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                                            <Input id="otp" placeholder="Enter OTP from patient" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                        </div>
                                        <Button className="w-full" onClick={handleRedeem}>Confirm Payment</Button>
                                    </div>
                                )}
                            </Card>
                        )}

                    </CardContent>
                </Card>
                <div className="md:col-span-2 lg:col-span-3">
                    <Alert variant="outline" className="w-full">
                        <Banknote className="h-4 w-4" />
                        <AlertTitle>How Payments Work</AlertTitle>
                        <AlertDescription>
                          Enter the patient's total bill amount. The system calculates how much they can pay with Health Points based on your discount. The patient pays the rest in cash. The Health Points you collect are added to your balance, which you can request as a cash payout from the admin (minus a 5% admin fee).
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
