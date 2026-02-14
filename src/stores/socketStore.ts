import { create } from 'zustand';

export type SocketEvent = 
  | 'challenge.created'
  | 'challenge.accepted'
  | 'challenge.completed'
  | 'shipment.status.updated'
  | 'ranking.updated'
  | 'wallet.updated';

interface SocketState {
  isConnected: boolean;
  lastEvent: { type: SocketEvent; data: unknown } | null;
  connect: () => void;
  disconnect: () => void;
  simulateEvent: (type: SocketEvent, data: unknown) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  lastEvent: null,
  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false }),
  simulateEvent: (type, data) => set({ lastEvent: { type, data } }),
}));
