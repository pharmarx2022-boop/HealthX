
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, IndianRupee, Bell, Search, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Mock patient data for demonstration
const mockPatients = [
    { id: 'rohan_sharma', name: 'Rohan Sharma', phone: '9876543210', healthPoints: 2200 },
    { id: 'user_def456', name: 'Priya Mehta', phone: '9876543211', healthPoints: 1000 },
];


export default function PharmacyDashboardPage() {
    const { toast } = useToast();
    const [patientPhone, setPatientPhone] = useState('');
    const [patient, setPatient] = useState<any | null>(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState('');

    const handleSearchPatient = () => {
        const foundPatient = mockPatients.find(p => p.phone === patientPhone);
        if (foundPatient) {
            setPatient(foundPatient);
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

        if (amount > patient.healthPoints) {
            toast({
                title: "Insufficient Balance",
                description: `Patient only has ₹${patient.healthPoints.toFixed(2)} available.`,
                variant: "destructive"
            });
            return;
        }
        
        // In a real app, update the backend here.
        const updatedPatient = { ...patient, healthPoints: patient.healthPoints - amount };
        setPatient(updatedPatient);

        toast({
            title: "Redemption Successful!",
            description: `₹${amount.toFixed(2)} has been successfully redeemed.`
        });

        // Reset state after successful redemption
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
            
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Pill className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Welcome, City Pharmacy!</CardTitle>
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
                        <CardTitle>Redeem Health Points</CardTitle>
                        <CardDescription>
                            Help patients pay for their medicines using their Health Points cashback.
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

                        {patient && (
                            <Card className="bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <User className="text-primary"/>
                                        <p className="font-semibold">{patient.name}</p>
                                    </div>
                                    <p className="text-lg font-bold">₹{patient.healthPoints.toFixed(2)}</p>
                                </div>
                                <CardDescription className="pl-8 -mt-1">Available Health Points</CardDescription>
                                
                                {!otpSent ? (
                                     <Button className="w-full mt-4" onClick={handleSendOtp}>Send OTP to Patient</Button>
                                ) : (
                                    <div className="mt-4 pt-4 border-t space-y-4">
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
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
