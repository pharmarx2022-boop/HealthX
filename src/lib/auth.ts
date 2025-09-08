
// THIS FILE IS A PLACEHOLDER FOR PRODUCTION AUTHENTICATION
// In a real application, this would be replaced with a secure authentication service like Firebase Authentication.

export type UserData = {
    id: string;
    email: string;
    role: string;
    fullName: string;
    phone: string;
    password?: string;
    referralCode?: string;
    status: 'pending' | 'approved' | 'rejected' | 'disabled';
    dateJoined: string;
    [key: string]: any; 
};

// This function simulates sending an OTP. In production, this would use a service like Twilio or Firebase Auth.
export async function sendOtp(email: string) {
    console.log(`A real magic link would be sent to ${email} by a backend service.`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}

// In production, this would query your database.
export async function checkUserExists(email: string, role: string): Promise<UserData | null> {
    console.log("Checking user existence would be a backend call.");
    if (typeof window === 'undefined') return null;

    const key = `${role}sData`; // e.g., doctorsData, patientsData
    const allUsersOfType = JSON.parse(localStorage.getItem(key) || '[]');
    const user = allUsersOfType.find((u: any) => u.email === email);
    
    // Special check for admin user
    if (role === 'admin' && email === 'admin@healthx.com') {
        return {
            id: 'admin_user',
            email: 'admin@healthx.com',
            role: 'admin',
            fullName: 'Platform Administrator',
            phone: '0000000000',
            password: 'password', // Mock password
            status: 'approved',
            dateJoined: new Date().toISOString(),
        };
    }

    return user || null;
}

// In production, this would be a secure API call to your backend.
export async function signInWithPassword(email: string, password: string, role: string) {
    if (typeof window === 'undefined') {
        return { user: null, error: "Sign in must be done on the client-side." };
    }
    
    const user = await checkUserExists(email, role);

    if (!user) {
        return { user: null, error: "No account found with that email for this role." };
    }

    if (user.password !== password) {
         return { user: null, error: "Incorrect password." };
    }

    return { user, error: null };
}

// In production, this would be a secure API call to your backend.
export async function signInWithOtp(email: string, otp: string, role: string, referralCode?: string) {
     return { user: null, error: "Backend not connected. This is a placeholder.", isNewUser: false };
}

// --- ADMIN & MANAGEMENT FUNCTIONS ---

// In production, these would be secure, role-protected API endpoints.

export function isEmailUnique(email: string): boolean { return true; }
export function isPhoneUnique(phone: string, currentUserId: string): boolean { return true; }
export function isRegistrationNumberUnique(role: 'doctor' | 'lab' | 'pharmacy', regNumber: string, currentUserId: string): boolean { return true; }
export const isAadharNumberUnique = (aadharNumber: string, currentUserId: string): boolean => { return true; }
export function getAllPendingUsers(): any[] { return []; }
export function updateUserStatus(userId: string, role: string, newStatus: 'approved' | 'rejected') { return true; }

export function verifyAdmin(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        // For prototype purposes, we designate a specific email as the admin
        return user.email === 'admin@healthx.com' && user.role === 'admin';
    }
    return false;
}

export function getAllUsersForAdmin(): UserData[] { return []; }
export function toggleUserStatus(userId: string, role: string) { return true; }
export async function updateUserByAdmin(userId: string, role: string, updatedData: Partial<UserData>): Promise<void> {}
