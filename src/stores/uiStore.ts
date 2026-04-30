import { create } from 'zustand';

interface UIState {
  isBackBlocked: boolean;
  blockers: Set<string>;
  addBlocker: (id: string) => void;
  removeBlocker: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBackBlocked: false,
  blockers: new Set(),
  addBlocker: (id) => set((state) => {
    const newBlockers = new Set(state.blockers).add(id);
    return { blockers: newBlockers, isBackBlocked: newBlockers.size > 0 };
  }),
  removeBlocker: (id) => set((state) => {
    const newBlockers = new Set(state.blockers);
    newBlockers.delete(id);
    return { blockers: newBlockers, isBackBlocked: newBlockers.size > 0 };
  }),
}));
