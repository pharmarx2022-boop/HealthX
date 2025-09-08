
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApprovalRequests } from '@/components/admin/approval-requests';
import { ShieldCheck } from 'lucide-react';

export default function AdminApprovalsPage() {
  return (
     <div className="space-y-8">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><ShieldCheck /> Partner Approval Requests</h1>
            <p className="text-muted-foreground">Approve or reject new partners who want to join the platform.</p>
        </div>
        
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                    Review the details of each partner and their verification documents before making a decision.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ApprovalRequests />
            </CardContent>
        </Card>
    </div>
  );
}
