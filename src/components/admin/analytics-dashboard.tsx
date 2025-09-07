
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Briefcase, Banknote, ShieldCheck, Stethoscope, Pill, Beaker, Calendar as CalendarIcon, Activity, Building, Badge as BadgeIcon, RefreshCw, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isToday, isSameDay } from 'date-fns';
import { initialDoctors, initialLabs, initialPharmacies, mockPatientData, initialClinics } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { getAllUsersForAdmin, type UserData } from '@/lib/auth';
import { Badge } from '../ui/badge';
import { getWithdrawalRequests } from '@/lib/commission-wallet';

const userGrowthData: any[] = [];

const userGrowthChartConfig = {
  users: {
    label: 'New Users',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const revenueData: any[] = [];

const revenueChartConfig = {
  consultations: { label: 'Doctor Consultations', color: 'hsl(var(--chart-1))' },
  labs: { label: 'Lab Commissions', color: 'hsl(var(--chart-2))' },
  pharmacies: { label: 'Pharmacy Commissions', color: 'hsl(var(--chart-3))' },
  coordinators: { label: 'Health Coordinator Fees', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

const recentActivities: any[] = [];

const appointmentStatuses = ['All', 'Done', 'Upcoming', 'Cancelled', 'Absent'];
const refundStatuses = ['All', 'Refunded', 'Not Refunded'];

export function AnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  
  // New filters for doctor performance
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [clinicFilter, setClinicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refundFilter, setRefundFilter] = useState('All');
  const [coordinatorFilter, setCoordinatorFilter] = useState('All');

  React.useEffect(() => {
    const users = getAllUsersForAdmin();
    setAllUsers(users);
    getWithdrawalRequests().then(reqs => setPendingApprovals(reqs.filter(r => r.status === 'pending')));
  }, []);
  
  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const activePartners = allUsers.filter(u => u.status === 'approved' && u.role !== 'patient').length;
    const todaysConsultations = mockPatientData.filter(appt => 
        isToday(new Date(appt.appointmentDate)) && appt.status === 'done'
    ).length;
    return { totalUsers, activePartners, todaysConsultations };
  }, [allUsers]);

  const timeFilteredAppointments = useMemo(() => {
     return mockPatientData.filter(appt => {
        const apptDate = new Date(appt.appointmentDate);
        if (selectedDate) return isSameDay(apptDate, selectedDate);
        if (timeFilter === 'today') return isToday(apptDate);
        if (timeFilter === 'week') {
            const today = new Date();
            return isWithinInterval(apptDate, { start: startOfWeek(today), end: endOfWeek(today) });
        }
        if (timeFilter === 'month') {
             const today = new Date();
            return isWithinInterval(apptDate, { start: startOfMonth(today), end: endOfMonth(today) });
        }
        return true; // 'all'
    });
  }, [timeFilter, selectedDate]);


  const doctorPerformanceData = useMemo(() => {
    const fullyFilteredAppointments = timeFilteredAppointments.filter(appt => {
        if (doctorFilter !== 'All' && appt.doctorId !== doctorFilter) return false;
        if (clinicFilter !== 'All' && appt.clinic !== clinicFilter) return false;
        if (statusFilter !== 'All' && appt.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
        if (refundFilter !== 'All' && appt.refundStatus !== refundFilter) return false;
        return true;
    });

    const data = initialDoctors.map(doctor => {
        const doctorAppointments = fullyFilteredAppointments.filter(appt => appt.doctorId === doctor.id);
        if(doctorFilter !== 'All' && doctor.id !== doctorFilter) return null;

        const countByStatus = (status: string) => doctorAppointments.filter(a => a.status === status).length;

        return {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            completed: countByStatus('done'),
            cancelled: countByStatus('cancelled'),
            absent: countByStatus('absent'),
            revenue: doctorAppointments.filter(a => a.status === 'done').reduce((sum, appt) => sum + appt.consultationFee, 0),
        };
    }).filter(Boolean).sort((a,b) => b!.revenue - a!.revenue);
    
    const totals = data.reduce((acc, curr) => {
        acc.completed += curr!.completed;
        acc.cancelled += curr!.cancelled;
        acc.absent += curr!.absent;
        acc.revenue += curr!.revenue;
        return acc;
    }, { completed: 0, cancelled: 0, absent: 0, revenue: 0 });

    return { data, totals };

  }, [timeFilteredAppointments, clinicFilter, statusFilter, doctorFilter, refundFilter]);
  
  const partnerPerformanceData = useMemo(() => {
    const labs = initialLabs.map(lab => ({ id: lab.id, name: lab.name, type: 'Lab', transactions: 0, commission: 'INR 0.00' }));
    const pharmacies = initialPharmacies.map(pharmacy => ({ id: pharmacy.id, name: pharmacy.name, type: 'Pharmacy', transactions: 0, commission: 'INR 0.00' }));
    
    const healthCoordinatorsData = timeFilteredAppointments
        .filter(appt => appt.healthCoordinatorId)
        .filter(appt => coordinatorFilter === 'All' || appt.healthCoordinatorId === coordinatorFilter)
        .map(appt => {
            const coordinator = allUsers.find(u => u.id === appt.healthCoordinatorId);
            const doctor = initialDoctors.find(d => d.id === appt.doctorId);
            return {
                ...appt,
                coordinatorName: coordinator?.fullName || 'Unknown',
                doctorName: doctor?.name || 'Unknown',
            }
        });

    return { labs, pharmacies, healthCoordinators: healthCoordinatorsData };
  }, [timeFilteredAppointments, allUsers, coordinatorFilter]);

  const handleTimeFilterChange = (value: string) => {
      setTimeFilter(value);
      setSelectedDate(null); // Clear specific date when preset is chosen
  }

  const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date || null);
      if (date) {
        setTimeFilter('custom'); // Set to custom to indicate a date is picked
      }
  }
  
  const renderFilterControls = () => (
     <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full">
        <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
        </Select>
         <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "w-full sm:w-auto justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
         <Select value={doctorFilter} onValueChange={setDoctorFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                 <Stethoscope className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Doctors</SelectItem>
                {initialDoctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
        </Select>
        <Select value={clinicFilter} onValueChange={setClinicFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                 <Building className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Clinics" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Clinics</SelectItem>
                {initialClinics.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
        </Select>
         <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <BadgeIcon className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
                {appointmentStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
        </Select>
         <Select value={refundFilter} onValueChange={setRefundFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Refunds" />
            </SelectTrigger>
            <SelectContent>
                {refundStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
        </Select>
        <Select value={coordinatorFilter} onValueChange={setCoordinatorFilter}>
            <SelectTrigger className="w-full sm:w-[220px]">
                 <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Health Coordinators" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Health Coordinators</SelectItem>
                {allUsers.filter(u => u.role === 'health-coordinator').map(c => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
  );

  return (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.todaysConsultations}</div>
                    <p className="text-xs text-muted-foreground">Consultations completed today.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Total registered users.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activePartners}</div>
                    <p className="text-xs text-muted-foreground">Approved partners on the platform.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                    <p className="text-xs text-muted-foreground">New partners awaiting approval.</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>New User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={userGrowthChartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={userGrowthData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={revenueChartConfig} className="min-h-[200px] w-full max-w-[250px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie data={revenueData} dataKey="value" nameKey="name" innerRadius={60}>
                                {revenueData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        {/* Doctor Performance */}
        <Card>
            <CardHeader className="flex flex-col items-start gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2"><Stethoscope/> Doctor Performance</CardTitle>
                    <CardDescription>Consultation and revenue metrics for each doctor.</CardDescription>
                </div>
                {renderFilterControls()}
            </CardHeader>
            <CardContent>
                 <div className="w-full overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead className="text-center">Completed</TableHead>
                                <TableHead className="text-center">Cancelled</TableHead>
                                <TableHead className="text-center">Absent</TableHead>
                                <TableHead className="text-right">Total Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {doctorPerformanceData.data.length > 0 ? doctorPerformanceData.data.map((doctor) => (
                                <TableRow key={doctor!.id}>
                                    <TableCell>
                                        <div className="font-medium">{doctor!.name}</div>
                                        <div className="text-xs text-muted-foreground">{doctor!.specialty}</div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{doctor!.completed}</TableCell>
                                    <TableCell className="text-center font-medium">{doctor!.cancelled}</TableCell>
                                    <TableCell className="text-center font-medium">{doctor!.absent}</TableCell>
                                    <TableCell className="text-right font-medium">INR {doctor!.revenue.toFixed(2)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No appointment data for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter className="bg-slate-50">
                            <TableRow>
                                <TableHead colSpan={1} className="font-bold text-right">Totals</TableHead>
                                <TableHead className="text-center font-bold">{doctorPerformanceData.totals.completed}</TableHead>
                                <TableHead className="text-center font-bold">{doctorPerformanceData.totals.cancelled}</TableHead>
                                <TableHead className="text-center font-bold">{doctorPerformanceData.totals.absent}</TableHead>
                                <TableHead className="text-right font-bold">INR {doctorPerformanceData.totals.revenue.toFixed(2)}</TableHead>
                            </TableRow>
                        </TableFooter>
                     </Table>
                 </div>
            </CardContent>
        </Card>

        {/* Other Partner Performance */}
         <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Pill/> Pharmacy Performance</CardTitle>
                     <CardDescription>Transaction volumes and earnings for the selected period.</CardDescription>
                </CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pharmacy</TableHead>
                                <TableHead className="text-center">Transactions</TableHead>
                                <TableHead className="text-right">Commission</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partnerPerformanceData.pharmacies.length > 0 ? partnerPerformanceData.pharmacies.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="text-center">{p.transactions}</TableCell>
                                    <TableCell className="text-right">{p.commission}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">No pharmacy data yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Beaker/> Lab Performance</CardTitle>
                     <CardDescription>Report uploads and earnings for the selected period.</CardDescription>
                </CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lab</TableHead>
                                <TableHead className="text-center">Reports</TableHead>
                                <TableHead className="text-right">Commission</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partnerPerformanceData.labs.length > 0 ? partnerPerformanceData.labs.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="text-center">{p.transactions}</TableCell>
                                    <TableCell className="text-right">{p.commission}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">No lab data yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Briefcase/> Health Coordinator Performance</CardTitle>
                     <CardDescription>Detailed log of appointments booked by coordinators.</CardDescription>
                </CardHeader>
                 <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Coordinator</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Refund Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partnerPerformanceData.healthCoordinators.length > 0 ? partnerPerformanceData.healthCoordinators.map((appt) => (
                                <TableRow key={appt.id}>
                                    <TableCell className="font-medium">{appt.coordinatorName}</TableCell>
                                    <TableCell>{appt.name}</TableCell>
                                    <TableCell>{appt.doctorName}</TableCell>
                                    <TableCell>{format(new Date(appt.appointmentDate), 'PP')}</TableCell>
                                    <TableCell>
                                        <Badge variant={appt.status === 'done' ? 'secondary' : (appt.status === 'cancelled' || appt.status === 'absent') ? 'destructive' : 'default'} className="capitalize">{appt.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{appt.refundStatus}</TableCell>
                                </TableRow>
                            )) : (
                                 <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No appointments booked by Health Coordinators for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity/> Recent Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="bg-slate-100 p-2 rounded-full">
                                <activity.icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-grow">
                                <p><span className="font-semibold">{activity.name}</span> {activity.action}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {format(new Date(activity.time), 'PP, p')}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-4">No recent activity.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
