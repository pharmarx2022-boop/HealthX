
'use client';

const TRANSACTIONS_KEY_PREFIX = 'health_coordinator_transactions_';

export type HealthCoordinatorTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

// MOCK DATA: Simulate that this health coordinator has completed 10 bookings to trigger referral reward for their referrer
const mockInitialTransactions: HealthCoordinatorTransaction[] = Array.from({ length: 10 }, (_, i) => ({
    type: 'credit' as 'credit',
    amount: 50 + i,
    description: `Commission from booking #${i+1}`,
    date: new Date(`2024-07-${i+1}T10:00:00Z`),
}));


function initializeTransactions(healthCoordinatorId: string): HealthCoordinatorTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    // In a real app, you would check if this health coordinator was referred and if their referrer's reward is pending
    // For demo, we will assume health_coordinator_1 was referred by pharm1
    if(healthCoordinatorId === 'health_coordinator_1') {
        const rewardDetails = {
            referrerId: 'pharm1',
            referredUserId: 'health_coordinator_1',
            type: 'health-coordinator',
            status: 'pending',
            rewardAmount: 200,
            milestone: 10, // 10 bookings needed
            currentProgress: 10,
        };
        // Check if milestone is reached
        if (rewardDetails.currentProgress >= rewardDetails.milestone && rewardDetails.status === 'pending') {
            console.log(`Health Coordinator ${healthCoordinatorId} reached the referral milestone. Crediting referrer ${rewardDetails.referrerId}.`);
            // This would call a backend function. We simulate it here.
            // In a real app, this would be a server-side check.
             import('./commission-wallet').then(wallet => {
                wallet.recordCommission(rewardDetails.referrerId, {
                    type: 'credit',
                    amount: rewardDetails.rewardAmount,
                    description: `Referral bonus for new health coordinator: ${healthCoordinatorId}`,
                    date: new Date(),
                    status: 'success'
                });
            });
            // Update referral status to completed
            rewardDetails.status = 'completed';
        }
    }


    sessionStorage.setItem(key, JSON.stringify(mockInitialTransactions));
    return mockInitialTransactions;
}

export function getHealthCoordinatorData(healthCoordinatorId: string): { balance: number; transactions: HealthCoordinatorTransaction[] } {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    let transactions: HealthCoordinatorTransaction[] = [];

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

export function convertPointsToCash(healthCoordinatorId: string) {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    const { balance, transactions } = getHealthCoordinatorData(healthCoordinatorId);

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

export function recordHealthCoordinatorCommission(healthCoordinatorId: string, transaction: Omit<HealthCoordinatorTransaction, 'date'> & { date: Date }) {
    const key = TRANSACTIONS_KEY_PREFIX + healthCoordinatorId;
    const history = getHealthCoordinatorData(healthCoordinatorId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
