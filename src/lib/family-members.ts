

'use client';

export const mockFamilyMembers: any[] = [];

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
