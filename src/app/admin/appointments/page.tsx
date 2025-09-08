
'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Loader2, Search, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { initialDoctors, mockPatientData } from '@/lib/mock-data';

type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  status: 'upcoming' | 'done' | 'cancelled' | 'missed';
  refundStatus: 'Refunded' | 'Not Refunded' | 'Processing';
  consultationFee: number;
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<{
    patientName: string;
    doctorName: string;
    dateRange: DateRange | undefined;
    status: string;
    refundStatus: string;
  }>({
    patientName: '',
    doctorName: '',
    dateRange: undefined,
    status: 'all',
    refundStatus: 'all',
  });

  useEffect(() => {
    // In a real app, this would be an API call to fetch all appointments and doctors
    const allAppointments = (JSON.parse(localStorage.getItem('mockPatients') || '[]') as any[]).map(appt => ({
        ...appt,
        patientName: appt.name,
        doctorName: initialDoctors.find(d => d.id === appt.doctorId)?.name || 'Unknown',
    }));
    setAppointments(allAppointments);
    setDoctors(initialDoctors);
    setIsLoading(false);
  }, []);

  const handleResetFilters = () => {
    setFilters({
      patientName: '',
      doctorName: '',
      dateRange: undefined,
      status: 'all',
      refundStatus: 'all',
    });
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const appointmentDate = new Date(appt.appointmentDate);
      const { patientName, doctorName, dateRange, status, refundStatus } = filters;

      const matchesPatient = appt.patientName.toLowerCase().includes(patientName.toLowerCase());
      const matchesDoctor = appt.doctorName.toLowerCase().includes(doctorName.toLowerCase());
      const matchesStatus = status === 'all' || appt.status === status;
      const matchesRefund = refundStatus === 'all' || appt.refundStatus === refundStatus;
      
      const matchesDate = !dateRange || (
        (!dateRange.from || appointmentDate >= startOfDay(dateRange.from)) &&
        (!dateRange.to || appointmentDate <= endOfDay(dateRange.to))
      );

      return matchesPatient && matchesDoctor && matchesStatus && matchesRefund && matchesDate;
    });
  }, [appointments, filters]);

  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'done': return 'secondary';
      case 'upcoming': return 'default';
      case 'cancelled':
      case 'missed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Appointment Management</h1>
        <p className="text-muted-foreground">Filter and view all appointments on the platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
           <CardDescription>Use the filters below to search for specific appointments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Filter by patient name..."
              value={filters.patientName}
              onChange={(e) => setFilters(prev => ({...prev, patientName: e.target.value}))}
            />
            <Input
              placeholder="Filter by doctor name..."
              value={filters.doctorName}
              onChange={(e) => setFilters(prev => ({...prev, doctorName: e.target.value}))}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => setFilters(prev => ({...prev, dateRange: range}))}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
              <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.refundStatus} onValueChange={(value) => setFilters(prev => ({...prev, refundStatus: value}))}>
              <SelectTrigger><SelectValue placeholder="Filter by refund status..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Refund Statuses</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Not Refunded">Not Refunded</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleResetFilters} variant="ghost">
              <X className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Appointment List</CardTitle>
            <CardDescription>{filteredAppointments.length} appointments found.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Refund</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="animate-spin inline-block"/></TableCell></TableRow>
                        ) : filteredAppointments.length > 0 ? (
                            filteredAppointments.map(appt => (
                                <TableRow key={appt.id}>
                                    <TableCell className="font-medium">{appt.patientName}</TableCell>
                                    <TableCell>{appt.doctorName}</TableCell>
                                    <TableCell>{format(new Date(appt.appointmentDate), 'PP, p')}</TableCell>
                                    <TableCell>INR {appt.consultationFee.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(appt.status)} className="capitalize">{appt.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={appt.refundStatus === 'Refunded' ? 'secondary' : 'outline'} className="capitalize">{appt.refundStatus}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={6} className="text-center h-24">No appointments match the current filters.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
