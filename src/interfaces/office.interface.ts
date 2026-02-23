export type OfficeStatus = 'active' | 'inactive';

export interface Office {
    id: string;
    name: string;
    city: string;
    address: string;
    // phone?: string; // Removed
    // manager?: string; // Removed
    managers?: { id: string; name: string }[];
    status: OfficeStatus;
    coordinates?: string;
}
