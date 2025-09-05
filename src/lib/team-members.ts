

'use client';

const TEAM_MEMBERS_KEY = 'teamMembers';

export type TeamMember = {
    id: string;
    name: string;
    title: string;
    image: string;
    dataAiHint: string;
    bio: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
}

const initialTeamMembers: TeamMember[] = [
  {
    id: 'team_1',
    name: 'Dr. Anjali Sharma',
    title: 'Founder & CEO',
    image: 'https://picsum.photos/400/400',
    dataAiHint: 'ceo portrait',
    bio: 'A visionary leader with a passion for leveraging technology to improve healthcare access for all.',
    linkedin: '#',
    twitter: '#',
    instagram: '#'
  },
  {
    id: 'team_2',
    name: 'Vikram Singh',
    title: 'Chief Technology Officer',
    image: 'https://picsum.photos/401/401',
    dataAiHint: 'cto portrait',
    bio: 'The architect of our platform, ensuring a seamless and secure experience for all users.',
    linkedin: '#',
    twitter: '#',
    instagram: '#'
  },
  {
    id: 'team_3',
    name: 'Priya Patel',
    title: 'Head of Patient Relations',
    image: 'https://picsum.photos/402/402',
    dataAiHint: 'manager portrait',
    bio: 'Dedicated to making sure every patient feels heard, supported, and cared for.',
    linkedin: '#',
    twitter: '#',
    instagram: '#'
  },
];

function initializeTeamMembers(): TeamMember[] {
    sessionStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(initialTeamMembers));
    return initialTeamMembers;
}

export function getTeamMembers(): TeamMember[] {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(TEAM_MEMBERS_KEY);
    return stored ? JSON.parse(stored) : initializeTeamMembers();
}

function saveTeamMembers(members: TeamMember[]): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
}

export function addTeamMember(member: Omit<TeamMember, 'id'>): void {
    const members = getTeamMembers();
    const newMember: TeamMember = { ...member, id: `team_${Date.now()}` };
    saveTeamMembers([...members, newMember]);
}

export function updateTeamMember(updatedMember: TeamMember): void {
    const members = getTeamMembers();
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    saveTeamMembers(updatedMembers);
}

export function deleteTeamMember(memberId: string): void {
    const members = getTeamMembers();
    const updatedMembers = members.filter(m => m.id !== memberId);
    saveTeamMembers(updatedMembers);
}
