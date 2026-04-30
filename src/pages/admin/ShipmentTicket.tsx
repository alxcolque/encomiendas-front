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

            {/* Ticket Content */}
            <div className="max-w-[105mm] mx-auto border-2 border-dashed border-gray-300 p-4 print:p-0 print:border-none print:max-w-none print:w-[105mm] print:h-[135mm] print:overflow-hidden flex flex-col justify-between overflow-hidden print:m-0">
                <div className="print:p-2">
                    {/* Row 1 */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {general.logo ? (
                                <img src={general.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <img src={defaultLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                            )}
                        </div>
                        <h1 className="text-xl font-black tracking-widest">TICKET</h1>
                        <div className="text-xs font-bold">
                            {format(new Date(), "dd-MM-yyyy")}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="text-center mb-2">
                        <h2 className="text-3xl font-black leading-tight">{general.siteName || 'KOLMOX'}</h2>
                    </div>

                    {/* Row 3 */}
                    <div className="flex justify-center mb-4">
                        <div className="border-2 border-black rounded-lg px-4 py-1">
                            <span className="text-xl font-mono font-bold">{shipment.tracking_code}</span>
                        </div>
                    </div>

                    {/* Row 7-9 & QR Area */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex gap-2 min-w-0 flex-1">
                                <span className="font-black uppercase">Rem:</span>
                                <span className="font-semibold truncate">{shipment.sender_name}</span>
                            </div>
                            <div className="flex gap-2 min-w-0 flex-1">
                                <span className="font-black uppercase">Dest:</span>
                                <span className="font-semibold truncate">{shipment.receiver_name}</span>
                            </div>
                            <div className="text-[11px] font-bold flex gap-2">
                                <span className="font-black uppercase">Desc:</span> <span className="font-medium">{description}</span>
                            </div>
                            {/* Row 7 */}
                            <div className="text-[11px] font-bold flex gap-2">
                                <span className="font-black uppercase">Pago:</span> <span className="font-medium">{paymentStatus}</span>
                            </div>
                            {/* Row 8 */}
                            <div className="text-sm font-black flex gap-1 items-baseline">
                                <span className="font-black uppercase text-[10px]">Total:</span>
                                <span className="text-xl">{roundedPrice.toFixed(2)} Bs.</span>
                            </div>
                            {/* Row 9 */}
                            <div className="text-[10px] italic font-bold flex gap-1 border-t border-gray-100 pt-1 mt-1">
                                <span className="font-black uppercase text-[9px] not-italic">Ruta:</span>
                                <span className="truncate">{shipment.origin_office?.city?.name} -&gt; {shipment.destination_office?.city?.name}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center border-l border-gray-200 pl-4 shrink-0">
                            <div className="w-25 h-25 border-2 border-black p-1 bg-white">
                                <img
                                    src={qrCodeUrl}
                                    alt="Tracking QR"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-[10px] mt-1 font-black uppercase tracking-tight text-center w-full">
                                Escanea para<br />seguimiento
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-2 pt-2 border-t border-black text-center text-[9px] uppercase font-bold print:mb-4">
                    * Gracias por su preferencia *
                </div>
            </div>

            {/* Custom styles for printing */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: letter portrait; 
                        margin: 5mm !important; 
                    }
                    html, body { 
                        width: 100% !important; 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important; 
                        -webkit-print-color-adjust: exact !important; 
                    }
                    .print\\:hidden { display: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:border-none { border: none !important; }
                    .print\\:overflow-hidden { overflow: hidden !important; }
                    .print\\:max-w-none { max-width: none !important; }
                    .print\\:h-\\[135mm\\] { height: 135mm !important; }
                    .print\\:w-\\[105mm\\] { width: 105mm !important; }
                    .print\\:m-0 { margin: 0 !important; }
                }
            `}} />
        </div>
    );
}
