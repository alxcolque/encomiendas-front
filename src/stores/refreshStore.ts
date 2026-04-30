import { create } from "zustand";
import { useEffect } from "react";

interface RefreshState {
    refreshFn: (() => Promise<void>) | null;
    isRefreshing: boolean;
    setRefreshFn: (fn: (() => Promise<void>) | null) => void;
    triggerRefresh: () => Promise<void>;
}

export const useRefreshStore = create<RefreshState>((set, get) => ({
    refreshFn: null,
    isRefreshing: false,
    setRefreshFn: (fn) => set({ refreshFn: fn }),
    triggerRefresh: async () => {
        const { refreshFn, isRefreshing } = get();
        if (refreshFn && !isRefreshing) {
            set({ isRefreshing: true });
            try {
                await refreshFn();
            } finally {
                set({ isRefreshing: false });
            }
        }
    },
}));

/**
 * Custom hook for components to register their refresh function.
 * Use this in pages like Dashboard, Shipments, etc.
 */
export const useRegisterRefresh = (fn: () => Promise<void>) => {
    const setRefreshFn = useRefreshStore((state) => state.setRefreshFn);
    
    useEffect(() => {
        setRefreshFn(fn);
        return () => setRefreshFn(null);
    }, [fn, setRefreshFn]);
};
