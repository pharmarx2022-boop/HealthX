
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const mockPatients = [
  { id: '1', name: 'Rohan Sharma', clinic: 'Andheri', appointmentDate: '2024-08-15T10:00:00Z', status: 'upcoming' },
  { id: '2', name: 'Priya Mehta', clinic: 'Dadar', appointmentDate: '2024-08-15T12:30:00Z', status: 'upcoming' },
  { id: '3', name: 'Amit Singh', clinic: 'Bandra', appointmentDate: '2024-08-14T15:00:00Z', status: 'done' },
  { id: '4', name: 'Sunita Patil', clinic: 'Andheri', appointmentDate: '2024-08-13T09:00:00Z', status: 'done' },
  { id: '5', name: 'Karan Verma', clinic: 'Dadar', appointmentDate: '2024-08-16T11:00:00Z', status: 'upcoming' },
  { id: '6', name: 'Anika Desai', clinic: 'Andheri', appointmentDate: '2024-08-12T16:00:00Z', status: 'done' },
  { id: '7', name: 'Vikram Reddy', clinic: 'Bandra', appointmentDate: '2024-08-17T14:00:00Z', status: 'upcoming' },
];

const clinics = ['All', 'Andheri', 'Dadar', 'Bandra'];
const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const consultationStatuses = ['All', 'Done', 'Upcoming'];


export function PatientList() {
  const [filters, setFilters] = useState({
    name: '',
    clinic: 'All',
    date: null as Date | null,
    day: 'All',
    status: 'All',
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
        const appointmentDate = new Date(patient.appointmentDate);
        if (filters.name && !patient.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.clinic !== 'All' && patient.clinic !== filters.clinic) return false;
        if (filters.date && format(appointmentDate, 'yyyy-MM-dd') !== format(filters.date, 'yyyy-MM-dd')) return false;
        if (filters.day !== 'All' && format(appointmentDate, 'EEEE') !== filters.day) return false;
        if (filters.status !== 'All' && patient.status !== filters.status.toLowerCase()) return false;
        return true;
    });
  }, [filters]);

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
            <Table>
                <TableHeader>
                    <TableRow>
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
                            <TableRow key={patient.id}>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.clinic}</TableCell>
                                <TableCell>{format(new Date(patient.appointmentDate), 'PP, p')}</TableCell>
                                <TableCell>
                                    <Badge variant={patient.status === 'done' ? 'secondary' : 'default'}>
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
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
