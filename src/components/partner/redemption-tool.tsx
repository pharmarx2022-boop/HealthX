
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockPharmacies, mockLabs } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';

const redemptionSchema = z.object({
  phone: z.string().min(10, 'A valid 10-digit phone number is required.').max(10, 'A valid 10-digit phone number is required.'),
  totalBill: z.coerce.number().positive('Total bill must be a positive number.'),
  otp: z.string().optional(),
});

interface RedemptionToolProps {
    partnerType: 'pharmacy' | 'lab';
}

// Mock patient data for demonstration
const mockPatientWallets: Record<string, { name: string, healthPoints: number }> = {
    '9876543210': { name: 'Rohan Sharma', healthPoints: 7450 - 150 - 450 }, // Using the calculated balance from patient dashboard
    '9999999999': { name: 'Jane Doe', healthPoints: 1200 },
};

// Mock partner data - in a real app this would be fetched for the logged in partner
const MOCK_PARTNER_DATA = {
    pharmacy: mockPharmacies[1], // Apollo Pharmacy (20% offer)
    lab: mockLabs[1], // Dr. Lal PathLabs (35% offer)
}


export function RedemptionTool({ partnerType }: RedemptionToolProps) {
  const [step, setStep] = useState<'initial' | 'confirm'>('initial');
  const [redemptionDetails, setRedemptionDetails] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const partnerData = MOCK_PARTNER_DATA[partnerType];
  const redemptionLimit = (partnerData.redemptionOffer || 0) / 100;
  const partnerName = partnerType.charAt(0).toUpperCase() + partnerType.slice(1);

  const form = useForm<z.infer<typeof redemptionSchema>>({
    resolver: zodResolver(redemptionSchema),
    defaultValues: {
      phone: '',
      totalBill: 0,
      otp: '',
    },
  });

  const handleInitiateRedemption = (values: z.infer<typeof redemptionSchema>) => {
    const patientData = mockPatientWallets[values.phone];

    if (!patientData) {
        toast({
            title: 'Patient Not Found',
            description: 'The entered mobile number does not exist. Try "9876543210".',
            variant: 'destructive',
        });
        return;
    }

    const maxRedeemable = values.totalBill * redemptionLimit;
    const redeemAmount = Math.min(patientData.healthPoints, maxRedeemable);
    const finalAmount = values.totalBill - redeemAmount;

    setRedemptionDetails({
        ...values,
        patientName: patientData.name,
        healthPoints: patientData.healthPoints,
        redeemAmount,
        finalAmount,
    });
    setStep('confirm');

     toast({
        title: "OTP Sent to Patient",
        description: `An OTP has been sent to ${patientData.name}. For testing, the OTP is 123456.`,
    });
  };

  const handleConfirmPayment = () => {
    const otp = form.getValues('otp');
    if (otp === '123456') { 
        toast({
            title: "Payment Successful!",
            description: `₹${redemptionDetails.redeemAmount.toFixed(2)} redeemed. Final amount of ₹${redemptionDetails.finalAmount.toFixed(2)} collected.`,
        });
        form.reset();
        setStep('initial');
        setRedemptionDetails(null);
        setIsDialogOpen(false);
    } else {
        toast({
            title: "Invalid OTP",
            description: 'The entered OTP is incorrect. Please try again.',
            variant: 'destructive',
        })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        if(!isOpen) {
            setStep('initial');
            form.reset();
        }
    }}>
        <DialogTrigger asChild>
             <Button className="w-full">
                <KeyRound className="mr-2"/>
                Redeem via OTP
            </Button>
        </DialogTrigger>
        <DialogContent>
             {step === 'initial' && (
                <>
                    <DialogHeader>
                        <DialogTitle>Redeem via OTP</DialogTitle>
                        <DialogDescription>
                            Enter patient's mobile and bill amount to send an OTP.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleInitiateRedemption)} className="space-y-4 pt-4">
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Patient's Mobile Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="e.g., 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="totalBill"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Total Bill Amount (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 1000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">Initiate Redemption</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </>
             )}
             {step === 'confirm' && redemptionDetails && (
                <>
                    <DialogHeader>
                        <DialogTitle>Confirm Payment</DialogTitle>
                        <DialogDescription>Verify details and enter OTP from patient.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Patient:</span>
                            <span className="font-medium">{redemptionDetails.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Bill:</span>
                            <span className="font-medium">₹{redemptionDetails.totalBill.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-destructive">
                            <span className="text-destructive/80">Points Redeemed:</span>
                            <span className="font-medium">- ₹{redemptionDetails.redeemAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-primary font-bold text-lg border-t pt-4">
                            <span>Final Amount to Pay:</span>
                            <span>₹{redemptionDetails.finalAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground pt-2">
                            Patient can redeem up to {redemptionLimit * 100}% of the bill at this {partnerName}.
                        </p>
                        <Form {...form}>
                             <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Enter 6-Digit OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </Form>
                    </div>
                     <DialogFooter>
                        <Button variant="outline" onClick={() => setStep('initial')}>Back</Button>
                        <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
                    </DialogFooter>
                </>
             )}
        </DialogContent>
    </Dialog>
  );
}
