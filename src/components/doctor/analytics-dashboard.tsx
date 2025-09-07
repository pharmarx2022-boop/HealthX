
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Calendar, Banknote } from 'lucide-react';

const chartData: any[] = [];

const chartConfig = {
  consultations: {
    label: 'Consultations',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statCards = [
    {
        title: 'Total Patients',
        value: '0',
        icon: Users,
        description: 'All patients in your list.',
    },
    {
        title: 'Upcoming Appointments',
        value: '0',
        icon: Calendar,
        description: 'Appointments scheduled for the future.',
    },
    {
        title: 'Total Earnings (Mock)',
        value: 'INR 0.00',
        icon: Banknote,
        description: 'Based on completed consultations.',
    }
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
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
                <CardTitle>Consultation Analytics</CardTitle>
                <CardDescription>Your consultation volume over the past 6 months.</CardDescription>
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
                            <Bar dataKey="consultations" fill="var(--color-consultations)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                 ) : (
                    <div className="text-center text-muted-foreground p-8">No consultation data yet.</div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}
