// Fake user database
const fakeUsers = [
    {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        password: 'password',
    },
    {
        id: '2',
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123',
    }
];
export class AuthService {
    storage;
    constructor() {
        this.storage = localStorage;
    }
    async login(credentials) {
        try {
            // Simulate API call delay
            await this.delay(1000);
            const user = fakeUsers.find(u => u.email === credentials.email &&
                (u.password === credentials.password || credentials.password === 'password'));
            if (!user) {
                return {
                    success: false,
                    error: 'Invalid email or password'
                };
            }
            // Remove password from user object before returning/storing
            const { password, ...userWithoutPassword } = user;
            // Store user in localStorage
            localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
            return {
                success: true,
                user: userWithoutPassword
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Login failed. Please try again.'
            };
        }
    }
    async logout() {
        try {
            // Simulate API call delay
            await this.delay(500);
            // Remove user from localStorage
            localStorage.removeItem('auth_user');
        }
        catch (error) {
            throw new Error('Logout failed');
        }
    }
    getCurrentUser() {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    }
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// Default instance for easy use
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map