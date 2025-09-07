

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

const initialTeam: TeamMember[] = [
    {
        id: '1',
        name: 'Dr. Sameer Sharma',
        category: 'Founder',
        title: 'Founder & CEO',
        image: 'https://picsum.photos/seed/ceo/400/400',
        dataAiHint: "professional man",
        bio: 'With a vision to revolutionize healthcare access, Dr. Sharma founded HealthX to bridge the gap between patients and providers through technology.',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com'
    },
    {
        id: '2',
        name: 'Aisha Khan',
        category: 'Director',
        title: 'Chief Technology Officer',
        image: 'https://picsum.photos/seed/cto/400/400',
        dataAiHint: "professional woman",
        bio: 'Aisha leads our engineering team, driving the development of our innovative platform with a passion for user-centric design and scalable solutions.',
        linkedin: 'https://linkedin.com',
    },
    {
        id: '3',
        name: 'Raj Patel',
        category: 'Director',
        title: 'Head of Operations',
        image: 'https://picsum.photos/seed/ops/400/400',
        dataAiHint: "smiling man",
        bio: 'Raj ensures the seamless operation of the HealthX ecosystem, managing partner relations and ensuring a high-quality experience for all users.',
        instagram: 'https://instagram.com'
    }
];

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
