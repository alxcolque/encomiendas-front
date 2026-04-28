import { create } from 'zustand';
import { toast } from 'sonner';
import { ENV } from '@/config/env';
import { useAdminShipmentStore } from './adminShipmentStore';

interface ScannerState {
    scanning: boolean;
    lastCode: string | null;
    scanAndUpdateShipment: (rawValue: string) => Promise<void>;
}

const normalizeTrackingCode = (rawValue: string) => {
    let value = rawValue.trim();

    // Detectar si el lector está en inglés (US) pero el teclado de Windows en Español.
    // Esto produce caracteres deformados como 'httpñ--' o 'KOL'LA'
    const isMangled = value.toLowerCase().includes('httpñ') || value.includes('CODE?TRACKING') || value.includes("KOL'");

    if (isMangled) {
        // Mapa de traducción: Carácter escrito por el OS Español -> Carácter original del código QR
        const charMap: Record<string, string> = {
            'Ñ': ':',
            'ñ': ':',
            '-': '/',
            "'": '-',
            '?': '_', 
            '_': '?', 
            '¡': '=',
            '¿': '=',
        };
        
        value = value.split('').map(char => charMap[char] || char).join('');
    }

    try {
        if (value.includes('CODE_TRACKING=')) {
            const parts = value.split('CODE_TRACKING=');
            return parts[1]?.trim() || null;
        }
        return value.trim() || null;
    } catch (e) {
        return null;
    }
};

export const useShipmentScannerStore = create<ScannerState>((set) => ({
    scanning: false,
    lastCode: null,

    scanAndUpdateShipment: async (rawValue) => {
        const trackingCode = normalizeTrackingCode(rawValue);

        if (!trackingCode) {
            toast.error('Código inválido');
            return;
        }

        set({ scanning: true });

        try {
            const { data } = await ENV.post<{ new_status: string }>('/shipments/scan', {
                tracking_code: trackingCode,
            });

            set({ lastCode: trackingCode });

            toast.success(`Estado cambiado a: ${data.new_status || 'Siguiente'}`);

            new Audio('/sounds/ok.mp3').play().catch(() => { });

            // Fetch the updated shipments to reflect the change in the UI tabs
            useAdminShipmentStore.getState().fetchShipments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar');
            new Audio('/sounds/error.mp3').play().catch(() => { });
        } finally {
            set({ scanning: false });
        }
    },
}));
