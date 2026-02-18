export type OfficeStatus = 'active' | 'inactive';

export interface Office {
    id: string;
    name: string;
    city: string;
    address: string;
    phone?: string;
    manager?: string;
    status: OfficeStatus;
    coordinates?: string;
}
