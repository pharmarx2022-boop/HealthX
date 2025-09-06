

'use client';

import { checkHealthCoordinatorMilestone } from "./referrals";

const TRANSACTIONS_KEY_PREFIX = 'health_coordinator_transactions_';

export type HealthCoordinatorTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

async function getStoredTransactions(healthCoordinatorId: string): Promise<HealthCoordinatorTransaction[]> {
    console.warn("Using placeholder for health coordinator transactions. Connect to your database.");
    return [];
}

export async function getHealthCoordinatorData(healthCoordinatorId: string): Promise<{ balance: number; transactions: HealthCoordinatorTransaction[] }> {
    const transactions = await getStoredTransactions(healthCoordinatorId);
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export async function convertPointsToCash(healthCoordinatorId: string) {
    const { balance, transactions } = await getHealthCoordinatorData(healthCoordinatorId);
    if (balance <= 0) return;
    
    console.warn("Using placeholder for cash conversion. Connect to your database.");
    // In a real app, this would create a debit transaction and likely a withdrawal request for the admin.
}

export async function recordHealthCoordinatorCommission(healthCoordinatorId: string, transaction: Omit<HealthCoordinatorTransaction, 'date'> & { date: Date }) {
    console.warn("Using placeholder for health coordinator commission. Connect to your database.");
    // In a real app, you would add the transaction to the user's subcollection in Firestore.
    await checkHealthCoordinatorMilestone(healthCoordinatorId);
}
