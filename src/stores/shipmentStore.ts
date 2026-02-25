import { create } from 'zustand';
import { PublicService } from '@/services/public.service';
import { IShipmentResponse, IShipmentEvent } from '@/interfaces/public.interface';
import { toast } from 'sonner';

export type ShipmentStatus = 'created' | 'in_transit' | 'at_office' | 'out_for_delivery' | 'delivered';

export interface ShipmentEvent {
  status: ShipmentStatus;
  location: string;
  timestamp: Date;
  description: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  origin: string;
  destination: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery: Date;
  events: ShipmentEvent[];
  senderName: string;
  receiverName: string;
}

interface ShipmentState {
  currentShipment: Shipment | null;
  isLoading: boolean;
  trackShipment: (code: string) => Promise<void>;
  resetShipment: () => void;
}

export const useShipmentStore = create<ShipmentState>((set) => ({
  currentShipment: null,
  isLoading: false,

  trackShipment: async (code: string) => {
    set({ isLoading: true, currentShipment: null });
    try {
      const data = await PublicService.trackShipment(code);

      const shipment: Shipment = {
        id: data.id.toString(),
        trackingCode: data.tracking_code,
        origin: data.origin_office.city?.name || 'N/A',
        destination: data.destination_office.city?.name || 'N/A',
        currentStatus: data.current_status as ShipmentStatus,
        estimatedDelivery: new Date(data.estimated_delivery),
        senderName: data.sender_name,
        receiverName: data.receiver_name,
        events: data.events.map((e) => ({
          status: e.status as ShipmentStatus,
          location: e.location || 'Oficina',
          timestamp: new Date(e.timestamp),
          description: e.description || 'Actualización de estado',
        })),
      };

      set({ currentShipment: shipment });
    } catch (error) {
      console.error(error);
      toast.error('No se encontró el envío o hubo un error');
      set({ currentShipment: null });
    } finally {
      set({ isLoading: false });
    }
  },

  resetShipment: () => set({ currentShipment: null }),
}));

