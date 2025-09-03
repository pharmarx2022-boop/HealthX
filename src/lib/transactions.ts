
'use client';

const TRANSACTIONS_KEY_PREFIX = 'transactions_';

export type Transaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: Date;
}

// Function to get transactions from sessionStorage
function getStoredTransactions(patientId: string): Transaction[] {
    if (typeof window === 'undefined') return [];
    const storedTransactions = sessionStorage.getItem(TRANSACTIONS_KEY_PREFIX + patientId);
    if (storedTransactions) {
        return JSON.parse(storedTransactions).map((t: any) => ({ ...t, date: new Date(t.date) }));
    }
    return [];
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

export function recordTransaction(patientId: string, transaction: Omit<Transaction, 'date'> & { date: Date }) {
    if (typeof window === 'undefined') return;
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    const history = getTransactionHistory(patientId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
