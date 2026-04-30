export type UserRole = 'admin' | 'worker' | 'driver' | 'client' | 'company' | 'partner';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    avatar_key?: string;
    role: UserRole;
    pin?: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    offices?: { id: string; name: string; city_id?: string }[];
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
