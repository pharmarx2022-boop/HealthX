
'use client';

import { useState, useEffect } from 'react';
import { getWithdrawalRequests, updateWithdrawalRequest, type WithdrawalRequest } from '@/lib/commission-wallet';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { verifyAdmin } from '@/lib/auth';

export function WithdrawalRequests() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (verifyAdmin()) {
            setRequests(getWithdrawalRequests());
        }
    }, []);

    const handleUpdateRequest = (requestId: string, newStatus: 'approved' | 'rejected') => {
        if (!verifyAdmin()) {
            toast({
                title: "Permission Denied",
                description: "You do not have permission to perform this action.",
                variant: "destructive",
            });
            return;
        }
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
                 <div className="w-full overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
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
                                    <TableCell>INR {req.amount.toFixed(2)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{format(new Date(req.date), 'PP')}</TableCell>
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
                 </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No pending withdrawal requests.</p>
            )}
        </div>
    );
}
