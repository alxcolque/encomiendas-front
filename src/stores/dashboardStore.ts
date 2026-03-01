import { create } from "zustand";
import { ENV } from "../config/env";
import { AdminDashboardData } from "@/interfaces/admin/dashboard.interface";

interface DashboardState {
    data: AdminDashboardData | null;
    isLoading: boolean;
    error: string | null;
    fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    data: null,
    isLoading: false,
    error: null,
    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await ENV.get<AdminDashboardData>("/admin/settings/stats");
            set({ data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error al cargar datos del dashboard",
                isLoading: false
            });
        }
    },
}));
