
'use client';

// This file simulates a database for storing contact form submissions.

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
};

const SUBMISSIONS_KEY = 'contactSubmissions';

// Initialize with some mock data if it doesn't exist
const initializeSubmissions = () => {
  if (typeof window !== 'undefined' && !sessionStorage.getItem(SUBMISSIONS_KEY)) {
    sessionStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }
};
initializeSubmissions();


export async function getSubmissions(): Promise<ContactSubmission[]> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SUBMISSIONS_KEY);
      const submissions = stored ? JSON.parse(stored) : [];
      // Sort by most recent first
      submissions.sort((a: ContactSubmission, b: ContactSubmission) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(submissions);
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
        submissions.unshift(newSubmission); // Add to the beginning of the array
        sessionStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    }
    resolve();
  });
}
