
'use client';

import { checkHealthCoordinatorMilestone } from "./referrals";
import { recordTransaction } from "./transactions";

const TRANSACTIONS_KEY_PREFIX = 'health_coordinator_transactions_';

export type HealthCoordinatorTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

function getStoredTransactions(healthCoordinatorId: string): HealthCoordinatorTransaction[] {
    if (typeof window === 'undefined') return [];
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveTransactions(healthCoordinatorId: string, transactions: HealthCoordinatorTransaction[]) {
     if (typeof window === 'undefined') return;
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    sessionStorage.setItem(key, JSON.stringify(transactions));
}

export function getHealthCoordinatorData(healthCoordinatorId: string): { balance: number; transactions: HealthCoordinatorTransaction[] } {
    const transactions = getStoredTransactions(healthCoordinatorId);
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export function convertPointsToCash(healthCoordinatorId: string) {
    const { balance, transactions } = getHealthCoordinatorData(healthCoordinatorId);
    if (balance <= 0) return;

    const newTransaction: HealthCoordinatorTransaction = {
        type: 'debit',
        amount: balance,
        description: `Conversion to cash request (Admin Approval Pending)`,
        date: new Date().toISOString(),
    };

    saveTransactions(healthCoordinatorId, [...transactions, newTransaction]);
    // In a real app, this would also create a withdrawal request for the admin.
}
