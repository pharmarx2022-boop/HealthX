

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
    // This function is now a placeholder.
    console.warn("Using placeholder for getStoredTransactions. Connect to your database.");
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
    console.warn("Using placeholder for recordTransaction. Connect to your database.");
    // In a real app, this function would write to Firestore.
}
