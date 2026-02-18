import { create } from 'zustand';
import { Office } from '@/interfaces/office.interface';
import { ENV } from "@/config/env";

interface OfficeState {
    offices: Office[];
    isLoading: boolean;
    error: string | null;
    fetchOffices: () => Promise<void>;
    createOffice: (office: Omit<Office, 'id'>) => Promise<void>;
    updateOffice: (id: string, office: Partial<Office>) => Promise<void>;
    deleteOffice: (id: string) => Promise<void>;
}



export const useOfficeStore = create<OfficeState>((set) => ({
    offices: [],
    isLoading: false,
    error: null,

    fetchOffices: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<{ data: Office[] }>("/offices");
            set({ offices: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    createOffice: async (office) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<{ data: Office }>("/offices", office);
            set((state) => ({
                offices: [...state.offices, data.data],
                isLoading: false
            }));
            return Promise.resolve();
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateOffice: async (id, updatedOffice) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<{ data: Office }>(`/offices/${id}`, updatedOffice);
            set((state) => ({
                offices: state.offices.map((o) => o.id === id ? data.data : o),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteOffice: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/offices/${id}`);
            set((state) => ({
                offices: state.offices.filter((o) => o.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    }
}));
