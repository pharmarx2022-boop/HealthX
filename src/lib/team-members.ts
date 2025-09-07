

'use client';

// This file should be refactored to use a backend service like Firestore.

export const teamMemberCategories = ['Founder', 'Director', 'Independent Director', 'Investor', 'Other'] as const;

export type TeamMember = {
    id: string;
    name: string;
    category: typeof teamMemberCategories[number];
    title: string;
    image: string;
    dataAiHint: string;
    bio: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
}

const initialTeam: TeamMember[] = [];

const TEAM_KEY = 'teamMembers';

// In a real app, this would fetch from Firestore, scoped to the logged-in user.
export function getTeamMembers(): TeamMember[] {
     if (typeof window === 'undefined') return [];
     const stored = sessionStorage.getItem(TEAM_KEY);
     if (stored) {
        return JSON.parse(stored);
     }
     sessionStorage.setItem(TEAM_KEY, JSON.stringify(initialTeam));
     return initialTeam;
}

export function addTeamMember(member: Omit<TeamMember, 'id'>) {
    const members = getTeamMembers();
    const newMember = { ...member, id: `team_${Date.now()}` };
    const updatedMembers = [...members, newMember];
    sessionStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
}

export function updateTeamMember(updatedMember: TeamMember) {
    const members = getTeamMembers();
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    sessionStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
}

export function deleteTeamMember(memberId: string) {
    const members = getTeamMembers();
    const updatedMembers = members.filter(m => m.id !== memberId);
    sessionStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
}
