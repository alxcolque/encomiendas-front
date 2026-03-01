import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { AdminShipment } from "@/interfaces/shipment.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Calendar,
    Clock,
    FileText,
    ExternalLink,
    Truck,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ShipmentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchShipmentById, isLoading } = useAdminShipmentStore();
    const [shipment, setShipment] = useState<AdminShipment | null>(null);

    useEffect(() => {
        if (id) {
            fetchShipmentById(id).then(setShipment).catch(() => navigate('/admin/shipments'));
        }
    }, [id, fetchShipmentById, navigate]);

    if (isLoading || !shipment) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Detalles de Encomienda</h1>
                    <p className="text-muted-foreground">Código de seguimiento: <span className="font-mono font-bold text-primary">{shipment.tracking_code}</span></p>
                </div>
                <div className="flex gap-2">
                    {shipment.invoice && (
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => window.open(`/shipments/${shipment.id}/invoice`, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" /> Factura
                        </Button>
                    )}
                    <Button
                        variant="default"
                        className="gap-2"
                        onClick={() => window.open(`/admin/ticket/${shipment.id}`, '_blank')}
                    >
                        <FileText className="w-4 h-4" /> Imprimir Etiqueta
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status and Overview */}
                <Card className="md:col-span-2 border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border/50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Resumen del Envío
                            </CardTitle>
                            <StatusBadge status={shipment.current_status} className="text-sm px-4 py-1" />
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1 tracking-wider">Fecha de Creación</h3>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{format(new Date(shipment.created_at!), 'PPP p', { locale: es })}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1 tracking-wider">Última Actualización</h3>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">{format(new Date(shipment.updated_at!), 'PPP p', { locale: es })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1 tracking-wider">Costo del Envío</h3>
                                <div className="text-2xl font-black text-primary">
                                    Bs. {Number(shipment.price).toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Sujeto a impuestos de ley</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logistics */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Logística
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="relative">
                            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-slate-200 to-indigo-500"></div>
                            <div className="space-y-8 pl-8 relative">
                                <div>
                                    <div className="absolute left-[2px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-white -translate-x-1/2"></div>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">Origen</h4>
                                    <p className="font-bold text-lg">{shipment.origin_office?.city?.name}</p>
                                    <p className="text-sm text-muted-foreground">{shipment.origin_office?.address}</p>
                                </div>
                                <div>
                                    <div className="absolute left-[2px] bottom-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white -translate-x-1/2"></div>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">Destino</h4>
                                    <p className="font-bold text-lg">{shipment.destination_office?.city?.name}</p>
                                    <p className="text-sm text-muted-foreground">{shipment.destination_office?.address}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Participants */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Remitente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <p className="text-xl font-bold">{shipment.sender_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            NIT/CI: {shipment.invoice?.doc_num || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Tel: {shipment.sender_phone || 'N/A'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50 text-indigo-500">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Destinatario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <p className="text-xl font-bold">{shipment.receiver_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Tel: {shipment.receiver_phone || 'N/A'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Historial de Eventos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {shipment.events && shipment.events.length > 0 ? (
                                shipment.events.map((event, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold capitalize">{event.status.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp), 'dd MMM, HH:mm')}</p>
                                            <p className="text-xs mt-1">{event.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                    <p className="text-sm text-muted-foreground">Sin eventos registrados</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
