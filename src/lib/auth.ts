// A simple in-memory store for users
const users: any[] = [];
const MOCK_OTP = '123456';

export function loginWithOtp(phone: string, otp: string, role: string) {
    // In a real app, you'd verify the OTP against a secure service.
    // Here, we'll just check against a mock OTP.
    if (otp !== MOCK_OTP) {
        return null;
    }

    // Find user or create a new one
    let user = users.find(u => u.phone === phone && u.role === role);
    
    if (!user) {
        user = { 
            phone,
            role, 
            fullName: `User ${phone.slice(-4)}`, // Mock name
            email: `${phone}@example.com` // Mock email
        };
        users.push(user);
        console.log('New user created and logged in:', user);
    } else {
        console.log('Existing user logged in:', user);
    }
    
    console.log('Current Users:', users);
    return user;
}


export function registerUser(userData: any) {
    const existingUser = users.find(u => u.email === userData.email || u.phone === userData.phone);
    if (existingUser) {
        return false; // User already exists
    }
    users.push(userData);
    console.log('Registered Users:', users);
    return true;
}

export function loginUser(emailOrPhone: string, password: string, role: string) {
    const user = users.find(u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.role === role);

    if (user && user.password === password) {
        return user;
    }
    return null;
}
