export type ClientStatus = 'normal' | 'blocked' | 'deleted';

export interface Client {
    id: string;
    name: string;
    ci_nit: string;
    phone: string | null;
    status: ClientStatus;
    observations: string | null;
    created_at: string;
    updated_at: string;
}

export interface IGetClientsResponse {
    data: Client[];
}

export interface IClientResponse {
    data: Client;
    message?: string;
}
