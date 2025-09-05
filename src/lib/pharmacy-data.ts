
'use client';

const TRANSACTIONS_KEY_PREFIX = 'pharmacy_transactions_';

export type PharmacyTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

const mockInitialTransactions: PharmacyTransaction[] = [];

function initializeTransactions(pharmacyId: string): PharmacyTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + pharmacyId;
    sessionStorage.setItem(key, JSON.stringify(mockInitialTransactions));
    return mockInitialTransactions;
}

export function getPharmacyData(pharmacyId: string): { balance: number; transactions: PharmacyTransaction[] } {
    const key = TRANSACTIONS_KEY_PREFIX + pharmacyId;
    let transactions: PharmacyTransaction[] = [];

    const storedTransactions = sessionStorage.getItem(key);
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
    } else {
        transactions = initializeTransactions(pharmacyId);
    }
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export function recordCommission(pharmacyId: string, transaction: PharmacyTransaction) {
    const key = TRANSACTIONS_KEY_PREFIX + pharmacyId;
    const history = getPharmacyData(pharmacyId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
