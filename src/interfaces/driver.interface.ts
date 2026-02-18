import { AdminUser } from "./user.interface";

export interface Driver extends AdminUser {
    // Driver specific fields
    // user_id is the same as id from AdminUser
    vehicle_type: string;
    plate_number: string;
    license_number: string;
    rating: number;
    total_deliveries: number;
    // Current location not yet implemented in backend, but good to have in interface
    current_location?: string;

    // The backend resource returns 'user' object nested? 
    // DriverResource: return [ ...$this->toArray($request), 'user' => new UserResource($this->whenLoaded('user')) ];
    // Actually detailed check: 
    // DriverController: return new DriverResource($driver->load('user'));
    // If DriverResource just delegates to parent or uses nice structure...
    // Let's assume the API returns a flat structure OR nested. 
    // Based on UserStore experience, we might want to flatten it for the frontend or keep it nested.
    // Let's check DriverResource if possible.

    // For now, extending AdminUser implies propertie are mixed in.
    // If backend returns { id:..., vehicle_type:..., user: { id:..., name:... } }
    // Then this interface might need adjustment.
    // user_id is the same as id from AdminUser

    user_id?: number; // If nested
}

export interface IGetDriversResponse {
    data: Driver[];
    meta?: any; // Pagination
}

export interface IDriverResponse {
    data: Driver;
    message?: string;
}
