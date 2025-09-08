

'use client';

// In production, this data would be fetched from a secure backend API.

export type Transaction = {
    id?: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: Date;
    reviewed?: boolean;
    partnerType?: 'lab' | 'pharmacy';
    partnerId?: string;
    partnerName?: string;
}

const getTransactionsKey = (patientId: string) => `transactions_${patientId}`;

export function getTransactionHistory(patientId: string): { balance: number; transactions: Transaction[] } {
    if (typeof window === 'undefined') {
        return { balance: 0, transactions: [] };
    }
    const key = getTransactionsKey(patientId);
    const stored = localStorage.getItem(key);
    const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

    const balance = transactions.reduce((acc, tx) => {
        if (tx.type === 'credit') {
            return acc + tx.amount;
        } else {
            return acc - tx.amount;
        }
    }, 0);

    return { balance, transactions: transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
}

export function recordTransaction(patientId: string, transaction: Omit<Transaction, 'date' | 'id'> & { date: Date }) {
    if (typeof window === 'undefined') return;
    
    const { balance, transactions } = getTransactionHistory(patientId);
    const newTransaction: Transaction = {
        ...transaction,
        id: `hp_txn_${Date.now()}`,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    const key = getTransactionsKey(patientId);
    localStorage.setItem(key, JSON.stringify(updatedTransactions));
}
