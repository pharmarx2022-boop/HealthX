
'use client';

import { toast } from "@/hooks/use-toast";
import { getLabData, recordCommission as recordLabTransaction } from './lab-data';
import { getPharmacyData, recordCommission as recordPharmacyTransaction } from './pharmacy-data';

const HP_WITHDRAWAL_REQUESTS_KEY = 'healthpoint_withdrawal_requests';

export type HealthPointWithdrawalRequest = {
    id: string;
    partnerId: string;
    partnerName: string;
    partnerType: 'lab' | 'pharmacy';
    amount: number;
    date: string | Date;
    status: 'pending' | 'approved' | 'rejected';
}

export function getWithdrawalRequests(): HealthPointWithdrawalRequest[] {
    const stored = sessionStorage.getItem(HP_WITHDRAWAL_REQUESTS_KEY);
    return stored ? JSON.parse(stored).map((r: any) => ({...r, date: new Date(r.date)})) : [];
}

export function requestWithdrawal(partnerId: string, partnerName: string, amount: number, partnerType: 'lab' | 'pharmacy') {
    const requests = getWithdrawalRequests();
    const newRequest: HealthPointWithdrawalRequest = {
        id: `hp_withdraw_${Date.now()}`,
        partnerId,
        partnerName,
        partnerType,
        amount,
        date: new Date(),
        status: 'pending',
    };
    
    const debitTransaction = {
        type: 'debit' as 'debit',
        amount,
        description: `Withdrawal request`,
        date: new Date(),
    };

    if (partnerType === 'lab') {
        recordLabTransaction(partnerId, debitTransaction);
    } else {
        recordPharmacyTransaction(partnerId, debitTransaction);
    }

    sessionStorage.setItem(HP_WITHDRAWAL_REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
    toast({
        title: "Withdrawal Request Sent",
        description: `Your request to withdraw INR ${amount.toFixed(2)} has been sent to the admin for approval.`
    });
}

export function updateWithdrawalRequest(requestId: string, newStatus: 'approved' | 'rejected') {
    const requests = getWithdrawalRequests();
    const request = requests.find(r => r.id === requestId);
    if(!request) return;

    // Update request status
    const updatedRequests = requests.map(r => r.id === requestId ? {...r, status: newStatus} : r);
    sessionStorage.setItem(HP_WITHDRAWAL_REQUESTS_KEY, JSON.stringify(updatedRequests));

    // Update partner's transaction log
    // We don't credit back on rejection for this one, admin handles the cash payout.
    // In a real app, a transaction status would be updated.
    // For this mock, we can just leave the debit transaction as is.
    if(newStatus === 'rejected') {
         const creditTransaction = {
            type: 'credit' as 'credit',
            amount: request.amount,
            description: `Withdrawal request rejected by admin`,
            date: new Date(),
        };
        if(request.partnerType === 'lab') {
            recordLabTransaction(request.partnerId, creditTransaction);
        } else {
            recordPharmacyTransaction(request.partnerId, creditTransaction);
        }
    }
}
