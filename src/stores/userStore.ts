import { create, StateCreator } from "zustand";
import { ENV } from "../config/env";
import { AdminUser, IGetUsersResponse, IUserResponse } from "@/interfaces/user.interface";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useAuthStore } from "./authStore";

interface UserState {
    users: AdminUser[];
    user: AdminUser | null;
    profile: AdminUser | null;
    isLoading: boolean;
}

interface Actions {
    getUsers: () => Promise<void>;
    getUser: (id: string) => Promise<void>;
    createUser: (dataUser: any) => Promise<void>; // dataUser includes avatar base64
    updateUser: (id: string, dataUser: any) => Promise<any>;
    deleteUser: (id: string) => Promise<void>;

    // Profile methods matching backend
    fetchProfile: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    changePin: (data: { current_pin: string; pin: string; pin_confirmation: string }) => Promise<void>;
}

const storeApi: StateCreator<UserState & Actions> = (set, get) => ({
    users: [],
    user: null, // Specific user details
    profile: null, // Authenticated user profile
    isLoading: false,

    // Authorization header is now handled by ENV interceptor in src/config/env.ts

    // Get all users
    getUsers: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<IGetUsersResponse>("/users");
            set({ users: data.users || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    // Get single user
    getUser: async (id) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<AdminUser>(`/users/${id}`);
            set({ user: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            toast.error("Error al obtener usuario");
        }
    },

    // Create user
    createUser: async (dataUser) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<IUserResponse>("/users", dataUser);
            set((state) => ({
                users: [...state.users, data.user],
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                throw error;
            }
        }
    },

    // Update user
    updateUser: async (id, dataUser) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<IUserResponse>(`/users/${id}`, dataUser);
            set((state) => ({
                users: state.users.map((u) => u.id === id ? data.user : u),
                user: data.user,
                isLoading: false
            }));
            return data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/users/${id}`);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                isLoading: false
            }));
            toast.success("Usuario eliminado correctamente");
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || "Error al eliminar usuario");
            }
        }
    },

    // Profile methods
    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get("/user/profile");
            set({ profile: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateProfile: async (formData) => {
        try {
            const { data } = await ENV.post("/user/profile", formData);
            set({ profile: data.user });
            toast.success(data.message || "Perfil actualizado");
        } catch (error) {
            throw error;
        }
    },

    changePin: async (pinData) => {
        try {
            const { data } = await ENV.post("/user/change-pin", pinData);
            toast.success(data.message || "PIN actualizado");
        } catch (error) {
            throw error;
        }
    }

});

export const useUserStore = create<UserState & Actions>()(storeApi);
