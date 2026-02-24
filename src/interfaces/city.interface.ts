export interface City {
    id: string;
    name: string;
    location?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface RouteValue {
    id: string;
    city_a: City;
    city_b: City;
    value: number | string;
    created_at?: string;
    updated_at?: string;
}
