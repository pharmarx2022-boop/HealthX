
'use client';

// This file should be refactored to use a backend service like Firestore.

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
    name: 'Alisha Singh',
    title: 'Founder & CEO',
    image: 'https://picsum.photos/id/1011/400/400',
    dataAiHint: 'ceo portrait',
    bio: 'A visionary leader with a passion for leveraging technology to improve healthcare access for all.',
    linkedin: 'https://linkedin.com/in/alishasingh',
    twitter: 'https://x.com/alishasingh',
    instagram: 'https://instagram.com/alishasingh'
  },
  {
    id: 'team_2',
    name: 'Rohan Mehta',
    title: 'Chief Technology Officer',
    image: 'https://picsum.photos/id/1005/400/400',
    dataAiHint: 'cto portrait',
    bio: 'The architect of our platform, ensuring a seamless and secure experience for all users.',
    linkedin: '#',
    twitter: '#',
    instagram: '#'
  },
  {
    id: 'team_3',
    name: 'Sonia Patel',
    title: 'Head of Patient Relations',
    image: 'https://picsum.photos/id/1027/400/400',
    dataAiHint: 'manager portrait',
    bio: 'Dedicated to making sure every patient feels heard, supported, and cared for.',
    linkedin: '#',
    twitter: '#',
    instagram: '#'
  },
];

// Placeholder for fetching team members from a database
export async function getTeamMembers(): Promise<TeamMember[]> {
    console.warn("Using placeholder for getTeamMembers. Connect to your database.");
    // In a real app, you would fetch from Firestore here.
    // For now, we'll continue to use sessionStorage for demo purposes.
     if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(TEAM_MEMBERS_KEY);
    if (!stored) {
      sessionStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(initialTeamMembers));
      return initialTeamMembers;
    }
    return JSON.parse(stored);
}

function saveTeamMembers(members: TeamMember[]): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
}

// Placeholder for adding a team member to a database
export async function addTeamMember(member: Omit<TeamMember, 'id'>): Promise<void> {
    console.warn("Using placeholder for addTeamMember. Connect to your database.");
    const members = await getTeamMembers();
    const newMember: TeamMember = { ...member, id: `team_${Date.now()}` };
    saveTeamMembers([...members, newMember]);
}

// Placeholder for updating a team member in a database
export async function updateTeamMember(updatedMember: TeamMember): Promise<void> {
    console.warn("Using placeholder for updateTeamMember. Connect to your database.");
    const members = await getTeamMembers();
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    saveTeamMembers(updatedMembers);
}

// Placeholder for deleting a team member from a database
export async function deleteTeamMember(memberId: string): Promise<void> {
    console.warn("Using placeholder for deleteTeamMember. Connect to your database.");
    const members = await getTeamMembers();
    const updatedMembers = members.filter(m => m.id !== memberId);
    saveTeamMembers(updatedMembers);
}
