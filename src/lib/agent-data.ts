
'use client';

const TRANSACTIONS_KEY_PREFIX = 'agent_transactions_';

export type AgentTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

// MOCK DATA: Simulate that this agent has completed 10 bookings to trigger referral reward for their referrer
const mockInitialTransactions: AgentTransaction[] = Array.from({ length: 10 }, (_, i) => ({
    type: 'credit' as 'credit',
    amount: 50 + i,
    description: `Commission from booking #${i+1}`,
    date: new Date(`2024-07-${i+1}T10:00:00Z`),
}));


function initializeTransactions(agentId: string): AgentTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + agentId;
    // In a real app, you would check if this agent was referred and if their referrer's reward is pending
    // For demo, we will assume agent_1 was referred by pharm1
    if(agentId === 'agent_1') {
        const rewardDetails = {
            referrerId: 'pharm1',
            referredUserId: 'agent_1',
            type: 'agent',
            status: 'pending',
            rewardAmount: 200,
            milestone: 10, // 10 bookings needed
            currentProgress: 10,
        };
        // Check if milestone is reached
        if (rewardDetails.currentProgress >= rewardDetails.milestone && rewardDetails.status === 'pending') {
            console.log(`Agent ${agentId} reached the referral milestone. Crediting referrer ${rewardDetails.referrerId}.`);
            // This would call a backend function. We simulate it here.
            // In a real app, this would be a server-side check.
             import('./commission-wallet').then(wallet => {
                wallet.recordCommission(rewardDetails.referrerId, {
                    type: 'credit',
                    amount: rewardDetails.rewardAmount,
                    description: `Referral bonus for new agent: ${agentId}`,
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

export function getAgentData(agentId: string): { balance: number; transactions: AgentTransaction[] } {
    const key = TRANSACTIONS_KEY_PREFIX + agentId;
    let transactions: AgentTransaction[] = [];

    const storedTransactions = sessionStorage.getItem(key);
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
    } else {
        transactions = initializeTransactions(agentId);
    }
    
    const balance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === 'credit' ? curr.amount : -curr.amount);
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export function convertPointsToCash(agentId: string) {
    const key = TRANSACTIONS_KEY_PREFIX + agentId;
    const { balance, transactions } = getAgentData(agentId);

    if (balance <= 0) return;

    const conversionTransaction: AgentTransaction = {
        type: 'debit',
        amount: balance,
        description: 'Cash conversion request to admin',
        date: new Date(),
    };

    const updatedTransactions = [...transactions, conversionTransaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}

export function recordAgentCommission(agentId: string, transaction: Omit<AgentTransaction, 'date'> & { date: Date }) {
    const key = TRANSACTIONS_KEY_PREFIX + agentId;
    const history = getAgentData(agentId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}
