

// A simple in-memory store for users
const users: any[] = [];
import { createReferral } from './referrals';

// A secure, hardcoded list of admin accounts.
// In a real application, this would be stored securely in a database.
const ADMIN_ACCOUNTS = [
    { email: 'admin@example.com', id: 'admin_001', role: 'admin', password: 'password123' },
];

const generateReferralCode = () => {
    return `HLH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

const findUserByReferralCode = (code: string) => {
    // In a real app, this would be a database query.
    // For now, we search all known users.
    const allUsers = JSON.parse(sessionStorage.getItem('all_users_for_referral_lookup') || '[]');
    return allUsers.find((u: any) => u.referralCode === code);
}

// Helper to populate all users for referral lookup
const populateAllUsersForLookup = () => {
    // This is a mock function. In a real app, you would fetch this from the DB.
    // Here we'll just combine all mock data user types that can refer.
    const allKnownUsers: any[] = [];
    const addUsers = (key: string) => {
        const stored = sessionStorage.getItem(key);
        if(stored) {
            allKnownUsers.push(...JSON.parse(stored));
        }
    };
    addUsers('mockPharmacies');
    addUsers('mockLabs');
    addUsers('doctorsData');
    // Assuming health coordinators are stored in a key like 'mockHealthCoordinators' if they existed separately
    // Or we rely on the dynamically created users array.
    users.forEach(u => {
        if(!allKnownUsers.find(k => k.id === u.id)) {
            allKnownUsers.push(u);
        }
    });

    sessionStorage.setItem('all_users_for_referral_lookup', JSON.stringify(allKnownUsers));
}


// This function simulates sending an authentication link.
// In a real Firebase app, this would use `sendSignInLinkToEmail` from the Firebase SDK.
export function sendAuthenticationLink(email: string) {
    // We store the email in localStorage because when the user clicks the link and comes back,
    // we need to know which email to sign in. Firebase's SDK handles this automatically.
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email);
    }
    console.log(`SIGN-IN LINK: A sign-in link has been sent to ${email}. In this demo, you don't need to check your email. The link is simulated.`);
    // In a real app, you would not return the link. The user gets it via email.
    // For demo purposes, we can construct a "magic link" that the user can use.
    return `${window.location.href}?signIn=true`;
}


export function completeSignIn(href: string, role: string, referralCode?: string) {
    if (typeof window === 'undefined') {
        return { user: null, error: "Sign-in must be completed in a browser.", isNewUser: false };
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        return { user: null, error: "Sign-in session expired or invalid. Please try again.", isNewUser: false };
    }

    // Special handling for admin login
    if (role === 'admin') {
        const adminUser = ADMIN_ACCOUNTS.find(admin => admin.email === email);
        if (adminUser) {
            window.localStorage.removeItem('emailForSignIn');
            return { user: { ...adminUser, fullName: 'Admin' }, error: null, isNewUser: false };
        } else {
             window.localStorage.removeItem('emailForSignIn');
            return { user: null, error: "This email is not registered as an admin.", isNewUser: false };
        }
    }
    
    // Combine all user data sources for lookup
    const allUsers = [
        ...users,
        ...(JSON.parse(sessionStorage.getItem('doctorsData') || '[]')),
        ...(JSON.parse(sessionStorage.getItem('mockLabs') || '[]')),
        ...(JSON.parse(sessionStorage.getItem('mockPharmacies') || '[]')),
    ];


    // Find user or create a new one
    let user = allUsers.find(u => u.email === email && u.role === role);
    let isNewUser = false;
    
    if (!user) {
        isNewUser = true;
        const emailPrefix = email.split('@')[0];
        const isProfessional = ['doctor', 'pharmacy', 'lab', 'health-coordinator'].includes(role);

        user = { 
            id: `${role}_${emailPrefix}_${Date.now()}`,
            email,
            role, 
            referralCode: isProfessional ? generateReferralCode() : null,
            fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`, // Mock name
            phone: '9876543210', // Mock phone for backward compatibility
            status: isProfessional ? 'pending' : 'approved', // New users need approval
            dateJoined: new Date().toISOString(),
            // Professional registration details
            registrationNumber: '',
            registrationCertificate: '',
            // Health Coordinator verification details
            aadharNumber: '',
            aadharFrontImage: '',
            aadharBackImage: '',
            password: '', // Add password field
        };

        // Add to appropriate mock data store based on role
        if (role === 'doctor') {
            const doctors = JSON.parse(sessionStorage.getItem('doctorsData') || '[]');
            sessionStorage.setItem('doctorsData', JSON.stringify([...doctors, { ...user, specialty: 'General', experience: 0, location: 'City', bio: '', image: 'https://picsum.photos/400/400', reviewsList: [] }]));
        } else if (role === 'pharmacy') {
            const pharmacies = JSON.parse(sessionStorage.getItem('mockPharmacies') || '[]');
            sessionStorage.setItem('mockPharmacies', JSON.stringify([...pharmacies, { ...user, location: 'City', image: 'https://picsum.photos/400/300', discount: 15, whatsappNumber: '', reviewsList: [] }]));
        } else if (role === 'lab') {
            const labs = JSON.parse(sessionStorage.getItem('mockLabs') || '[]');
            sessionStorage.setItem('mockLabs', JSON.stringify([...labs, { ...user, location: 'City', image: 'https://picsum.photos/400/300', discount: 30, whatsappNumber: '', reviewsList: [] }]));
        } else {
             users.push(user); // For patients and health coordinators
        }
        
        // Handle referral logic for new users
        if (referralCode) {
            populateAllUsersForLookup(); // Ensure our lookup list is up-to-date
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
    
    if (user.status === 'rejected') {
        return { user: null, error: "Your registration has been rejected.", isNewUser: false };
    }
    
    window.localStorage.removeItem('emailForSignIn');
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
    const keys = {
        doctor: 'doctorsData',
        lab: 'mockLabs',
        pharmacy: 'mockPharmacies',
    };
    const key = keys[role];
    const allPartners = JSON.parse(sessionStorage.getItem(key) || '[]');
    const existingPartner = allPartners.find((p: any) => p.registrationNumber === regNumber && p.id !== currentUserId);
    return !existingPartner;
}

export function isAadharNumberUnique(aadharNumber: string, currentUserId: string): boolean {
    // For this mock setup, we only check the `users` array which contains health coordinators and patients.
    const existingUser = users.find(
        (u: any) => u.role === 'health-coordinator' && u.aadharNumber === aadharNumber && u.id !== currentUserId
    );
    return !existingUser;
}


/**
 * Verifies if the currently logged-in user is a legitimate admin.
 * In a real app, this would check a secure, server-set HTTP-only cookie.
 * For this demo, it checks sessionStorage against the hardcoded admin list.
 * @returns {boolean} True if the user is a verified admin, false otherwise.
 */
export const MOCK_OTP = '123456';
export function verifyAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return false;

    try {
        const user = JSON.parse(storedUser);
        // Check if the user from session exists in our secure admin list
        return user.role === 'admin' && ADMIN_ACCOUNTS.some(admin => admin.id === user.id && admin.email === user.email);
    } catch (e) {
        return false;
    }
}
