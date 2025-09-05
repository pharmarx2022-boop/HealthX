

'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Beaker, Search, User, History, BadgePercent, Banknote, Upload, Gift, Loader2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { initialLabs, mockPatientData, mockReports, type MockReport } from '@/lib/mock-data';
import { getTransactionHistory, recordTransaction, type Transaction } from '@/lib/transactions';
import { getCommissionWalletData, requestWithdrawal as requestCommissionWithdrawal, recordCommission, type CommissionTransaction } from '@/lib/commission-wallet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import dynamic from 'next/dynamic';
import { addNotification, sendRedemptionOtpNotification } from '@/lib/notifications';
import { checkPartnerMilestone } from '@/lib/referrals';
import Link from 'next/link';

const AnalyticsDashboard = dynamic(() => import('@/components/lab/analytics-dashboard').then(mod => mod.AnalyticsDashboard), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>,
});


const LABS_KEY = 'mockLabs';
const PATIENTS_KEY = 'mockPatientData';
const REPORTS_KEY = 'mockReports';

export default function LabDashboardPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<any | null>(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [uploadPatientSearch, setUploadPatientSearch] = useState('');
    const [patient, setPatient] = useState<any | null>(null);
    const [uploadPatient, setUploadPatient] = useState<any | null>(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [totalBill, setTotalBill] = useState('');
    const [patientTransactionHistory, setPatientTransactionHistory] = useState<{ balance: number; transactions: Transaction[] }>({ balance: 0, transactions: [] });
    const [commissionWallet, setCommissionWallet] = useState<{ balance: number; transactions: CommissionTransaction[] }>({ balance: 0, transactions: [] });
    const [labDetails, setLabDetails] = useState<any | null>(null);
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [reportName, setReportName] = useState('');
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);

                const storedLabs = sessionStorage.getItem(LABS_KEY);
                const allLabs = storedLabs ? JSON.parse(storedLabs) : initialLabs;
                const myDetails = allLabs.find((p: any) => p.id === u.id);
                setLabDetails(myDetails);
                setCommissionWallet(getCommissionWalletData(u.id));
            }
             if (!sessionStorage.getItem(REPORTS_KEY)) {
                sessionStorage.setItem(REPORTS_KEY, JSON.stringify(mockReports));
            }
            if (!sessionStorage.getItem(PATIENTS_KEY)) {
                sessionStorage.setItem(PATIENTS_KEY, JSON.stringify(mockPatientData));
            }
        }
    }, []);

    const handleSearchPatient = (searchTermValue: string, type: 'payment' | 'upload') => {
        const allPatients = JSON.parse(sessionStorage.getItem(PATIENTS_KEY) || '[]');
        const searchTerm = searchTermValue.toLowerCase();
        const foundPatient = allPatients.find((p: any) => p.phone === searchTerm || (p.email && p.email.toLowerCase() === searchTerm));

        if (foundPatient) {
            if (type === 'payment') {
                setPatient(foundPatient);
                setPatientTransactionHistory(getTransactionHistory(foundPatient.id));
                setOtpSent(false);
                setOtp('');
                setTotalBill('');
            } else {
                setUploadPatient(foundPatient);
                setReportFile(null);
                setReportName('');
            }
        } else {
            toast({
                title: "Patient Not Found",
                description: "No patient found with that phone number or email.",
                variant: "destructive"
            });
            if (type === 'payment') setPatient(null);
            if (type === 'upload') setUploadPatient(null);
        }
    };
    
    const handleSendOtp = () => {
        setOtpSent(true);
        sendRedemptionOtpNotification(patient.id, patient.name);
        toast({
            title: "OTP Sent as Notification",
            description: `An OTP has been sent to the patient's device ending in ${patient.phone.slice(-4)}. For demo, OTP is 123456.`
        });
    }

    const calculatedAmounts = useMemo(() => {
        const bill = parseFloat(totalBill);
        if (!bill || isNaN(bill) || !labDetails) {
            return { pointsToPay: 0, cashToPay: 0 };
        }
        const pointsToPay = bill * (labDetails.discount / 100);
        const cashToPay = bill - pointsToPay;
        return { pointsToPay, cashToPay };
    }, [totalBill, labDetails]);


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
        const commissionAmount = pointsToPay * 0.05; // Partner gets 5%

        if (pointsToPay > patientTransactionHistory.balance) {
            toast({
                title: "Insufficient Balance",
                description: `Patient needs INR ${pointsToPay.toFixed(2)} in Health Points but only has INR ${patientTransactionHistory.balance.toFixed(2)}.`,
                variant: "destructive"
            });
            return;
        }
        
        // Debit points from patient
        recordTransaction(patient.id, {
            type: 'debit',
            amount: pointsToPay,
            description: `Paid for bill at ${labDetails.name}`,
            date: new Date(),
            partnerType: 'lab',
            partnerId: labDetails.id,
            partnerName: labDetails.name,
            reviewed: false
        });
        addNotification(patient.id, {
            title: 'Payment Successful',
            message: `You redeemed INR ${pointsToPay.toFixed(2)} in Health Points at ${labDetails.name}.`,
            icon: 'wallet',
            href: '/patient/my-health'
        });
        
        // Credit commission to lab
        recordCommission(user.id, {
            type: 'credit',
            amount: commissionAmount,
            description: `Commission from ${patient.name}'s bill`,
            date: new Date(),
            status: 'success'
        });
        
        // Check for referral milestone
        checkPartnerMilestone(user.id, 'lab');

        toast({
            title: "Payment Successful!",
            description: `INR ${pointsToPay.toFixed(2)} collected in Health Points. Please collect INR ${calculatedAmounts.cashToPay.toFixed(2)} in cash.`,
            duration: 6000
        });

        // Refresh data
        setPatient(null);
        setPatientSearch('');
        setCommissionWallet(getCommissionWalletData(user.id));
        setOtpSent(false);
        setOtp('');
        setTotalBill('');
    };

    const handleUploadReport = () => {
        if (!reportFile || !reportName) {
            toast({
                title: "Upload Failed",
                description: "Please select a file and enter a report name.",
                variant: "destructive"
            });
            return;
        }
        
        const allReports = JSON.parse(sessionStorage.getItem(REPORTS_KEY) || '[]');
        const newReport: MockReport = {
            id: `rep${Date.now()}`,
            patientId: uploadPatient.id,
            name: reportName,
            lab: labDetails.name,
            date: new Date().toISOString(),
            file: 'mock.pdf' // In a real app, this would be a URL to the uploaded file
        };
        
        const updatedReports = [...allReports, newReport];
        sessionStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));

        addNotification(uploadPatient.id, {
            title: 'New Report Available',
            message: `Your report "${reportName}" from ${labDetails.name} is now available to view.`,
            icon: 'file-text',
            href: '/patient/my-health'
        });
        toast({
            title: "Report Uploaded!",
            description: `"${reportName}" has been uploaded for ${uploadPatient.name}.`
        });

        setUploadPatient(null);
        setUploadPatientSearch('');
        setReportFile(null);
        setReportName('');
    }

    const handleCommissionWithdrawal = () => {
        const withdrawalAmount = commissionWallet.balance;
         if (withdrawalAmount <= 0) {
            toast({
                title: "No Commission to Withdraw",
                description: "You have no commission balance to withdraw.",
                variant: "destructive"
            });
            return;
        }
        requestCommissionWithdrawal(user.id, labDetails.name, withdrawalAmount);
        setCommissionWallet(getCommissionWalletData(user.id));
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Lab Dashboard</h1>
                <p className="text-muted-foreground">Manage lab tests and process patient payments.</p>
            </div>

            <AnalyticsDashboard />
            
            <div className="grid lg:grid-cols-3 gap-8 items-start mt-8">
                <div className="lg:col-span-2 grid gap-8">
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Process Patient Bill</CardTitle>
                            <CardDescription>
                                Help patients pay using their Health Points.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 max-w-sm">
                            <Label htmlFor="patientSearch">Patient Phone or Email</Label>
                            <div className="flex gap-2">
                                    <Input 
                                        id="patientSearch" 
                                        placeholder="Enter phone or email..." 
                                        value={patientSearch}
                                        onChange={(e) => setPatientSearch(e.target.value)}
                                        disabled={!!patient}
                                    />
                                    <Button onClick={() => handleSearchPatient(patientSearch, 'payment')} disabled={!!patient}>
                                        <Search className="mr-2"/> Search
                                    </Button>
                            </div>
                            </div>

                            {patient && labDetails && (
                                <Card className="bg-slate-50 p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <User className="text-primary"/>
                                            <div>
                                                <p className="font-semibold text-lg">{patient.name}</p>
                                                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setPatient(null); setPatientSearch(''); }}>
                                                    Search for another patient
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right mt-4 md:mt-0">
                                            <p className="text-xl font-bold">INR {patientTransactionHistory.balance.toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground -mt-1">Available Balance</p>
                                        </div>
                                    </div>
                                
                                    {!otpSent ? (
                                        <Button className="w-full mt-4" onClick={handleSendOtp}>Send OTP to Patient</Button>
                                    ) : (
                                        <div className="mt-4 pt-4 border-t space-y-4">
                                            <Alert variant="default" className="bg-primary/10 border-primary/20">
                                                <BadgePercent className="h-4 w-4 text-primary" />
                                                <AlertTitle>Your Redemption Offer: {labDetails.discount}%</AlertTitle>
                                                <AlertDescription>
                                                    The patient can pay {labDetails.discount}% of their bill using Health Points.
                                                </AlertDescription>
                                            </Alert>

                                            <div>
                                                <Label htmlFor="totalBill">Total Bill Amount (INR)</Label>
                                                <Input id="totalBill" placeholder="e.g., 1000" type="number" value={totalBill} onChange={(e) => setTotalBill(e.target.value)}/>
                                            </div>

                                            {calculatedAmounts.pointsToPay > 0 && (
                                                <div className="space-y-2 text-sm p-3 bg-white rounded-md border">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Pay with Health Points:</span>
                                                        <span className="font-medium">INR {calculatedAmounts.pointsToPay.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-semibold">
                                                        <span className="text-muted-foreground">Pay with Cash:</span>
                                                        <span className="font-medium">INR {calculatedAmounts.cashToPay.toFixed(2)}</span>
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
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Briefcase className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Book a Doctor Appointment</CardTitle>
                                <CardDescription>
                                   Find and book a doctor for a patient.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Button asChild className="w-full">
                                <Link href="/book-doctor-appointment">
                                    Book Appointment
                                </Link>
                             </Button>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Upload Patient Report</CardTitle>
                            <CardDescription>Find a patient to upload their lab report.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 max-w-sm">
                                <Label htmlFor="uploadPatientSearch">Patient Phone or Email</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="uploadPatientSearch" 
                                        placeholder="Enter phone or email..." 
                                        value={uploadPatientSearch}
                                        onChange={(e) => setUploadPatientSearch(e.target.value)}
                                        disabled={!!uploadPatient}
                                    />
                                    <Button onClick={() => handleSearchPatient(uploadPatientSearch, 'upload')} disabled={!!uploadPatient}>
                                        <Search className="mr-2"/> Search
                                    </Button>
                                </div>
                            </div>
                             {uploadPatient && (
                                <Card className="bg-slate-50 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <User className="text-primary"/>
                                        <div>
                                            <p className="font-semibold text-lg">{uploadPatient.name}</p>
                                            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setUploadPatient(null); setUploadPatientSearch(''); }}>
                                                Search for another patient
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="reportName">Report Name</Label>
                                            <Input id="reportName" placeholder="e.g., Blood Test Report" value={reportName} onChange={(e) => setReportName(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="reportFile">Report File</Label>
                                            <Input id="reportFile" type="file" onChange={(e) => setReportFile(e.target.files?.[0] || null)} />
                                        </div>
                                        <Button className="w-full" onClick={handleUploadReport}>
                                            <Upload className="mr-2"/> Upload Report for {uploadPatient.name}
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Gift/> Total Earnings</CardTitle>
                            <CardDescription>Your earnings from referrals and patient transactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">INR {isClient ? commissionWallet.balance.toFixed(2) : '0.00'}</p>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                            <Button className="w-full" onClick={handleCommissionWithdrawal} disabled={!isClient || commissionWallet.balance <= 0}>
                                <Banknote className="mr-2"/> Request Withdrawal
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
                                        <DialogDescription>A record of your referral bonuses, patient transaction commissions, and withdrawals.</DialogDescription>
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
                                                <p className="text-center text-muted-foreground py-4">No transactions yet.</p>
                                            )}
                                        </ul>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                     <Alert variant="outline" className="w-full">
                        <Banknote className="h-4 w-4" />
                        <AlertTitle>How Payments Work</AlertTitle>
                        <AlertDescription>
                          Enter the patient's total bill amount. The system calculates how much they can pay with Health Points based on your discount. You earn a 5% commission on the value of redeemed points. All earnings can be withdrawn from your Total Earnings wallet.
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
