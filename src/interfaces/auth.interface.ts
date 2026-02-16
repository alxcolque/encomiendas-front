export type UserRole = 'admin' | 'worker' | 'driver' | 'client';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginCredentials {
    email?: string;
    password?: string;
    phone?: string; // keeping for backward compatibility if needed
    pin?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}
