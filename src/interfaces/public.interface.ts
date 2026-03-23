import { IUser } from "./backend.interface";

export interface IOffice {
    id: number;
    name: string;
    city: {
        id: string;
        name: string;
    };
    address: string;
    phone?: string;
    hours?: string;
    image?: string;
    coordinates?: string;
    managers?: { id: string; name: string; phone?: string }[];
}

export interface IShipmentEvent {
    id: number;
    shipment_id: number;
    status: string;
    location: string;
    description: string;
    timestamp: string; // ISO date string from backend
}

export interface IShipmentResponse {
    id: number;
    tracking_code: string;
    current_status: string;
    sender_name: string;
    receiver_name: string;
    origin_office: IOffice;
    destination_office: IOffice;
    estimated_delivery: string;
    events: IShipmentEvent[];
    price: number;
}
