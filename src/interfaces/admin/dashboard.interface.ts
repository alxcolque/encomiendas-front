export interface KPIData {
    label: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    icon: any;
}

export interface AdminDashboardData {
    kpi: KPIData[];
    charts: {
        shipments: { month: string; value: number }[];
        revenue: { month: string; value: number }[];
        status: { [key: string]: number };
    };
    recent_shipments: any[];
    office_performance: { name: string; total: number }[];
    active_drivers: any[];
    active_drivers_count: number;
    total_offices_count: number;
}

export type ShipmentStatus = 'created' | 'in_transit' | 'at_office' | 'delivered';

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
