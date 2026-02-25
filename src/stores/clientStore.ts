import { create } from 'zustand';
import { ENV } from '@/config/env';
import { Client, IGetClientsResponse, IClientResponse } from '@/interfaces/client.interface';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

interface ClientState {
    clients: Client[];
    isLoading: boolean;
    error: string | null;
    fetchClients: () => Promise<void>;
    createClient: (client: Partial<Client>) => Promise<Client>;
    updateClient: (id: string, client: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    changeClientStatus: (id: string, status: Client['status']) => Promise<void>;
    searchClients: (q: string) => Promise<Client[]>;
}

export const useClientStore = create<ClientState>((set) => ({
    clients: [],
    isLoading: false,
    error: null,

    fetchClients: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<IGetClientsResponse>('/clients');
            set({ clients: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    createClient: async (clientData) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<IClientResponse>('/clients', clientData);
            set((state) => ({
                clients: [...state.clients, data.data],
                isLoading: false,
            }));
            toast.success('Cliente registrado correctamente');
            return data.data;
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                throw error;
            }
            throw error;
        }
    },

    updateClient: async (id, clientData) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<IClientResponse>(`/clients/${id}`, clientData);
            set((state) => ({
                clients: state.clients.map((c) => (c.id === id ? data.data : c)),
                isLoading: false,
            }));
            toast.success('Cliente actualizado correctamente');
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                throw error;
            }
        }
    },

    deleteClient: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/clients/${id}`);
            set((state) => ({
                clients: state.clients.filter((c) => c.id !== id),
                isLoading: false,
            }));
            toast.success('Cliente eliminado correctamente');
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                toast.error(
                    (error as any).response?.data?.message || 'Error al eliminar cliente'
                );
            }
        }
    },

    changeClientStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.patch<IClientResponse>(
                `/clients/${id}/status/${status}`
            );
            set((state) => ({
                clients: state.clients.map((c) => (c.id === id ? data.data : c)),
                isLoading: false,
            }));
            toast.success('Estado del cliente actualizado');
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                toast.error('Error al cambiar el estado del cliente');
            }
        }
    },

    searchClients: async (q) => {
        try {
            const { data } = await ENV.get<IGetClientsResponse>(`/clients/search?q=${q}`);
            return data.data || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
}));
