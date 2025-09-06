

'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trash2, CalendarClock, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mockPatientData as mockPatients } from '@/lib/mock-data';

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

const clinics = ['All', 'Andheri West Clinic', 'Dadar East Clinic', 'Skin & Hair Clinic', 'Happy Kids Pediatrics'];
const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const consultationStatuses = ['All', 'Done', 'Upcoming'];


export function PatientList() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    clinic: 'All',
    date: null as Date | null,
    day: 'All',
    status: 'All',
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        const storedPatients = sessionStorage.getItem('mockPatients');
        const allAppointments = storedPatients ? JSON.parse(storedPatients) : mockPatients;
        setPatients(allAppointments.filter((p: any) => p.doctorId === u.id));
    }
     if (!sessionStorage.getItem('mockPatients')) {
        sessionStorage.setItem('mockPatients', JSON.stringify(mockPatients));
    }
    setIsLoading(false);
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
    const allStoredAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
    const remainingAppointments = allStoredAppointments.filter((p: any) => !selectedRows.has(p.id));
    sessionStorage.setItem('mockPatients', JSON.stringify(remainingAppointments));
    
    // Also update the local state for the current doctor
    setPatients(patients.filter(p => !selectedRows.has(p.id)));

    selectedRows.forEach(id => {
        const patient = patients.find(p => p.id === id);
        if (patient) {
            addNotification(patient.id, {
                title: 'Appointment Canceled',
                message: 'Your doctor has canceled your upcoming appointment. Your payment has been refunded.',
                icon: 'calendar',
                href: '/patient/my-health'
            });
        }
    });

    toast({
        title: "Appointments Canceled",
        description: `${selectedRows.size} appointment(s) have been canceled. Patients have been notified and refunded.`
    })
    setSelectedRows(new Set());
  }

  const handleBulkReschedule = () => {
    toast({
        title: "Appointments Rescheduled",
        description: `${selectedRows.size} appointment(s) have been successfully rescheduled.`
    })
    setSelectedRows(new Set());
  }
  
  const handleDownload = () => {
    const doc = new jsPDF();
    const tableHead = [["Patient Name", "Clinic", "Appointment Date", "Status", "Reason"]];
    const tableBody = filteredPatients.map(p => {
        const date = new Date(p.appointmentDate);
        return [
            p.name,
            p.clinic,
            format(date, 'PP, p'),
            p.status,
            p.consultation
        ];
    });

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      didDrawPage: (data) => {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Patient List", data.settings.margin.left, 22);

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
      startY: 30,
    });
    
    doc.save(`patient_list_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
            <div className="p-4 bg-slate-50/70 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
                {numSelected > 0 ? (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-sm font-medium">{numSelected} selected</span>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" disabled={isActionDisabled}><CalendarClock className="mr-2 h-4 w-4"/> Reschedule</Button>
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
                                <Button variant="destructive" size="sm" disabled={isActionDisabled}><Trash2 className="mr-2 h-4 w-4"/> Cancel</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Appointments?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will cancel {numSelected} appointment(s) and issue a full refund to each patient's original payment method.
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
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download PDF
                </Button>
            </div>
            <div className="w-full overflow-x-auto">
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
                            <TableHead className="hidden lg:table-cell">Clinic</TableHead>
                            <TableHead>Appointment</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading appointments...</TableCell></TableRow>
                        ) : filteredPatients.length > 0 ? (
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
                                    <TableCell className="hidden lg:table-cell">{patient.clinic}</TableCell>
                                    <TableCell>{format(new Date(patient.appointmentDate), 'PP, p')}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={patient.status === 'done' ? 'secondary' : 'default'}>
                                            {patient.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/doctor/patient/${patient.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No patients found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  )
}

    