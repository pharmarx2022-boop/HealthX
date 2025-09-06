

// THIS IS A MOCK AUTHENTICATION FILE FOR PROTOTYPING ONLY
// In a real application, this would be replaced with a secure authentication service like Firebase Authentication.

export const MOCK_OTP = '123456';

const USERS_KEY = 'allUsers';

const ADMIN_ACCOUNTS = [
    { email: 'admin@example.com', id: 'admin_001', role: 'admin' },
];

const generateReferralCode = () => {
    return `HX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

const initializeUsers = () => {
     if (typeof window !== 'undefined' && !sessionStorage.getItem(USERS_KEY)) {
        sessionStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
}
initializeUsers();


const getAllUsers = (): any[] => {
    if (typeof window === 'undefined') return [];
    const users = sessionStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

const saveAllUsers = (users: any[]) => {
    sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const findUserByReferralCode = (code: string) => {
    const allUsers = getAllUsers();
    return allUsers.find((u: any) => u.referralCode === code);
}

// This function simulates sending an OTP.
export async function sendOtp(email: string) {
    console.log(`OTP/Magic Link SENT to ${email}: The mock code is ${MOCK_OTP}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}


export const isEmailUnique = (email: string): boolean => {
    const allUsers = getAllUsers();
    return !allUsers.some(user => user.email === email);
}

export const isPhoneUnique = (phone: string, currentUserId: string): boolean => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(user => user.phone === phone);
    return !foundUser || foundUser.id === currentUserId;
}

export function signInWithOtp(email: string, otp: string, role: string, referralCode?: string) {
    if (otp !== MOCK_OTP) {
        return { user: null, error: "Invalid OTP/magic link.", isNewUser: false };
    }
    
    // Admin login check
    if (role === 'admin') {
        const adminUser = ADMIN_ACCOUNTS.find(admin => admin.email === email);
        if (adminUser) {
            return { user: { ...adminUser, fullName: 'Admin', status: 'approved' }, error: null, isNewUser: false };
        } else {
            return { user: null, error: "This email is not registered as an admin.", isNewUser: false };
        }
    }
    
    const allUsers = getAllUsers();
    let existingUser = allUsers.find(u => u.email === email && u.role === role);

    if (existingUser) {
        return { user: existingUser, error: null, isNewUser: false };
    }

    // Create new user if they don't exist
    const isNewUser = true;
    const emailPrefix = email.split('@')[0];
    const isProfessional = ['doctor', 'pharmacy', 'lab', 'health-coordinator'].includes(role);

    const user = { 
        id: `${role}_${emailPrefix}_${Date.now()}`,
        email,
        role, 
        fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`,
        phone: '',
        referralCode: isProfessional ? generateReferralCode() : undefined,
        status: isProfessional ? 'pending' : 'approved',
        dateJoined: new Date().toISOString(),
    };
    
    allUsers.push(user);
    saveAllUsers(allUsers);
    
     if (referralCode) {
        const referrer = findUserByReferralCode(referralCode);
        if (referrer) {
            // Placeholder for creating referral record
            console.log(`Referral created: ${referrer.id} referred ${user.id}`);
        } else {
             return { user: null, error: "Invalid referral code.", isNewUser: false };
        }
    }

    return { user, error: null, isNewUser };
}


export function getAllPendingUsers(): any[] {
    const allUsers = getAllUsers();
    return allUsers.filter(user => user.status === 'pending');
}


export function updateUserStatus(userId: string, role: string, newStatus: 'approved' | 'rejected') {
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(user => user.id === userId);

    if(userIndex !== -1) {
        allUsers[userIndex].status = newStatus;
        saveAllUsers(allUsers);
        return true;
    }
    return false;
}

export const isRegistrationNumberUnique = (role: 'doctor' | 'lab' | 'pharmacy', regNumber: string, currentUserId: string): boolean => {
    const key = role === 'doctor' ? 'doctorsData' : role === 'lab' ? 'mockLabs' : 'mockPharmacies';
    const allPartners = JSON.parse(sessionStorage.getItem(key) || '[]');
    const foundPartner = allPartners.find((p: any) => p.registrationNumber === regNumber);
    return !foundPartner || foundPartner.id === currentUserId;
}

export const isAadharNumberUnique = (aadharNumber: string, currentUserId: string): boolean => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(user => user.aadharNumber === aadharNumber);
    return !foundUser || foundUser.id === currentUserId;
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


export function getAllUsersForAdmin(): any[] {
     const allUsers = getAllUsers();
     return allUsers.filter(user => user.role !== 'admin');
}


export function toggleUserStatus(userId: string, role: string) {
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(user => user.id === userId);

    if(userIndex !== -1) {
        const currentStatus = allUsers[userIndex].status;
        allUsers[userIndex].status = currentStatus === 'disabled' ? (role === 'patient' ? 'approved' : 'pending') : 'disabled';
        saveAllUsers(allUsers);
        return true;
    }
    return false;
}
