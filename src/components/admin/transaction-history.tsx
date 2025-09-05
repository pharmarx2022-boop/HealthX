
'use client';

import { useState, useEffect } from 'react';
import { mockPatients } from '@/components/doctor/patient-list';
import { initialDoctors } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

type Transaction = {
    id: string;
    patientName: string;
    doctorName: string;
    amount: number;
    date: Date;
    status: 'Success' | 'Failed' | 'Pending';
};

export function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // This is a mock data generation. In a real app, this data would come from your payment gateway API.
        const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]') || mockPatients;
        const allDoctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]') || initialDoctors;
        
        const generatedTransactions = allAppointments
            .filter((appt: any) => appt.status === 'done' || appt.status === 'upcoming')
            .map((appt: any) => {
                const doctor = allDoctors.find((doc: any) => doc.id === appt.doctorId);
                return {
                    id: appt.transactionId || `txn_${appt.id}`,
                    patientName: appt.name,
                    doctorName: doctor?.name || 'Unknown Doctor',
                    amount: appt.consultationFee,
                    date: new Date(appt.appointmentDate),
                    status: 'Success',
                };
            });
            
        setTransactions(generatedTransactions.sort((a,b) => b.date.getTime() - a.date.getTime()));

    }, []);

    return (
        <div>
            {transactions.length > 0 ? (
                 <div className="w-full overflow-x-auto">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                 <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.patientName}</TableCell>
                                    <TableCell className="hidden md:table-cell">{tx.doctorName}</TableCell>
                                    <TableCell>INR {tx.amount.toFixed(2)}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{format(tx.date, 'PP, p')}</TableCell>
                                    <TableCell><Badge variant="secondary">{tx.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No transactions found.</p>
            )}
        </div>
    );
}
