
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon, User, Search, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '../ui/input';
import { mockPatientData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { MOCK_OTP } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

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
    days: string[];
    slots: string;
    consultationFee: number;
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
    onConfirm: (patientId: string, clinicId: string, date: Date, time: string) => void;
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

    // Common state
    const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');
    
    // Patient flow state
    const [selectedPatientId, setSelectedPatientId] = useState('self');
    
    // Agent flow state
    const [patientPhone, setPatientPhone] = useState('');
    const [foundPatient, setFoundPatient] = useState<any | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            setUserRole(storedUser ? JSON.parse(storedUser).role : 'patient');
        }
        
        if (isOpen) {
            // Reset all state when dialog opens
            setSelectedClinicId(undefined);
            setSelectedDate(undefined);
            setSelectedTime('');
            setSelectedPatientId('self');
            setPatientPhone('');
            setFoundPatient(null);
            setIsSearching(false);
            setOtpSent(false);
            setOtp('');
        }
    }, [isOpen]);

    const selectedClinic = useMemo(() => {
        return clinics.find(c => c.id === selectedClinicId);
    }, [selectedClinicId, clinics]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedClinic) return [];
        return selectedClinic.slots.split(',').map(s => s.trim());
    }, [selectedClinic]);

    const handleClinicChange = (clinicId: string) => {
        setSelectedClinicId(clinicId);
        setSelectedDate(undefined);
        setSelectedTime('');
    }
    
    const handleConfirm = () => {
        const patientId = userRole === 'agent' ? foundPatient.id : selectedPatientId;
        if (patientId && selectedClinicId && selectedDate && selectedTime) {
            
            if (userRole === 'agent') {
                if (otp !== MOCK_OTP) {
                    toast({ title: "Invalid OTP", description: "The OTP entered is incorrect.", variant: "destructive" });
                    return;
                }
            }

            onConfirm(patientId, selectedClinicId, selectedDate, selectedTime);
        }
    };
    
    const isDateDisabled = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
            return true;
        }
        if (!selectedClinic) {
            return true;
        }
        const dayOfWeek = format(date, 'EEEE');
        return !selectedClinic.days.includes(dayOfWeek);
    };

    const handleSearchPatient = () => {
        setIsSearching(true);
        setTimeout(() => { // Simulate API call
            const patient = mockPatientData.find(p => p.phone === patientPhone);
            if (patient) {
                setFoundPatient(patient);
            } else {
                toast({ title: "Patient Not Found", description: "No patient exists with this mobile number.", variant: "destructive" });
            }
            setIsSearching(false);
        }, 500);
    }
    
    const handleSendOtp = () => {
        setOtpSent(true);
        toast({
            title: "OTP Sent to Patient",
            description: `An OTP has been sent to ${foundPatient.name}. Please ask them for it. The mock OTP is ${MOCK_OTP}.`
        })
    }

    const renderPatientSelector = () => (
        <div>
            <Label className="font-semibold">Step 1: Who is this appointment for?</Label>
            <RadioGroup 
                value={selectedPatientId} 
                onValueChange={setSelectedPatientId}
                className="mt-2 space-y-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self" className="flex items-center gap-2 font-normal">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=rohan`} alt="Rohan Sharma" />
                            <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <span>Rohan Sharma (Myself)</span>
                    </Label>
                </div>
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
        </div>
    );

    const renderAgentPatientFinder = () => (
        <div>
            <Label className="font-semibold">Step 1: Find Patient</Label>
            {foundPatient ? (
                <div className="mt-2 p-3 bg-slate-50 border rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <User className="text-primary"/>
                        <p className="font-medium">{foundPatient.name} ({foundPatient.phone})</p>
                    </div>
                    <Button variant="link" size="sm" onClick={() => { setFoundPatient(null); setPatientPhone('')}}>Change</Button>
                </div>
            ) : (
                <div className="flex gap-2 mt-2">
                    <Input 
                        placeholder="Patient's 10-digit mobile number" 
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        disabled={isSearching}
                    />
                    <Button onClick={handleSearchPatient} disabled={isSearching || patientPhone.length !== 10}>
                        {isSearching ? <Loader2 className="animate-spin"/> : <Search/>}
                    </Button>
                </div>
            )}
        </div>
    );

    const isConfirmDisabled = userRole === 'agent' 
        ? !foundPatient || !selectedTime || !otpSent || otp.length !== 6
        : !selectedPatientId || !selectedTime;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                    <DialogDescription>
                        Complete the steps below to confirm your booking.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {userRole === 'agent' ? renderAgentPatientFinder() : renderPatientSelector()}

                    <div className={cn(!foundPatient && userRole === 'agent' && "opacity-50 pointer-events-none")}>
                        <Label htmlFor="clinic" className="font-semibold">Step 2: Select a Clinic</Label>
                        <Select value={selectedClinicId} onValueChange={handleClinicChange}>
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

                    {selectedClinic && (
                         <Alert variant="default" className="bg-primary/10 border-primary/20 text-primary">
                            <span className="font-bold">₹</span>
                            <AlertTitle className="font-bold">Consultation Fee: ₹{selectedClinic.consultationFee.toFixed(2)}</AlertTitle>
                            <AlertDescription>
                                This fee is applicable for {selectedClinic.name}.
                            </AlertDescription>
                        </Alert>
                    )}


                    <div>
                        <Label htmlFor="date" className="font-semibold">Step 3: Select a Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal mt-2",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                    disabled={!selectedClinicId || (!foundPatient && userRole === 'agent')}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={isDateDisabled}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="time-slot" className="font-semibold">Step 4: Select a Time Slot</Label>
                         <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDate}>
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
                    
                    {userRole === 'agent' && selectedTime && (
                         <div>
                            <Label className="font-semibold">Step 5: Verify with Patient</Label>
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm} disabled={isConfirmDisabled}>Confirm Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    
