
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithdrawalRequests } from '@/components/admin/withdrawal-requests';
import { Banknote } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  return (
     <div className="space-y-8">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Banknote /> Commission Withdrawal Requests</h1>
            <p className="text-muted-foreground">Approve or reject requests from partners to withdraw their referral commissions.</p>
        </div>
        
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Pending Withdrawals</CardTitle>
                <CardDescription>
                    Once approved, payouts must be processed manually outside of this platform. This tool is for tracking and approval purposes only.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <WithdrawalRequests />
            </CardContent>
        </Card>
    </div>
  );
}
