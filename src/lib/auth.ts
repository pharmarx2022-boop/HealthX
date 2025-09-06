
// A simple in-memory store for users
const users: any[] = [];
import { createReferral } from './referrals';

// A secure, hardcoded list of admin accounts.
// In a real application, this would be stored securely in a database.
const ADMIN_ACCOUNTS = [
    { email: 'admin@example.com', id: 'admin_001', role: 'admin' },
];

export const MOCK_OTP = '123456';

const generateReferralCode = () => {
    return `HX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// In a real app, this would query your Firestore database.
const getAllUsers = async () => {
    // This is a placeholder for fetching all users from your database.
    // e.g., const snapshot = await db.collection('users').get();
    console.warn("Using placeholder for getAllUsers. Connect to your database.");
    return [];
}

const findUserByReferralCode = async (code: string) => {
    const allUsers = await getAllUsers();
    return allUsers.find((u: any) => u.referralCode === code);
}

// This function simulates sending an OTP. In production, use Firebase Auth.
export async function sendOtp(email: string) {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('emailForSignIn', email);
    }
    console.log(`OTP/Magic Link SENT to ${email}: The mock code is ${MOCK_OTP}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}

// In a real app, this would check your database.
export const isEmailUnique = async (email: string) => {
    const allUsers = await getAllUsers();
    return !allUsers.some(u => u.email === email);
}

export const isPhoneUnique = async (phone: string, currentUserId: string) => {
    if (!phone) return true;
    const allUsers = await getAllUsers();
    return !allUsers.some(u => u.phone === phone && u.id !== currentUserId);
}

// This should be replaced with Firebase Authentication.
export async function signInWithOtp(email: string, otp: string, role: string, referralCode?: string) {
    if (typeof window === 'undefined') {
        return { user: null, error: "Sign-in must be completed in a browser.", isNewUser: false };
    }

    const emailForSignIn = window.sessionStorage.getItem('emailForSignIn');
    if (emailForSignIn !== email) {
        return { user: null, error: "Email does not match the one that requested the magic link.", isNewUser: false };
    }
    
    if (otp !== MOCK_OTP) {
        return { user: null, error: "Invalid OTP/magic link.", isNewUser: false };
    }
    
    // Admin login remains the same for now
    if (role === 'admin') {
        const adminUser = ADMIN_ACCOUNTS.find(admin => admin.email === email);
        if (adminUser) {
            window.sessionStorage.removeItem('emailForSignIn');
            return { user: { ...adminUser, fullName: 'Admin' }, error: null, isNewUser: false };
        } else {
            return { user: null, error: "This email is not registered as an admin.", isNewUser: false };
        }
    }
    
    // In a real app, you would fetch from your DB here.
    // e.g., const userRef = db.collection('users').where('email', '==', email).where('role', '==', role);
    console.warn("Using placeholder for user lookup in signInWithOtp. Connect to your database.");
    
    // This part will now always create a new user for demo purposes, since fetching is mocked.
    let isNewUser = true;
    const emailPrefix = email.split('@')[0];
    const isProfessional = ['doctor', 'pharmacy', 'lab', 'health-coordinator'].includes(role);

    const user = { 
        id: `${role}_${emailPrefix}_${Date.now()}`,
        email,
        role, 
        referralCode: isProfessional ? generateReferralCode() : null,
        fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`,
        phone: '',
        status: isProfessional ? 'pending' : 'approved',
        dateJoined: new Date().toISOString(),
        registrationNumber: '',
        registrationCertificate: '',
        aadharNumber: '',
        aadharFrontImage: '',
        aadharBackImage: '',
    };
    
     // In a real app, you would now SAVE this user to your database.
     // e.g., await db.collection('users').doc(user.id).set(user);
     console.log('New user would be created:', user);

    if (referralCode) {
        const referrer = await findUserByReferralCode(referralCode);
        if (referrer) {
             createReferral(referrer.id, user.id, user.role as any);
        } else {
             return { user: null, error: "Invalid referral code.", isNewUser: false };
        }
    }
    
    window.sessionStorage.removeItem('emailForSignIn');
    return { user, error: null, isNewUser };
}


// Replace with a DB query
export async function getAllPendingUsers() {
    console.warn("Using placeholder for getAllPendingUsers. Connect to your database.");
    return [];
}

// Replace with a DB update
export async function updateUserStatus(userId: string, role: string, newStatus: 'approved' | 'rejected') {
     console.warn("Using placeholder for updateUserStatus. Connect to your database.");
     // e.g., await db.collection('users').doc(userId).update({ status: newStatus });
     return true;
}

export async function isRegistrationNumberUnique(role: 'doctor' | 'lab' | 'pharmacy', regNumber: string, currentUserId: string): Promise<boolean> {
    console.warn("Using placeholder for isRegistrationNumberUnique. Connect to your database.");
    return true; // Assume unique for prototype
}

export async function isAadharNumberUnique(aadharNumber: string, currentUserId: string): Promise<boolean> {
    console.warn("Using placeholder for isAadharNumberUnique. Connect to your database.");
    return true; // Assume unique for prototype
}

export function verifyAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return false;

    try {
        const user = JSON.parse(storedUser);
        return user.role === 'admin' && ADMIN_ACCOUNTS.some(admin => admin.id === user.id && admin.email === user.email);
    } catch (e) {
        return false;
    }
}

// Replace with a DB query
export async function getAllUsersForAdmin() {
     console.warn("Using placeholder for getAllUsersForAdmin. Connect to your database.");
     return [];
}

// Replace with a DB update
export async function toggleUserStatus(userId: string, role: string) {
     console.warn("Using placeholder for toggleUserStatus. Connect to your database.");
     return true;
}
