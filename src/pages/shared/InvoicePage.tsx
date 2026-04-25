import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InvoiceDocument } from "@/components/worker/shipment/InvoiceDocument";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { AdminShipment } from "@/interfaces/shipment.interface";

export default function InvoicePage() {
    const { id } = useParams<{ id: string }>();
    const { fetchShipmentById } = useAdminShipmentStore();
    const [shipment, setShipment] = useState<AdminShipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchShipmentById(id)
                .then(setShipment)
                .finally(() => setIsLoading(false));
        }
    }, [id, fetchShipmentById]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
                <div className={`loading-logo ${"h-8 w-8 animate-pulse text-primary"}`}></div>
                <p className="text-muted-foreground animate-pulse">Generando factura...</p>
            </div>
        );
    }

    if (!shipment?.invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-border">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Factura no encontrada</h1>
                    <p className="text-muted-foreground">Esta encomienda no tiene una factura asociada o no existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:p-0">
            <InvoiceDocument
                invoice={shipment.invoice}
                onClose={() => window.close()}
            />
        </div>
    );
}
