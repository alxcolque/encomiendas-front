import { create } from 'zustand';
import { AdminUser } from '@/interfaces/user.interface';

interface UserState {
    users: AdminUser[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (user: Omit<AdminUser, 'id'>) => Promise<void>;
    updateUser: (id: string, user: Partial<AdminUser>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

// MOCK DATA
const MOCK_USERS_DATA: AdminUser[] = [
    {
        id: '1', name: 'Admin User', email: 'admin@kolmox.com', phone: '70000000', role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', status: 'active'
    },
    {
        id: '2', name: 'Worker User', email: 'worker@kolmox.com', phone: '70000001', role: 'worker',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=worker', status: 'active'
    },
    {
        id: '3', name: 'Driver User', email: 'driver@kolmox.com', phone: '70000002', role: 'driver',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver', status: 'active'
    },
    {
        id: '4', name: 'Client User', email: 'client@kolmox.com', phone: '70000003', role: 'client',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client', status: 'inactive'
    },
];

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true });
        // Mock API call
        setTimeout(() => {
            set({ users: MOCK_USERS_DATA, isLoading: false });
        }, 500);
    },

    createUser: async (user) => {
        set({ isLoading: true });
        setTimeout(() => {
            const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
            set((state) => ({
                users: [...state.users, newUser as AdminUser],
                isLoading: false
            }));
        }, 500);
    },

    updateUser: async (id, updatedUser) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                users: state.users.map((u) => u.id === id ? { ...u, ...updatedUser } : u),
                isLoading: false
            }));
        }, 500);
    },

    deleteUser: async (id) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                isLoading: false
            }));
        }, 500);
    }
}));
