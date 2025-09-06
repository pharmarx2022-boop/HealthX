

'use client';

import { addNotification } from "./notifications";
import { toast } from "@/hooks/use-toast";

const COMMISSION_WALLET_KEY_PREFIX = 'commission_wallet_';
const WITHDRAWAL_REQUESTS_KEY = 'commission_withdrawal_requests';

export type CommissionTransaction = {
    id?: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string | Date;
    status: 'success' | 'pending' | 'rejected' | 'paid';
}

export type WithdrawalRequest = {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    date: string | Date;
    status: 'pending' | 'approved' | 'rejected';
}

function getCommissionTransactions(userId: string): CommissionTransaction[] {
    if (typeof window === 'undefined') return [];
    const key = COMMISSION_WALLET_KEY_PREFIX + userId;
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveCommissionTransactions(userId: string, transactions: CommissionTransaction[]) {
    if (typeof window === 'undefined') return;
    const key = COMMISSION_WALLET_KEY_PREFIX + userId;
    sessionStorage.setItem(key, JSON.stringify(transactions));
}


export function getCommissionWalletData(userId: string): { balance: number; transactions: CommissionTransaction[] } {
    const transactions = getCommissionTransactions(userId);
    
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


export function recordCommission(userId: string, transaction: Omit<CommissionTransaction, 'date' | 'id'> & { date: Date }) {
    const transactions = getCommissionTransactions(userId);
    const newTransaction = {
        ...transaction,
        id: `ctx_${Date.now()}`,
        date: transaction.date.toISOString(),
    };
    transactions.push(newTransaction);
    saveCommissionTransactions(userId, transactions);
}

function getWithdrawalRequestsData(): WithdrawalRequest[] {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(WITHDRAWAL_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveWithdrawalRequests(requests: WithdrawalRequest[]) {
     if (typeof window === 'undefined') return;
     sessionStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
}


export function requestWithdrawal(userId: string, userName: string, amount: number) {
    const allRequests = getWithdrawalRequestsData();
    const newRequest: WithdrawalRequest = {
        id: `wd_${Date.now()}`,
        userId,
        userName,
        amount,
        date: new Date().toISOString(),
        status: 'pending'
    };
    allRequests.push(newRequest);
    saveWithdrawalRequests(allRequests);

    // Also record a debit in the user's wallet
    const userTransactions = getCommissionTransactions(userId);
    userTransactions.push({
        id: newRequest.id,
        type: 'debit',
        amount: amount,
        description: `Withdrawal request`,
        date: newRequest.date,
        status: 'pending'
    });
    saveCommissionTransactions(userId, userTransactions);

    toast({
        title: "Withdrawal Request Sent",
        description: `Your request to withdraw INR ${amount.toFixed(2)} has been sent to the admin for approval.`
    })
}


export function getWithdrawalRequests(): WithdrawalRequest[] {
    return getWithdrawalRequestsData().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export function updateWithdrawalRequest(requestId: string, newStatus: 'approved' | 'rejected') {
    const allRequests = getWithdrawalRequestsData();
    const requestIndex = allRequests.findIndex(r => r.id === requestId);
    if(requestIndex === -1) return;

    allRequests[requestIndex].status = newStatus;
    saveWithdrawalRequests(allRequests);

    const request = allRequests[requestIndex];
    const userTransactions = getCommissionTransactions(request.userId);
    const transactionIndex = userTransactions.findIndex(tx => tx.id === requestId);

    if (transactionIndex !== -1) {
        if(newStatus === 'approved') {
            userTransactions[transactionIndex].status = 'paid';
             addNotification(request.userId, {
                title: "Withdrawal Approved",
                message: `Your withdrawal of INR ${request.amount.toFixed(2)} has been approved and processed.`,
                icon: 'wallet',
                href: '#',
            });
        }
        else if (newStatus === 'rejected') {
            userTransactions[transactionIndex].status = 'rejected';
             addNotification(request.userId, {
                title: "Withdrawal Rejected",
                message: `Your withdrawal of INR ${request.amount.toFixed(2)} was rejected. The amount has been credited back.`,
                icon: 'wallet',
                href: '#',
            });
        }
        saveCommissionTransactions(request.userId, userTransactions);
    }
}
