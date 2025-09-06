
'use client';

import { checkHealthCoordinatorMilestone } from "./referrals";

const TRANSACTIONS_KEY_PREFIX = 'health_coordinator_transactions_';

export type HealthCoordinatorTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

// MOCK DATA: Simulate that this health coordinator has completed some bookings
const mockInitialTransactions: HealthCoordinatorTransaction[] = Array.from({ length: 5 }, (_, i) => ({
    type: 'credit' as 'credit',
    amount: 50 + i,
    description: `Commission from booking #${i+1}`,
    date: new Date(`2024-07-${i+1}T10:00:00Z`),
}));


function initializeTransactions(healthCoordinatorId: string): HealthCoordinatorTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    sessionStorage.setItem(key, JSON.stringify(mockInitialTransactions));
    return mockInitialTransactions;
}

export async function getHealthCoordinatorData(healthCoordinatorId: string): Promise<{ balance: number; transactions: HealthCoordinatorTransaction[] }> {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    let transactions: HealthCoordinatorTransaction[] = [];

    // This part remains sessionStorage-based for demo purposes.
    // In production, you'd fetch from Firestore.
    const storedTransactions = sessionStorage.getItem(key);
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
    } else {
        transactions = initializeTransactions(healthCoordinatorId);
    }
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export async function convertPointsToCash(healthCoordinatorId: string) {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    const { balance, transactions } = await getHealthCoordinatorData(healthCoordinatorId);

    if (balance <= 0) return;

    const conversionTransaction: HealthCoordinatorTransaction = {
        type: 'debit',
        amount: balance,
        description: 'Cash conversion request to admin',
        date: new Date(),
    };

    const updatedTransactions = [...transactions, conversionTransaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}

export async function recordHealthCoordinatorCommission(healthCoordinatorId: string, transaction: Omit<HealthCoordinatorTransaction, 'date'> & { date: Date }) {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    const history = await getHealthCoordinatorData(healthCoordinatorId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
    await checkHealthCoordinatorMilestone(healthCoordinatorId);
}
