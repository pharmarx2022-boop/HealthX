
'use client';

import { toast } from "@/hooks/use-toast";

const COMMISSION_WALLET_KEY_PREFIX = 'commission_wallet_';
const WITHDRAWAL_REQUESTS_KEY = 'commission_withdrawal_requests';


export type CommissionTransaction = {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
    status: 'success' | 'pending' | 'rejected' | 'paid';
}

export type WithdrawalRequest = {
    id: string;
    userId: string;
    userName: string; // for display in admin panel
    amount: number;
    date: string | Date;
    status: 'pending' | 'approved' | 'rejected';
}

// In a real app, this would fetch from Firestore.
async function getCommissionTransactions(userId: string): Promise<CommissionTransaction[]> {
    const key = COMMISSION_WALLET_KEY_PREFIX + userId;
    const stored = sessionStorage.getItem(key);
    if(stored) {
        return JSON.parse(stored).map((t: any) => ({...t, date: new Date(t.date)}));
    }
    return [];
}


export async function getCommissionWalletData(userId: string): Promise<{ balance: number; transactions: CommissionTransaction[] }> {
    const transactions = await getCommissionTransactions(userId);
    
    const balance = transactions.reduce((acc, curr) => {
        if(curr.type === 'credit' && curr.status === 'success') {
            return acc + curr.amount;
        }
        if(curr.type === 'debit' && (curr.status === 'paid' || curr.status === 'pending')) {
             return acc - curr.amount;
        }
        return acc;
    }, 0);

    return {
        balance: balance > 0 ? balance : 0,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
}

export async function recordCommission(userId: string, transaction: Omit<CommissionTransaction, 'date'> & { date: Date }) {
    const key = COMMISSION_WALLET_KEY_PREFIX + userId;
    const history = await getCommissionWalletData(userId);
    const updatedTransactions = [...history.transactions, transaction];
    sessionStorage.setItem(key, JSON.stringify(updatedTransactions));
}

export async function requestWithdrawal(userId: string, userName: string, amount: number) {
    const requests = await getWithdrawalRequests();
    const newRequest: WithdrawalRequest = {
        id: `withdraw_${Date.now()}`,
        userId,
        userName,
        amount,
        date: new Date(),
        status: 'pending',
    };
    
    const debitTransaction: CommissionTransaction = {
        type: 'debit',
        amount,
        description: `Withdrawal request`,
        date: new Date(),
        status: 'pending'
    };

    await recordCommission(userId, debitTransaction);

    sessionStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
    toast({
        title: "Withdrawal Request Sent",
        description: `Your request to withdraw INR ${amount.toFixed(2)} has been sent to the admin for approval.`
    })
}

export async function getWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    const stored = sessionStorage.getItem(WITHDRAWAL_REQUESTS_KEY);
    return stored ? JSON.parse(stored).map((r: any) => ({...r, date: new Date(r.date)})) : [];
}

export async function updateWithdrawalRequest(requestId: string, newStatus: 'approved' | 'rejected') {
    const requests = await getWithdrawalRequests();
    const request = requests.find(r => r.id === requestId);
    if(!request) return;

    const updatedRequests = requests.map(r => r.id === requestId ? {...r, status: newStatus} : r);
    sessionStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify(updatedRequests));

    const transactions = await getCommissionTransactions(request.userId);
    const updatedTransactions = transactions.map(t => {
        if(t.description === 'Withdrawal request' && t.status === 'pending') {
            return {...t, status: newStatus === 'approved' ? 'paid' : 'rejected' };
        }
        return t;
    });

    if (newStatus === 'rejected') {
        const creditTransaction: CommissionTransaction = {
            type: 'credit',
            amount: request.amount,
            description: `Withdrawal request rejected by admin`,
            date: new Date(),
            status: 'success'
        };
        updatedTransactions.push(creditTransaction);
    }
    
    sessionStorage.setItem(COMMISSION_WALLET_KEY_PREFIX + request.userId, JSON.stringify(updatedTransactions));
}
