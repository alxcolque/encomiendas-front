import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    User,
    Phone,
    CreditCard,
    ArrowLeft,
    Send,
    CheckCircle2,
    Loader2,
    MapPin,
    Wallet,
    MapPinOff,
    Search,
    Plus,
} from "lucide-react";
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
});

type FormValues = z.infer<typeof schema>;

export interface ShipmentPeopleData extends FormValues { }

interface Props {
    shipmentDetails: ShipmentDetailsData;
    onBack: () => void;
    onSubmit: (data: ShipmentPeopleData) => Promise<void>;
}

/* ─── Field helper ───────────────────────────────────────── */
function PersonField({
    label,
    icon: Icon,
    error,
    ...props
}: {
    label: string;
    icon: React.ElementType;
    error?: string;
} & React.ComponentProps<"input">) {
    return (
        <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
                <span className="text-destructive text-sm">*</span>
            </Label>
            <Input
                {...props}
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
}

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
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { offices } = useOfficeStore();
    const { searchClients, createClient } = useClientStore();

    const [isNewSender, setIsNewSender] = useState(false);
    const [isNewRecipient, setIsNewRecipient] = useState(false);
    const [isSearchingSender, setIsSearchingSender] = useState(false);
    const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);

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
            recipientId: "",
        },
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
                    setValue("senderId", found.id);
                    setValue("senderName", found.name);
                    setValue("senderPhone", found.phone || "");
                    setIsNewSender(false);
                } else {
                    setValue("recipientId", found.id);
                    setValue("recipientName", found.name);
                    setValue("recipientPhone", found.phone || "");
                    setIsNewRecipient(false);
                }
            } else {
                if (type === 'sender') {
                    setValue("senderId", "");
                } else {
                    setValue("recipientId", "");
                }
            }
        } finally {
            if (type === 'sender') setIsSearchingSender(false);
            else setIsSearchingRecipient(false);
        }
    };

    const paymentBy = watch("paymentBy");

    const onFormSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            let finalSenderId = data.senderId;
            let finalRecipientId = data.recipientId;

            // Create new sender if needed
            if (!finalSenderId || isNewSender) {
                const newSender = await createClient({
                    name: data.senderName,
                    ci_nit: data.senderCI,
                    phone: data.senderPhone,
                    status: 'normal'
                });
                finalSenderId = newSender.id;
            }

            // Create new recipient if needed
            if (!finalRecipientId || isNewRecipient) {
                const newRecipient = await createClient({
                    name: data.recipientName,
                    ci_nit: data.recipientCI,
                    phone: data.recipientPhone,
                    status: 'normal'
                });
                finalRecipientId = newRecipient.id;
            }

            await onSubmit({
                ...data,
                senderId: finalSenderId,
                recipientId: finalRecipientId
            });
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

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

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
                        {!isNewSender && (
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
                        {isNewSender && (
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
                                className={cn(
                                    "h-11 transition-colors focus:border-primary",
                                    errors.senderCI && "border-destructive"
                                )}
                                {...register("senderCI")}
                            />
                            {!isNewSender && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 shrink-0"
                                    disabled={isSearchingSender || (senderCI?.length || 0) < 5}
                                    onClick={() => handleSearchClient('sender')}
                                >
                                    {isSearchingSender ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
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
                            <PersonField
                                label="Nombre Completo"
                                icon={User}
                                placeholder="Ej: Juan Carlos Mamani"
                                error={errors.senderName?.message}
                                {...register("senderName")}
                                readOnly={!!watch("senderId") && !isNewSender}
                            />
                            <PersonField
                                label="Número de Celular"
                                icon={Phone}
                                type="tel"
                                placeholder="Ej: 71234567"
                                error={errors.senderPhone?.message}
                                {...register("senderPhone")}
                                readOnly={!!watch("senderId") && !isNewSender}
                            />
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
                                        <Loader2 className="h-4 w-4 animate-spin" />
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
                            <PersonField
                                label="Nombre Completo"
                                icon={User}
                                placeholder="Ej: María Quispe Flores"
                                error={errors.recipientName?.message}
                                {...register("recipientName")}
                                readOnly={!!watch("recipientId") && !isNewRecipient}
                            />
                            <PersonField
                                label="Número de Celular"
                                icon={Phone}
                                type="tel"
                                placeholder="Ej: 76543210"
                                error={errors.recipientPhone?.message}
                                {...register("recipientPhone")}
                                readOnly={!!watch("recipientId") && !isNewRecipient}
                            />
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
                            <Loader2 className="h-5 w-5 animate-spin" />
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
