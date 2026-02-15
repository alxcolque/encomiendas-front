export type UserRole = 'admin' | 'worker' | 'driver' | 'client';

export interface User {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    role: UserRole;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (phone: string, role: UserRole) => void;
    logout: () => void;
}
