import { User } from "./auth.interface";

export type UserStatus = 'active' | 'inactive';

export interface AdminUser extends User {
    status?: UserStatus;
    password?: string;
    pin?: string;
}

export interface IGetUsersResponse {
    message: string;
    users: AdminUser[];
}

export interface IUserResponse {
    message: string;
    user: AdminUser;
}

