import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { format } from "date-fns";
import ShipmentRegisterWizard from "@/components/worker/shipment/ShipmentRegisterWizard";

/* ─── Props ──────────────────────────────────────────────── */
interface NewShipmentModalProps {
    /** Custom trigger element. If omitted, renders the default "Nueva Encomienda" button. */
    trigger?: React.ReactNode;
    /** Controlled open state (optional). */
    open?: boolean;
    /** Called when the dialog open state changes (optional). */
    onOpenChange?: (open: boolean) => void;
}

/* ─── Component ──────────────────────────────────────────── */
export function NewShipmentModal({
    trigger,
    open: controlledOpen,
    onOpenChange,
}: NewShipmentModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = typeof controlledOpen !== "undefined";
    const open = isControlled ? controlledOpen! : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

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
            <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/60">

                {/* Sticky header */}
                <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl gradient-primary shadow-md shadow-primary/30">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-foreground leading-tight">
                                Registro de Encomienda
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Completa los pasos para registrar el nuevo envío
                            </p>
                        </div>
                    </div>

                    {/* Date display */}
                    <div className="flex gap-1.5">
                        {(["dd", "MM", "yyyy"] as const).map((fmt, i) => (
                            <div key={fmt} className="flex flex-col items-center">
                                <div className="bg-muted border border-border/60 rounded-lg px-2.5 py-1 font-mono text-sm font-semibold text-foreground min-w-[2.5rem] text-center">
                                    {format(currentDate, fmt)}
                                </div>
                                <span className="text-[9px] text-muted-foreground uppercase mt-0.5 font-medium">
                                    {["Día", "Mes", "Año"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wizard content */}
                <div className="p-6">
                    <ShipmentRegisterWizard
                        onSuccess={() => setOpen(false)}
                        hideHeader
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
