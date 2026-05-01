import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

/**
 * Professional Hook to manage mobile camera scanner with Capacitor.
 * Updated for @capacitor-mlkit/barcode-scanning v8.
 */
export const useDeviceScanner = () => {
    /**
     * Web-based scanner using @zxing/browser
     */
    const startWebScan = (onScan: (content: string) => void) => {
        return new Promise<void>(async (resolve) => {
            const codeReader = new BrowserMultiFormatReader();
            
            // 1. Create Overlay UI
            const overlay = document.createElement('div');
            overlay.className = 'web-scanner-overlay';
            
            const container = document.createElement('div');
            container.className = 'web-scanner-container';
            
            const video = document.createElement('video');
            video.className = 'web-scanner-video';
            
            const ui = document.createElement('div');
            ui.className = 'web-scanner-ui';
            
            ui.innerHTML = `
                <div class="flex flex-col items-center gap-2 pt-10">
                    <h2 class="text-white text-xl font-bold tracking-tight">Escaneando Código</h2>
                    <p class="text-white/70 text-sm">Coloque el código dentro del recuadro</p>
                </div>
                <div class="web-scanner-frame">
                    <div class="web-scanner-line"></div>
                </div>
                <div class="pb-20">
                    <button class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold transition-all border border-white/20">
                        Cancelar
                    </button>
                </div>
            `;
            
            container.appendChild(video);
            container.appendChild(ui);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            
            const cleanup = () => {
                codeReader.reset();
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                resolve();
            };
            
            const cancelButton = ui.querySelector('button');
            cancelButton?.addEventListener('click', cleanup);
            
            try {
                // 2. Request Camera Permission & Start Decoding
                // This triggers the browser permission dialog
                await codeReader.decodeFromVideoDevice(undefined, video, (result, error) => {
                    if (result) {
                        onScan(result.getText());
                        cleanup();
                    }
                });
            } catch (err) {
                console.error('ZXing error:', err);
                toast.error("No se pudo acceder a la cámara o ocurrió un error.");
                cleanup();
            }
        });
    };

    /**
     * Starts the scanning process.
     * Uses MLKit for Native and ZXing for Web.
     */
    const startScan = async (onScan: (content: string) => void) => {
        const isNative = Capacitor.isNativePlatform();

        if (!isNative) {
            await startWebScan(onScan);
            return;
        }

        try {
            // Native Logic (MLKit)
            const { supported } = await BarcodeScanner.isSupported();
            if (!supported) {
                toast.error("El escaneo de códigos no es compatible con este dispositivo.");
                return;
            }

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

            const { barcodes } = await BarcodeScanner.scan();
            if (barcodes.length > 0) {
                onScan(barcodes[0].displayValue);
            }

        } catch (error) {
            console.error('Scan error:', error);
            toast.error("Error al iniciar el escáner.");
        } finally {
            stopScan();
        }
    };

    const stopScan = async () => {
        if (Capacitor.isNativePlatform()) {
            try {
                await BarcodeScanner.stopScan();
            } catch (e) {}
            document.querySelector('body')?.classList.remove('scanner-active');
        }
    };

    return {
        startScan,
        stopScan
    };
};
