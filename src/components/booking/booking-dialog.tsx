
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
    onConfirm: (patientId: string, clinicName: string, date: Date, time: string) => void;
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
    const [selectedPatientId, setSelectedPatientId] = useState('self');
    const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');

    const selectedClinic = useMemo(() => {
        return clinics.find(c => c.id === selectedClinicId);
    }, [selectedClinicId, clinics]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedClinic) return [];
        return selectedClinic.slots.split(',').map(s => s.trim());
    }, [selectedClinic]);
    
    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setSelectedPatientId('self');
            setSelectedClinicId(undefined);
            setSelectedDate(undefined);
            setSelectedTime('');
        }
    }, [isOpen]);

    const handleClinicChange = (clinicId: string) => {
        setSelectedClinicId(clinicId);
        setSelectedDate(undefined); // Reset date when clinic changes
        setSelectedTime(''); // Reset time
    }
    
    const handleConfirm = () => {
        if (selectedPatientId && selectedClinic && selectedDate && selectedTime) {
            onConfirm(selectedPatientId, selectedClinic.name, selectedDate, selectedTime);
        }
    };
    
    const isDateDisabled = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
            return true;
        }
        if (!selectedClinic) {
            return true; // Disable all dates if no clinic is selected
        }
        const dayOfWeek = format(date, 'EEEE'); // e.g., "Monday"
        return !selectedClinic.days.includes(dayOfWeek);
    };

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

                    <div>
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
                                    disabled={!selectedClinicId}
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
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm} disabled={!selectedPatientId || !selectedTime}>Confirm Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
