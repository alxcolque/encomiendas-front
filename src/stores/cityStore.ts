import { create } from 'zustand';
import { City } from '@/interfaces/city.interface';
import { ENV } from '@/config/env';

interface CityState {
    cities: City[];
    isLoading: boolean;
    error: string | null;
    fetchCities: () => Promise<void>;
    createCity: (city: Omit<City, 'id'>) => Promise<void>;
    updateCity: (id: string, city: Partial<City>) => Promise<void>;
    deleteCity: (id: string) => Promise<void>;
}

export const useCityStore = create<CityState>((set) => ({
    cities: [],
    isLoading: false,
    error: null,

    fetchCities: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<{ data: City[] }>('/cities');
            set({ cities: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    createCity: async (city) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<{ data: City }>('/cities', city);
            set((state) => ({
                cities: [...state.cities, data.data],
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateCity: async (id, updatedCity) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<{ data: City }>(`/cities/${id}`, updatedCity);
            set((state) => ({
                cities: state.cities.map((c) => (c.id === id ? data.data : c)),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteCity: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/cities/${id}`);
            set((state) => ({
                cities: state.cities.filter((c) => c.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
