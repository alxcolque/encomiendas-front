import { LoadingLogo } from "@/components/shared/LoadingLogo";
import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    
    MapPin,
    MapPinOff,
    MessageCircle,
    Phone,
    Plus,
    Search,
    Send,
    Star, // Added Star here
    User,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ShipmentDetailsData } from "./ShipmentDetailsForm";
import { useOfficeStore } from "@/stores/officeStore";
import { useClientStore } from "@/stores/clientStore";

/* ─── Schema ─────────────────────────────────────────────── */
const schema = z.object({
    senderId: z.string().optional(),
    senderName: z.string().min(3, "Nombre requerido (mínimo 3 caracteres)"),
    senderCI: z.string().min(5, "Carnet de identidad requerido"),
    senderPhone: z
        .string()
        .min(7, "Número de celular requerido"),

    recipientId: z.string().optional(),
    recipientName: z.string().min(3, "Nombre requerido (mínimo 3 caracteres)"),
    recipientCI: z.string().min(5, "Carnet de identidad requerido"),
    recipientPhone: z
        .string()
        .min(7, "Número de celular requerido"),

    paymentBy: z.enum(["remitente", "destinatario"]),
    isFragile: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export interface ShipmentPeopleData extends FormValues { }

interface Props {
    shipmentDetails: ShipmentDetailsData;
    onBack: () => void;
    onSubmit: (data: ShipmentPeopleData) => Promise<void>;
    defaultSender?: {
        id: number | string;
        name: string;
        ci: string;
        phone: string;
    };
}

/* ─── Field helper ───────────────────────────────────────── */
const PersonField = forwardRef<HTMLInputElement, {
    label: string;
    icon: React.ElementType;
    error?: string;
} & React.ComponentProps<"input">>(({ label, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
                <span className="text-destructive text-sm">*</span>
            </Label>
            <Input
                {...props}
                ref={ref}
                className={cn(
                    "h-11 transition-colors focus:border-primary",
                    error && "border-destructive focus:border-destructive"
                )}
            />
            {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {error}
                </p>
            )}
        </div>
    );
});

PersonField.displayName = "PersonField";

/* ─── Section Header ─────────────────────────────────────── */
function SectionHeader({
    number,
    title,
    color = "gradient-primary",
    textColor = "text-primary-foreground",
}: {
    number: string | number;
    title: string;
    color?: string;
    textColor?: string;
}) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md",
                    color,
                    textColor
                )}
            >
                {number}
            </div>
            <h3 className="font-bold text-base text-foreground">{title}</h3>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function ShipmentPeopleForm({
    shipmentDetails,
    onBack,
    onSubmit,
    defaultSender
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { offices } = useOfficeStore();
    const { searchClients, createClient } = useClientStore();

    const [isNewSender, setIsNewSender] = useState(false);
    const [isNewRecipient, setIsNewRecipient] = useState(false);
    const [isSearchingSender, setIsSearchingSender] = useState(false);
    const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);

    const [origSenderName, setOrigSenderName] = useState("");
    const [origRecipientName, setOrigRecipientName] = useState("");
    const [origSenderPhone, setOrigSenderPhone] = useState("");
    const [origRecipientPhone, setOrigRecipientPhone] = useState("");
    const [isUpdatingSender, setIsUpdatingSender] = useState(false);
    const [isUpdatingRecipient, setIsUpdatingRecipient] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            paymentBy: "remitente",
            senderId: "",
            senderName: "",
            senderCI: "",
            senderPhone: "",
            recipientId: "",
            recipientName: "",
            recipientCI: "",
            recipientPhone: "",
            isFragile: false,
        },
    });

    // Handle default sender initialization
    useState(() => {
        if (defaultSender) {
            setValue("senderId", String(defaultSender.id));
            setValue("senderName", defaultSender.name);
            setValue("senderCI", defaultSender.ci);
            setValue("senderPhone", defaultSender.phone);
        }
    });

    const senderCI = watch("senderCI");
    const recipientCI = watch("recipientCI");

    const handleSearchClient = async (type: 'sender' | 'recipient') => {
        const ci = type === 'sender' ? senderCI : recipientCI;
        if (!ci || ci.length < 5) return;

        if (type === 'sender') setIsSearchingSender(true);
        else setIsSearchingRecipient(true);

        try {
            const results = await searchClients(ci);
            const found = results.find(c => c.ci_nit === ci);

            if (found) {
                if (type === 'sender') {
                    setValue("senderId", String(found.id));
                    setValue("senderName", found.name);
                    setValue("senderPhone", found.phone || "");
                    setOrigSenderName(found.name);
                    setOrigSenderPhone(found.phone || "");
                    setIsNewSender(false);
                } else {
                    setValue("recipientId", String(found.id));
                    setValue("recipientName", found.name);
                    setValue("recipientPhone", found.phone || "");
                    setOrigRecipientName(found.name);
                    setOrigRecipientPhone(found.phone || "");
                    setIsNewRecipient(false);
                }
                toast.success("Cliente encontrado");
            } else {
                toast.error("Cliente no encontrado. Se habilitará el registro nuevo.");
                if (type === 'sender') {
                    setValue("senderId", "");
                    setValue("senderName", "");
                    setValue("senderPhone", "");
                    setIsNewSender(true);
                } else {
                    setValue("recipientId", "");
                    setValue("recipientName", "");
                    setValue("recipientPhone", "");
                    setIsNewRecipient(true);
                }
            }
        } finally {
            if (type === 'sender') setIsSearchingSender(false);
            else setIsSearchingRecipient(false);
        }
    };

    const handleWhatsApp = (phone: string, name: string) => {
        if (!phone || phone.length < 7) {
            toast.error("Por favor ingrese un número de celular válido.");
            return;
        }
        const message = `Hola ${name}, su código de verificación para Encomiendas Oruro es: ${Math.floor(Math.random() * 900000) + 100000}`;
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/591${phone}?text=${encoded}`, '_blank');
    };

    const handleUpdateClientData = async (type: 'sender' | 'recipient') => {
        const id = String(type === 'sender' ? watch("senderId") : watch("recipientId"));
        const name = type === 'sender' ? watch("senderName") : watch("recipientName");
        const phone = type === 'sender' ? watch("senderPhone") : watch("recipientPhone");

        if (!id || id === 'undefined' || !name || !phone) return;

        if (type === 'sender') setIsUpdatingSender(true);
        else setIsUpdatingRecipient(true);

        try {
            const { updateClient } = useClientStore.getState();
            await updateClient(id, { name, phone });
            if (type === 'sender') {
                setOrigSenderName(name);
                setOrigSenderPhone(phone);
            } else {
                setOrigRecipientName(name);
                setOrigRecipientPhone(phone);
            }
            toast.success("Datos del cliente actualizados");
        } catch (error) {
            toast.error("Error al actualizar el cliente");
        } finally {
            if (type === 'sender') setIsUpdatingSender(false);
            else setIsUpdatingRecipient(false);
        }
    };

    const paymentBy = watch("paymentBy");

    const onFormSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const originOffice = offices.find(o => o.id === shipmentDetails.origin_office_id);
    const destinationOffice = offices.find(o => o.id === shipmentDetails.destination_office_id);

    const selectedTierLabel = {
        normal: "Normal",
        estandar: "Estándar",
        rapido: "Rápido",
    }[shipmentDetails.service];

    const onError = (errors: any) => {
        console.log("Validation Errors:", errors);
        toast.error("Por favor revise los datos del formulario. Faltan campos obligatorios.");
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit, onError)} className="space-y-5">

            {/* ── Summary banner ──────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden border border-primary/25 shadow-md shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-bold text-foreground">
                                {originOffice?.city?.name || "..."} ({originOffice?.name || "..."})
                            </span>
                        </div>
                        <span className="text-muted-foreground">→</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                                <MapPin className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-bold text-foreground">
                                {destinationOffice?.city?.name || "..."} ({destinationOffice?.name || "..."})
                            </span>
                        </div>
                        <div className="flex gap-1.5 ml-1 flex-wrap">
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium capitalize">
                                {shipmentDetails.type === "paquete" ? "📦 Paquete" : "✉️ Sobre"}
                            </span>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                                {shipmentDetails.transport === "aereo" ? "✈️ Aéreo" : "🚛 Terrestre"}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                {selectedTierLabel}
                            </span>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <p className="text-2xl font-black text-primary tabular-nums leading-none">
                            {shipmentDetails.total.toFixed(2)}
                            <span className="text-base font-bold text-primary/70 ml-1">Bs.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Section 4: Remitente & Destinatario ──────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Sender */}
                <div className="border border-border/60 rounded-2xl p-5 bg-card/60 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                                R
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">Remitente</h3>
                                <p className="text-xs text-muted-foreground">Quien envía la encomienda</p>
                            </div>
                        </div>
                        {!defaultSender && !isNewSender && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsNewSender(true)}
                                className="h-8 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                            >
                                <Plus className="h-3 w-3" />
                                Nuevo cliente
                            </Button>
                        )}
                        {!defaultSender && isNewSender && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsNewSender(false)}
                                className="h-8 text-xs gap-1 text-muted-foreground hover:bg-muted"
                            >
                                Buscar existente
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Carnet de Identidad
                            <span className="text-destructive text-sm">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ej: 7654321"
                                readOnly={!!defaultSender}
                                className={cn(
                                    "h-11 transition-colors focus:border-primary",
                                    errors.senderCI && "border-destructive",
                                    defaultSender && "bg-muted cursor-not-allowed text-muted-foreground"
                                )}
                                {...register("senderCI")}
                            />
                            {!defaultSender && !isNewSender && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 shrink-0"
                                    disabled={isSearchingSender || (senderCI?.length || 0) < 5}
                                    onClick={() => handleSearchClient('sender')}
                                >
                                    {isSearchingSender ? (
                                        <LoadingLogo className="h-4 w-4 animate-pulse" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
                        {errors.senderCI && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                {errors.senderCI.message}
                            </p>
                        )}
                    </div>

                    {(isNewSender || watch("senderId")) && (
                        <>
                            <div className="space-y-1.5">
                                <PersonField
                                    label="Nombre Completo"
                                    icon={User}
                                    placeholder="Ej: Juan Carlos Mamani"
                                    readOnly={!!defaultSender}
                                    className={cn(defaultSender && "bg-muted cursor-not-allowed text-muted-foreground")}
                                    error={errors.senderName?.message}
                                    {...register("senderName")}
                                />
                                {!defaultSender && !isNewSender && watch("senderId") && watch("senderName") !== origSenderName && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleUpdateClientData('sender')}
                                        disabled={isUpdatingSender}
                                        className="w-full h-9 gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all animate-in fade-in zoom-in duration-300"
                                    >
                                        {isUpdatingSender ? <LoadingLogo className="h-4 w-4 animate-pulse" /> : "Guardar nombre actualizado"}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Phone className="h-4 w-4 text-primary" />
                                    Número de Celular
                                    <span className="text-destructive text-sm">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="tel"
                                        placeholder="Ej: 71234567"
                                        readOnly={!!defaultSender}
                                        className={cn(
                                            "h-11 transition-colors focus:border-primary",
                                            errors.senderPhone && "border-destructive",
                                            defaultSender && "bg-muted cursor-not-allowed text-muted-foreground"
                                        )}
                                        {...register("senderPhone")}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                        onClick={() => handleWhatsApp(watch("senderPhone"), watch("senderName"))}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>
                                    {!defaultSender && !isNewSender && watch("senderId") && (watch("senderPhone") !== origSenderPhone || watch("senderName") !== origSenderName) && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => handleUpdateClientData('sender')}
                                            disabled={isUpdatingSender}
                                            className="h-11 px-3 gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all animate-in fade-in zoom-in duration-300"
                                        >
                                            {isUpdatingSender ? <LoadingLogo className="h-4 w-4 animate-pulse" /> : "Guardar"}
                                        </Button>
                                    )}
                                </div>
                                {errors.senderPhone && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        {errors.senderPhone.message}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Recipient */}
                <div className="border border-border/60 rounded-2xl p-5 bg-card/60 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                                D
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">Destinatario</h3>
                                <p className="text-xs text-muted-foreground">Quien recibe la encomienda</p>
                            </div>
                        </div>
                        {!isNewRecipient && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsNewRecipient(true)}
                                className="h-8 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                            >
                                <Plus className="h-3 w-3" />
                                Nuevo cliente
                            </Button>
                        )}
                        {isNewRecipient && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsNewRecipient(false)}
                                className="h-8 text-xs gap-1 text-muted-foreground hover:bg-muted"
                            >
                                Buscar existente
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Carnet de Identidad
                            <span className="text-destructive text-sm">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ej: 4321876"
                                className={cn(
                                    "h-11 transition-colors focus:border-primary",
                                    errors.recipientCI && "border-destructive"
                                )}
                                {...register("recipientCI")}
                            />
                            {!isNewRecipient && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 shrink-0"
                                    disabled={isSearchingRecipient || (recipientCI?.length || 0) < 5}
                                    onClick={() => handleSearchClient('recipient')}
                                >
                                    {isSearchingRecipient ? (
                                        <LoadingLogo className="h-4 w-4 animate-pulse" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
                        {errors.recipientCI && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                {errors.recipientCI.message}
                            </p>
                        )}
                    </div>

                    {(isNewRecipient || watch("recipientId")) && (
                        <>
                            <div className="space-y-1.5">
                                <PersonField
                                    label="Nombre Completo"
                                    icon={User}
                                    placeholder="Ej: María Quispe Flores"
                                    error={errors.recipientName?.message}
                                    {...register("recipientName")}
                                />
                                {!isNewRecipient && watch("recipientId") && watch("recipientName") !== origRecipientName && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleUpdateClientData('recipient')}
                                        disabled={isUpdatingRecipient}
                                        className="w-full h-9 gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all animate-in fade-in zoom-in duration-300"
                                    >
                                        {isUpdatingRecipient ? <LoadingLogo className="h-4 w-4 animate-pulse" /> : "Guardar nombre actualizado"}
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Phone className="h-4 w-4 text-primary" />
                                    Número de Celular
                                    <span className="text-destructive text-sm">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="tel"
                                        placeholder="Ej: 76543210"
                                        className={cn(
                                            "h-11 transition-colors focus:border-primary",
                                            errors.recipientPhone && "border-destructive"
                                        )}
                                        {...register("recipientPhone")}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-11 w-11 shrink-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                        onClick={() => handleWhatsApp(watch("recipientPhone"), watch("recipientName"))}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </Button>
                                    {!isNewRecipient && watch("recipientId") && (watch("recipientPhone") !== origRecipientPhone || watch("recipientName") !== origRecipientName) && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => handleUpdateClientData('recipient')}
                                            disabled={isUpdatingRecipient}
                                            className="h-11 px-3 gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all animate-in fade-in zoom-in duration-300"
                                        >
                                            {isUpdatingRecipient ? <LoadingLogo className="h-4 w-4 animate-pulse" /> : "Guardar"}
                                        </Button>
                                    )}
                                </div>
                                {errors.recipientPhone && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        {errors.recipientPhone.message}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Section 5: Opción de Pago ───────────────────── */}
            <div className="border border-border/60 rounded-2xl p-5 bg-card/60 shadow-sm">
                <SectionHeader number={5} title="Opción de Pago" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Remitente - Pagado en Origen */}
                    {(() => {
                        const active = paymentBy === "remitente";
                        return (
                            <button
                                key="remitente"
                                type="button"
                                onClick={() => setValue("paymentBy", "remitente")}
                                className={cn(
                                    "relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                                    active
                                        ? "border-emerald-500 bg-emerald-500/10 shadow-md"
                                        : "border-border bg-card hover:border-emerald-400/50 hover:bg-emerald-500/5 hover:scale-[1.01]"
                                )}
                            >
                                {active && (
                                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-emerald-500" />
                                )}
                                <div
                                    className={cn(
                                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                                        active ? "bg-emerald-500 shadow-md shadow-emerald-500/30" : "bg-muted group-hover:bg-emerald-500/15"
                                    )}
                                >
                                    <Wallet className={cn("h-5 w-5", active ? "text-white" : "text-muted-foreground group-hover:text-emerald-600")} />
                                </div>
                                <div>
                                    <p className={cn("font-bold text-sm", active ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                                        Pagado por Remitente
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Se cobra al momento del envío
                                    </p>
                                    <span className={cn(
                                        "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5",
                                        active ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        ORIGEN
                                    </span>
                                </div>
                            </button>
                        );
                    })()}

                    {/* Destinatario - Por pagar en Destino */}
                    {(() => {
                        const active = paymentBy === "destinatario";
                        return (
                            <button
                                key="destinatario"
                                type="button"
                                onClick={() => setValue("paymentBy", "destinatario")}
                                className={cn(
                                    "relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                                    active
                                        ? "border-sky-500 bg-sky-500/10 shadow-md"
                                        : "border-border bg-card hover:border-sky-400/50 hover:bg-sky-500/5 hover:scale-[1.01]"
                                )}
                            >
                                {active && (
                                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-sky-500" />
                                )}
                                <div
                                    className={cn(
                                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                                        active ? "bg-sky-500 shadow-md shadow-sky-500/30" : "bg-muted group-hover:bg-sky-500/15"
                                    )}
                                >
                                    <MapPinOff className={cn("h-5 w-5", active ? "text-white" : "text-muted-foreground group-hover:text-sky-600")} />
                                </div>
                                <div>
                                    <p className={cn("font-bold text-sm", active ? "text-sky-600 dark:text-sky-400" : "text-foreground")}>
                                        Por Pagar
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Se cobra al momento de la entrega
                                    </p>
                                    <span className={cn(
                                        "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5",
                                        active ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        DESTINO
                                    </span>
                                </div>
                            </button>
                        );
                    })()}
                </div>
            </div>

            {/* ── Section 6: Opciones Extra ───────────────────── */}
            <div className="border border-border/60 rounded-2xl p-5 bg-card/60 shadow-sm">
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center space-x-2 cursor-pointer group"
                        onClick={() => setValue("isFragile", !watch("isFragile"))}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                            watch("isFragile") ? "bg-amber-500 border-amber-500" : "border-border bg-muted group-hover:border-amber-400"
                        )}>
                            {watch("isFragile") && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <Label className="text-sm font-bold text-foreground cursor-pointer flex items-center gap-2">
                            <Star className={cn("h-4 w-4 transition-colors", watch("isFragile") ? "text-amber-500" : "text-muted-foreground")} />
                            Esta encomienda contiene objetos frágiles
                        </Label>
                    </div>
                </div>
            </div>

            {/* ── Actions ───────────────────────────────────── */}
            <div className="flex gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onBack}
                    className="flex-none gap-2 font-semibold hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>

                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="flex-1 gap-2 gradient-primary glow-primary text-base font-bold hover:opacity-90 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                >
                    {isSubmitting ? (
                        <>
                            <LoadingLogo className="h-5 w-5 animate-pulse" />
                            Registrando encomienda...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Registrar Encomienda
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
