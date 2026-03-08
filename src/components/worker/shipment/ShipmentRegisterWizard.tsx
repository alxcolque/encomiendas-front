import { useState } from "react";
import { Package, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import ShipmentDetailsForm, {
    type ShipmentDetailsData,
    type ServiceTier,
} from "./ShipmentDetailsForm";
import ShipmentPeopleForm, {
    type ShipmentPeopleData,
} from "./ShipmentPeopleForm";
import { cn } from "@/lib/utils";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { CreateShipmentPayload } from "@/interfaces/shipment.interface";
import { useAuthStore } from "@/stores/authStore";

import { InvoiceDocument } from "./InvoiceDocument";
import { Invoice } from "@/interfaces/invoice.interface";

/* ─── Step indicator ─────────────────────────────────────── */
const getSteps = (isClient: boolean) => [
    { number: 1, label: "Detalles del Envío" },
    ...(isClient ? [] : [{ number: 2, label: "Remitente y Destinatario" }])
];

function StepIndicator({ current, isClient }: { current: number, isClient: boolean }) {
    const STEPS = getSteps(isClient);
    return (
        <div className="flex items-center gap-0 mb-8">
            {STEPS.map((step, idx) => (
                <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={cn(
                                "w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300",
                                current > step.number
                                    ? "bg-green-500 border-green-500 text-white"
                                    : current === step.number
                                        ? "gradient-primary border-primary text-white glow-primary"
                                        : "border-border text-muted-foreground bg-card"
                            )}
                        >
                            {current > step.number ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-xs font-medium text-center leading-tight max-w-[90px]",
                                current === step.number
                                    ? "text-primary"
                                    : current > step.number
                                        ? "text-green-500"
                                        : "text-muted-foreground"
                            )}
                        >
                            {step.label}
                        </span>
                    </div>

                    {/* Connector line between steps */}
                    {idx < STEPS.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-border">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    current > step.number ? "w-full bg-green-500" : "w-0"
                                )}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── Props ──────────────────────────────────────────────── */
interface ShipmentRegisterWizardProps {
    /** Called after the shipment is successfully registered. Use to close a modal. */
    onSuccess?: () => void;
    /** When true, hides the top title/header (useful when embedded inside a modal with its own header). */
    hideHeader?: boolean;
    /** Pre-fills the sender data, used generally by authenticated clients */
    defaultSender?: {
        id: number | string;
        name: string;
        ci: string;
        phone: string;
    };
}

/* ─── Main Wizard ────────────────────────────────────────── */
export default function ShipmentRegisterWizard({
    onSuccess,
    hideHeader = false,
    defaultSender,
}: ShipmentRegisterWizardProps) {
    const [step, setStep] = useState(1);
    const [detailsData, setDetailsData] = useState<ShipmentDetailsData | null>(null);
    const [withIva, setWithIva] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
    const { createShipment } = useAdminShipmentStore();

    const { user, hasRole } = useAuthStore();
    const isClient = hasRole('client') || user?.role === 'client';

    const handleDetailsNext = (data: ShipmentDetailsData) => {
        setDetailsData(data);
        setWithIva(data.withIva);

        if (isClient) {
            handleFinalSubmit(undefined, data);
        } else {
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFinalSubmit = async (people?: ShipmentPeopleData, currentDetails?: ShipmentDetailsData) => {
        const details = currentDetails || detailsData;
        if (!details) return;

        try {
            const isClientFlow = !people && isClient;

            const payload: CreateShipmentPayload = {
                origin_office_id: details.origin_office_id,
                destination_office_id: details.destination_office_id,

                sender_id: isClientFlow ? user?.id : (people?.senderId || undefined),
                receiver_id: isClientFlow ? undefined : (people?.recipientId || undefined),

                // If IDs are missing, the backend will use these
                sender_name: isClientFlow ? user?.name : people?.senderName,
                sender_ci: isClientFlow ? user?.ci_nit : people?.senderCI,
                sender_phone: isClientFlow ? user?.phone : people?.senderPhone,

                receiver_name: isClientFlow ? undefined : people?.recipientName,
                receiver_ci: isClientFlow ? undefined : people?.recipientCI,
                receiver_phone: isClientFlow ? undefined : people?.recipientPhone,

                tracking_pay: isClientFlow ? 1 : (people?.paymentBy === 'remitente' ? 1 : 2),
                is_pack: details.type === 'paquete',
                is_fragile: isClientFlow ? false : people?.isFragile,
                type_service: details.service,
                track_type: details.transport === 'terrestre' ? 1 : 2,
                price: details.total,
                current_status: 'created'
            };

            const result = await createShipment({
                ...payload,
                with_invoice: isClientFlow ? details.withIva : true,
                invoice_name: isClientFlow ? user?.name : people?.senderName,
                invoice_nit: isClientFlow ? user?.ci_nit : people?.senderCI,
                invoice_type: details.withIva ? 'con' : 'sin',
            } as any);

            toast.success("¡Encomienda registrada exitosamente!", {
                description: `Código: ${result.tracking_code} · ${details.total.toFixed(2)} Bs.`,
            });

            if (result.invoice) {
                setCreatedInvoice(result.invoice);
                setShowInvoice(true);
            } else {
                // Reset wizard if no invoice
                resetWizard();
            }

            // Notify parent (e.g. close modal)
            onSuccess?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Error creating shipment:", error);
            toast.error("Error al registrar la encomienda. Por favor intente de nuevo.");
        }
    };

    const resetWizard = () => {
        setStep(1);
        setDetailsData(null);
        setShowInvoice(false);
        setCreatedInvoice(null);
    };

    return (
        <div className="max-w-3xl mx-auto">

            {/* Header — hidden when used inside a modal */}
            {!hideHeader && !showInvoice && (
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-xl gradient-primary glow-primary">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-foreground">
                                Registro de Encomienda
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Completa los pasos para registrar el nuevo envío
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showInvoice && createdInvoice ? (
                <InvoiceDocument
                    invoice={createdInvoice}
                    onClose={resetWizard}
                />
            ) : (
                <>
                    {/* Step indicator */}
                    {!isClient && <StepIndicator current={step} isClient={isClient} />}

                    {/* Step content with slide animation */}
                    <div className="relative overflow-hidden">
                        <div
                            className={cn(
                                "transition-all duration-300",
                                step === 1 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                            )}
                        >
                            <ShipmentDetailsForm onNext={handleDetailsNext} isClientMode={isClient} />
                        </div>

                        <div
                            className={cn(
                                "transition-all duration-300",
                                step === 2 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                            )}
                        >
                            {detailsData && (
                                <ShipmentPeopleForm
                                    shipmentDetails={detailsData as any}
                                    onBack={handleBack}
                                    onSubmit={handleFinalSubmit}
                                    defaultSender={defaultSender}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
