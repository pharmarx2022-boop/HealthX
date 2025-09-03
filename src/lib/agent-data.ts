
'use client';

const TRANSACTIONS_KEY_PREFIX = 'agent_transactions_';

export type AgentTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
}

const mockInitialTransactions: AgentTransaction[] = [
    {
        type: 'credit',
        amount: 50,
        description: 'Commission from booking for Rohan Sharma',
        date: new Date('2024-07-20T10:00:00Z'),
    },
    {
        type: 'credit',
        amount: 75,
        description: 'Commission from booking for Priya Mehta',
        date: new Date('2024-07-21T11:30:00Z'),
    }
];

function initializeTransactions(agentId: string): AgentTransaction[] {
    const key = TRANSACTIONS_KEY_PREFIX + agentId;
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
