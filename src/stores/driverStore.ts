import { create } from 'zustand';

export interface Driver {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'on-delivery';
    avatar: string;
    vehicleType: string;
    plateNumber: string;
    licenseNumber: string;
    currentLocation?: string;
    rating: number;
    totalDeliveries: number;
}

interface DriverState {
    drivers: Driver[];
    isLoading: boolean;
    error: string | null;
    fetchDrivers: () => Promise<void>;
    createDriver: (driver: Omit<Driver, 'id' | 'avatar' | 'rating' | 'totalDeliveries'>) => Promise<void>;
    updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
    deleteDriver: (id: string) => Promise<void>;
}

// MOCK DATA
const MOCK_DRIVERS_DATA: Driver[] = [
    {
        id: '1', name: 'Carlos Mamani', email: 'carlos@kolmox.com', phone: '70000002', status: 'active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver1',
        vehicleType: 'Motocicleta', plateNumber: '2024-ABC', licenseNumber: '7654321', rating: 4.8, totalDeliveries: 154
    },
    {
        id: '2', name: 'Juan Perez', email: 'juan@kolmox.com', phone: '60000002', status: 'on-delivery',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver2',
        vehicleType: 'Automóvil', plateNumber: '4040-XYZ', licenseNumber: '9988776', rating: 4.5, totalDeliveries: 89
    },
    {
        id: '3', name: 'Roberto Gomez', email: 'roberto@kolmox.com', phone: '71234567', status: 'inactive',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver3',
        vehicleType: 'Camión', plateNumber: '1010-TRK', licenseNumber: '5566778', rating: 5.0, totalDeliveries: 312
    }
];

export const useDriverStore = create<DriverState>((set) => ({
    drivers: [],
    isLoading: false,
    error: null,

    fetchDrivers: async () => {
        set({ isLoading: true });
        // Mock API call
        setTimeout(() => {
            set({ drivers: MOCK_DRIVERS_DATA, isLoading: false });
        }, 600);
    },

    createDriver: async (driver) => {
        set({ isLoading: true });
        setTimeout(() => {
            const newDriver = {
                ...driver,
                id: Math.random().toString(36).substr(2, 9),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`,
                rating: 5.0,
                totalDeliveries: 0
            };
            set((state) => ({
                drivers: [...state.drivers, newDriver as Driver],
                isLoading: false
            }));
        }, 500);
    },

    updateDriver: async (id, updatedDriver) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updatedDriver } : d),
                isLoading: false
            }));
        }, 500);
    },

    deleteDriver: async (id) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                drivers: state.drivers.filter((d) => d.id !== id),
                isLoading: false
            }));
        }, 500);
    }
}));
