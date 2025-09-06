
'use client';

import { toast } from "@/hooks/use-toast";
import { recordCommission } from "./commission-wallet";

const REFERRALS_KEY = 'referrals';

type ReferralStatus = 'pending' | 'completed';
type ReferredUserRole = 'doctor' | 'pharmacy' | 'lab' | 'health-coordinator';

type Referral = {
    referralId: string;
    referrerId: string;
    referredUserId: string;
    referredUserRole: ReferredUserRole;
    status: ReferralStatus;
    progress: number; 
    dateCreated: string;
};

// --- Milestone Definitions ---
const MILESTONES = {
    doctor: { threshold: 10, reward: 1000, unit: 'consultations' },
    pharmacy: { threshold: 10000, reward: 500, unit: 'INR' },
    lab: { threshold: 10000, reward: 500, unit: 'INR' },
    'health-coordinator': { threshold: 50, reward: 250, unit: 'bookings' },
};


async function getReferrals(): Promise<Referral[]> {
    const stored = sessionStorage.getItem(REFERRALS_KEY);
    return stored ? JSON.parse(stored) : [];
}

async function saveReferrals(referrals: Referral[]) {
    sessionStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
}

export async function createReferral(referrerId: string, referredUserId: string, referredUserRole: ReferredUserRole) {
    const referrals = await getReferrals();
    const newReferral: Referral = {
        referralId: `ref_${Date.now()}`,
        referrerId,
        referredUserId,
        referredUserRole,
        status: 'pending',
        progress: 0,
        dateCreated: new Date().toISOString(),
    };
    referrals.push(newReferral);
    await saveReferrals(referrals);
    console.log('Referral created:', newReferral);
}

async function completeReferral(referral: Referral) {
    const milestone = MILESTONES[referral.referredUserRole];
    
    await recordCommission(referral.referrerId, {
        type: 'credit',
        amount: milestone.reward,
        description: `Referral bonus for ${referral.referredUserRole} ${referral.referredUserId}`,
        date: new Date(),
        status: 'success'
    });
    
    toast({
        title: "Referral Bonus Paid!",
        description: `You've received INR ${milestone.reward} for referring a new ${referral.referredUserRole}.`
    });

    const allReferrals = await getReferrals();
    const updatedReferrals = allReferrals.map(r => 
        r.referralId === referral.referralId ? { ...r, status: 'completed' } : r
    );
    await saveReferrals(updatedReferrals);
}


// --- Milestone Check Functions ---

export async function checkDoctorMilestone(doctorId: string) {
    const referrals = await getReferrals();
    const referral = referrals.find(r => r.referredUserId === doctorId && r.status === 'pending');

    if (!referral) return;

    // This needs to be a DB query. Using mock data for now.
    const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
    const completedConsultations = allAppointments.filter((appt: any) => 
        appt.doctorId === doctorId && appt.status === 'done'
    ).length;

    referral.progress = completedConsultations;
    
    if (referral.progress >= MILESTONES.doctor.threshold) {
        await completeReferral(referral);
    } else {
        await saveReferrals(referrals); // Save progress
    }
}

export async function checkPartnerMilestone(partnerId: string, partnerType: 'lab' | 'pharmacy') {
    const referrals = await getReferrals();
    const referral = referrals.find(r => r.referredUserId === partnerId && r.status === 'pending');
    
    if (!referral) return;

    // This needs to be a DB query. Using mock data for now.
    const { balance } = await getCommissionWalletData(partnerId);
    referral.progress = balance;
    
    const milestone = MILESTONES[partnerType];
    if (referral.progress >= milestone.threshold) {
        await completeReferral(referral);
    } else {
        await saveReferrals(referrals);
    }
}

export async function checkHealthCoordinatorMilestone(coordinatorId: string) {
    const referrals = await getReferrals();
    const referral = referrals.find(r => r.referredUserId === coordinatorId && r.status === 'pending');

    if (!referral) return;

    // This needs to be a DB query. Using mock data for now.
    const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
    const completedBookings = allAppointments.filter((appt: any) =>
        appt.healthCoordinatorId === coordinatorId && appt.status === 'done'
    ).length;
    
    referral.progress = completedBookings;
    
    if (referral.progress >= MILESTONES['health-coordinator'].threshold) {
        await completeReferral(referral);
    } else {
        await saveReferrals(referrals);
    }
}

// Function to get wallet data from commission-wallet, needed here for partner milestone checks.
async function getCommissionWalletData(userId: string): Promise<{ balance: number; transactions: any[] }> {
    const key = `commission_wallet_${userId}`;
    const stored = sessionStorage.getItem(key);
    const transactions = stored ? JSON.parse(stored) : [];
    
    const balance = transactions.reduce((acc: number, curr: any) => {
        if(curr.type === 'credit' && curr.status === 'success') {
            return acc + curr.amount;
        }
        if(curr.type === 'debit' && (curr.status === 'paid' || curr.status === 'pending')) {
             return acc - curr.amount;
        }
        return acc;
    }, 0);

    return { balance, transactions };
}
