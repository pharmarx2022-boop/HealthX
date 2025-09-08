
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Banknote, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
     <div className="space-y-8">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">An overview of key platform management areas.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><ShieldCheck/> Partner Approvals</CardTitle>
                    <CardDescription>
                        Review and approve new doctors, labs, and pharmacies who want to join the platform. Your approval is required before they can become active.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/approvals">Manage Approvals <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>

             <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Banknote/> Withdrawal Requests</CardTitle>
                    <CardDescription>
                        Process commission withdrawal requests from Health Coordinators, Labs, and Pharmacies. Payouts must be handled externally.
                    </CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Button asChild>
                        <Link href="/admin/withdrawals">Manage Withdrawals <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
