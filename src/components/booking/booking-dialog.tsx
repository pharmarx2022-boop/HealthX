

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon, User, Search, Loader2, CreditCard, Users, Info, Sparkles } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '../ui/input';
import { mockPatientData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { MOCK_OTP } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardFooter, CardContent } from '../ui/card';
import { addNotification, sendBookingOtpNotification } from '@/lib/notifications';
import { mockFamilyMembers } from '@/lib/family-members';
import { processPayment } from '@/lib/payment';
import { recordCommission } from '@/lib/commission-wallet';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

type Doctor = {
    id: string;
    name: string;
    specialty: string;
    image: string;
    dataAiHint?: string;
};

type Clinic = {
    id: string;
    name: string;
    availabilityType: 'days' | 'dates';
    days?: string[];
    specificDates?: string[];
    slots: string;
    consultationFee: number;
    patientLimit?: number;
};

type FamilyMember = {
    id: string;
    name: string;
    relationship: string;
    dob: string;
};

interface BookingDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    doctor: Doctor;
    clinics: Clinic[];
    familyMembers: FamilyMember[];
    onConfirm: (patientId: string, clinicId: string, date: Date, time: string, transactionId: string) => void;
}

const calculateAge = (dob: string | Date) => {
    const dobDate = typeof dob === 'string' ? new Date(dob) : dob;
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }
    return age;
};

export function BookingDialog({ isOpen, onOpenChange, doctor, clinics, familyMembers, onConfirm }: BookingDialogProps) {
    const { toast } = useToast();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Form state
    const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');
    
    // Patient flow state
    const [selectedPatientId, setSelectedPatientId] = useState('self');
    const [patientOptsOut, setPatientOptsOut] = useState(false);
    
    // Health Coordinator / Partner flow state
    const [patientSearch, setPatientSearch] = useState('');
    const [foundPatient, setFoundPatient] = useState<any | null>(null);
    const [foundPatientFamily, setFoundPatientFamily] = useState<FamilyMember[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                setUserRole(u.role);
                if (u.role === 'patient') {
                    setSelectedPatientId(u.id);
                }
            } else {
                 setUserRole('patient'); // Default to patient flow if not logged in
            }
        }
        
        if (isOpen) {
            // Reset all state when dialog opens
            setSelectedClinicId(clinics.length === 1 ? clinics[0].id : undefined);
            setSelectedDate(undefined);
            setSelectedTime('');
            setSelectedPatientId(user?.role === 'patient' ? user.id : 'self');
            setPatientSearch('');
            setFoundPatient(null);
            setFoundPatientFamily([]);
            setIsSearching(false);
            setOtpSent(false);
            setOtp('');
            setIsProcessingPayment(false);
            setPatientOptsOut(false);
        }
    }, [isOpen, user?.id, user?.role, clinics]);

    const selectedClinic = useMemo(() => {
        return clinics.find(c => c.id === selectedClinicId);
    }, [selectedClinicId, clinics]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedClinic) return [];
        return selectedClinic.slots.split(',').map(s => s.trim());
    }, [selectedClinic]);

    const isDateFull = useMemo(() => {
        if (!selectedDate || !selectedClinic || !selectedClinic.patientLimit) {
            return false;
        }
        const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
        const appointmentsOnDate = allAppointments.filter((appt: any) => 
            appt.clinicId === selectedClinic.id && 
            format(new Date(appt.appointmentDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );
        return appointmentsOnDate.length >= selectedClinic.patientLimit;
    }, [selectedDate, selectedClinic]);
    
    const isPartnerBooking = userRole === 'health-coordinator' || userRole === 'lab' || userRole === 'pharmacy';

    const getFeeDetails = () => {
        if (!selectedClinic) return null;
        
        const fee = selectedClinic.consultationFee;
        let platformFeeRate = 0;

        if (isPartnerBooking) {
            platformFeeRate = patientOptsOut ? 0.10 : 0.05; // 10% if partner opts out for patient, 5% otherwise
        } else {
            platformFeeRate = patientOptsOut ? 0.05 : 0; // 5% if patient opts out, 0% otherwise
        }
        
        const platformFee = fee * platformFeeRate;
        const totalOnlinePayment = fee + platformFee;

        let infoText = `A non-refundable platform fee of ₹${platformFee.toFixed(2)} is applied.`;
        let rewardText = `Pay ₹${fee.toFixed(2)} in cash at the clinic.`;

        if (!patientOptsOut) {
            rewardText += ` After your visit, your ₹${fee.toFixed(2)} deposit will be refunded AND you'll earn ₹${fee.toFixed(2)} in Health Points!`;
        }

        if (platformFee === 0) {
            infoText = `You've opted to earn Health Points! No platform fee will be charged.`;
        }


        return { fee, platformFee, totalOnlinePayment, infoText, rewardText };
    }

    const feeDetails = getFeeDetails();


    const handleConfirmBooking = async () => {
        const patientId = isPartnerBooking && foundPatient ? foundPatient.id : user.id;
        if (!patientId || !selectedClinicId || !selectedClinic || !selectedDate || !selectedTime || !feeDetails) {
             toast({ title: "Incomplete Details", description: "Please fill all the booking details before proceeding.", variant: "destructive" });
             return;
        }
         if (isDateFull) {
            toast({ title: "Booking Limit Reached", description: "This day is fully booked. Please select another date.", variant: "destructive" });
            return;
        }

        if (isPartnerBooking && otp !== MOCK_OTP) {
            toast({ title: "Invalid OTP", description: "The OTP entered is incorrect.", variant: "destructive" });
            return;
        }

        setIsProcessingPayment(true);
        try {
            const paymentResult = await processPayment({
                amount: feeDetails.totalOnlinePayment,
                currency: 'INR',
                description: `Booking for ${doctor.name}`,
                patientId: patientId,
            });

            if (paymentResult.success) {
                addNotification(patientId, {
                    title: 'Appointment Confirmed!',
                    message: `Your booking with ${doctor.name} at ${selectedClinic?.name} for ${format(selectedDate, 'PPP')} is confirmed.`,
                    icon: 'calendar',
                    href: '/patient/my-health'
                });
                onConfirm(patientId, selectedClinicId, selectedDate, selectedTime, paymentResult.transactionId);
            } else {
                 toast({ title: "Payment Failed", description: paymentResult.error || "Could not process payment.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "An Error Occurred", description: "Something went wrong during payment.", variant: "destructive" });
        } finally {
            setIsProcessingPayment(false);
        }
    }
    
    const isDateDisabled = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
            return true;
        }
        if (!selectedClinic) {
            return true;
        }

        if (selectedClinic.availabilityType === 'dates' && selectedClinic.specificDates) {
            return !selectedClinic.specificDates.some(d => format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        }

        if (selectedClinic.availabilityType === 'days' && selectedClinic.days) {
            const dayOfWeek = format(date, 'EEEE');
            return !selectedClinic.days.includes(dayOfWeek);
        }

        return true; // Disable if no availability is set
    };

    const handleSearchPatient = () => {
        setIsSearching(true);
        setTimeout(() => { // Simulate API call
            const allPatients = JSON.parse(sessionStorage.getItem('mockPatientData') || '[]');
            const searchTerm = patientSearch.toLowerCase();
            const patient = allPatients.find((p: any) => p.phone === searchTerm || p.email.toLowerCase() === searchTerm);
            if (patient) {
                setFoundPatient(patient);
                setSelectedPatientId(patient.id); // Default selection to the patient
                // For demo purposes, we'll assign the standard mock family to the found user
                const storedFamily = sessionStorage.getItem('familyMembers')
                setFoundPatientFamily(storedFamily ? JSON.parse(storedFamily) : mockFamilyMembers);
            } else {
                toast({ title: "Patient Not Found", description: "No patient exists with this mobile number or email.", variant: "destructive" });
            }
            setIsSearching(false);
        }, 500);
    }
    
    const handleSendOtp = () => {
        setOtpSent(true);
        sendBookingOtpNotification(foundPatient.id, foundPatient.name);
        toast({
            title: "OTP Sent to Patient",
            description: `An OTP has been sent as a notification to ${foundPatient.name}. The mock OTP is ${MOCK_OTP}.`
        })
    }

    const renderPatientSelector = () => (
        <div>
            <Label className="font-semibold">Who is this appointment for?</Label>
            <RadioGroup 
                value={selectedPatientId} 
                onValueChange={setSelectedPatientId}
                className="mt-2 space-y-2"
            >
                {user && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={user.id} id={user.id} />
                        <Label htmlFor={user.id} className="flex items-center gap-2 font-normal">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.fullName} />
                                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.fullName} (Myself)</span>
                        </Label>
                    </div>
                )}
                {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={member.id} id={member.id} />
                        <Label htmlFor={member.id} className="flex items-center gap-2 font-normal">
                                <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name} ({member.relationship}, {calculateAge(member.dob)} yrs)</span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            
            <div className="flex items-center space-x-2 mt-4 p-3 bg-slate-50 border rounded-md">
                <Checkbox id="opt-out" checked={patientOptsOut} onCheckedChange={(checked) => setPatientOptsOut(Boolean(checked))} />
                <Label htmlFor="opt-out" className="text-sm font-normal">
                    I don't want to receive Health Points bonus for this appointment.
                </Label>
            </div>
            
        </div>
    );

    const renderPartnerPatientFinder = () => (
        <div>
            <Label className="font-semibold">Find Patient</Label>
            {!foundPatient ? (
                 <div className="flex gap-2 mt-2">
                    <Input 
                        placeholder="Patient's Phone or Email" 
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        disabled={isSearching}
                    />
                    <Button onClick={handleSearchPatient} disabled={isSearching || patientSearch.length < 3}>
                        {isSearching ? <Loader2 className="animate-spin"/> : <Search/>}
                    </Button>
                </div>
            ) : (
                <div className="mt-2 p-3 bg-slate-50 border rounded-md">
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <User className="text-primary"/>
                            <p className="font-medium">{foundPatient.name} ({foundPatient.phone})</p>
                        </div>
                        <Button variant="link" size="sm" onClick={() => { setFoundPatient(null); setPatientSearch(''); setFoundPatientFamily([]); }}>Change</Button>
                    </div>

                    <Label className="font-semibold flex items-center gap-2 mb-2"><Users className="w-4 h-4"/> Who is this appointment for?</Label>
                     <RadioGroup 
                        value={selectedPatientId} 
                        onValueChange={setSelectedPatientId}
                        className="mt-2 space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={foundPatient.id} id={`hc_${foundPatient.id}`} />
                            <Label htmlFor={`hc_${foundPatient.id}`} className="flex items-center gap-2 font-normal">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${foundPatient.id}`} alt={foundPatient.name} />
                                    <AvatarFallback>{foundPatient.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{foundPatient.name} (Themself)</span>
                            </Label>
                        </div>
                        {foundPatientFamily.map(member => (
                            <div key={member.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={member.id} id={`hc_${member.id}`} />
                                <Label htmlFor={`hc_${member.id}`} className="flex items-center gap-2 font-normal">
                                        <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{member.name} ({member.relationship}, {calculateAge(member.dob)} yrs)</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                     <div className="flex items-center space-x-2 mt-4 p-3 bg-white border rounded-md">
                        <Checkbox id="partner-opt-out" checked={patientOptsOut} onCheckedChange={(checked) => setPatientOptsOut(Boolean(checked))} />
                        <Label htmlFor="partner-opt-out" className="text-sm font-normal">
                           Opt patient out of receiving Health Points bonus. (10% platform fee will apply)
                        </Label>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                    <DialogDescription>
                        Confirm the details below to book your slot.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4 pr-2 max-h-[60vh] overflow-y-auto">
                    {isPartnerBooking ? renderPartnerPatientFinder() : renderPatientSelector()}

                    <div className={cn(isPartnerBooking && !foundPatient && "opacity-50 pointer-events-none")}>
                        <Label htmlFor="clinic" className="font-semibold">Clinic</Label>
                        <Select value={selectedClinicId} onValueChange={setSelectedClinicId}>
                            <SelectTrigger id="clinic" className="mt-2">
                                <SelectValue placeholder="Choose a clinic location" />
                            </SelectTrigger>
                            <SelectContent>
                                {clinics.length > 0 ? clinics.map(clinic => (
                                    <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                                )) : <SelectItem value="none" disabled>No clinics available</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="date" className="font-semibold">Date</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal mt-2",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                    disabled={!selectedClinicId || (isPartnerBooking && !foundPatient)}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={isDateDisabled}
                                    initialFocus
                                    footer={isDateFull ? <p className="text-center text-sm text-destructive p-2">This date is fully booked.</p> : null}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="time-slot" className="font-semibold">Time Slot</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDate || isDateFull}>
                            <SelectTrigger id="time-slot" className="mt-2">
                                <SelectValue placeholder="Choose an available time" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTimeSlots.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {isPartnerBooking && foundPatient && (
                        <div>
                            <Label className="font-semibold">Verify with Patient</Label>
                            {!otpSent ? (
                                <Button className="w-full mt-2" onClick={handleSendOtp}>Send OTP to Patient</Button>
                            ) : (
                                <div className="mt-2">
                                    <Input 
                                        placeholder="Enter 6-digit OTP from patient"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                 {feeDetails && (
                    <CardFooter className="flex-col gap-3 !p-0 !pt-4 border-t">
                         <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-900 w-full">
                            <Info className="h-4 w-4 !text-blue-900" />
                            <AlertTitle className="font-semibold">Important Payment Information</AlertTitle>
                            <AlertDescription>
                                <p className="font-semibold">Step 1 (Online): Pay a fully refundable security deposit now.</p>
                                <p className="font-semibold">Step 2 (At Clinic): Pay the full consultation fee in cash at the clinic.</p>
                            </AlertDescription>
                        </Alert>
                       
                        <div className="w-full space-y-2 p-4 border-y">
                             <h4 className="font-semibold">Billing Summary</h4>
                             <div className="flex justify-between text-sm">
                                <p>Refundable Security Deposit:</p>
                                <p className="font-medium">₹{feeDetails.fee.toFixed(2)}</p>
                             </div>
                             <div className="flex justify-between text-sm">
                                <p>Platform Fee:</p>
                                <p className="font-medium">₹{feeDetails.platformFee.toFixed(2)}</p>
                             </div>
                             <Separator className="my-2"/>
                             <div className="flex justify-between font-bold text-base">
                                <p>Total Online Payment:</p>
                                <p>₹{feeDetails.totalOnlinePayment.toFixed(2)}</p>
                             </div>
                        </div>

                         <Alert variant="default" className="bg-green-50 border-green-200 text-green-900 w-full">
                            <Sparkles className="h-4 w-4 !text-green-900" />
                            <AlertTitle className="font-semibold">Your Reward</AlertTitle>
                            <AlertDescription>
                                {patientOptsOut ? "You have opted out of Health Points for this booking." : `After your visit, your deposit is refunded AND you get ₹${feeDetails.fee.toFixed(2)} in Health Points!`}
                            </AlertDescription>
                        </Alert>
                       
                        <div className="w-full px-1 pt-2">
                            <Button className="w-full h-12 text-lg" onClick={handleConfirmBooking} disabled={isProcessingPayment}>
                                {isProcessingPayment ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
                                {isProcessingPayment ? 'Processing...' : `Pay & Confirm Booking`}
                            </Button>
                        </div>
                    </CardFooter>
                 )}
            </DialogContent>
        </Dialog>
    );
}

    