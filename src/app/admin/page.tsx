

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RefundTool } from '@/components/admin/refund-tool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithdrawalRequests } from '@/components/admin/withdrawal-requests';
import { HealthPointWithdrawals } from '@/components/admin/healthpoint-withdrawals';
import { TransactionHistory } from '@/components/admin/transaction-history';
import { ApprovalRequests } from '@/components/admin/approval-requests';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users, approvals, and refunds.</p>
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
                            <CardTitle>AI-Assisted Refund Tool</CardTitle>
                            <CardDescription>
                                Use this tool to quickly verify user refund requests by looking up consultation history and wallet balance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RefundTool />
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
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Health Point Withdrawal Requests</CardTitle>
                            <CardDescription>
                               Approve or reject requests from Labs & Pharmacies to withdraw their collected points.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HealthPointWithdrawals />
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
