
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Briefcase, Banknote, ShieldCheck, Stethoscope, Pill, Beaker } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';

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
        <Card>
            <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
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
