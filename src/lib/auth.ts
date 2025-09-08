

// THIS IS A MOCK AUTHENTICATION FILE FOR PROTOTYPING ONLY
// In a real application, this would be replaced with a secure authentication service like Firebase Authentication.

export const MOCK_OTP = '123456';

const USERS_KEY = 'allUsers';

const ADMIN_ACCOUNTS = [
    { email: 'admin@example.com', id: 'admin_001', role: 'admin' },
];

export type UserData = {
    id: string;
    email: string;
    role: string;
    fullName: string;
    phone: string;
    referralCode?: string;
    status: 'pending' | 'approved' | 'rejected' | 'disabled';
    dateJoined: string;
    // Role-specific fields that might exist on a user object
    [key: string]: any; 
};


const generateReferralCode = () => {
    return `HX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

const initializeUsers = () => {
     if (typeof window !== 'undefined' && !sessionStorage.getItem(USERS_KEY)) {
        const initialMockUsers = [
             // Simple, role-based emails for easy testing
            {
                id: 'patient_test_1',
                email: 'patient@example.com',
                fullName: 'Priya Patient',
                phone: '9876543210',
                role: 'patient',
                status: 'approved',
                dateJoined: new Date().toISOString(),
            },
            {
                id: 'doctor_test_1',
                email: 'doctor@example.com',
                fullName: 'Dr. Dev Doctor',
                phone: '9876543211',
                role: 'doctor',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-DOCTEST'
            },
            {
                id: 'coordinator_test_1',
                email: 'coordinator@example.com',
                fullName: 'Chirag Coordinator',
                phone: '9876543212',
                role: 'health-coordinator',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-HCTEST'
            },
            {
                id: 'lab_test_1',
                email: 'lab@example.com',
                fullName: 'Leo Lab',
                phone: '9876543213',
                role: 'lab',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-LABTEST'
            },
            {
                id: 'pharmacy_test_1',
                email: 'pharmacy@example.com',
                fullName: 'Parth Pharmacy',
                phone: '9876543214',
                role: 'pharmacy',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-PHARMTEST'
            },
            // --- Additional detailed mock users ---
            {
                id: 'patient_rohan_1687889900',
                email: 'rohan.patel@example.com',
                fullName: 'Rohan Patel',
                phone: '9820098200',
                role: 'patient',
                status: 'approved',
                dateJoined: new Date().toISOString(),
            },
            {
                id: 'patient_priya_1687889955',
                email: 'priya.singh@example.com',
                fullName: 'Priya Singh',
                phone: '9820098201',
                role: 'patient',
                status: 'approved',
                dateJoined: new Date().toISOString(),
            },
            {
                id: 'doctor_anjali_1687890123',
                email: 'anjali.sharma@example.com',
                fullName: 'Dr. Anjali Sharma',
                phone: '9876543210',
                role: 'doctor',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-DOCANJALI'
            },
             {
                id: 'doctor_vikram_1687890456',
                email: 'vikram.singh@example.com',
                fullName: 'Dr. Vikram Singh',
                phone: '9876543211',
                role: 'doctor',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-DOCVIKRAM'
            },
            {
                id: 'pharmacy_wellness_1687890789',
                email: 'contact@wellness.com',
                fullName: 'Wellness Forever Pharmacy',
                phone: '919988776655',
                role: 'pharmacy',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-PHRMWELL'
            },
            {
                id: 'lab_metropolis_1687891122',
                email: 'support@metropolis.com',
                fullName: 'Metropolis Lab',
                phone: '919988776644',
                role: 'lab',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-LABMETRO'
            },
            {
                id: 'hc_amit_1687891455',
                email: 'amit.kumar@example.com',
                fullName: 'Amit Kumar',
                phone: '9123456789',
                role: 'health-coordinator',
                status: 'approved',
                dateJoined: new Date().toISOString(),
                referralCode: 'HX-HCAMIT'
            }
        ];
        sessionStorage.setItem(USERS_KEY, JSON.stringify(initialMockUsers));
    }
}
initializeUsers();


const getAllUsers = (): UserData[] => {
    if (typeof window === 'undefined') return [];
    const users = sessionStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

const saveAllUsers = (users: UserData[]) => {
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
    const canRefer = ['pharmacy', 'lab', 'health-coordinator'].includes(role);

    const user: UserData = { 
        id: `${role}_${emailPrefix}_${Date.now()}`,
        email,
        role, 
        fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`,
        phone: '',
        referralCode: canRefer ? generateReferralCode() : undefined,
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


export function getAllUsersForAdmin(): UserData[] {
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

export async function updateUserByAdmin(userId: string, role: string, updatedData: Partial<UserData>): Promise<void> {
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...updatedData };
        saveAllUsers(allUsers);
    }

    // Also update the specific data store if it's a professional role
    let dataKey: string | null = null;
    switch (role) {
        case 'doctor': dataKey = 'doctorsData'; break;
        case 'lab': dataKey = 'mockLabs'; break;
        case 'pharmacy': dataKey = 'mockPharmacies'; break;
        case 'patient': dataKey = 'mockPatientData'; break;
    }

    if (dataKey) {
        const storedData = sessionStorage.getItem(dataKey);
        if (storedData) {
            const allData = JSON.parse(storedData);
            const dataIndex = allData.findIndex((d: any) => d.id === userId);
            if (dataIndex !== -1) {
                const nameKey = allData[dataIndex].name ? 'name' : 'fullName';
                allData[dataIndex] = { ...allData[dataIndex], ...updatedData, [nameKey]: updatedData.fullName };
                sessionStorage.setItem(dataKey, JSON.stringify(allData));
            }
        }
    }
}
