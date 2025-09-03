
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Doctor = {
    id: string;
    name: string;
    specialty: string;
    image: string;
    dataAiHint?: string;
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
    familyMembers: FamilyMember[];
    onConfirm: (patientId: string, time: string) => void;
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

export function BookingDialog({ isOpen, onOpenChange, doctor, familyMembers, onConfirm }: BookingDialogProps) {
    const [selectedPatientId, setSelectedPatientId] = useState('self');
    const [selectedTime, setSelectedTime] = useState('');
    
    // Hardcoded time slots for the demo
    const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

    useEffect(() => {
        if (isOpen) {
            setSelectedPatientId('self');
            setSelectedTime('');
        }
    }, [isOpen]);
    
    const handleConfirm = () => {
        if (selectedPatientId && selectedTime) {
            onConfirm(selectedPatientId, selectedTime);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                    <DialogDescription>
                        Select the patient and a time slot to confirm your booking.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <Label className="font-semibold">Who is this appointment for?</Label>
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
                        <Label htmlFor="time-slot" className="font-semibold">Select a Time Slot</Label>
                         <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id="time-slot" className="mt-2">
                                <SelectValue placeholder="Choose an available time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map(time => (
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
