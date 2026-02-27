export interface KPIData {
    label: string;
    value: string | number;
    change: number; // percentage
    trend: 'up' | 'down' | 'neutral';
    icon: React.ElementType;
    description?: string;
}

export type ShipmentStatus = 'created' | 'pending' | 'in_transit' | 'at_office' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface ShipmentData {
    id: string;
    code: string;
    client: string;
    origin: string;
    destination: string;
    status: ShipmentStatus;
    date: string;
    amount: number;
}

export interface RevenueData {
    name: string; // e.g., "Jan", "Feb" or "Mon", "Tue"
    revenue: number;
    expenses?: number;
}

export interface ShipmentStatusDistribution {
    name: string;
    value: number;
    color: string;
}

export interface DriverStatus {
    id: string;
    name: string;
    avatar?: string;
    status: 'available' | 'busy' | 'offline';
    currentTask?: string;
    activeShipments: number;
}

export interface OfficePerformance {
    id: string;
    name: string;
    processedShipments: number;
    revenue: number;
    efficiency: number; // percentage
}
