import { City } from './city.interface';
import { Invoice } from './invoice.interface';

export type ShipmentStatus = 'quote' | 'created' | 'in_transit' | 'at_office' | 'delivered';

export interface AdminOffice {
    id: string;
    name: string;
    city: City;
    city_id: string;
    address: string;
    status: string;
}

export interface AdminShipmentEvent {
    id: string;
    shipment_id: string;
    status: ShipmentStatus;
    location: string;
    description: string;
    timestamp: string;
}

export interface AdminShipment {
    id: string;
    tracking_code: string;
    origin_office_id: string;
    destination_office_id: string;
    origin_office?: AdminOffice;
    destination_office?: AdminOffice;
    sender_name: string;
    sender_ci?: string;
    sender_phone?: string;
    sender_id?: string;
    receiver_name: string;
    receiver_ci?: string;
    receiver_phone?: string;
    receiver_id?: string;
    current_status: ShipmentStatus;
    estimated_delivery?: string;
    price: number;
    discount: number;
    tracking_pay: number;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    is_pack: boolean;
    is_fragile: boolean;
    type_service: 'normal' | 'standard' | 'express';
    track_type: number;
    observation?: string;
    events?: AdminShipmentEvent[];
    invoice?: Invoice;
    created_at?: string;
    updated_at?: string;
}

export interface CreateShipmentPayload {
    tracking_code?: string;
    origin_office_id: string;
    destination_office_id: string;
    sender_id?: string;
    receiver_id?: string;

    // Optional client data for auto-creation
    sender_name?: string;
    sender_ci?: string;
    sender_phone?: string;
    receiver_name?: string;
    receiver_ci?: string;
    receiver_phone?: string;

    tracking_pay: number;
    is_pack: boolean;
    is_fragile: boolean;
    type_service: 'normal' | 'standard' | 'express';
    track_type: number;
    observation?: string;
    current_status?: ShipmentStatus;
    estimated_delivery?: string;
    price: number;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    discount?: number;
}
