import { create } from 'zustand';
import { RouteValue } from '@/interfaces/city.interface';
import { ENV } from '@/config/env';

interface RouteValueState {
    routeValues: RouteValue[];
    isLoading: boolean;
    error: string | null;
    fetchRouteValues: () => Promise<void>;
    createRouteValue: (rv: { city_a: string; city_b: string; value: number }) => Promise<void>;
    updateRouteValue: (id: string, value: number) => Promise<void>;
    deleteRouteValue: (id: string) => Promise<void>;
    findRouteValue: (cityA: string, cityB: string) => Promise<RouteValue | null>;
    generateRoutes: () => Promise<void>;
}

export const useRouteValueStore = create<RouteValueState>((set) => ({
    routeValues: [],
    isLoading: false,
    error: null,

    fetchRouteValues: async () => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.get<{ data: RouteValue[] }>('/route-values');
            set({ routeValues: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    createRouteValue: async (rv) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.post<{ data: RouteValue }>('/route-values', rv);
            set((state) => ({
                routeValues: [...state.routeValues, data.data],
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateRouteValue: async (id, value) => {
        set({ isLoading: true });
        try {
            const { data } = await ENV.put<{ data: RouteValue }>(`/route-values/${id}`, { value });
            set((state) => ({
                routeValues: state.routeValues.map((rv) => (rv.id === id ? data.data : rv)),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteRouteValue: async (id) => {
        set({ isLoading: true });
        try {
            await ENV.delete(`/route-values/${id}`);
            set((state) => ({
                routeValues: state.routeValues.filter((rv) => rv.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    findRouteValue: async (cityA, cityB) => {
        try {
            const { data } = await ENV.get<{ data: RouteValue }>(`/route-values/find`, {
                params: { city_a: cityA, city_b: cityB }
            });
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    generateRoutes: async () => {
        set({ isLoading: true });
        try {
            await ENV.post('/route-values/generate');
            // Re-fetch after generating
            const { data } = await ENV.get<{ data: RouteValue[] }>('/route-values');
            set({ routeValues: data.data || [], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));
