import { ENV } from "../config/env";
import { IOffice, IShipmentResponse } from "../interfaces";

export const PublicService = {
    getOffices: async () => {
        // Laravel Resource Collection returns { data: [...] }
        const { data } = await ENV.get<{ data: IOffice[] }>("/offices");
        return data.data;
    },

    trackShipment: async (code: string) => {
        // Single Resource returns { data: {...} }
        const { data } = await ENV.get<{ data: IShipmentResponse }>(`/shipments/track/${code}`);
        return data.data;
    }
};
