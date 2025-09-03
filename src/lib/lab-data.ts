
'use client';

const TRANSACTIONS_KEY_PREFIX = 'lab_transactions_';

export type LabTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

const mockInitialTransactions: LabTransaction[] = [];

function initializeTransactions(labId: string): LabTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + labId;
    sessionStorage.setItem(key, JSON.stringify(mockInitialTransactions));
    return mockInitialTransactions;
}

export function getLabData(labId: string): { balance: number; transactions: LabTransaction[] } {
    const key = TRANSACTIONS_KEY_PREFIX + labId;
    let transactions: LabTransaction[] = [];

    const storedTransactions = sessionStorage.getItem(key);
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
    } else {
        transactions = initializeTransactions(labId);
    }
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export function recordCommission(labId: string, transaction: Omit<LabTransaction, 'date'> & { date: Date }) {
    const key = TRANSACTIONS_KEY_PREFIX + labId;
    const history = getLabData(labId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
