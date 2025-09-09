

'use client';

import { toast } from '@/hooks/use-toast';

// In production, this data would be fetched from a backend (e.g., a CMS or database).

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

const TEAM_KEY = 'teamMembers';

const defaultTeam: TeamMember[] = [
    {
        id: '1',
        name: 'Dr. Aarav Sharma',
        category: 'Founder',
        title: 'Founder & CEO',
        image: 'https://placehold.co/400x400/EBF5FF/1E40AF?text=AS',
        dataAiHint: 'professional man',
        bio: 'With over 20 years of experience in cardiology, Dr. Sharma founded HealthX to bridge the gap between patients and quality healthcare.',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com'
    },
    {
        id: '2',
        name: 'Priya Singh',
        category: 'Director',
        title: 'Director of Operations',
        image: 'https://placehold.co/400x400/EBF5FF/1E40AF?text=PS',
        dataAiHint: 'professional woman',
        bio: 'Priya brings a wealth of experience in scaling operations for tech startups, ensuring a seamless experience for all our users.',
        linkedin: 'https://linkedin.com'
    },
];

// In a real app, these functions would make API calls to a backend service.
export async function getTeamMembers(): Promise<TeamMember[]> {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
            const storedTeam = localStorage.getItem(TEAM_KEY);
            if (storedTeam) {
                resolve(JSON.parse(storedTeam));
            } else {
                localStorage.setItem(TEAM_KEY, JSON.stringify(defaultTeam));
                resolve(defaultTeam);
            }
        } else {
            resolve(defaultTeam);
        }
    });
}

export async function addTeamMember(member: Omit<TeamMember, 'id'>) {
    const members = await getTeamMembers();
    const newMember: TeamMember = {
        ...member,
        id: `team_${Date.now()}`
    };
    const updatedMembers = [...members, newMember];
    if (typeof window !== 'undefined') {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
    }
}

export async function updateTeamMember(updatedMember: TeamMember) {
    let members = await getTeamMembers();
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
     if (typeof window !== 'undefined') {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
    }
}

export async function deleteTeamMember(memberId: string) {
    let members = await getTeamMembers();
    const updatedMembers = members.filter(m => m.id !== memberId);
    if (typeof window !== 'undefined') {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updatedMembers));
    }
}
