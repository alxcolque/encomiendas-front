import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { toast } from 'sonner';

/**
 * Professional Hook to manage mobile camera scanner with Capacitor.
 * Updated for @capacitor-mlkit/barcode-scanning v8.
 */
export const useDeviceScanner = () => {
    /**
     * Starts the scanning process using the native "Ready-to-use" UI.
     * This method blocks until a code is scanned or the user cancels.
     */
    const startScan = async (onScan: (content: string) => void) => {
        try {
            // 1. Check if the device supports barcode scanning
            const { supported } = await BarcodeScanner.isSupported();
            if (!supported) {
                toast.error("El escaneo de códigos no es compatible con este dispositivo.");
                return;
            }

            // 2. Check/Request Permissions
            const { camera } = await BarcodeScanner.checkPermissions();

            if (camera === 'denied') {
                toast.error("Permiso de cámara denegado. Por favor, habilítalo en los ajustes del sistema.");
                return;
            }

            if (camera !== 'granted') {
                const { camera: newStatus } = await BarcodeScanner.requestPermissions();
                if (newStatus !== 'granted') {
                    toast.error("No se otorgaron permisos para usar la cámara.");
                    return;
                }
            }

            // 3. Start Scan using the modern ready-to-use interface
            // This provides a native UI and doesn't require WebView transparency hacks.
            const { barcodes } = await BarcodeScanner.scan();

            if (barcodes.length > 0) {
                // The displayValue is usually what the user wants (the decoded string)
                onScan(barcodes[0].displayValue);
            }

        } catch (error) {
            console.error('Scan error:', error);
            toast.error("Error al iniciar el escáner.");
        } finally {
            // Ensure any cleanup is done if we used startScan(), 
            // but with scan() it's generally automatic.
            stopScan();
        }
    };

    const stopScan = async () => {
        // Stop any active scanning session
        try {
            await BarcodeScanner.stopScan();
        } catch (e) {
            // Ignore errors if no scan was active
        }
        document.querySelector('body')?.classList.remove('scanner-active');
    };

    return {
        startScan,
        stopScan
    };
};
