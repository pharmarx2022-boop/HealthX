

'use client';

import { useState, useEffect } from 'react';
import { getAllPendingUsers, updateUserStatus, verifyAdmin } from '@/lib/auth';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Check, X, Pill, Beaker, Briefcase, Stethoscope, FileText, IdCard, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ApprovalRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRequests = async () => {
            if (verifyAdmin()) {
                const pendingUsers = await getAllPendingUsers();
                setRequests(pendingUsers);
            }
            setIsLoading(false);
        }
        fetchRequests();
    }, []);

    const handleUpdateRequest = async (userId: string, role: string, newStatus: 'approved' | 'rejected') => {
        if (!verifyAdmin()) {
            toast({
                title: "Permission Denied",
                description: "You do not have permission to perform this action.",
                variant: "destructive",
            });
            return;
        }

        await updateUserStatus(userId, role, newStatus);
        const pendingUsers = await getAllPendingUsers();
        setRequests(pendingUsers); // Refresh list
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

    if (isLoading) {
        return (
             <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin" />
                <p className="ml-2">Loading requests...</p>
            </div>
        )
    }

    return (
        <div>
            {requests.length > 0 ? (
                 <div className="w-full overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">Verification</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="font-medium">{req.fullName}</div>
                                        <div className="text-xs text-muted-foreground break-all">{req.email}</div>
                                        <div className="text-xs text-muted-foreground hidden md:block">Joined: {format(new Date(req.dateJoined), 'PP')}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(req.role)}
                                            <span>{getRoleDisplayName(req.role)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {req.role === 'health-coordinator' ? (
                                             req.aadharNumber ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono flex items-center gap-2"><IdCard className="w-4 h-4" /> Aadhar: {req.aadharNumber}</span>
                                                    {(req.aadharFrontImage || req.aadharBackImage) && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="link" className="p-0 h-auto text-xs justify-start">
                                                                    <FileText className="mr-1 h-3 w-3" /> View Aadhar Images
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Aadhar Verification for {req.fullName}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                                    {req.aadharFrontImage && <div className="space-y-2"><p className="text-sm font-medium text-center">Front</p><div className="relative w-full aspect-video rounded-md overflow-hidden border"><Image src={req.aadharFrontImage} alt="Aadhar Front" fill className="object-contain"/></div></div>}
                                                                    {req.aadharBackImage && <div className="space-y-2"><p className="text-sm font-medium text-center">Back</p><div className="relative w-full aspect-video rounded-md overflow-hidden border"><Image src={req.aadharBackImage} alt="Aadhar Back" fill className="object-contain"/></div></div>}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Not provided</span>
                                            )
                                        ) : (
                                            req.registrationNumber ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono">Reg #: {req.registrationNumber}</span>
                                                    {req.registrationCertificate && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="link" className="p-0 h-auto text-xs justify-start">
                                                                    <FileText className="mr-1 h-3 w-3" /> View Certificate
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Registration Certificate for {req.fullName}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="relative w-full aspect-[4/3] mt-4 rounded-md overflow-hidden border">
                                                                    <Image src={req.registrationCertificate} alt="Registration Certificate" fill className="object-contain"/>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Not provided</span>
                                            )
                                        )}
                                    </TableCell>
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
