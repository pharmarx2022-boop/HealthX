
'use client';

import { mockPatients } from "@/components/doctor/patient-list";

const TRANSACTIONS_KEY_PREFIX = 'transactions_';

export type Transaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: Date;
}

// Initialize with cashback from completed consultations
function initializeTransactions(patientId: string) {
    const patientAppointments = mockPatients.filter(p => p.id === '1' && p.name.toLowerCase().includes(patientId.split('_')[0])); // Simple check for demo
    
    const initialCredits = patientAppointments
        .filter(appt => appt.status === 'done' && appt.refundStatus === 'Refunded')
        .map(appt => ({
            type: 'credit' as 'credit',
            amount: appt.consultationFee,
            description: `Cashback from consultation on ${new Date(appt.appointmentDate).toLocaleDateString()}`,
            date: new Date(appt.appointmentDate),
        }));

    sessionStorage.setItem(TRANSACTIONS_KEY_PREFIX + patientId, JSON.stringify(initialCredits));
    return initialCredits;
}


export function getTransactionHistory(patientId: string): { balance: number; transactions: Transaction[] } {
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    let transactions: Transaction[] = [];

    const storedTransactions = sessionStorage.getItem(key);
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
    } else {
        transactions = initializeTransactions(patientId);
    }
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
}

export function recordTransaction(patientId: string, transaction: Omit<Transaction, 'date'> & { date: Date }) {
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    const history = getTransactionHistory(patientId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
