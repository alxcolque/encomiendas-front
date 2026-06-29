import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { AdminShipment } from "@/interfaces/shipment.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import defaultLogo from '/logo.png';

export default function ShipmentTicket() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchShipmentById } = useAdminShipmentStore();
    const { general, fetchSettings } = useSettingsStore();
    const [shipment, setShipment] = useState<AdminShipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
        if (id) {
            fetchShipmentById(id)
                .then(setShipment)
                .finally(() => setIsLoading(false));
        }
    }, [id, fetchShipmentById, fetchSettings]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background">
                <div className="loading-logo"></div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Generando ticket...</p>
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-8 border border-border rounded-3xl bg-card shadow-xl max-w-sm mx-auto">
                    <h1 className="text-xl font-bold mb-2">Envío no encontrado</h1>
                    <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
                        Regresar
                    </Button>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    // Description: Paquete 49 Kg or Sobre
    const description = shipment.is_pack
        ? `Paquete ${shipment.weight ? shipment.weight + ' Kg' : ''}`
        : 'Sobre';

    // Payment status
    const paymentStatus = shipment.tracking_pay === 1 ? 'Pagado' : 'A pagar';

    const roundedPrice = Math.ceil(Number(shipment.price) * 2) / 2;

    const trackingUrl = `${window.location.protocol}//${window.location.host}/tracking?=CODE_TRACKING=${shipment.tracking_code}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`;

    return (
        <div className="min-h-screen bg-muted/30 text-black p-4 font-sans print:bg-white print:p-0 print:py-0 print:min-h-0 overflow-x-hidden">
            {/* Controls - hidden when printing */}
            <div className="max-w-md mx-auto mb-8 flex justify-between print:hidden gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="gap-2 h-11 px-6 rounded-xl border-border bg-card shadow-sm hover:bg-muted transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Regresar
                </Button>
                <Button
                    onClick={handlePrint}
                    className="gap-2 h-11 px-8 rounded-xl gradient-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <Printer className="w-4 h-4" /> Imprimir Etiqueta
                </Button>
            </div>

            {/* Ticket Content - Thermal 90mm Optimized */}
            <div className="bg-white mx-auto p-4 print:p-0 w-full max-w-[280px] ticket-container flex flex-col items-center overflow-hidden font-mono text-black">
                {/* Tracking Code */}
                <div className="text-center w-full">
                    <h1 className="text-sm font-black tracking-widest uppercase">TICKET</h1>
                    <div className="text-xl font-black tracking-tight">{shipment.tracking_code}</div>
                </div>
                {/* Information */}
                <div className="w-full text-[11px] leading-tight">
                    <div><span className="font-black uppercase">Rem:</span> <span className="font-semibold">{shipment.sender_name}</span></div>
                    <div><span className="font-black uppercase">Dest:</span> <span className="font-semibold">{shipment.receiver_name}</span></div>
                    <div><span className="font-black uppercase">Ruta:</span> <span className="font-semibold">{shipment.origin_office?.city?.name} - {shipment.destination_office?.city?.name}</span></div>
                </div>

                {/* Plan Favorcito Indicator */}
                {shipment.is_favorite && (
                    <div className="w-full mt-3 text-center border-y-2 border-black py-1.5">
                        <span className="font-black text-[11px] uppercase tracking-wide">★ SEGURO: PLAN FAVORCITO ★</span>
                    </div>
                )}
                {/* QR Code */}
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="p-1 bg-white">
                        <img src={qrCodeUrl} alt="QR" className="w-40 h-40 object-contain" />
                    </div>
                    {/* <span className="text-[10px] font-bold mt-1 text-center uppercase tracking-tighter">Escanea para seguimiento</span> */}
                </div>

            </div>

            {/* Custom styles for 90mm thermal printing */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: 90mm auto;
                        margin: 0; 
                    }
                    html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 90mm !important;
                        background: white !important; 
                        color: black !important;
                        -webkit-print-color-adjust: exact !important; 
                        color-adjust: exact !important;
                    }
                    /* Force black text for thermal printing */
                    * {
                        color: #000 !important;
                    }
                    .print\\:hidden { 
                        display: none !important; 
                    }
                    .ticket-container {
                        width: 90mm !important;
                        max-width: 90mm !important;
                        padding: 1mm !important;
                        margin: 0 auto !important;
                        background: white !important;
                        font-family: monospace !important;
                        border: none !important;
                        box-shadow: none !important;
                        font-size: 20px !important;
                    }
                    .ticket-divider {
                        letter-spacing: -1.5px !important;
                    }
                }
            `}} />
        </div>
    );
}
