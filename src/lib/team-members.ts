

'use client';

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


// In a real app, these functions would make API calls to a backend service.
export function getTeamMembers(): TeamMember[] {
     return [];
}

export function addTeamMember(member: Omit<TeamMember, 'id'>) {
    console.log("Adding team member would be a backend call.");
}

export function updateTeamMember(updatedMember: TeamMember) {
    console.log("Updating team member would be a backend call.");
}

export function deleteTeamMember(memberId: string) {
    console.log("Deleting team member would be a backend call.");
}
