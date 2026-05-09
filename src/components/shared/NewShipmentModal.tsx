import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { format } from "date-fns";
import ShipmentRegisterWizard from "@/components/worker/shipment/ShipmentRegisterWizard";
import { useBackToClose } from "@/hooks/useBackToClose";

/* ─── Props ──────────────────────────────────────────────── */
interface NewShipmentModalProps {
    /** Custom trigger element. If omitted, renders the default "Nueva Encomienda" button. */
    trigger?: React.ReactNode;
    /** Controlled open state (optional). */
    open?: boolean;
    /** Called when the dialog open state changes (optional). */
    onOpenChange?: (open: boolean) => void;
    /** Pre-fills the sender data */
    defaultSender?: {
        id: number | string;
        name: string;
        ci: string;
        phone: string;
    };
    /** Called after a shipment is successfully registered (before closing the modal). */
    onSuccess?: () => void;
}

/* ─── Component ──────────────────────────────────────────── */
export function NewShipmentModal({
    trigger,
    open: controlledOpen,
    onOpenChange,
    defaultSender,
    onSuccess,
}: NewShipmentModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = typeof controlledOpen !== "undefined";
    const open = isControlled ? controlledOpen! : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

    // Intercept back button to close modal
    useBackToClose(open, () => setOpen(false));

    const currentDate = new Date();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        size="lg"
                        className="gradient-primary glow-primary text-white shadow-lg shadow-primary/20 font-semibold gap-2 hover:opacity-90 hover:scale-[1.01] transition-all duration-200"
                    >
                        <Package className="h-5 w-5" />
                        Nueva Encomienda
                    </Button>
                )}
            </DialogTrigger>

            {/* Content */}
            <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-4 gap-0 bg-background/95 backdrop-blur-xl border-border/60">

                <DialogHeader className="text-left">
                    <DialogTitle className="text-lg font-black text-foreground leading-tight">
                        Registro de Encomienda
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                        Completa los pasos para registrar el nuevo envío
                    </p>
                </DialogHeader>


                {/* Wizard content */}
                <div className="p-0">
                    <ShipmentRegisterWizard
                        onSuccess={() => {
                            onSuccess?.();
                            setOpen(false);
                        }}
                        hideHeader
                        defaultSender={defaultSender}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
