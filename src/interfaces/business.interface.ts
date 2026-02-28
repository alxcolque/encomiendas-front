export type BusinessStatus = 'activo' | 'inactivo' | 'bloqueado';

export interface Business {
    id: string;
    company_name: string;
    code: string;
    phone: string | null;
    description: string | null;
    location: string | null;
    status: BusinessStatus;
    created_at?: string;
    updated_at?: string;
}

export interface BusinessStore {
    businesses: Business[];
    isLoading: boolean;
    error: string | null;
    fetchBusinesses: () => Promise<void>;
    createBusiness: (business: Omit<Business, 'id'>) => Promise<void>;
    updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
    deleteBusiness: (id: string) => Promise<void>;
}
