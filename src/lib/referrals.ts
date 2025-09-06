
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
    progress: number; // e.g., number of consultations, total transaction amount
    dateCreated: string;
};

// --- Milestone Definitions ---
const MILESTONES = {
    doctor: { threshold: 10, reward: 1000, unit: 'consultations' },
    pharmacy: { threshold: 10000, reward: 500, unit: 'INR' },
    lab: { threshold: 10000, reward: 500, unit: 'INR' },
    'health-coordinator': { threshold: 50, reward: 250, unit: 'bookings' },
};


function getReferrals(): Referral[] {
    const stored = sessionStorage.getItem(REFERRALS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveReferrals(referrals: Referral[]) {
    sessionStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
}

export function createReferral(referrerId: string, referredUserId: string, referredUserRole: ReferredUserRole) {
    const referrals = getReferrals();
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
    saveReferrals(referrals);
    console.log('Referral created:', newReferral);
}

function completeReferral(referral: Referral) {
    const milestone = MILESTONES[referral.referredUserRole];
    
    recordCommission(referral.referrerId, {
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

    // Update the referral's status to completed
    const allReferrals = getReferrals();
    const updatedReferrals = allReferrals.map(r => 
        r.referralId === referral.referralId ? { ...r, status: 'completed' } : r
    );
    saveReferrals(updatedReferrals);
}


// --- Milestone Check Functions ---

export function checkDoctorMilestone(doctorId: string) {
    const referrals = getReferrals();
    const referral = referrals.find(r => r.referredUserId === doctorId && r.status === 'pending');

    if (!referral) return;

    // In a real app, you'd fetch this from a DB. Here, we count from mock data.
    const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
    const completedConsultations = allAppointments.filter((appt: any) => 
        appt.doctorId === doctorId && appt.status === 'done'
    ).length;

    referral.progress = completedConsultations;
    
    if (referral.progress >= MILESTONES.doctor.threshold) {
        completeReferral(referral);
    } else {
        saveReferrals(referrals); // Save progress
    }
}

export function checkPartnerMilestone(partnerId: string, partnerType: 'lab' | 'pharmacy') {
    const referrals = getReferrals();
    const referral = referrals.find(r => r.referredUserId === partnerId && r.status === 'pending');
    
    if (!referral) return;

    const partnerDataKey = partnerType === 'lab' ? 'lab_transactions_' : 'pharmacy_transactions_';
    const transactions = JSON.parse(sessionStorage.getItem(partnerDataKey + partnerId) || '[]');
    const totalCollected = transactions
        .filter((tx: any) => tx.type === 'credit')
        .reduce((sum: number, tx: any) => sum + tx.amount, 0);

    referral.progress = totalCollected;
    
    const milestone = MILESTONES[partnerType];
    if (referral.progress >= milestone.threshold) {
        completeReferral(referral);
    } else {
        saveReferrals(referrals); // Save progress
    }
}

export function checkHealthCoordinatorMilestone(coordinatorId: string) {
    const referrals = getReferrals();
    const referral = referrals.find(r => r.referredUserId === coordinatorId && r.status === 'pending');

    if (!referral) return;

    // In a real app, this would be a DB query.
    const allAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
    const completedBookings = allAppointments.filter((appt: any) =>
        appt.healthCoordinatorId === coordinatorId && appt.status === 'done'
    ).length;
    
    referral.progress = completedBookings;
    
    if (referral.progress >= MILESTONES['health-coordinator'].threshold) {
        completeReferral(referral);
    } else {
        saveReferrals(referrals); // Save progress
    }
}
