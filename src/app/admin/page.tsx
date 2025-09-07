
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithdrawalRequests } from '@/components/admin/withdrawal-requests';
import { TransactionHistory } from '@/components/admin/transaction-history';
import { ApprovalRequests } from '@/components/admin/approval-requests';

export default function AdminPage() {
  return (
     <div className="space-y-8">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, approvals, and withdrawals.</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Partner Approval Requests</CardTitle>
                        <CardDescription>
                            Approve or reject new partners who want to join the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApprovalRequests />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>
                            View all incoming payments from appointment bookings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionHistory />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8 lg:col-span-1">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Commission Withdrawal Requests</CardTitle>
                        <CardDescription>
                            Approve or reject requests from partners to withdraw their referral commissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WithdrawalRequests />
                    </CardContent>
                </Card>
            </div>
        </div>

    </div>
  );
}
