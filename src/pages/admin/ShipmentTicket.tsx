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
        <div className="min-h-screen bg-muted/30 text-black p-4 font-sans print:p-0 print:m-0 print:min-h-0 print:h-auto overflow-x-hidden">
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

            {/* Ticket Content - Thermal 58mm Optimized */}
            <div className="bg-white mx-auto p-4 print:p-0 w-full max-w-[280px] print:w-[58mm] print:max-w-[58mm] flex flex-col items-center overflow-hidden font-mono text-black">
                
                {/* Header: Logo and Site Name */}
                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    {general.logo ? (
                        <img src={general.logo} alt="Logo" className="max-w-full max-h-full object-contain filter grayscale" />
                    ) : (
                        <img src={defaultLogo} alt="Logo" className="max-w-full max-h-full object-contain filter grayscale" />
                    )}
                </div>
                <h2 className="text-xl font-black text-center leading-tight mb-1 uppercase">{general.siteName || 'KOLMOX'}</h2>
                <div className="text-[10px] font-bold mb-2">
                    {format(new Date(), "dd-MM-yyyy HH:mm")}
                </div>
                
                <div className="w-full border-b-[2px] border-black border-dashed my-2"></div>
                
                {/* Tracking Code */}
                <div className="text-center mb-1 w-full">
                    <h1 className="text-sm font-black tracking-widest uppercase">TICKET</h1>
                    <div className="text-xl font-black tracking-tight">{shipment.tracking_code}</div>
                </div>
                
                <div className="w-full border-b-[2px] border-black border-dashed my-2"></div>
                
                {/* Information */}
                <div className="w-full space-y-1.5 text-[11px] leading-tight">
                    <div><span className="font-black uppercase">Rem:</span> <span className="font-semibold">{shipment.sender_name}</span></div>
                    <div><span className="font-black uppercase">Dest:</span> <span className="font-semibold">{shipment.receiver_name}</span></div>
                    <div><span className="font-black uppercase">Ruta:</span> <span className="font-semibold">{shipment.origin_office?.city?.name} - {shipment.destination_office?.city?.name}</span></div>
                    <div><span className="font-black uppercase">Desc:</span> <span className="font-semibold">{description}</span></div>
                </div>
                
                {/* Plan Favorcito Indicator */}
                {shipment.is_favorite && (
                    <div className="w-full mt-3 text-center border-y-2 border-black py-1.5">
                        <span className="font-black text-[11px] uppercase tracking-wide">★ SEGURO: PLAN FAVORCITO ★</span>
                    </div>
                )}

                <div className="w-full border-b-[2px] border-black border-dashed my-2 mt-3"></div>

                {/* Total and Payment */}
                <div className="w-full flex justify-between items-center text-sm font-black mt-1">
                    <span>TOTAL:</span>
                    <span className="text-lg">{roundedPrice.toFixed(2)} Bs.</span>
                </div>
                <div className="w-full text-xs font-black mt-1 text-center border border-black py-0.5 rounded-sm">
                    PAGO: {paymentStatus.toUpperCase()}
                </div>

                <div className="w-full border-b-[2px] border-black border-dashed my-3"></div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="p-1 bg-white">
                        <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-center uppercase tracking-tighter">Escanea para<br/>seguimiento</span>
                </div>

                {/* Footer note */}
                <div className="mt-4 text-center text-[10px] font-bold pb-4 uppercase">
                    * Gracias por su preferencia *
                </div>
            </div>

            {/* Custom styles for 58mm thermal printing */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        margin: 0; 
                        size: 58mm auto;
                    }
                    html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 58mm !important;
                        background: white !important; 
                        -webkit-print-color-adjust: exact !important; 
                        color-adjust: exact !important;
                    }
                    /* Forzar que todos los textos sean negro puro para térmicas */
                    * {
                        color: #000 !important;
                    }
                    .print\\:hidden { display: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:w-\\[58mm\\] { width: 58mm !important; }
                    .print\\:max-w-\\[58mm\\] { max-width: 58mm !important; }
                }
            `}} />
        </div>
    );
}
