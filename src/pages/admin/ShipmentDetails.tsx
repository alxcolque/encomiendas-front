import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { AdminShipment, ShipmentStatus, CreateShipmentPayload } from "@/interfaces/shipment.interface";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    ArrowLeft,
    Package,
    MapPin,
    FileText,
    ExternalLink,
    Truck,
    Plane,
    Save,
    CreditCard,
    Mail,
    Ruler,
    Weight,
    CheckCircle2,
    Star,
    Wallet,
    MapPinOff,
    Zap,
    Clock,
    User,
    Phone,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { useOfficeStore } from "@/stores/officeStore";
import { useClientStore } from "@/stores/clientStore";
import { useRouteValueStore } from "@/stores/routeValueStore";
import { ENV } from "@/config/env";
import { cn } from "@/lib/utils";

/* ─── Price Calculation ─── */
function calculateTotal(
    type: "paquete" | "sobre",
    service: "normal" | "standard" | "express",
    w = 0,
    l = 0,
    h = 0,
    weight = 0,
    routeValue = 0,
    discount = 0,
    withInvoice = false
): number {
    const minStore = Number(import.meta.env.VITE_STORE_MIN) || 3;
    const maxStore = Number(import.meta.env.VITE_STORE_MAX) || 5;
    const divX = Number(import.meta.env.VITE_DIV_X) || 0.9;
    const divY = Number(import.meta.env.VITE_DIV_Y) || 0.6;
    const basePrice = Number(import.meta.env.VITE_BASE_PRICE) || 15;

    let baseResult = 0;

    if (type === "paquete") {
        const volumetricWeight = (w * l * h) / 5000;
        const finalWeight = Math.max(volumetricWeight, weight);

        const store = (finalWeight * routeValue) + (finalWeight < 50 ? minStore : maxStore);
        const divXVal = Math.floor((store / divX) * 100) / 100;
        const divYVal = Math.round((divXVal / divY) * 100) / 100;
        baseResult = divYVal;
    } else {
        baseResult = basePrice;
    }

    const serviceDelta = { normal: 3, standard: 5, express: 10 }[service];
    let total = baseResult + serviceDelta - discount;

    if (total < 0) total = 0;

    if (withInvoice) {
        total = total * 1.16;
    }

    return Math.ceil(total * 2) / 2;
}

/* ─── Shared Components from Register Forms ─── */
function SectionHeader({ number, title, color = "gradient-primary", textColor = "text-primary-foreground" }: { number: string | number; title: string; color?: string; textColor?: string; }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md", color, textColor)}>
                {number}
            </div>
            <h3 className="font-bold text-base text-foreground">{title}</h3>
        </div>
    );
}

function ShipmentTypeCard({ active, disabled, icon: Icon, label, description, onClick }: { active: boolean; disabled?: boolean; icon: React.ElementType; label: string; description: string; onClick: () => void; }) {
    return (
        <button type="button" disabled={disabled} onClick={onClick} className={cn("relative flex flex-col items-center gap-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", active ? "border-primary bg-primary/10 shadow-lg shadow-primary/15 scale-[1.02]" : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]", disabled && "opacity-50 pointer-events-none")}>
            {active && <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />}
            <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300", active ? "gradient-primary shadow-lg shadow-primary/30" : "bg-muted group-hover:bg-primary/15")}>
                <Icon className={cn("h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-300", active ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
            </div>
            <div className="text-center">
                <p className={cn("font-bold text-sm sm:text-base", active ? "text-primary" : "text-foreground")}>{label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </button>
    );
}

function TransportCard({ active, disabled, icon: Icon, label, subtitle, badge, onClick }: { active: boolean; disabled?: boolean; icon: React.ElementType; label: string; subtitle: string; badge?: string; onClick: () => void; }) {
    return (
        <button type="button" disabled={disabled} onClick={onClick} className={cn("relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 cursor-pointer flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", active ? "border-primary bg-primary/10 shadow-md shadow-primary/15" : "border-border bg-card hover:border-primary/40 hover:bg-primary/5", disabled && "opacity-50 pointer-events-none")}>
            {active && <CheckCircle2 className="absolute top-2.5 right-2.5 h-4 w-4 text-primary" />}
            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300", active ? "gradient-primary shadow-md shadow-primary/30" : "bg-muted group-hover:bg-primary/15")}>
                <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors", active ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
            </div>
            <div className="text-left">
                <p className={cn("font-bold text-xs sm:text-sm", active ? "text-primary" : "text-foreground")}>{label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                {badge && <span className={cn("inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1", active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>{badge}</span>}
            </div>
        </button>
    );
}

const SERVICE_TIERS = [
    { id: "normal", label: "Normal", colorClass: "text-sky-500", bgGradient: "from-sky-500/15 via-sky-400/5 to-transparent", borderColor: "border-sky-500", badgeBg: "bg-sky-500/10", icon: Truck },
    { id: "standard", label: "Estándar", colorClass: "text-amber-500", bgGradient: "from-amber-500/15 via-amber-400/5 to-transparent", borderColor: "border-amber-500", badgeBg: "bg-amber-500/10", icon: Star },
    { id: "express", label: "Rápido", colorClass: "text-violet-500", bgGradient: "from-violet-500/15 via-violet-400/5 to-transparent", borderColor: "border-violet-500", badgeBg: "bg-violet-500/10", icon: Zap },
];

export default function ShipmentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchShipmentById, updateShipment } = useAdminShipmentStore();
    const { offices, fetchOffices } = useOfficeStore();
    const { findRouteValue, fetchRouteValues } = useRouteValueStore();

    const [shipment, setShipment] = useState<AdminShipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [isReadyForAutoCalc, setIsReadyForAutoCalc] = useState(false);

    // Form states
    const [originId, setOriginId] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [status, setStatus] = useState<ShipmentStatus>("created");
    const [observation, setObservation] = useState("");
    const [type, setType] = useState<"paquete" | "sobre">("paquete");
    const [transport, setTransport] = useState<"terrestre" | "aereo">("terrestre");
    const [service, setService] = useState<"normal" | "standard" | "express">("standard");
    const [weight, setWeight] = useState<string>("");
    const [width, setWidth] = useState<string>("");
    const [length, setLength] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [discount, setDiscount] = useState<string>("0");
    const [isFragile, setIsFragile] = useState(false);
    const [withInvoice, setWithInvoice] = useState(false);
    const [paymentBy, setPaymentBy] = useState<"remitente" | "destinatario">("remitente");

    // Sender states
    const [senderName, setSenderName] = useState("");
    const [senderCi, setSenderCi] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // Receiver states
    const [receiverName, setReceiverName] = useState("");
    const [receiverCi, setReceiverCi] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");

    const { searchClients } = useClientStore();
    const [isSearchingSender, setIsSearchingSender] = useState(false);
    const [isSearchingReceiver, setIsSearchingReceiver] = useState(false);
    const [isNewReceiver, setIsNewReceiver] = useState(false);

    const isQuote = status === "quote";

    const handleSearchClient = async (type: 'sender' | 'recipient') => {
        const ci = type === 'sender' ? senderCi : receiverCi;
        if (!ci || ci.length < 5) return;

        if (type === 'sender') setIsSearchingSender(true);
        else setIsSearchingReceiver(true);

        try {
            const results = await searchClients(ci);
            const found = results.find(c => c.ci_nit === ci);

            if (found) {
                if (type === 'sender') {
                    setSenderName(found.name);
                    setSenderPhone(found.phone || "");
                } else {
                    setReceiverName(found.name);
                    setReceiverPhone(found.phone || "");
                }
                toast.success("Cliente encontrado");
            } else {
                toast.error("Cliente no encontrado. Se habilitará el registro nuevo.");
                if (type === 'sender') {
                    setSenderName("");
                    setSenderPhone("");
                } else {
                    setReceiverName("");
                    setReceiverPhone("");
                    setIsNewReceiver(true);
                }
            }
        } catch (error) {
            toast.error("Error al buscar el cliente");
        } finally {
            if (type === 'sender') setIsSearchingSender(false);
            else setIsSearchingReceiver(false);
        }
    };

    useEffect(() => {
        if (offices.length === 0) fetchOffices();
        fetchRouteValues(); // Make sure route values are loaded for calculation
    }, []);

    useEffect(() => {
        if (id) loadShipment(id);
    }, [id]);

    const loadShipment = async (shipmentId: string) => {
        setIsLoading(true);
        try {
            const data = await fetchShipmentById(shipmentId);
            setShipment(data);

            setOriginId(data.origin_office_id || "");
            setDestinationId(data.destination_office_id || "");
            setStatus(data.current_status || "created");
            setObservation(data.observation || "");

            setType(data.is_pack ? "paquete" : "sobre");
            setTransport(data.track_type === 2 ? "aereo" : "terrestre");
            setService(data.type_service || "standard");
            setWeight(data.weight?.toString() || "");
            setWidth(data.width?.toString() || "");
            setLength(data.length?.toString() || "");
            setHeight(data.height?.toString() || "");
            setPrice(data.price?.toString() || "");
            setDiscount(data.discount?.toString() || "0");
            setIsFragile(data.is_fragile || false);
            setWithInvoice(data.with_invoice || false);
            setPaymentBy(data.tracking_pay === 2 ? "destinatario" : "remitente");

            setSenderName(data.sender_name || "");
            setSenderCi(data.sender_ci || data.invoice?.doc_num || "");
            setSenderPhone(data.sender_phone || "");

            setReceiverName(data.receiver_name || "");
            setReceiverCi(data.receiver_ci || "");
            setReceiverPhone(data.receiver_phone || "");

            setTimeout(() => {
                setIsReadyForAutoCalc(true);
            }, 500);

        } catch (error) {
            toast.error("Error al cargar la encomienda");
            navigate('/admin/shipments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isReadyForAutoCalc) return;
        if (!originId || !destinationId) return;

        const origin = offices.find(o => o.id === originId);
        const dest = offices.find(o => o.id === destinationId);

        if (!origin?.city_id || !dest?.city_id) return;

        const timeout = setTimeout(async () => {
            const routeVal = await findRouteValue(origin.city_id, dest.city_id);
            const calculated = calculateTotal(
                type,
                service,
                Number(width) || 0,
                Number(length) || 0,
                Number(height) || 0,
                Number(weight) || 0,
                Number(routeVal?.value) || 0,
                Number(discount) || 0,
                withInvoice
            );
            setPrice(calculated.toString());
        }, 300);

        return () => clearTimeout(timeout);
    }, [type, service, width, length, height, weight, discount, withInvoice, transport, originId, destinationId, isReadyForAutoCalc]);

    const handleCalculatePrice = async () => {
        if (!originId || !destinationId) {
            toast.error("Seleccione origen y destino", { description: "Se necesitan para calcular la tarifa por ruta" });
            return;
        }

        const origin = offices.find(o => o.id === originId);
        const dest = offices.find(o => o.id === destinationId);

        if (!origin?.city_id || !dest?.city_id) {
            toast.error("Agencias sin ciudad", { description: "Las agencias deben tener ciudad asignada" });
            return;
        }

        const routeVal = await findRouteValue(origin.city_id, dest.city_id);

        if (!routeVal) {
            toast.error("Ruta no definida", { description: "No existe valor tarifario para esta ruta en el sistema" });
            return;
        }

        const calculated = calculateTotal(
            type,
            service,
            Number(width) || 0,
            Number(length) || 0,
            Number(height) || 0,
            Number(weight) || 0,
            Number(routeVal.value) || 0,
            Number(discount) || 0,
            withInvoice
        );

        setPrice(calculated.toString());
        toast.success("Precio calculado", { description: `${calculated} Bs.` });
    };

    const handleSave = async () => {
        if (!shipment) return;

        // Validation
        if (!senderName.trim() || !senderCi.trim() || !senderPhone.trim()) {
            toast.error("Datos del remitente incompletos", {
                description: "El Nombre, CI/NIT y Teléfono del remitente son obligatorios."
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload: Partial<CreateShipmentPayload> = {
                origin_office_id: originId,
                destination_office_id: destinationId,
                current_status: status,
                observation,
                is_pack: type === "paquete",
                track_type: transport === "aereo" ? 2 : 1,
                type_service: service,
                weight: weight ? parseFloat(weight) : 0,
                width: width ? parseFloat(width) : 0,
                length: length ? parseFloat(length) : 0,
                height: height ? parseFloat(height) : 0,
                price: price ? parseFloat(price) : 0,
                is_fragile: isFragile,
                with_invoice: withInvoice,
                ...(withInvoice ? {
                    invoice_nit: senderCi || "0",
                    invoice_name: senderName || "S/N"
                } : {}),
                tracking_pay: paymentBy === "destinatario" ? 2 : 1,
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
        const confirm = window.confirm("¿Estás seguro de generar la factura para esta encomienda?");
        if (!confirm) return;

        setIsGeneratingInvoice(true);
        try {
            await ENV.post(`/shipments/${shipment.id}/invoice`, {
                invoice_type: "con",
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
                <div className="animate-pulse rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

                <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
                    <img src={qrCodeUrl} alt="QR Code" className="w-11 h-11 sm:w-12 sm:h-12 rounded border p-0.5 bg-white shadow-sm" />

                    {shipment.invoice ? (
                        <Button variant="outline" className="gap-2 h-11 sm:h-12 border-green-500 text-green-600 hover:bg-green-50" onClick={() => window.open(`/shipments/${shipment.id}/invoice`, '_blank')}>
                            <ExternalLink className="w-4 h-4" /> Factura
                        </Button>
                    ) : (
                        <Button variant="default" className="gap-2 h-11 sm:h-12 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleGenerateInvoice} disabled={isGeneratingInvoice}>
                            <CreditCard className="w-4 h-4" />
                            {isGeneratingInvoice ? "Proc..." : "Cobrar"}
                        </Button>
                    )}

                    <Button variant="secondary" className="gap-2 h-11 sm:h-12" onClick={() => window.open(`/admin/ticket/${shipment.id}`, '_blank')}>
                        <FileText className="w-4 h-4" /> Etiqueta
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Left Column: Details ── */}
                <div className="space-y-5">
                    {/* Agencias */}
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 backdrop-blur-sm shadow-sm">
                        <SectionHeader number={1} title="Agencia de Origen y Destino" />

                        <div className="flex gap-2 mb-4">
                            <ShipmentTypeCard active={type === "paquete"} icon={Package} label="Paquete" description="Caja o bulto" onClick={() => setType("paquete")} />
                            <ShipmentTypeCard active={type === "sobre"} icon={Mail} label="Sobre" description="Documento" onClick={() => setType("sobre")} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            <SelectItem key={o.id} value={o.id}>{o.city?.name} - {o.name}</SelectItem>
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
                                            <SelectItem key={o.id} value={o.id}>{o.city?.name} - {o.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Medidas (Paquete only) */}
                    <div className={cn("border rounded-2xl overflow-hidden transition-all duration-500", type === "paquete" ? "opacity-100 border-border/60 bg-card/60 shadow-sm" : "hidden opacity-0")}>
                        <div className="p-4 sm:p-5">
                            <SectionHeader number={2} title="Medidas (Caja y Bulto)" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <Ruler className="h-4 w-4 text-primary" /> Ancho (cm)
                                    </Label>
                                    <Input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="h-11" placeholder="Ej: 30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <Ruler className="h-4 w-4 text-primary" /> Largo (cm)
                                    </Label>
                                    <Input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="h-11" placeholder="Ej: 30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <Ruler className="h-4 w-4 text-primary" /> Alto (cm)
                                    </Label>
                                    <Input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="h-11" placeholder="Ej: 30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <Weight className="h-4 w-4 text-primary" /> Peso (Kg)
                                    </Label>
                                    <Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11 border-primary/50" placeholder="Ej: 5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modalidad y Servicio */}
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 shadow-sm">
                        <SectionHeader number={type === "paquete" ? 3 : 2} title="Modalidad y Tipo de Servicio" />

                        <div className="mb-4">
                            <Label className="text-sm font-semibold text-foreground block mb-3">Transporte</Label>
                            <div className="flex gap-3">
                                <TransportCard active={transport === "terrestre"} icon={Truck} label="Terrestre" subtitle="Camión/Flota" onClick={() => setTransport("terrestre")} />
                                <TransportCard active={transport === "aereo"} icon={Plane} label="Aéreo" subtitle="Avión" onClick={() => setTransport("aereo")} />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-foreground block mb-3">Servicio</Label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {SERVICE_TIERS.map((tier) => (
                                    <button key={tier.id} type="button" onClick={() => setService(tier.id as any)} className={cn("relative flex flex-col gap-2 p-2 rounded-xl border-2 text-left transition-all duration-300", service === tier.id ? `bg-gradient-to-br ${tier.bgGradient} ${tier.borderColor} shadow-md` : "border-border/70 bg-card hover:bg-muted/30", "")}>
                                        <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center", service === tier.id ? tier.badgeBg : "bg-muted")}>
                                            <tier.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", service === tier.id ? tier.colorClass : "text-muted-foreground")} />
                                        </div>
                                        <p className={cn("font-bold text-xs sm:text-sm", service === tier.id ? tier.colorClass : "text-foreground")}>{tier.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Costo Total */}
                    <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Costo Total del Envío</p>
                                <Button variant="outline" size="sm" onClick={handleCalculatePrice} className="mt-2 text-xs h-8">
                                    <Zap className="w-3 h-3 mr-1 text-amber-500" /> Auto-calcular
                                </Button>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Descuento</Label>
                                    <Input type="number" step="0.5" value={discount} onChange={e => setDiscount(e.target.value)} className="h-8 w-20 text-right" />
                                </div>
                                <div className="flex items-center gap-2 mt-1 border-t border-border pt-1">
                                    <Label className="text-sm border flex items-center bg-background px-2 py-1 rounded-md font-bold text-muted-foreground w-full">Precio Final</Label>
                                    <Input type="number" step="0.5" value={price} onChange={e => setPrice(e.target.value)} className="h-10 w-28 text-right font-black text-xl text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: People & Options ── */}
                <div className="space-y-5">

                    {/* Status & Options */}
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 shadow-sm">
                        <SectionHeader number={4} title="Estado y Observaciones" />
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="font-semibold text-sm">Estado Actual</Label>
                                <Select value={status} onValueChange={(val: ShipmentStatus) => setStatus(val)} disabled={!receiverCi.trim() || !receiverName.trim() || !receiverPhone.trim()}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quote">Cotización</SelectItem>
                                        <SelectItem value="created">Registrado</SelectItem>
                                        <SelectItem value="in_transit">En Tránsito</SelectItem>
                                        <SelectItem value="at_office">En Agencia de Destino</SelectItem>
                                        <SelectItem value="delivered">Entregado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(!receiverCi.trim() || !receiverName.trim() || !receiverPhone.trim()) && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Asigne un destinatario para cambiar el estado.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold text-sm">Observaciones</Label>
                                <Textarea value={observation} onChange={(e) => setObservation(e.target.value)} className="resize-none min-h-[60px]" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-md">R</div>
                            <h3 className="font-bold text-sm text-foreground">Remitente</h3>
                        </div>
                        <div className="space-y-2">
                            <Label>CI / NIT <span className="text-destructive">*</span></Label>
                            <div className="flex gap-2">
                                <Input value={senderCi} onChange={e => setSenderCi(e.target.value)} placeholder="Buscar por CI..." className={!senderCi.trim() ? "border-destructive/50" : ""} />
                                <Button disabled={!isQuote || isSearchingSender || senderCi.length < 5} type="button" variant="outline" size="icon" className="shrink-0 h-10 w-10 text-primary hover:text-primary transition-colors hover:bg-primary/10" onClick={() => handleSearchClient('sender')}>
                                    {isSearchingSender ? <div className={`loading-logo ${"w-4 h-4 animate-pulse"}`}></div> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Nombre Completo <span className="text-destructive">*</span></Label>
                                <Input value={senderName} onChange={e => setSenderName(e.target.value)} className={!senderName.trim() ? "border-destructive/50" : ""} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono <span className="text-destructive">*</span></Label>
                                <Input value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className={!senderPhone.trim() ? "border-destructive/50" : ""} />
                            </div>
                        </div>
                    </div>

                    {/* Destinatario */}
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-black shadow-md">D</div>
                                <h3 className="font-bold text-sm text-foreground">Destinatario</h3>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>CI / NIT</Label>
                            <div className="flex gap-2">
                                <Input value={receiverCi} onChange={e => setReceiverCi(e.target.value)} placeholder="Buscar por CI..." />
                                <Button disabled={!isQuote || isSearchingReceiver || receiverCi.length < 5} type="button" variant="outline" size="icon" className="shrink-0 h-10 w-10 text-primary hover:text-primary transition-colors hover:bg-primary/10" onClick={() => handleSearchClient('recipient')}>
                                    {isSearchingReceiver ? <div className={`loading-logo ${"w-4 h-4 animate-pulse"}`}></div> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* If NOT in 'new receiver' mode */}
                        {!isNewReceiver ? (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Nombre Completo</Label>
                                    <Input disabled={!isQuote || !receiverName} value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder={!receiverName ? "Busque un cliente primero" : ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input disabled={!isQuote || !receiverPhone} value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} placeholder={!receiverPhone ? "Busque un cliente primero" : ""} />
                                </div>
                            </div>
                        ) : (
                            /* 'New receiver' registration form */
                            <div className="mt-4 p-4 border rounded-xl bg-background/50 space-y-4 border-primary/20">
                                <div>
                                    <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-3">Registrar Nuevo Destinatario</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Nombre Completo <span className="text-destructive">*</span></Label>
                                        <Input value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="Ej: Juan Perez" autoFocus className={!receiverName.trim() ? "border-destructive/50" : ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Teléfono <span className="text-destructive">*</span></Label>
                                        <Input value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} placeholder="Ej: 76543210" className={!receiverPhone.trim() ? "border-destructive/50" : ""} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setIsNewReceiver(false); setReceiverName(""); setReceiverPhone(""); setReceiverCi(""); }} >
                                        Cancelar
                                    </Button>
                                    <Button type="button" size="sm" className="bg-primary text-white" disabled={!isQuote || !receiverName.trim() || !receiverPhone.trim()} onClick={() => setIsNewReceiver(false)}>
                                        Aceptar Datos
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opción de Pago & Fragilidad */}
                    <div className="border border-border/60 rounded-2xl p-4 sm:p-5 bg-card/60 shadow-sm space-y-5">
                        <h3 className="font-bold text-sm text-foreground">Opción de Pago y Fragilidad</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setPaymentBy("remitente")} className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all", paymentBy === "remitente" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-border bg-card", "")}>
                                <Wallet className="h-5 w-5 mb-1" />
                                <span className="text-xs font-bold">Origen</span>
                            </button>
                            <button type="button" onClick={() => setPaymentBy("destinatario")} className={cn("flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all", paymentBy === "destinatario" ? "border-sky-500 bg-sky-500/10 text-sky-600" : "border-border bg-card", "")}>
                                <MapPinOff className="h-5 w-5 mb-1" />
                                <span className="text-xs font-bold">Destino</span>
                            </button>
                        </div>

                        <div className={cn("flex items-center space-x-2 pt-2 border-t border-border", isQuote ? "cursor-pointer" : "opacity-50 pointer-events-none")} onClick={() => setIsFragile(!isFragile)}>
                            <div className={cn("w-6 h-6 rounded border-2 flex items-center justify-center transition-all", isFragile ? "bg-amber-500 border-amber-500" : "border-border bg-muted")}>
                                {isFragile && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <Label className="text-sm font-bold text-foreground cursor-pointer flex items-center gap-2">
                                <Star className={cn("h-4 w-4", isFragile ? "text-amber-500" : "text-muted-foreground")} /> Contiene objetos frágiles
                            </Label>
                        </div>

                        <div className={cn("flex items-center space-x-2 pt-2 border-t border-border", isQuote ? "cursor-pointer" : "opacity-50 pointer-events-none")} onClick={() => isQuote && setWithInvoice(!withInvoice)}>
                            <div className={cn("w-6 h-6 rounded border-2 flex items-center justify-center transition-all", withInvoice ? "bg-blue-500 border-blue-500" : "border-border bg-muted")}>
                                {withInvoice && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <Label className="text-sm font-bold text-foreground cursor-pointer flex items-center gap-2">
                                <FileText className={cn("h-4 w-4", withInvoice ? "text-blue-500" : "text-muted-foreground")} /> Con Factura
                            </Label>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Floating Save Button or Bottom Save Button ── */}
            <div className="mt-8 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2 h-14 px-8 text-lg font-bold gradient-primary text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                    <Save className="w-5 h-5" /> {isSaving ? "Guardando cambios..." : "Guardar Cambios"}
                </Button>
            </div>
        </div>
    );
}
