import { City } from './city.interface';

export type OfficeStatus = 'active' | 'inactive';

export interface Office {
    id: string;
    name: string;
    city: City;
    city_id: string;
    address: string;
    managers?: { id: string; name: string }[];
    status: OfficeStatus;
    coordinates?: string;
    image?: string | null;
}
