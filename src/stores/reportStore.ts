import { create } from "zustand";
import { ENV } from "../config/env";

export interface ReportData {
    kpi: {
        revenue: number;
        shipments: number;
        activeUsers: number;
        efficiency: number;
    };
    charts: {
        revenue: { label: string; revenue: number }[];
        volume: { label: string; packages: number }[];
        status: { browser: string; visitors: number; fill: string }[];
    }
}

interface ReportState {
    data: ReportData | null;
    isLoading: boolean;
    error: string | null;
    fetchReportData: (startDate: string, endDate: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
    data: null,
    isLoading: false,
    error: null,
    fetchReportData: async (startDate: string, endDate: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await ENV.get<ReportData>(`/reports?start_date=${startDate}&end_date=${endDate}`);
            set({ data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error al cargar reportes",
                isLoading: false
            });
        }
    },
}));
