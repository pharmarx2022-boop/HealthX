
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Briefcase, Banknote, ShieldCheck, Stethoscope, Pill, Beaker, Calendar as CalendarIcon, UserX, UserCheck, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isToday, isSameDay } from 'date-fns';
import { initialDoctors, initialLabs, initialPharmacies, mockPatientData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { getAllUsersForAdmin, type UserData } from '@/lib/auth';
import { getTransactionHistory } from '@/lib/transactions';
import { getCommissionWalletData } from '@/lib/commission-wallet';

const userGrowthData = [
  { month: 'January', users: 12 },
  { month: 'February', users: 19 },
  { month: 'March', users: 15 },
  { month: 'April', users: 21 },
  { month: 'May', users: 18 },
  { month: 'June', users: 25 },
];

const userGrowthChartConfig = {
  users: {
    label: 'New Users',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const revenueData = [
  { name: 'Doctor Consultations', value: 400, fill: 'var(--color-consultations)' },
  { name: 'Lab Commissions', value: 300, fill: 'var(--color-labs)' },
  { name: 'Pharmacy Commissions', value: 300, fill: 'var(--color-pharmacies)' },
  { name: 'Health Coordinator Fees', value: 200, fill: 'var(--color-coordinators)' },
];

const revenueChartConfig = {
  consultations: { label: 'Doctor Consultations', color: 'hsl(var(--chart-1))' },
  labs: { label: 'Lab Commissions', color: 'hsl(var(--chart-2))' },
  pharmacies: { label: 'Pharmacy Commissions', color: 'hsl(var(--chart-3))' },
  coordinators: { label: 'Health Coordinator Fees', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;


const statCards = [
    {
        title: 'Total Users',
        value: '1,254',
        icon: Users,
        description: '+20.1% from last month',
    },
    {
        title: 'Active Partners',
        value: '78',
        icon: Briefcase,
        description: '+180.1% from last month',
    },
    {
        title: 'Total Revenue',
        value: 'INR 2,38,900',
        icon: Banknote,
        description: '+19% from last month',
    },
    {
        title: 'Pending Approvals',
        value: '5',
        icon: ShieldCheck,
        description: '3 doctors, 2 labs',
    }
];

const recentActivities = [
    {
        icon: Stethoscope,
        name: 'Dr. Priya Patel',
        action: 'joined as a new doctor.',
        time: '2024-08-15T10:00:00Z'
    },
    {
        icon: Pill,
        name: 'Wellness Forever',
        action: 'had their account approved.',
        time: '2024-08-15T09:30:00Z'
    },
    {
        icon: Users,
        name: 'Rohan Sharma',
        action: 'completed an appointment.',
        time: '2024-08-15T08:00:00Z'
    },
    {
        icon: Beaker,
        name: 'Metropolis Labs',
        action: 'requested a withdrawal of INR 5,000.',
        time: '2024-08-14T15:00:00Z'
    }
]

export function AnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  React.useEffect(() => {
    // In a real app, this data would be fetched once and stored in a context/state manager
    const users = getAllUsersForAdmin();
    setAllUsers(users);
  }, []);

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
    return initialDoctors.map(doctor => {
        const doctorAppointments = timeFilteredAppointments.filter(appt => appt.doctorId === doctor.id);
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
    }).sort((a,b) => b.revenue - a.revenue);
  }, [timeFilteredAppointments]);
  
  const partnerPerformanceData = useMemo(() => {
    const labs = initialLabs.map(lab => {
      // Logic for lab performance (e.g., tests conducted, revenue from commissions)
      return { id: lab.id, name: lab.name, type: 'Lab', metric1: Math.floor(Math.random() * 50), metric2: `INR ${(Math.random() * 5000).toFixed(2)}` };
    });

    const pharmacies = initialPharmacies.map(pharmacy => {
      // Logic for pharmacy performance (e.g., orders fulfilled, revenue from commissions)
      return { id: pharmacy.id, name: pharmacy.name, type: 'Pharmacy', metric1: Math.floor(Math.random() * 100), metric2: `INR ${(Math.random() * 8000).toFixed(2)}` };
    });
    
    const healthCoordinators = allUsers.filter(u => u.role === 'health-coordinator').map(hc => {
        const bookings = timeFilteredAppointments.filter(appt => appt.healthCoordinatorId === hc.id && appt.status === 'done').length;
        const earnings = bookings * 50; // Mock earning logic
        return { id: hc.id, name: hc.fullName, type: 'Health Coordinator', metric1: bookings, metric2: `INR ${earnings.toFixed(2)}` };
    });

    return { labs, pharmacies, healthCoordinators };
  }, [timeFilteredAppointments, allUsers]);

  const handleTimeFilterChange = (value: string) => {
      setTimeFilter(value);
      setSelectedDate(null); // Clear specific date when preset is chosen
  }

  const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date || null);
      setTimeFilter('custom'); // Set to custom to indicate a date is picked
  }
  
  const renderFilterControls = () => (
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full sm:w-[240px] justify-start text-left font-normal",
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
            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
            </Select>
        </div>
  );

  return (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
                 <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>New User Growth</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
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
                    <CardDescription>Sources of all platform income.</CardDescription>
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
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                            {doctorPerformanceData.length > 0 ? doctorPerformanceData.map((doctor) => (
                                <TableRow key={doctor.id}>
                                    <TableCell>
                                        <div className="font-medium">{doctor.name}</div>
                                        <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{doctor.completed}</TableCell>
                                    <TableCell className="text-center font-medium">{doctor.cancelled}</TableCell>
                                    <TableCell className="text-center font-medium">{doctor.absent}</TableCell>
                                    <TableCell className="text-right font-medium">INR {doctor.revenue.toFixed(2)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No appointment data for the selected period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                 </div>
            </CardContent>
        </Card>

        {/* Other Partner Performance */}
         <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Pill/> Pharmacy Performance</CardTitle>
                     <CardDescription>Transaction volumes and earnings.</CardDescription>
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
                            {partnerPerformanceData.pharmacies.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="text-center">{p.metric1}</TableCell>
                                    <TableCell className="text-right">{p.metric2}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Beaker/> Lab Performance</CardTitle>
                     <CardDescription>Report uploads and earnings.</CardDescription>
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
                            {partnerPerformanceData.labs.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="text-center">{p.metric1}</TableCell>
                                    <TableCell className="text-right">{p.metric2}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Briefcase/> Health Coordinator Performance</CardTitle>
                     <CardDescription>Bookings and earnings.</CardDescription>
                </CardHeader>
                 <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Coordinator</TableHead>
                                <TableHead className="text-center">Completed Bookings</TableHead>
                                <TableHead className="text-right">Total Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partnerPerformanceData.healthCoordinators.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell className="text-center">{p.metric1}</TableCell>
                                    <TableCell className="text-right">{p.metric2}</TableCell>
                                </TableRow>
                            ))}
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
                    {recentActivities.map((activity, index) => (
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
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
