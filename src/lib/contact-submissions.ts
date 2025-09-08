
'use client';

// This file simulates a database for storing contact form submissions.
// In production, this would be an API call to a secure backend.

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
};

const SUBMISSIONS_KEY = 'contactSubmissions';

export async function getSubmissions(): Promise<ContactSubmission[]> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SUBMISSIONS_KEY);
      resolve(stored ? JSON.parse(stored) : []);
    } else {
      resolve([]);
    }
  });
}

export async function saveSubmission(data: Omit<ContactSubmission, 'id' | 'date'>): Promise<void> {
   return new Promise(async (resolve) => {
    if (typeof window !== 'undefined') {
        const submissions = await getSubmissions();
        const newSubmission: ContactSubmission = {
            ...data,
            id: `sub_${Date.now()}`,
            date: new Date().toISOString(),
        };
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([newSubmission, ...submissions]));
    }
    resolve();
  });
}
