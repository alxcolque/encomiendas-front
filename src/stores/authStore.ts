import { create } from 'zustand';
import { User, UserRole, AuthState } from '@/interfaces/auth.interface';

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: 'admin-1',
    name: 'Carlos Admin',
    phone: '+591 70000001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
  },
  worker: {
    id: 'worker-1',
    name: 'María Oficina',
    phone: '+591 70000002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=worker',
    role: 'worker',
  },
  driver: {
    id: 'driver-1',
    name: 'Juan Conductor',
    phone: '+591 70000003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver',
    role: 'driver',
  },
  client: {
    id: 'client-1',
    name: 'Ana Cliente',
    phone: '+591 70000004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
    role: 'client',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (phone: string, role: UserRole) => {
    const user = { ...mockUsers[role], phone };
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
