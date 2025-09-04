
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { CalendarCheck, Users } from 'lucide-react';

const chartData = [
  { month: 'January', bookings: 12 },
  { month: 'February', bookings: 19 },
  { month: 'March', bookings: 15 },
  { month: 'April', bookings: 21 },
  { month: 'May', bookings: 18 },
  { month: 'June', bookings: 25 },
];

const chartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statCards = [
    {
        title: 'Total Appointments Booked',
        value: '110',
        icon: CalendarCheck,
        description: 'All-time appointments booked.',
    },
    {
        title: 'Patients Assisted',
        value: '45',
        icon: Users,
        description: 'Unique patients you have helped.',
    },
    {
        title: 'Total Commission Earned',
        value: 'INR 5,500',
        icon: () => <span className="font-bold">INR</span>,
        description: 'Based on all completed bookings.',
    }
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8 mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Card>
            <CardHeader>
                <CardTitle>Booking Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
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
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
