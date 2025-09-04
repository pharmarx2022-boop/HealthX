

'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trash2, CalendarClock, DownloadIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { addNotification } from '@/lib/notifications';
import { initialDoctors } from '@/lib/mock-data';

export const mockPatients = [
  { id: '1', transactionId: 'txn_1', name: 'Rohan Sharma', clinic: 'Andheri', doctorId: '1', healthCoordinatorId: null, appointmentDate: '2024-08-15T10:00:00Z', status: 'upcoming', consultation: 'Follow-up for cardiology check-up.', notes: 'Patient has reported mild chest pain.', consultationFee: 1200, refundStatus: 'Not Refunded', nextAppointmentDate: null, reviewed: false },
  { id: '2', transactionId: 'txn_2', name: 'Priya Mehta', clinic: 'Dadar', doctorId: '2', healthCoordinatorId: 'health_coordinator_1', appointmentDate: '2024-08-15T12:30:00Z', status: 'upcoming', consultation: 'Initial consultation for dermatology.', notes: 'Patient has a history of eczema.', consultationFee: 1500, refundStatus: 'Not Refunded', nextAppointmentDate: null, reviewed: false },
  { id: '3', transactionId: 'txn_3', name: 'Amit Singh', clinic: 'Bandra', doctorId: '3', healthCoordinatorId: 'health_coordinator_1', appointmentDate: '2024-08-14T15:00:00Z', status: 'done', consultation: 'Annual health check-up.', notes: 'All reports are normal.', consultationFee: 800, refundStatus: 'Refunded', nextAppointmentDate: '2025-08-14T15:00:00Z', reviewed: true },
  { id: '4', transactionId: 'txn_4', name: 'Sunita Patil', clinic: 'Andheri', doctorId: '1', healthCoordinatorId: null, appointmentDate: '2024-08-13T09:00:00Z', status: 'done', consultation: 'Post-operative follow-up.', notes: 'Wound healing well.', consultationFee: 950, refundStatus: 'Refunded', nextAppointmentDate: null, reviewed: false },
  { id: '5', transactionId: 'txn_5', name: 'Karan Verma', clinic: 'Dadar', doctorId: '2', healthCoordinatorId: 'health_coordinator_1', appointmentDate: '2024-08-16T11:00:00Z', status: 'upcoming', consultation: 'Vaccination appointment.', notes: '', consultationFee: 500, refundStatus: 'Not Refunded', nextAppointmentDate: null, reviewed: false },
  { id: '6', transactionId: 'txn_6', name: 'Anika Desai', clinic: 'Andheri', doctorId: '1', healthCoordinatorId: null, appointmentDate: '2024-08-12T16:00:00Z', status: 'done', consultation: 'Consultation for fever.', notes: 'Prescribed medication for viral infection.', consultationFee: 700, refundStatus: 'Refunded', nextAppointmentDate: '2024-09-12T16:00:00Z', reviewed: true },
  { id: '7', transactionId: 'txn_7', name: 'Vikram Reddy', clinic: 'Bandra', doctorId: '3', healthCoordinatorId: null, appointmentDate: '2024-08-17T14:00:00Z', status: 'upcoming', consultation: 'Physiotherapy session.', notes: 'Patient recovering from a sports injury.', consultationFee: 1800, refundStatus: 'Not Refunded', nextAppointmentDate: null, reviewed: false },
];

const clinics = ['All', 'Andheri', 'Dadar', 'Bandra'];
const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const consultationStatuses = ['All', 'Done', 'Upcoming'];


export function PatientList() {
  const { toast } = useToast();
  const [patients, setPatients] = useState(mockPatients);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    clinic: 'All',
    date: null as Date | null,
    day: 'All',
    status: 'All',
  });

  useEffect(() => {
    setIsClient(true);
     if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (!sessionStorage.getItem('mockPatients')) {
            sessionStorage.setItem('mockPatients', JSON.stringify(mockPatients));
        }
        
        const storedPatients = sessionStorage.getItem('mockPatients');
        if (storedPatients) {
            setPatients(JSON.parse(storedPatients));
        }
    }
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
        const appointmentDate = new Date(patient.appointmentDate);
        if (filters.name && !patient.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.clinic !== 'All' && patient.clinic !== filters.clinic) return false;
        if (filters.date && format(appointmentDate, 'yyyy-MM-dd') !== format(filters.date, 'yyyy-MM-dd')) return false;
        if (filters.day !== 'All' && format(appointmentDate, 'EEEE') !== filters.day) return false;
        if (filters.status !== 'All' && patient.status !== filters.status.toLowerCase()) return false;
        return true;
    });
  }, [filters, patients]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(new Set(filteredPatients.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleBulkCancel = () => {
    const allDoctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]') || initialDoctors;
    const doctor = allDoctors.find((d: any) => d.id === user?.id);

    selectedRows.forEach(patientId => {
        const patient = patients.find(p => p.id === patientId);
        if(patient && doctor) {
             addNotification(patient.id, `Your appointment at ${patient.clinic} on ${format(new Date(patient.appointmentDate), 'PP')} has been canceled by ${doctor.name}.`);
        }
    });

    const updatedPatients = patients.filter(p => !selectedRows.has(p.id));
    setPatients(updatedPatients);
    sessionStorage.setItem('mockPatients', JSON.stringify(updatedPatients));
    toast({
        title: "Appointments Canceled",
        description: `${selectedRows.size} appointment(s) have been successfully canceled.`
    })
    setSelectedRows(new Set());
  }

  const handleBulkReschedule = () => {
    const allDoctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]') || initialDoctors;
    const doctor = allDoctors.find((d: any) => d.id === user?.id);
    
    selectedRows.forEach(patientId => {
        const patient = patients.find(p => p.id === patientId);
         if(patient && doctor) {
            addNotification(patient.id, `Your appointment at ${patient.clinic} on ${format(new Date(patient.appointmentDate), 'PP')} has been rescheduled by ${doctor.name}. Please check for new details.`);
        }
    });

    toast({
        title: "Appointments Rescheduled",
        description: `${selectedRows.size} appointment(s) have been successfully rescheduled.`
    })
    setSelectedRows(new Set());
  }
  
  const handleDownload = () => {
    const headers = ["Patient Name", "Clinic", "Appointment Date", "Appointment Time", "Status", "Reason for Visit"];
    const csvContent = [
        headers.join(','),
        ...filteredPatients.map(p => {
            const date = new Date(p.appointmentDate);
            const row = [
                `"${p.name}"`,
                `"${p.clinic}"`,
                format(date, 'yyyy-MM-dd'),
                format(date, 'p'),
                `"${p.status}"`,
                `"${p.consultation.replace(/"/g, '""')}"`
            ];
            return row.join(',');
        })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const filename = `patient_list_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  const numSelected = selectedRows.size;
  const isAllSelected = numSelected > 0 && numSelected === filteredPatients.length;
  const isIndeterminate = numSelected > 0 && numSelected < filteredPatients.length;
  const isActionDisabled = user?.status !== 'approved';

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-slate-50/50 items-end">
            <div className="space-y-2">
                <Label htmlFor="patientName">Filter by Name</Label>
                <Input 
                    id="patientName"
                    placeholder="Patient Name..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="clinic">Filter by Clinic</Label>
                <Select value={filters.clinic} onValueChange={(value) => handleFilterChange('clinic', value)}>
                    <SelectTrigger id="clinic"><SelectValue placeholder="Clinic" /></SelectTrigger>
                    <SelectContent>
                        {clinics.map(clinic => <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Filter by Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={filters.date ?? undefined}
                            onSelect={(date) => handleFilterChange('date', date as Date | null)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="day">Filter by Day</Label>
                <Select value={filters.day} onValueChange={(value) => handleFilterChange('day', value)}>
                    <SelectTrigger id="day"><SelectValue placeholder="Day" /></SelectTrigger>
                    <SelectContent>
                        {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger id="status"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        {consultationStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b flex items-center justify-between">
                {numSelected > 0 ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{numSelected} patient(s) selected</span>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" disabled={isActionDisabled}><CalendarClock className="mr-2"/> Reschedule</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reschedule Appointments?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to reschedule the selected {numSelected} appointments? This action will notify the patients.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBulkReschedule}>Confirm Reschedule</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={isActionDisabled}><Trash2 className="mr-2"/> Cancel</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Appointments?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel the selected {numSelected} appointments? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBulkCancel}>Confirm Cancellation</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">Select patients to perform bulk actions.</div>
                )}
                 <Button variant="outline" size="sm" onClick={handleDownload} disabled={filteredPatients.length === 0}>
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download List
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox 
                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                checked={isAllSelected || (isIndeterminate ? 'indeterminate' : false)}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Clinic</TableHead>
                        <TableHead>Appointment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                            <TableRow key={patient.id} data-state={selectedRows.has(patient.id) ? "selected" : ""}>
                                <TableCell>
                                    <Checkbox
                                        onCheckedChange={(checked) => handleSelectRow(patient.id, Boolean(checked))}
                                        checked={selectedRows.has(patient.id)}
                                        aria-label={`Select ${patient.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.clinic}</TableCell>
                                <TableCell>{isClient ? format(new Date(patient.appointmentDate), 'PP, p') : ''}</TableCell>
                                <TableCell>
                                    <Badge variant={patient.status === 'done' ? 'secondary' : 'default'}>
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/doctor/patient/${patient.id}`}>View Details</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No patients found with the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}
