import { useState, useEffect } from "react";
import {
    Package,
    Mail,
    Truck,
    Plane,
    ArrowRight,
    Ruler,
    Weight,
    MapPin,
    Zap,
    CheckCircle2,
    Clock,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useOfficeStore } from "@/stores/officeStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouteValueStore } from "@/stores/routeValueStore";

/* ─── Types ─────────────────────────────────────────────── */
export type ShipmentType = "paquete" | "sobre";
export type TransportMode = "terrestre" | "aereo";
export type ServiceTier = "normal" | "standard" | "express";

export interface ShipmentDetailsData {
    type: ShipmentType;
    origin_office_id: string;
    destination_office_id: string;
    width?: number;
    length?: number;
    height?: number;
    weight?: number;
    transport: TransportMode;
    service: ServiceTier;
    total: number;
    withIva: boolean;
}

interface Props {
    onNext: (data: ShipmentDetailsData) => void;
}

/* ─── Constants ─────────────────────────────────────────── */
interface ServiceTierConfig {
    id: ServiceTier;
    label: string;
    delta: number;
    days: string;
    description: string;
    colorClass: string;
    bgGradient: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ElementType;
}

const SERVICE_TIERS: ServiceTierConfig[] = [
    {
        id: "normal",
        label: "Normal",
        delta: 3,
        days: "6 – 8 días",
        description: "Entrega estándar económica",
        colorClass: "text-sky-500",
        bgGradient: "from-sky-500/15 via-sky-400/5 to-transparent",
        borderColor: "border-sky-500",
        badgeBg: "bg-sky-500/10",
        badgeText: "text-sky-600 dark:text-sky-400",
        icon: Truck,
    },
    {
        id: "standard",
        label: "Estándar",
        delta: 5,
        days: "3 – 5 días",
        description: "Equilibrio velocidad-precio",
        colorClass: "text-amber-500",
        bgGradient: "from-amber-500/15 via-amber-400/5 to-transparent",
        borderColor: "border-amber-500",
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-600 dark:text-amber-400",
        icon: Star,
    },
    {
        id: "express",
        label: "Rápido",
        delta: 10,
        days: "1 – 2 días",
        description: "Entrega urgente prioritaria",
        colorClass: "text-violet-500",
        bgGradient: "from-violet-500/15 via-violet-400/5 to-transparent",
        borderColor: "border-violet-500",
        badgeBg: "bg-violet-500/10",
        badgeText: "text-violet-600 dark:text-violet-400",
        icon: Zap,
    },
];

/* ─── Price calculation ──────────────────────────────────── */
function calculateTotal(
    type: ShipmentType,
    transport: TransportMode,
    service: ServiceTier,
    w = 0,
    l = 0,
    h = 0,
    weight = 0,
    withIva = false,
    routeValue = 0,
    discount = 0
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

    if (withIva) {
        total = total * 1.16;
    }

    return Math.round(total * 100) / 100;
}

/* ─── Section Header ─────────────────────────────────────── */
function SectionHeader({ number, title }: { number: number | string; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-black shadow-md">
                {number}
            </div>
            <h3 className="font-bold text-base text-foreground">{title}</h3>
        </div>
    );
}

/* ─── Type Selector Card ─────────────────────────────────── */
function ShipmentTypeCard({
    active,
    icon: Icon,
    label,
    description,
    onClick,
}: {
    active: boolean;
    icon: React.ElementType;
    label: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/15 scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]"
            )}
        >
            {active && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
            )}
            <div
                className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                    active
                        ? "gradient-primary shadow-lg shadow-primary/30"
                        : "bg-muted group-hover:bg-primary/15"
                )}
            >
                <Icon
                    className={cn(
                        "h-10 w-10 transition-colors duration-300",
                        active ? "text-white" : "text-muted-foreground group-hover:text-primary"
                    )}
                />
            </div>
            <div className="text-center">
                <p className={cn("font-bold text-base", active ? "text-primary" : "text-foreground")}>
                    {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </button>
    );
}

/* ─── Transport Card ─────────────────────────────────────── */
function TransportCard({
    active,
    icon: Icon,
    label,
    subtitle,
    badge,
    onClick,
}: {
    active: boolean;
    icon: React.ElementType;
    label: string;
    subtitle: string;
    badge?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/15"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
            )}
        >
            {active && (
                <CheckCircle2 className="absolute top-2.5 right-2.5 h-4 w-4 text-primary" />
            )}
            <div
                className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                    active
                        ? "gradient-primary shadow-md shadow-primary/30"
                        : "bg-muted group-hover:bg-primary/15"
                )}
            >
                <Icon
                    className={cn(
                        "h-6 w-6 transition-colors",
                        active ? "text-white" : "text-muted-foreground group-hover:text-primary"
                    )}
                />
            </div>
            <div className="text-left">
                <p className={cn("font-bold text-sm", active ? "text-primary" : "text-foreground")}>
                    {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                {badge && (
                    <span className={cn(
                        "inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1",
                        active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        {badge}
                    </span>
                )}
            </div>
        </button>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function ShipmentDetailsForm({ onNext }: Props) {
    const { offices, fetchOffices } = useOfficeStore();
    const [type, setType] = useState<ShipmentType>("paquete");
    const [originId, setOriginId] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [width, setWidth] = useState<string>("");
    const [lengthVal, setLengthVal] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [transport, setTransport] = useState<TransportMode>("terrestre");
    const [service, setService] = useState<ServiceTier>("standard");
    const [withIva, setWithIva] = useState(false);
    const [total, setTotal] = useState(0);
    const [routeValue, setRouteValue] = useState(0);
    const [routeValueNotFound, setRouteValueNotFound] = useState(false);
    const [discount, setDiscount] = useState<string>("0");
    const { findRouteValue } = useRouteValueStore();

    useEffect(() => {
        if (offices.length === 0) {
            fetchOffices();
        }
    }, []);

    /* Fetch Route Value when offices change */
    useEffect(() => {
        const fetchValue = async () => {
            if (originId && destinationId && originId !== destinationId) {
                const origin = offices.find(o => o.id === originId);
                const dest = offices.find(o => o.id === destinationId);
                if (origin?.city_id && dest?.city_id) {
                    const rv = await findRouteValue(origin.city_id, dest.city_id);
                    if (rv) {
                        setRouteValue(Number(rv.value) || 0);
                        setRouteValueNotFound(false);
                    } else {
                        setRouteValue(0);
                        setRouteValueNotFound(true);
                    }
                }
            } else {
                setRouteValue(0);
                setRouteValueNotFound(false);
            }
        };
        fetchValue();
    }, [originId, destinationId, offices]);

    /* Recalculate total whenever any relevant field changes */
    useEffect(() => {
        const w = parseFloat(width) || 0;
        const l = parseFloat(lengthVal) || 0;
        const h = parseFloat(height) || 0;
        const wt = parseFloat(weight) || 0;
        const d = parseFloat(discount) || 0;
        setTotal(calculateTotal(type, transport, service, w, l, h, wt, withIva, routeValue, d));
    }, [type, transport, service, width, lengthVal, height, weight, withIva, routeValue, discount]);

    /* Validation */
    const isPackageDimensionsValid =
        type === "sobre" ||
        (parseFloat(width) > 0 &&
            parseFloat(lengthVal) > 0 &&
            parseFloat(height) > 0 &&
            parseFloat(weight) > 0);

    const isValid = originId && destinationId && originId !== destinationId && isPackageDimensionsValid;

    const handleNext = () => {
        if (!isValid) return;
        onNext({
            type,
            origin_office_id: originId,
            destination_office_id: destinationId,
            width: type === "paquete" ? parseFloat(width) : undefined,
            length: type === "paquete" ? parseFloat(lengthVal) : undefined,
            height: type === "paquete" ? parseFloat(height) : undefined,
            weight: type === "paquete" ? parseFloat(weight) : undefined,
            transport,
            service,
            total,
            withIva,
        });
    };

    const selectedTier = SERVICE_TIERS.find((t) => t.id === service)!;

    const originOffice = offices.find(o => o.id === originId);
    const destinationOffice = offices.find(o => o.id === destinationId);

    return (
        <div className="space-y-5">

            {/* ── Section 1: Tipo y Ruta ───────────────────────── */}
            <div className="border border-border/60 rounded-2xl p-5 bg-card/60 backdrop-blur-sm shadow-sm">
                <SectionHeader number={1} title="Oficina de Origen y Destino" />

                {/* Type selector */}
                <div className="flex gap-4 mb-5">
                    <ShipmentTypeCard
                        active={type === "paquete"}
                        icon={Package}
                        label="Paquete"
                        description="Caja o bulto con dimensiones"
                        onClick={() => setType("paquete")}
                    />
                    <ShipmentTypeCard
                        active={type === "sobre"}
                        icon={Mail}
                        label="Sobre"
                        description="Documento, carta o sobre"
                        onClick={() => setType("sobre")}
                    />
                </div>

                {/* Origin / Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-sm font-semibold">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-white" />
                            </div>
                            Oficina de Origen
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select value={originId} onValueChange={setOriginId}>
                            <SelectTrigger className="h-11 border-border/80 focus:border-primary">
                                <SelectValue placeholder="Seleccionar origen..." />
                            </SelectTrigger>
                            <SelectContent>
                                {offices.filter(o => o.status === 'active').map((o) => (
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
                            Oficina de Destino
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select value={destinationId} onValueChange={setDestinationId}>
                            <SelectTrigger className="h-11 border-border/80 focus:border-primary">
                                <SelectValue placeholder="Seleccionar destino..." />
                            </SelectTrigger>
                            <SelectContent>
                                {offices.filter(o => o.status === 'active').map((o) => (
                                    <SelectItem key={o.id} value={o.id} disabled={o.id === originId}>
                                        {o.city?.name} - {o.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Route preview */}
                {originOffice && destinationOffice && (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{originOffice.city?.name} ({originOffice.name})</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="font-semibold text-rose-600 dark:text-rose-400">{destinationOffice.city?.name} ({destinationOffice.name})</span>
                        </div>

                        {routeValueNotFound && (
                            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-1.5 animate-pulse">
                                <Zap className="h-3 w-3" />
                                No se encontró el valor de la ruta entre estas ciudades. Se asume valor 0.
                            </div>
                        )}

                        {!routeValueNotFound && routeValue > 0 && (
                            <div className="text-center text-[10px] text-muted-foreground font-medium">
                                Valor de ruta encontrado: <span className="text-primary font-bold">{routeValue} Bs/Kg</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Section 2: Medidas (Paquete only) ──────────────── */}
            <div
                className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-500 ease-in-out",
                    type === "paquete"
                        ? "max-h-[500px] opacity-100 border-border/60 bg-card/60 shadow-sm"
                        : "max-h-0 opacity-0 border-transparent"
                )}
            >
                <div className="p-5">
                    <SectionHeader number={2} title="Medidas del Paquete" />

                    <div className="space-y-4">
                        {/* Dimensions */}
                        <div>
                            <Label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Ruler className="h-4 w-4 text-primary" />
                                Dimensiones
                                <span className="text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                                    centímetros (cm)
                                </span>
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Ancho", placeholder: "0", val: width, set: setWidth },
                                    { label: "Largo", placeholder: "0", val: lengthVal, set: setLengthVal },
                                    { label: "Alto", placeholder: "0", val: height, set: setHeight },
                                ].map(({ label, placeholder, val, set }) => (
                                    <div key={label} className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                placeholder={placeholder}
                                                value={val}
                                                onChange={(e) => set(e.target.value)}
                                                className="h-11 pr-10 text-center font-semibold focus:border-primary"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                                                cm
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weight */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                <Weight className="h-4 w-4 text-primary" />
                                Peso
                                <span className="text-xs text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">
                                    kilogramos (Kg)
                                </span>
                            </Label>
                            <div className="relative max-w-[200px]">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="h-11 pr-10 text-center font-semibold focus:border-primary"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary pointer-events-none">
                                    Kg
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section 3: Modalidad y Servicio ─────────────────── */}
            <div className="border border-border/60 rounded-2xl p-5 bg-card/60 shadow-sm">
                <SectionHeader
                    number={type === "paquete" ? 3 : 2}
                    title="Modalidad y Tipo de Servicio"
                />

                {/* Transport mode */}
                <div className="mb-5">
                    <Label className="text-sm font-semibold text-foreground block mb-3">
                        Modalidad de Transporte
                    </Label>
                    <div className="flex gap-3">
                        <TransportCard
                            active={transport === "terrestre"}
                            icon={Truck}
                            label="Terrestre"
                            subtitle="Ruta por carretera"
                            badge="Económico"
                            onClick={() => setTransport("terrestre")}
                        />
                        <TransportCard
                            active={transport === "aereo"}
                            icon={Plane}
                            label="Aéreo"
                            subtitle="Vuelo directo"
                            badge="+40% tarifa"
                            onClick={() => setTransport("aereo")}
                        />
                    </div>
                </div>

                {/* Service tier cards */}
                <div>
                    <Label className="text-sm font-semibold text-foreground block mb-3">
                        Tipo de Servicio
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {SERVICE_TIERS.map((tier) => {
                            const Icon = tier.icon;
                            const active = service === tier.id;
                            return (
                                <button
                                    key={tier.id}
                                    type="button"
                                    onClick={() => setService(tier.id)}
                                    className={cn(
                                        "relative flex flex-col gap-3 p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                        active
                                            ? `bg-gradient-to-br ${tier.bgGradient} ${tier.borderColor} shadow-md scale-[1.02]`
                                            : "border-border/70 bg-card hover:border-muted-foreground/30 hover:bg-muted/30 hover:scale-[1.01]"
                                    )}
                                >
                                    {active && (
                                        <CheckCircle2
                                            className={cn("absolute top-3 right-3 h-4 w-4", tier.colorClass)}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={cn(
                                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
                                            active
                                                ? `${tier.badgeBg}`
                                                : "bg-muted group-hover:bg-muted/80"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-6 w-6 transition-colors",
                                                active ? tier.colorClass : "text-muted-foreground"
                                            )}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1">
                                        <p className={cn("font-bold text-sm", active ? tier.colorClass : "text-foreground")}>
                                            {tier.label}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground leading-tight">
                                            {tier.description}
                                        </p>
                                    </div>

                                    {/* Price & Days */}
                                    <div className="mt-auto pt-2 border-t border-border/40 flex items-center justify-between gap-1">
                                        <span
                                            className={cn(
                                                "text-sm font-black",
                                                active ? tier.colorClass : "text-primary"
                                            )}
                                        >
                                            {tier.delta > 0 ? `+${tier.delta} Bs.` : "Incluido"}
                                        </span>
                                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-medium"	>
                                            <Clock className="h-3 w-3" />
                                            {tier.days}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Costo Total ───────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                <div className="relative p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Costo Total del Envío
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {originOffice && destinationOffice && (
                                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                                        {originOffice.city?.name} → {destinationOffice.city?.name}
                                    </span>
                                )}
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium capitalize">
                                    {type === "paquete" ? "📦 Paquete" : "✉️ Sobre"}
                                </span>
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                    {transport === "aereo" ? "✈️ Aéreo" : "🚛 Terrestre"}
                                </span>
                                <span
                                    className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-semibold",
                                        selectedTier.badgeBg,
                                        selectedTier.badgeText
                                    )}
                                >
                                    {selectedTier.label} · {selectedTier.days}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 shrink-0">
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setWithIva(!withIva)}>
                                <Checkbox
                                    id="iva-checkbox"
                                    checked={withIva}
                                    onCheckedChange={(checked) => setWithIva(!!checked)}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor="iva-checkbox" className="text-sm font-bold text-foreground cursor-pointer select-none">
                                    Con Factura
                                </Label>
                            </div>

                            {/* Discount Input */}
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/60 hover:border-primary/40 transition-colors">
                                <Label htmlFor="discount-input" className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                                    Descuento (Bs.)
                                </Label>
                                <Input
                                    id="discount-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="h-8 w-24 text-right font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                />
                            </div>

                            <div className="text-right">
                                <p className="text-5xl sm:text-6xl font-black text-primary tabular-nums tracking-tight leading-none">
                                    {total.toFixed(2)}
                                    <span className="text-2xl sm:text-3xl font-bold ml-1 text-primary/80">Bs.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Next Button ──────────────────────────────────── */}
            <div className="space-y-2">
                <Button
                    type="button"
                    size="lg"
                    onClick={handleNext}
                    disabled={!isValid}
                    className={cn(
                        "w-full h-13 text-base font-bold transition-all duration-300 gap-2",
                        isValid
                            ? "gradient-primary glow-primary hover:opacity-90 hover:scale-[1.01] shadow-lg"
                            : "opacity-40 cursor-not-allowed"
                    )}
                >
                    Siguiente — Completar Registro
                    <ArrowRight className="h-5 w-5" />
                </Button>

                {!isValid && (
                    <p className="text-center text-xs text-muted-foreground">
                        {!originId || !destinationId
                            ? "📍 Selecciona ciudad de origen y destino para continuar"
                            : originId === destinationId
                                ? "⚠️ El origen y destino deben ser ciudades diferentes"
                                : "📐 Completa las dimensiones y peso del paquete para continuar"}
                    </p>
                )}
            </div>
        </div>
    );
}
