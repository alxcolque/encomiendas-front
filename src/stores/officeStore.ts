import { create } from 'zustand';
import { Office } from '@/interfaces/office.interface';

interface OfficeState {
    offices: Office[];
    isLoading: boolean;
    error: string | null;
    fetchOffices: () => Promise<void>;
    createOffice: (office: Omit<Office, 'id'>) => Promise<void>;
    updateOffice: (id: string, office: Partial<Office>) => Promise<void>;
    deleteOffice: (id: string) => Promise<void>;
}

// MOCK DATA
const MOCK_OFFICES_DATA: Office[] = [
    {
        id: '1', name: 'Oficina Central Oruro', city: 'Oruro', address: 'Calle Bolívar #123',
        phone: '2-5200000', manager: 'Ana Flores', status: 'active'
    },
    {
        id: '2', name: 'Sucursal Terminal', city: 'Oruro', address: 'Terminal de Buses, Local 45',
        phone: '2-5200001', manager: 'Mario Cruz', status: 'active'
    },
    {
        id: '3', name: 'Oficina La Paz', city: 'La Paz', address: 'Av. Montes #789',
        phone: '2-2400000', manager: 'Sofia Lima', status: 'active'
    },
    {
        id: '4', name: 'Oficina Cochabamba', city: 'Cochabamba', address: 'Av. Ayacucho #456',
        phone: '4-4200000', manager: 'Pedro Rojas', status: 'inactive'
    }
];

export const useOfficeStore = create<OfficeState>((set) => ({
    offices: [],
    isLoading: false,
    error: null,

    fetchOffices: async () => {
        set({ isLoading: true });
        // Mock API call
        setTimeout(() => {
            set({ offices: MOCK_OFFICES_DATA, isLoading: false });
        }, 600);
    },

    createOffice: async (office) => {
        set({ isLoading: true });
        setTimeout(() => {
            const newOffice = {
                ...office,
                id: Math.random().toString(36).substr(2, 9)
            };
            set((state) => ({
                offices: [...state.offices, newOffice as Office],
                isLoading: false
            }));
        }, 500);
    },

    updateOffice: async (id, updatedOffice) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                offices: state.offices.map((o) => o.id === id ? { ...o, ...updatedOffice } : o),
                isLoading: false
            }));
        }, 500);
    },

    deleteOffice: async (id) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                offices: state.offices.filter((o) => o.id !== id),
                isLoading: false
            }));
        }, 500);
    }
}));
