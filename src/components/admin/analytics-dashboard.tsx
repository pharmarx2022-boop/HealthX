
'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Calendar, Banknote } from 'lucide-react';
import { TransactionHistory } from './transaction-history';

const chartData: any[] = [];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statCards = [
    {
        title: 'Total Revenue',
        value: 'INR 0.00',
        icon: Banknote,
        description: 'From platform fees on all transactions.',
    },
    {
        title: 'Active Patients',
        value: '0',
        icon: Users,
        description: 'Patients with recent activity.',
    },
    {
        title: 'Total Appointments',
        value: '0',
        icon: Calendar,
        description: 'All-time completed appointments.',
    }
]

export function AnalyticsDashboard() {
  // In a production app, the data for these cards and charts would be fetched
  // from a backend API with proper date filtering (daily, weekly, monthly, yearly).
  // For this prototype, we are showing a placeholder structure.
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
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Your revenue from platform fees over the past 6 months.</CardDescription>
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
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                 ) : (
                    <div className="text-center text-muted-foreground p-8">No revenue data yet to display.</div>
                 )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Security Deposit Transactions</CardTitle>
                <CardDescription>A log of all security deposits paid by patients for appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <TransactionHistory />
            </CardContent>
        </Card>
    </div>
  );
}
