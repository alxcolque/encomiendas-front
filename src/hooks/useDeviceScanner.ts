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
            let videoTrack: MediaStreamTrack | null = null;
            let currentZoom = 1;
            let isScanning = true;
            
            // 1. Create Overlay UI
            const overlay = document.createElement('div');
            overlay.className = 'web-scanner-overlay';
            
            const container = document.createElement('div');
            container.className = 'web-scanner-container';
            
            const video = document.createElement('video');
            video.className = 'web-scanner-video';
            video.setAttribute('playsinline', 'true');
            
            const ui = document.createElement('div');
            ui.className = 'web-scanner-ui pointer-events-none';
            
            ui.innerHTML = `
                <div class="flex flex-col items-center gap-2 pt-10">
                    <h2 class="text-white text-xl font-bold tracking-tight">Escaneando Código</h2>
                    <p class="text-white/70 text-sm">Coloque el código dentro del recuadro</p>
                </div>
                <div class="web-scanner-frame pointer-events-none">
                    <div class="web-scanner-line"></div>
                </div>
                <div class="pb-20 flex gap-4 pointer-events-auto relative z-50">
                    <button id="web-scanner-zoom" class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full font-bold transition-all border border-white/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </button>
                    <button id="web-scanner-close" class="bg-destructive/80 hover:bg-destructive backdrop-blur-md text-white px-10 py-3 rounded-full font-bold transition-all border border-destructive-foreground/20">
                        Cerrar
                    </button>
                </div>
            `;
            
            container.appendChild(video);
            container.appendChild(ui);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            
            const cleanup = () => {
                if (!isScanning) return;
                isScanning = false;
                
                if (timeoutId) clearTimeout(timeoutId);
                
                try {
                    codeReader.reset();
                } catch(e) {}
                
                try {
                    if (video.srcObject && video.srcObject instanceof MediaStream) {
                        video.srcObject.getTracks().forEach(t => t.stop());
                    }
                    if (videoTrack) {
                        videoTrack.stop();
                    }
                } catch(e) {}
                
                try {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                } catch(e) {}
                
                resolve();
            };
            
            let timeoutId = setTimeout(() => {
                if (isScanning) {
                    toast.info("Tiempo agotado. La cámara se cerró automáticamente.");
                    cleanup();
                }
            }, 20000);
            
            const closeButton = ui.querySelector('#web-scanner-close');
            const handleClose = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                cleanup();
            };
            closeButton?.addEventListener('click', handleClose);
            closeButton?.addEventListener('touchstart', handleClose, { passive: false });

            const zoomButton = ui.querySelector('#web-scanner-zoom');
            const handleZoom = async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                if (!videoTrack) {
                    toast.error("La cámara aún no está lista.");
                    return;
                }
                try {
                    const capabilities = videoTrack.getCapabilities();
                    if (capabilities.zoom) {
                        const min = capabilities.zoom.min || 1;
                        const max = capabilities.zoom.max || 2;
                        const step = capabilities.zoom.step || 0.5;
                        
                        currentZoom += step;
                        if (currentZoom > max) {
                            currentZoom = min;
                        }
                        
                        await videoTrack.applyConstraints({
                            advanced: [{ zoom: currentZoom }]
                        });
                    } else {
                        toast.error("Tu cámara no soporta zoom por software");
                    }
                } catch (err) {
                    console.error("Zoom error:", err);
                    toast.error("Tu cámara no soporta zoom por software");
                }
            };
            zoomButton?.addEventListener('click', handleZoom);
            zoomButton?.addEventListener('touchstart', handleZoom, { passive: false });
            
            try {
                // ZXing automatically opens the camera and attaches it to the video element.
                // We do NOT call getUserMedia ourselves to avoid dual streams.
                await codeReader.decodeFromVideoDevice(undefined, video, (result, error) => {
                    // Once the video starts playing, we can grab the track from it
                    if (!videoTrack && video.srcObject instanceof MediaStream) {
                        videoTrack = video.srcObject.getVideoTracks()[0];
                    }
                    
                    if (result && isScanning) {
                        onScan(result.getText());
                        cleanup();
                    }
                });
            } catch (err) {
                console.error('ZXing error:', err);
                toast.error("Error al acceder a la cámara. Verifica los permisos.");
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

            // In v8, scan() opens the native Google Code Scanner which has its own UI.
            // We pass autoZoom to enable the native zoom feature.
            const { barcodes } = await BarcodeScanner.scan({
                autoZoom: true
            });
            
            if (barcodes.length > 0) {
                onScan(barcodes[0].displayValue);
            }

        } catch (error: any) {
            console.error('Scan error:', error);
            // Ignore "canceled" error when user presses the back button or native close
            if (error?.message && !error.message.includes('canceled')) {
                toast.error("Error al iniciar el escáner.");
            }
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
