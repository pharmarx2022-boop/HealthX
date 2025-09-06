

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
    // This function would fetch from Firestore, e.g., `db.collection('users').doc(userId).collection('commissionWallet').get()`
    // For now, it will return an empty array as we are no longer using sessionStorage.
    console.warn("Using placeholder for getCommissionTransactions. Connect to your database.");
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
    // This function would write to Firestore, e.g., `db.collection('users').doc(userId).collection('commissionWallet').add(transaction)`
    console.warn("Using placeholder for recordCommission. Connect to your database.");
}

export async function requestWithdrawal(userId: string, userName: string, amount: number) {
    // This function would create a withdrawal request document in Firestore
    console.warn("Using placeholder for requestWithdrawal. Connect to your database.");
    
    toast({
        title: "Withdrawal Request Sent",
        description: `Your request to withdraw INR ${amount.toFixed(2)} has been sent to the admin for approval.`
    })
}

export async function getWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    // This function would fetch from Firestore, e.g., `db.collection('withdrawalRequests').where('status', '==', 'pending').get()`
    console.warn("Using placeholder for getWithdrawalRequests. Connect to your database.");
    return [];
}

export async function updateWithdrawalRequest(requestId: string, newStatus: 'approved' | 'rejected') {
   // This function would update a withdrawal request document in Firestore and the user's wallet transactions
   console.warn("Using placeholder for updateWithdrawalRequest. Connect to your database.");
}
