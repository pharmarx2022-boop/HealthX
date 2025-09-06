
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, CalendarIcon, Stethoscope, Building, RefreshCw } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { mockPatientData } from '@/lib/mock-data';
import { initialDoctors, initialClinics } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const PATIENTS_KEY = 'mockPatients';

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        doctor: 'all',
        clinic: 'all',
        date: null as Date | null,
        status: 'all',
        refundStatus: 'all',
    });

    useEffect(() => {
        const storedAppointments = sessionStorage.getItem(PATIENTS_KEY);
        setAppointments(storedAppointments ? JSON.parse(storedAppointments) : mockPatientData);
        setIsLoading(false);
    }, []);

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter(appt => {
            if (filters.doctor !== 'all' && appt.doctorId !== filters.doctor) return false;
            if (filters.clinic !== 'all' && appt.clinic !== filters.clinic) return false;
            if (filters.status !== 'all' && appt.status !== filters.status) return false;
            if (filters.refundStatus !== 'all' && appt.refundStatus !== filters.refundStatus) return false;
            if (filters.date && !isSameDay(new Date(appt.appointmentDate), filters.date)) return false;
            return true;
        }).map(appt => {
            const doctor = initialDoctors.find(d => d.id === appt.doctorId);
            return { ...appt, doctorName: doctor?.name || 'Unknown Doctor' };
        });
    }, [appointments, filters]);
    
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'done':
            case 'upcoming':
                 return 'secondary';
            case 'cancelled':
            case 'absent':
                 return 'destructive';
            default:
                return 'default';
        }
    };

    const getRefundStatusVariant = (status: string) => {
        switch (status) {
            case 'Refunded': return 'secondary';
            case 'Not Refunded': return 'outline';
            default: return 'default';
        }
    };


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Appointment Management</h1>
                <p className="text-muted-foreground">View and filter all patient appointments across the platform.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Filter Appointments</CardTitle>
                    <CardDescription>Use the filters below to narrow down the appointment list.</CardDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
                        <Select value={filters.doctor} onValueChange={(v) => handleFilterChange('doctor', v)}>
                            <SelectTrigger><div className="flex items-center gap-2"><Stethoscope className="w-4 h-4" /><span>Doctor</span></div></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Doctors</SelectItem>
                                {initialDoctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Select value={filters.clinic} onValueChange={(v) => handleFilterChange('clinic', v)}>
                            <SelectTrigger><div className="flex items-center gap-2"><Building className="w-4 h-4" /><span>Clinic</span></div></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Clinics</SelectItem>
                                {initialClinics.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("justify-start text-left font-normal", !filters.date && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.date ?? undefined} onSelect={(d) => handleFilterChange('date', d)} initialFocus /></PopoverContent>
                        </Popover>
                         <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger>Status</SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="done">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                            </SelectContent>
                        </Select>
                          <Select value={filters.refundStatus} onValueChange={(v) => handleFilterChange('refundStatus', v)}>
                            <SelectTrigger><div className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /><span>Refund</span></div></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Refunds</SelectItem>
                                <SelectItem value="Refunded">Refunded</SelectItem>
                                <SelectItem value="Not Refunded">Not Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead className="hidden md:table-cell">Doctor</TableHead>
                                    <TableHead className="hidden lg:table-cell">Clinic</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Refund</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                     <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            <Loader2 className="animate-spin inline-block mr-2" /> Loading appointments...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAppointments.length > 0 ? filteredAppointments.map(appt => (
                                    <TableRow key={appt.id}>
                                        <TableCell className="font-medium">{appt.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{appt.doctorName}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{appt.clinic}</TableCell>
                                        <TableCell>{format(new Date(appt.appointmentDate), 'PP, p')}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusVariant(appt.status)} className="capitalize">{appt.status}</Badge>
                                        </TableCell>
                                         <TableCell className="text-center">
                                            <Badge variant={getRefundStatusVariant(appt.refundStatus)} className="capitalize">{appt.refundStatus}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No appointments found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
