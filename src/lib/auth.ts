

// A simple in-memory store for users
const users: any[] = [];
import { createReferral } from './referrals';
import { initialDoctors, initialLabs, initialPharmacies } from './mock-data';

// A secure, hardcoded list of admin accounts.
// In a real application, this would be stored securely in a database.
const ADMIN_ACCOUNTS = [
    { email: 'admin@example.com', id: 'admin_001', role: 'admin' },
];

export const MOCK_OTP = '123456';

const generateReferralCode = () => {
    return `HX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

const getAllUsers = () => {
    // This is a mock function. In a real app, you would fetch this from the DB.
    // Here we'll just combine all mock data user types that can refer.
    const allKnownUsers: any[] = [];
    const addUsers = (key: string, defaultData: any[]) => {
        const stored = sessionStorage.getItem(key);
        if(stored) {
            allKnownUsers.push(...JSON.parse(stored));
        } else {
             allKnownUsers.push(...defaultData);
        }
    };
    addUsers('mockPharmacies', initialPharmacies);
    addUsers('mockLabs', initialLabs);
    addUsers('doctorsData', initialDoctors);
    users.forEach(u => {
        if(!allKnownUsers.find(k => k.id === u.id)) {
            allKnownUsers.push(u);
        }
    });

   return allKnownUsers;
}

const findUserByReferralCode = (code: string) => {
    const allUsers = getAllUsers();
    return allUsers.find((u: any) => u.referralCode === code);
}

// This function simulates sending an OTP.
export async function sendOtp(email: string) {
    if (typeof window !== 'undefined') {
        // We store the email to associate the OTP with it on the verification step.
        window.sessionStorage.setItem('emailForSignIn', email);
    }
    console.log(`OTP/Magic Link SENT to ${email}: The mock code is ${MOCK_OTP}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}

// Check for uniqueness across all users
const isEmailUnique = (email: string) => {
    const allUsers = getAllUsers();
    return !allUsers.some(u => u.email === email);
}

const isPhoneUnique = (phone: string, currentUserId: string) => {
    if (!phone) return true; // Don't validate empty strings
    const allUsers = getAllUsers();
    return !allUsers.some(u => u.phone === phone && u.id !== currentUserId);
}


export function signInWithOtp(email: string, otp: string, role: string, referralCode?: string) {
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

    // Special handling for admin login
    if (role === 'admin') {
        const adminUser = ADMIN_ACCOUNTS.find(admin => admin.email === email);
        if (adminUser) {
            window.sessionStorage.removeItem('emailForSignIn');
            return { user: { ...adminUser, fullName: 'Admin' }, error: null, isNewUser: false };
        } else {
            window.sessionStorage.removeItem('emailForSignIn');
            return { user: null, error: "This email is not registered as an admin.", isNewUser: false };
        }
    }
    
    const allKnownUsers = getAllUsers();

    // Find user or create a new one
    let user = allKnownUsers.find(u => u.email === email && u.role === role);
    let isNewUser = false;
    
    if (!user) {
        // Before creating, check if email is globally unique across all roles
        if (allKnownUsers.some(u => u.email === email)) {
            return { user: null, error: "This email address is already in use with a different role.", isNewUser: false };
        }

        isNewUser = true;
        const emailPrefix = email.split('@')[0];
        const isProfessional = ['doctor', 'pharmacy', 'lab', 'health-coordinator'].includes(role);

        user = { 
            id: `${role}_${emailPrefix}_${Date.now()}`,
            email,
            role, 
            referralCode: isProfessional ? generateReferralCode() : null,
            fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`, // Mock name
            phone: '',
            status: isProfessional ? 'pending' : 'approved', // New users need approval
            dateJoined: new Date().toISOString(),
            // Professional registration details
            registrationNumber: '',
            registrationCertificate: '',
            // Health Coordinator verification details
            aadharNumber: '',
            aadharFrontImage: '',
            aadharBackImage: '',
        };

        // Add to appropriate mock data store based on role
        if (role === 'doctor') {
            const doctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]');
            sessionStorage.setItem('doctorsData', JSON.stringify([...doctors, { ...user, specialty: 'General', experience: 0, location: 'City', bio: '', image: 'https://picsum.photos/400/400', reviewsList: [] }]));
        } else if (role === 'pharmacy') {
            const pharmacies = JSON.parse(sessionStorage.getItem('mockPharmacies') || '[]');
            sessionStorage.setItem('mockPharmacies', JSON.stringify([...pharmacies, { ...user, location: 'City', image: 'https://picsum.photos/400/300', discount: 15, phoneNumber: '', reviewsList: [] }]));
        } else if (role === 'lab') {
            const labs = JSON.parse(sessionStorage.getItem('mockLabs') || '[]');
            sessionStorage.setItem('mockLabs', JSON.stringify([...labs, { ...user, location: 'City', image: 'https://picsum.photos/400/300', discount: 30, phoneNumber: '', reviewsList: [] }]));
        } else {
             users.push(user); // For patients and health coordinators
        }
        
        // Handle referral logic for new users
        if (referralCode) {
            const referrer = findUserByReferralCode(referralCode);
            if (referrer) {
                 createReferral(referrer.id, user.id, user.role);
            } else {
                 return { user: null, error: "Invalid referral code.", isNewUser: false };
            }
        }
        console.log('New user created and awaiting approval:', user);

    } else {
        console.log('Existing user logging in:', user);
    }
    
    if (user.status === 'rejected' || user.status === 'disabled') {
        return { user: null, error: "Your account has been rejected or disabled by the administrator.", isNewUser: false };
    }
    
    window.sessionStorage.removeItem('emailForSignIn');
    return { user, error: null, isNewUser };
}

export function getAllPendingUsers() {
    const doctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]').filter((u: any) => u.status === 'pending');
    const labs = JSON.parse(sessionStorage.getItem('mockLabs') || '[]').filter((u: any) => u.status === 'pending');
    const pharmacies = JSON.parse(sessionStorage.getItem('mockPharmacies') || '[]').filter((u: any) => u.status === 'pending');
    const healthCoordinators = users.filter((u: any) => u.role === 'health-coordinator' && u.status === 'pending');
    return [...doctors, ...labs, ...pharmacies, ...healthCoordinators];
}

export function updateUserStatus(userId: string, role: string, newStatus: 'approved' | 'rejected') {
     let key;
     switch(role) {
         case 'doctor': key = 'doctorsData'; break;
         case 'lab': key = 'mockLabs'; break;
         case 'pharmacy': key = 'mockPharmacies'; break;
         case 'health-coordinator':
         case 'patient':
            const userIndex = users.findIndex(u => u.id === userId);
            if(userIndex > -1) {
                users[userIndex].status = newStatus;
                 const storedUser = sessionStorage.getItem('user');
                if (storedUser) {
                    const u = JSON.parse(storedUser);
                    if (u.id === userId) {
                        u.status = newStatus;
                        sessionStorage.setItem('user', JSON.stringify(u));
                    }
                }
            }
            return;
     }

     const storedData = sessionStorage.getItem(key);
     if(storedData) {
         let data = JSON.parse(storedData);
         data = data.map((item: any) => {
             if(item.id === userId) {
                 return { ...item, status: newStatus };
             }
             return item;
         });
         sessionStorage.setItem(key, JSON.stringify(data));
     }
}

export function isRegistrationNumberUnique(role: 'doctor' | 'lab' | 'pharmacy', regNumber: string, currentUserId: string): boolean {
    const allUsers = getAllUsers();
    const existingUser = allUsers.find(
        (u: any) => u.registrationNumber === regNumber && u.id !== currentUserId
    );
    return !existingUser;
}

export function isAadharNumberUnique(aadharNumber: string, currentUserId: string): boolean {
    const allUsers = getAllUsers();
    const existingUser = allUsers.find(
        (u: any) => u.aadharNumber === aadharNumber && u.id !== currentUserId
    );
    return !existingUser;
}

export { isPhoneUnique };


/**
 * Verifies if the currently logged-in user is a legitimate admin.
 * In a real app, this would check a secure, server-set HTTP-only cookie.
 * For this demo, it checks sessionStorage against the hardcoded admin list.
 * @returns {boolean} True if the user is a verified admin, false otherwise.
 */
export function verifyAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return false;

    try {
        const user = JSON.parse(storedUser);
        // Check if the user from session exists in our secure list
        return user.role === 'admin' && ADMIN_ACCOUNTS.some(admin => admin.id === user.id && admin.email === user.email);
    } catch (e) {
        return false;
    }
}

export function getAllUsersForAdmin() {
    const doctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]');
    const labs = JSON.parse(sessionStorage.getItem('mockLabs') || '[]');
    const pharmacies = JSON.parse(sessionStorage.getItem('mockPharmacies') || '[]');
    // For patients and health coordinators, we assume they are in the in-memory `users` array
    return [...doctors, ...labs, ...pharmacies, ...users];
}

export function toggleUserStatus(userId: string, role: string) {
    let key: string | null = null;
    let dataArray: any[] | null = null;
    let inMemory = false;

    switch(role) {
        case 'doctor': key = 'doctorsData'; break;
        case 'lab': key = 'mockLabs'; break;
        case 'pharmacy': key = 'mockPharmacies'; break;
        case 'patient':
        case 'health-coordinator':
            inMemory = true;
            dataArray = users;
            break;
    }

    if (!inMemory && key) {
        const stored = sessionStorage.getItem(key);
        dataArray = stored ? JSON.parse(stored) : [];
    }

    if (!dataArray) return false;

    let userFound = false;
    const updatedArray = dataArray.map((user: any) => {
        if (user.id === userId) {
            userFound = true;
            const newStatus = user.status === 'disabled' ? 'approved' : 'disabled';
            return { ...user, status: newStatus };
        }
        return user;
    });

    if (userFound) {
        if (inMemory) {
            // This is tricky as we are modifying the original `users` array.
            const userIndex = users.findIndex(u => u.id === userId);
            if(userIndex > -1) {
                users[userIndex].status = users[userIndex].status === 'disabled' ? 'approved' : 'disabled';
            }
        } else if (key) {
            sessionStorage.setItem(key, JSON.stringify(updatedArray));
        }
    }

    return userFound;
}
