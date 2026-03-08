import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { AdminShipment, ShipmentStatus, CreateShipmentPayload } from "@/interfaces/shipment.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    FileText,
    ExternalLink,
    Truck,
    Save,
    QrCode,
    CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useOfficeStore } from "@/stores/officeStore";
import { ENV } from "@/config/env";

export default function ShipmentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchShipmentById, updateShipment } = useAdminShipmentStore();
    const { offices, fetchOffices } = useOfficeStore();

    const [shipment, setShipment] = useState<AdminShipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

    // Form states
    const [originId, setOriginId] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [status, setStatus] = useState<ShipmentStatus>("created");
    const [observation, setObservation] = useState("");

    // Sender states
    const [senderName, setSenderName] = useState("");
    const [senderCi, setSenderCi] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // Receiver states
    const [receiverName, setReceiverName] = useState("");
    const [receiverCi, setReceiverCi] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");

    useEffect(() => {
        if (offices.length === 0) {
            fetchOffices();
        }
    }, []);

    useEffect(() => {
        if (id) {
            loadShipment(id);
        }
    }, [id]);

    const loadShipment = async (shipmentId: string) => {
        setIsLoading(true);
        try {
            const data = await fetchShipmentById(shipmentId);
            setShipment(data);

            // Populate form
            setOriginId(data.origin_office_id || "");
            setDestinationId(data.destination_office_id || "");
            setStatus(data.current_status || "created");
            setObservation(data.observation || "");

            setSenderName(data.sender_name || "");
            setSenderCi(data.invoice?.doc_num || ""); // Approximate CI mapping
            setSenderPhone(data.sender_phone || "");

            setReceiverName(data.receiver_name || "");
            setReceiverPhone(data.receiver_phone || "");

        } catch (error) {
            toast.error("Error al cargar la encomienda");
            navigate('/admin/shipments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!shipment) return;
        setIsSaving(true);
        try {
            const payload: Partial<CreateShipmentPayload> = {
                origin_office_id: originId,
                destination_office_id: destinationId,
                current_status: status,
                observation,
                sender_name: senderName,
                sender_ci: senderCi,
                sender_phone: senderPhone,
                receiver_name: receiverName,
                receiver_ci: receiverCi,
                receiver_phone: receiverPhone,
            };

            await updateShipment(shipment.id, payload);
            toast.success("Encomienda actualizada correctamente");
            loadShipment(shipment.id);
        } catch (error) {
            toast.error("Error al actualizar la encomienda");
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateInvoice = async () => {
        if (!shipment) return;

        const confirm = window.confirm("¿Estás seguro de pagar y generar la factura para esta encomienda?");
        if (!confirm) return;

        setIsGeneratingInvoice(true);
        try {
            await ENV.post(`/shipments/${shipment.id}/invoice`, {
                invoice_type: "con", // Or based on shipment choice
                invoice_name: senderName,
                invoice_nit: senderCi || "0",
            });
            toast.success("Factura generada exitosamente");
            loadShipment(shipment.id);
        } catch (error) {
            toast.error("Error al generar factura. Revisa si ya fue generada.");
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    if (isLoading || !shipment) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const trackingUrl = `${window.location.origin}/tracking?code=${shipment.tracking_code}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Encomienda</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Código: <span className="font-mono font-bold text-primary">{shipment.tracking_code}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12 rounded border p-0.5 bg-white shadow-sm" />

                    {shipment.invoice ? (
                        <Button
                            variant="outline"
                            className="gap-2 h-12 border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => window.open(`/shipments/${shipment.id}/invoice`, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" /> Ver Factura
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="gap-2 h-12 bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={handleGenerateInvoice}
                            disabled={isGeneratingInvoice}
                        >
                            <CreditCard className="w-4 h-4" />
                            {isGeneratingInvoice ? "Procesando..." : "Cobrar"}
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        className="gap-2 h-12"
                        onClick={() => window.open(`/admin/ticket/${shipment.id}`, '_blank')}
                    >
                        <FileText className="w-4 h-4" /> Etiqueta
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2 h-12 gradient-primary text-white"
                    >
                        <Save className="w-4 h-4" /> {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ── Status & Options ── */}
                <Card className="border-border/50 shadow-sm md:col-span-2">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Estado y Observaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Estado de la encomienda</Label>
                            <Select value={status} onValueChange={(val: ShipmentStatus) => setStatus(val)}>
                                <SelectTrigger className="h-11 border-border/80 font-semibold focus:border-primary w-full">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created">Registrado (Creado)</SelectItem>
                                    <SelectItem value="in_transit">En Tránsito</SelectItem>
                                    <SelectItem value="at_office">En Oficina de Destino</SelectItem>
                                    <SelectItem value="delivered">Entregado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Observaciones / Detalles</Label>
                            <Textarea
                                placeholder="Escribe observaciones o detalles si existen..."
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                                className="resize-none min-h-[80px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Route ── */}
                <Card className="border-border/50 shadow-sm md:col-span-2">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Oficinas (Ruta)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-sm font-semibold">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <MapPin className="h-3 w-3 text-white" />
                                </div>
                                Origen
                            </Label>
                            <Select value={originId} onValueChange={setOriginId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Origen..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {offices.map((o) => (
                                        <SelectItem key={o.id} value={o.id} disabled={o.id === destinationId}>
                                            {o.city?.name} - {o.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-sm font-semibold">
                                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                                    <MapPin className="h-3 w-3 text-white" />
                                </div>
                                Destino
                            </Label>
                            <Select value={destinationId} onValueChange={setDestinationId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Destino..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {offices.map((o) => (
                                        <SelectItem key={o.id} value={o.id} disabled={o.id === originId}>
                                            {o.city?.name} - {o.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Sender ── */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <User className="w-5 h-5" />
                            Remitente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input value={senderName} onChange={e => setSenderName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CI / NIT</Label>
                                <Input value={senderCi} onChange={e => setSenderCi(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input value={senderPhone} onChange={e => setSenderPhone(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Receiver ── */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="bg-indigo-500/5 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-indigo-500">
                            <User className="w-5 h-5" />
                            Destinatario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input value={receiverName} onChange={e => setReceiverName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Hidden CI field if you don't use it much, but good to have since backend allows it if needed, or just leave it */}
                            <div className="space-y-2">
                                <Label>CI / NIT</Label>
                                <Input value={receiverCi} onChange={e => setReceiverCi(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
