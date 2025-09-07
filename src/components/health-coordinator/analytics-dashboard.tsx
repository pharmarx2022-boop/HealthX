
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { CalendarCheck, Users, Banknote } from 'lucide-react';

const chartData: any[] = [];

const chartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statCards = [
    {
        title: 'Total Appointments Booked',
        value: '0',
        icon: CalendarCheck,
        description: 'All-time appointments booked.',
    },
    {
        title: 'Patients Assisted',
        value: '0',
        icon: Users,
        description: 'Unique patients you have helped.',
    },
    {
        title: 'Total Commission Earned',
        value: 'INR 0.00',
        icon: Banknote,
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
                 <CardDescription>Your booking volume over the past 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                 {chartData.length > 0 ? (
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
                 ) : (
                    <div className="text-center text-muted-foreground p-8">No booking data yet.</div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}
