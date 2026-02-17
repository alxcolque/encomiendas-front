export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'worker' | 'driver' | 'client';
    avatar?: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    driver_profile?: any; // Add specific type if needed
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
}
