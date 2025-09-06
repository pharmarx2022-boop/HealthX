
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

// In a real app, this would fetch from Firestore.
async function getStoredTransactions(patientId: string): Promise<Transaction[]> {
    if (typeof window === 'undefined') return [];
    // For demo purposes, we'll continue using sessionStorage.
    // In production, you'd replace this with a Firestore query.
    const storedTransactions = sessionStorage.getItem(TRANSACTIONS_KEY_PREFIX + patientId);
    if (storedTransactions) {
        return JSON.parse(storedTransactions).map((t: any) => ({ ...t, date: new Date(t.date) }));
    }
    return [];
}

export async function getTransactionHistory(patientId: string): Promise<{ balance: number; transactions: Transaction[] }> {
    const transactions = await getStoredTransactions(patientId);
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
}

export async function recordTransaction(patientId: string, transaction: Omit<Transaction, 'date' | 'id'> & { date: Date }) {
    if (typeof window === 'undefined') return;
    const key = TRANSACTIONS_KEY_PREFIX + patientId;
    const history = await getTransactionHistory(patientId);
    const newTransaction = {
        ...transaction,
        id: `txn_${Date.now()}`
    }
    const updatedTransactions = [...history.transactions, newTransaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
