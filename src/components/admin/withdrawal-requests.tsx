
'use client';

import { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalRequest, type WithdrawalRequest } from '@/lib/commission-wallet';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { IndianRupee, Check, X } from 'lucide-react';

export function WithdrawalRequests() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setRequests(getWithdrawalRequests());
    }, []);

    const handleUpdateRequest = (requestId: string, newStatus: 'approved' | 'rejected') => {
        updateWithdrawalRequest(requestId, newStatus);
        setRequests(getWithdrawalRequests()); // Refresh list
        toast({
            title: `Request ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
            description: `The withdrawal request has been updated.`,
        });
    };

    return (
        <div>
            {requests.length > 0 ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <div className="font-medium">{req.userName}</div>
                                    <div className="text-xs text-muted-foreground">{req.userId}</div>
                                </TableCell>
                                <TableCell>₹{req.amount.toFixed(2)}</TableCell>
                                <TableCell>{format(new Date(req.date), 'PP')}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        req.status === 'approved' ? 'secondary' :
                                        req.status === 'rejected' ? 'destructive' :
                                        'default'
                                    } className="capitalize">{req.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {req.status === 'pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600" onClick={() => handleUpdateRequest(req.id, 'approved')}>
                                                <Check />
                                            </Button>
                                             <Button size="icon" variant="outline" className="h-8 w-8 text-red-600" onClick={() => handleUpdateRequest(req.id, 'rejected')}>
                                                <X />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            ) : (
                <p className="text-center text-muted-foreground py-8">No pending withdrawal requests.</p>
            )}
        </div>
    );
}
