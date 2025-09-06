

'use client';

export const mockFamilyMembers = [
    {
        id: 'family1',
        name: 'Rohan Sharma',
        relationship: 'Spouse',
        dob: '1988-05-10',
        sex: 'Male'
    },
    {
        id: 'family2',
        name: 'Priya Sharma',
        relationship: 'Child',
        dob: '2015-11-22',
        sex: 'Female'
    },
];

const FAMILY_KEY_PREFIX = 'familyMembers_'; // Per-user storage

// In a real app, this would fetch from Firestore, scoped to the logged-in user.
export function getFamilyMembers(userId: string): any[] {
     if (typeof window === 'undefined') return [];
     const key = FAMILY_KEY_PREFIX + userId;
     const storedFamily = sessionStorage.getItem(key);
     if (storedFamily) {
        return JSON.parse(storedFamily);
     }
     // If no family members for this user, set the default mock ones.
     sessionStorage.setItem(key, JSON.stringify(mockFamilyMembers));
     return mockFamilyMembers;
}

export function saveFamilyMembers(userId: string, members: any[]) {
    if (typeof window === 'undefined') return;
    const key = FAMILY_KEY_PREFIX + userId;
    sessionStorage.setItem(key, JSON.stringify(members));
}
