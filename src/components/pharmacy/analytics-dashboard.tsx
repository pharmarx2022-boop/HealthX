
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Users, Gift } from 'lucide-react';

const chartData = [
  { month: 'January', transactions: 152 },
  { month: 'February', transactions: 189 },
  { month: 'March', transactions: 175 },
  { month: 'April', transactions: 210 },
  { month: 'May', transactions: 198 },
  { month: 'June', transactions: 240 },
];

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const statCards = [
    {
        title: 'Total HealthPoints Collected',
        value: 'INR 25,600',
        icon: () => <span className="font-bold">INR</span>,
        description: 'All-time points collected from bills.',
    },
    {
        title: 'Patients Served',
        value: '452',
        icon: Users,
        description: 'Total transactions processed.',
    },
    {
        title: 'Total Commission Earned',
        value: 'INR 2,500',
        icon: Gift,
        description: 'From referring new partners.',
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
                <CardTitle>Transaction Analytics</CardTitle>
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
                    <Bar dataKey="transactions" fill="var(--color-transactions)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
