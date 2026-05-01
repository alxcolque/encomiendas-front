import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { toast } from 'sonner';

/**
 * Professional Hook to manage mobile camera scanner with Capacitor.
 * Handles permissions, UI transparency, and scanning logic.
 */
export const useDeviceScanner = () => {
    const startScan = async (onScan: (content: string) => void) => {
        try {
            // 1. Check/Request Permissions
            const status = await BarcodeScanner.checkPermission({ force: true });

            if (status.denied) {
                toast.error("Permiso de cámara denegado. Por favor, habilítalo en los ajustes del sistema.");
                return;
            }

            if (!status.granted) {
                toast.error("No se otorgaron permisos para usar la cámara.");
                return;
            }

            // 2. Prepare UI (The plugin renders the camera behind the webview)
            // We must make the body transparent to see the camera
            document.querySelector('body')?.classList.add('scanner-active');
            await BarcodeScanner.hideBackground();

            // 3. Start Scan
            const result = await BarcodeScanner.startScan(); // This blocks until a code is scanned or canceled

            if (result.hasContent) {
                onScan(result.content);
            }

            // 4. Cleanup
            stopScan();

        } catch (error) {
            console.error('Scan error:', error);
            toast.error("Error al iniciar el escáner.");
            stopScan();
        }
    };

    const stopScan = () => {
        BarcodeScanner.showBackground();
        BarcodeScanner.stopScan();
        document.querySelector('body')?.classList.remove('scanner-active');
    };

    return {
        startScan,
        stopScan
    };
};
