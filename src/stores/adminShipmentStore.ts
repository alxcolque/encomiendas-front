import { create } from 'zustand';
import { AdminShipment, CreateShipmentPayload, ShipmentStatus } from '@/interfaces/shipment.interface';
import { ENV } from '@/config/env';

interface AdminShipmentState {
    shipments: AdminShipment[];
    isLoading: boolean;
    error: string | null;
    fetchShipments: () => Promise<void>;
    fetchShipmentById: (id: string) => Promise<AdminShipment>;
    createShipment: (payload: CreateShipmentPayload) => Promise<AdminShipment>;
    updateShipment: (id: string, payload: Partial<CreateShipmentPayload>) => Promise<void>;
    updateStatus: (id: string, status: ShipmentStatus) => Promise<void>;
    deleteShipment: (id: string) => Promise<void>;
}

export const useAdminShipmentStore = create<AdminShipmentState>((set, get) => ({
    shipments: [],
    isLoading: false,
    error: null,

    fetchShipments: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await ENV.get<{ data: AdminShipment[] }>('/shipments');
            set({ shipments: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Error al cargar encomiendas' });
            console.error(error);
        }
    },

    fetchShipmentById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await ENV.get<{ data: AdminShipment }>(`/shipments/${id}`);
            set({ isLoading: false });
            return data.data;
        } catch (error) {
            set({ isLoading: false, error: 'Error al cargar la encomienda' });
            throw error;
        }
    },

    createShipment: async (payload) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<{ data: AdminShipment }>('/shipments', payload);
            set((state) => ({
                shipments: [data.data, ...state.shipments],
                isLoading: false,
            }));
            return data.data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateShipment: async (id, payload) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<{ data: AdminShipment }>(`/shipments/${id}`, payload);
            set((state) => ({
                shipments: state.shipments.map((s) => s.id === id ? data.data : s),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        await get().updateShipment(id, { current_status: status } as any);
    },

    deleteShipment: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/shipments/${id}`);
            set((state) => ({
                shipments: state.shipments.filter((s) => s.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
