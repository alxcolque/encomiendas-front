import { create } from 'zustand';

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
  shipments: Shipment[];
  currentShipment: Shipment | null;
  trackShipment: (code: string) => Shipment | null;
  updateShipmentStatus: (id: string, status: ShipmentStatus, location: string) => void;
}

const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    trackingCode: 'ENV-2025-001',
    origin: 'La Paz',
    destination: 'Santa Cruz',
    currentStatus: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
    senderName: 'Juan Pérez',
    receiverName: 'María García',
    events: [
      {
        status: 'created',
        location: 'Oficina La Paz Centro',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        description: 'Paquete recibido en oficina',
      },
      {
        status: 'in_transit',
        location: 'En camino a Santa Cruz',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        description: 'Paquete en tránsito',
      },
    ],
  },
  {
    id: 'ship-2',
    trackingCode: 'ENV-2025-002',
    origin: 'Cochabamba',
    destination: 'La Paz',
    currentStatus: 'at_office',
    estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000),
    senderName: 'Carlos Mendoza',
    receiverName: 'Ana López',
    events: [
      {
        status: 'created',
        location: 'Oficina Cochabamba Norte',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        description: 'Paquete recibido',
      },
      {
        status: 'in_transit',
        location: 'En ruta La Paz',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: 'Salió de Cochabamba',
      },
      {
        status: 'at_office',
        location: 'Oficina La Paz Sur',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Llegó a oficina destino',
      },
    ],
  },
];

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  shipments: mockShipments,
  currentShipment: null,
  trackShipment: (code: string) => {
    const shipment = get().shipments.find(
      (s) => s.trackingCode.toLowerCase() === code.toLowerCase()
    );
    if (shipment) {
      set({ currentShipment: shipment });
    }
    return shipment || null;
  },
  updateShipmentStatus: (id: string, status: ShipmentStatus, location: string) => {
    set((state) => ({
      shipments: state.shipments.map((s) =>
        s.id === id
          ? {
              ...s,
              currentStatus: status,
              events: [
                ...s.events,
                {
                  status,
                  location,
                  timestamp: new Date(),
                  description: `Estado actualizado a ${status}`,
                },
              ],
            }
          : s
      ),
    }));
  },
}));
