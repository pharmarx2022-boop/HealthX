

'use client';

import { useState, useEffect } from 'react';
import { getAllPendingUsers, updateUserStatus } from '@/lib/auth';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Check, X, Pill, Beaker, Briefcase, Stethoscope } from 'lucide-react';

export function ApprovalRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setRequests(getAllPendingUsers());
    }, []);

    const handleUpdateRequest = (userId: string, role: string, newStatus: 'approved' | 'rejected') => {
        updateUserStatus(userId, role, newStatus);
        setRequests(getAllPendingUsers()); // Refresh list
        toast({
            title: `Request ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
            description: `The user has been ${newStatus}.`,
        });
    };
    
    const getRoleIcon = (role: string) => {
        switch(role) {
            case 'doctor': return <Stethoscope className="h-4 w-4 text-muted-foreground" />;
            case 'lab': return <Beaker className="h-4 w-4 text-muted-foreground" />;
            case 'pharmacy': return <Pill className="h-4 w-4 text-muted-foreground" />;
            case 'health-coordinator': return <Briefcase className="h-4 w-4 text-muted-foreground" />;
            default: return null;
        }
    };
    
    const getRoleDisplayName = (role: string) => {
        return (role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator');
    };

    return (
        <div>
            {requests.length > 0 ? (
                 <div className="w-full overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">Date Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="font-medium">{req.fullName}</div>
                                        <div className="text-xs text-muted-foreground">{req.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(req.role)}
                                            <span>{getRoleDisplayName(req.role)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{format(new Date(req.dateJoined), 'PP')}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600" onClick={() => handleUpdateRequest(req.id, req.role, 'approved')}>
                                                <Check />
                                            </Button>
                                             <Button size="icon" variant="outline" className="h-8 w-8 text-red-600" onClick={() => handleUpdateRequest(req.id, req.role, 'rejected')}>
                                                <X />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No pending approval requests.</p>
            )}
        </div>
    );
}
