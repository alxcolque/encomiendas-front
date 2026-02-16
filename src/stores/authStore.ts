import { create } from 'zustand';
import { User, AuthState, LoginCredentials } from '@/interfaces/auth.interface';

// MOCK DATA
const MOCK_USERS: Record<string, User> = {
  '70000000': {
    id: '1', name: 'Admin User', email: 'admin@kolmox.com', phone: '70000000', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  '70000001': {
    id: '2', name: 'Worker User', email: 'worker@kolmox.com', phone: '70000001', role: 'worker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=worker'
  },
  '70000002': {
    id: '3', name: 'Driver User', email: 'driver@kolmox.com', phone: '70000002', role: 'driver', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver'
  },
  '70000003': {
    id: '4', name: 'Client User', email: 'client@kolmox.com', phone: '70000003', role: 'client', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client'
  },
};

const MOCK_PIN = '1234'; // Simple PIN for all mock users

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start false to allow UI to render. fetchUser will set true.
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const { phone, pin, password } = credentials;
      const userPin = pin || password; // Support both for now

      if (!phone || !userPin) throw new Error('Credenciales incompletas');

      // Check PIN
      if (userPin !== MOCK_PIN) {
        throw new Error('PIN incorrecto (Prueba con 1234)');
      }

      // Check User
      const user = MOCK_USERS[phone];
      if (!user) {
        throw new Error('Usuario no encontrado (Prueba 70000000 para Admin)');
      }

      // Simulate Session Persistence (Local for mock only)
      localStorage.setItem('mock_session_user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Error al iniciar sesión',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.removeItem('mock_session_user');
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const stored = localStorage.getItem('mock_session_user');
      if (stored) {
        set({ user: JSON.parse(stored), isAuthenticated: true, isLoading: false, error: null });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
