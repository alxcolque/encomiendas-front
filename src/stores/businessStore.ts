import { create } from 'zustand';
import { ENV } from '@/config/env';
import { Business, BusinessStore } from '@/interfaces/business.interface';
import { toast } from 'sonner';

export const useBusinessStore = create<BusinessStore>((set, get) => ({
    businesses: [],
    isLoading: false,
    error: null,

    fetchBusinesses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await ENV.get('/businesses');
            set({ businesses: response.data.data, isLoading: false });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al cargar empresas';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    createBusiness: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ENV.post('/businesses', data);
            set({
                businesses: [...get().businesses, response.data.data],
                isLoading: false
            });
            toast.success('Empresa creada correctamente');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear empresa';
            set({ error: message, isLoading: false });
            toast.error(message);
            throw error;
        }
    },

    updateBusiness: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ENV.put(`/businesses/${id}`, data);
            set({
                businesses: get().businesses.map((b) =>
                    b.id === id ? response.data.data : b
                ),
                isLoading: false
            });
            toast.success('Empresa actualizada correctamente');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al actualizar empresa';
            set({ error: message, isLoading: false });
            toast.error(message);
            throw error;
        }
    },

    deleteBusiness: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await ENV.delete(`/businesses/${id}`);
            set({
                businesses: get().businesses.filter((b) => b.id !== id),
                isLoading: false
            });
            toast.success('Empresa eliminada correctamente');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al eliminar empresa';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    }
}));
