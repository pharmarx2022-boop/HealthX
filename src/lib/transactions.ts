

'use client';

const TRANSACTIONS_KEY_PREFIX = 'transactions_';

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

function getStoredTransactions(patientId: string): Transaction[] {
    if (typeof window === 'undefined') return [];
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored).map((t: any) => ({ ...t, date: new Date(t.date) })) : [];
}

function saveTransactions(patientId: string, transactions: Transaction[]) {
     if (typeof window === 'undefined') return;
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    sessionStorage.setItem(key, JSON.stringify(transactions));
}

export function getTransactionHistory(patientId: string): { balance: number; transactions: Transaction[] } {
    const transactions = getStoredTransactions(patientId);
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
}

export function recordTransaction(patientId: string, transaction: Omit<Transaction, 'date' | 'id'> & { date: Date }) {
    const transactions = getStoredTransactions(patientId);
    const newTransaction = {
        ...transaction,
        id: `txn_${Date.now()}`
    };
    saveTransactions(patientId, [...transactions, newTransaction]);
}
