import { User } from "./auth.interface";

export type UserStatus = 'active' | 'inactive';

export type AdminRole = 'admin' | 'worker' | 'driver' | 'company' | 'partner';

export interface AdminUser extends Omit<User, 'role'> {
    role: AdminRole;
    status?: UserStatus;
    password?: string;
    pin?: string;
    offices?: { id: string; name: string }[];
}

export interface IGetUsersResponse {
    message: string;
    users: AdminUser[];
}

export interface IUserResponse {
    message: string;
    user: AdminUser;
}

