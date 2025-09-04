

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


export function loginWithOtp(email: string, otp: string, role: string, referralCode?: string) {
    // In a real app, you'd verify the OTP against a secure service.
    // Here, we'll just check against a mock OTP.
    if (otp !== MOCK_OTP) {
        return { user: null, error: "Invalid OTP. Please try again.", isNewUser: false };
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
                 const newReferral = {
                    referralId: `ref_${Date.now()}`,
                    referrerId: referrer.id,
                    referredUserId: user.id,
                    referredUserRole: user.role,
                    status: 'pending',
                };
                referrals.push(newReferral);
                console.log('Referral successful:', newReferral);
                sessionStorage.setItem('referrals', JSON.stringify(referrals));
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
    
    return { user, error: null, isNewUser };
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
