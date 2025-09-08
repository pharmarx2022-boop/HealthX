

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


// In production, these functions would be secure API calls to your backend.

export function getCommissionWalletData(userId: string): { balance: number; transactions: CommissionTransaction[] } {
    return { balance: 0, transactions: [] };
}


export function recordCommission(userId: string, transaction: Omit<CommissionTransaction, 'date' | 'id'> & { date: Date }) {
    console.log("Recording commission would be a backend call.");
}

export function requestWithdrawal(userId: string, userName: string, amount: number) {
    toast({
        title: "Action Required",
        description: `Backend integration needed to request withdrawal.`,
    })
}

export function getWithdrawalRequests(): WithdrawalRequest[] {
    return [];
}


export function updateWithdrawalRequest(requestId: string, newStatus: 'approved' | 'rejected') {
    console.log("Updating withdrawal request would be a backend call.");
}
