import { create } from 'zustand';
import { ENV } from "../config/env";
import { Driver, IGetDriversResponse, IDriverResponse } from "@/interfaces/driver.interface";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface DriverState {
    drivers: Driver[];
    isLoading: boolean;
    error: string | null;
    fetchDrivers: () => Promise<void>;
    createDriver: (driver: any) => Promise<void>;
    updateDriver: (id: string, driver: any) => Promise<void>;
    deleteDriver: (id: string) => Promise<void>;
}

export const useDriverStore = create<DriverState>((set, get) => ({
    drivers: [],
    isLoading: false,
    error: null,

    fetchDrivers: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<IGetDriversResponse>("/drivers");
            set({ drivers: data.data || [], isLoading: false }); // Backend usually returns wrapped in 'data' via Collection
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    createDriver: async (driverData) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<IDriverResponse>("/drivers", driverData);
            set((state) => ({
                drivers: [...state.drivers, data.data], // Assuming single resource return
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                throw error;
            }
        }
    },

    updateDriver: async (id, driverData) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<IDriverResponse>(`/drivers/${id}`, driverData);
            set((state) => ({
                drivers: state.drivers.map((d) => d.id === id ? data.data : d),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteDriver: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/drivers/${id}`);
            set((state) => ({
                drivers: state.drivers.filter((d) => d.id !== id),
                isLoading: false
            }));
            toast.success("Conductor eliminado correctamente");
        } catch (error) {
            set({ isLoading: false });
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || "Error al eliminar conductor");
            }
        }
    }
}));
