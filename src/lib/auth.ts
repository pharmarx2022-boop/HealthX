// A simple in-memory store for users
const users: any[] = [];

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
