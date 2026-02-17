import { User } from "./auth.interface";

export type UserStatus = 'active' | 'inactive';

export interface AdminUser extends User {
    status: UserStatus;
}
