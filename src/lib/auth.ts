
// A simple in-memory store for users
const users: any[] = [];
const referrals: any[] = []; // To track referrals
export const MOCK_OTP = '123456';

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
    // Assuming health coordinators are stored in a key like 'mockHealthCoordinators' if they existed separately
    // Or we rely on the dynamically created users array.
    users.forEach(u => {
        if(!allKnownUsers.find(k => k.id === u.id)) {
            allKnownUsers.push(u);
        }
    });

    sessionStorage.setItem('all_users_for_referral_lookup', JSON.stringify(allKnownUsers));
}


export function loginWithOtp(email: string, otp: string, role: string, referralCode?: string) {
    // In a real app, you'd verify the OTP against a secure service.
    // Here, we'll just check against a mock OTP.
    if (otp !== MOCK_OTP) {
        return { user: null, error: "Invalid OTP. Please try again." };
    }

    // Assign a static ID for demo purposes based on role
    let userId;
    let hasReferralCode = false;
    const emailPrefix = email.split('@')[0];

    switch(role) {
        case 'doctor':
            userId = `doc_${emailPrefix}`;
            break;
        case 'patient':
             // Assuming patient Rohan Sharma has id 'rohan_sharma'
            userId = 'rohan_sharma';
            break;
        case 'pharmacy':
            userId = `pharm_${emailPrefix}`;
            hasReferralCode = true;
            break;
        case 'lab':
            userId = `lab_${emailPrefix}`;
            hasReferralCode = true;
            break;
        case 'health-coordinator':
            userId = `health_coordinator_${emailPrefix}`;
            hasReferralCode = true;
            break;
        default:
            userId = `${role}_${emailPrefix}`;
    }


    // Find user or create a new one
    let user = users.find(u => u.email === email && u.role === role);
    
    if (!user) {
        user = { 
            id: userId,
            email,
            role, 
            referralCode: hasReferralCode ? generateReferralCode() : null,
            fullName: `${(role.charAt(0).toUpperCase() + role.slice(1)).replace('-coordinator', ' Coordinator')} ${emailPrefix}`, // Mock name
            phone: '9876543210' // Mock phone for backward compatibility with other components
        };
        users.push(user);
        console.log('New user created and logged in:', user);
        
        // Handle referral logic for new users
        if (referralCode) {
            populateAllUsersForLookup(); // Ensure our lookup list is up-to-date
            const referrer = findUserByReferralCode(referralCode);
            if (referrer) {
                 const newReferral = {
                    referralId: `ref_${Date.now()}`,
                    referrerId: referrer.id,
                    referredUserId: user.id,
                    referredUserRole: user.role,
                    status: 'pending',
                    // Reward details can be determined here based on referredUserRole
                };
                referrals.push(newReferral);
                console.log('Referral successful:', newReferral);
                sessionStorage.setItem('referrals', JSON.stringify(referrals));
            } else {
                 return { user: null, error: "Invalid referral code." };
            }
        }

    } else {
        console.log('Existing user logged in:', user);
    }
    
    console.log('Current Users:', users);
    return { user, error: null };
}


export function registerUser(userData: any) {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
        return false; // User already exists
    }
    users.push(userData);
    console.log('Registered Users:', users);
    return true;
}

export function loginUser(email: string, password: string, role: string) {
    const user = users.find(u => (u.email === email) && u.role === role);

    if (user && user.password === password) {
        return user;
    }
    return null;
}
