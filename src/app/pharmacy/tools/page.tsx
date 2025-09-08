
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Search, User, BellPlus, Trash2, BadgePercent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { initialPharmacies, mockPatientData } from '@/lib/mock-data';
import { getTransactionHistory, recordTransaction, type Transaction } from '@/lib/transactions';
import { recordCommission } from '@/lib/commission-wallet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { addNotification, sendRedemptionOtpNotification } from '@/lib/notifications';
import { checkPartnerMilestone } from '@/lib/referrals';
import { AnalyticsDashboard } from '@/components/pharmacy/analytics-dashboard';
import { Textarea } from '@/components/ui/textarea';
import { getRemindersForPartner, addReminder, deleteReminder, type HealthReminder } from '@/lib/reminders';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';


const PHARMACIES_KEY = 'mockPharmacies';
const PATIENTS_KEY = 'mockPatientData';

export default function PharmacyToolsPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<any | null>(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [patient, setPatient] = useState<any | null>(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [totalBill, setTotalBill] = useState('');
    const [patientTransactionHistory, setPatientTransactionHistory] = useState<{ balance: number; transactions: Transaction[] }>({ balance: 0, transactions: [] });
    const [pharmacyDetails, setPharmacyDetails] = useState<any>(null);

    // Reminder state
    const [reminderPatientSearch, setReminderPatientSearch] = useState('');
    const [reminderPatient, setReminderPatient] = useState<any | null>(null);
    const [medicineDetails, setMedicineDetails] = useState('');
    const [activeReminders, setActiveReminders] = useState<HealthReminder[]>([]);


    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);

                const storedPharmacies = localStorage.getItem(PHARMACIES_KEY);
                const allPharmacies = storedPharmacies ? JSON.parse(storedPharmacies) : initialPharmacies;
                const myDetails = allPharmacies.find((p: any) => p.id === u.id);
                setPharmacyDetails(myDetails);
                setActiveReminders(getRemindersForPartner(u.id));
            }
             if (!localStorage.getItem(PATIENTS_KEY)) {
                localStorage.setItem(PATIENTS_KEY, JSON.stringify(mockPatientData));
            }
        }
    }, []);

    const handleSearchPatient = (searchTermValue: string, type: 'payment' | 'reminder') => {
        const allPatients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
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
                setReminderPatient(foundPatient);
                setMedicineDetails('');
            }
        } else {
            toast({
                title: "Patient Not Found",
                description: "No patient found with that phone number or email.",
                variant: "destructive"
            });
            if (type === 'payment') setPatient(null);
            if (type === 'reminder') setReminderPatient(null);
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
        const commissionAmount = pointsToPay * 0.05; // Pharmacy gets 5%

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
            description: `Paid for bill at ${pharmacyDetails.name}`,
            date: new Date(),
            partnerType: 'pharmacy',
            partnerId: pharmacyDetails.id,
            partnerName: pharmacyDetails.name,
            reviewed: false
        });
        addNotification(patient.id, {
            title: 'Payment Successful',
            message: `You redeemed INR ${pointsToPay.toFixed(2)} in Health Points at ${pharmacyDetails.name}.`,
            icon: 'wallet',
            href: '/patient/my-health'
        });
        
        // Credit commission to pharmacy
        recordCommission(user.id, {
            type: 'credit',
            amount: commissionAmount,
            description: `Commission from ${patient.name}'s bill`,
            date: new Date(),
            status: 'success'
        });
        
        // Check for referral milestone
        checkPartnerMilestone(user.id, 'pharmacy');


        toast({
            title: "Payment Successful!",
            description: `INR ${pointsToPay.toFixed(2)} collected in Health Points. Please collect INR ${calculatedAmounts.cashToPay.toFixed(2)} in cash.`,
            duration: 6000
        });

        // Refresh data
        setPatient(null);
        setPatientSearch('');
        setOtpSent(false);
        setOtp('');
        setTotalBill('');
    }

    const handleSetReminder = () => {
        if (!medicineDetails) {
            toast({
                title: "Missing Details",
                description: "Please enter the medicine details for the reminder.",
                variant: "destructive",
            });
            return;
        }

        addReminder({
            partnerId: user.id,
            partnerName: pharmacyDetails.name,
            partnerType: 'pharmacy',
            patientId: reminderPatient.id,
            patientName: reminderPatient.name,
            details: medicineDetails,
        });

        addNotification(reminderPatient.id, {
            title: 'Monthly Reminder Set',
            message: `${pharmacyDetails.name} has set a monthly reminder for your medicines.`,
            icon: 'bell',
            href: '/patient/my-health'
        });

        toast({
            title: "Reminder Set!",
            description: `A monthly medicine reminder has been set for ${reminderPatient.name}.`,
        });

        setActiveReminders(getRemindersForPartner(user.id));
        setReminderPatient(null);
        setReminderPatientSearch('');
        setMedicineDetails('');
    };
    
    const handleDeleteReminder = (reminderId: string) => {
        deleteReminder(reminderId);
        setActiveReminders(getRemindersForPartner(user.id));
        toast({
            title: "Reminder Removed",
            variant: "destructive",
        })
    };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
        <div className="container mx-auto py-12 space-y-8">
             <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Patient Tools</h1>
                <p className="text-muted-foreground">Manage payments and reminders for patients.</p>
            </div>
             <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Process Patient Bill</CardTitle>
                    <CardDescription>
                        Help patients pay for their medicines using their Health Points.
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

                    {patient && pharmacyDetails && (
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
                                        <AlertTitle>Your Redemption Offer: {pharmacyDetails.discount}%</AlertTitle>
                                        <AlertDescription>
                                            The patient can pay {pharmacyDetails.discount}% of their bill using Health Points.
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
                <CardHeader>
                    <CardTitle>Set Health Reminders</CardTitle>
                    <CardDescription>Set monthly reminders for patients who need regular refills.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2 max-w-sm">
                        <Label htmlFor="reminderPatientSearch">Patient Phone or Email</Label>
                        <div className="flex gap-2">
                            <Input 
                                id="reminderPatientSearch" 
                                placeholder="Enter phone or email..." 
                                value={reminderPatientSearch}
                                onChange={(e) => setReminderPatientSearch(e.target.value)}
                                disabled={!!reminderPatient}
                            />
                            <Button onClick={() => handleSearchPatient(reminderPatientSearch, 'reminder')} disabled={!!reminderPatient}>
                                <Search className="mr-2"/> Search
                            </Button>
                        </div>
                    </div>
                    {reminderPatient && (
                        <Card className="bg-slate-50 p-6">
                             <div className="flex items-center gap-3 mb-4">
                                <User className="text-primary"/>
                                <div>
                                    <p className="font-semibold text-lg">{reminderPatient.name}</p>
                                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setReminderPatient(null); setReminderPatientSearch(''); }}>
                                        Search for another patient
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="medicineDetails">Medicine & Refill Details</Label>
                                    <Textarea id="medicineDetails" placeholder="e.g., Thyronorm 50mg, 1 month supply" value={medicineDetails} onChange={(e) => setMedicineDetails(e.target.value)} />
                                </div>
                                <Button className="w-full" onClick={handleSetReminder}>
                                    <BellPlus className="mr-2"/> Set Monthly Reminder
                                </Button>
                            </div>
                        </Card>
                    )}
                    {activeReminders.length > 0 && (
                        <div className="space-y-2 pt-4">
                            <h4 className="font-medium">Active Reminders</h4>
                            {activeReminders.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-2 border rounded-md">
                                    <div>
                                        <p className="font-semibold">{r.patientName}</p>
                                        <p className="text-sm text-muted-foreground">{r.details}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(r.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
