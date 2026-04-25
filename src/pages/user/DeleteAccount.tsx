import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, ArrowLeft, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const REASONS = [
    "No lo uso frecuentemente",
    "Problemas técnicos con la aplicación",
    "Preocupaciones sobre la privacidad de mis datos",
    "Encontré otra alternativa que prefiero",
    "La interfaz es difícil de usar",
    "Otro motivo"
];

export default function DeleteAccountPage() {
    const navigate = useNavigate();
    const { deleteAccount, isLoading } = useAuthStore();
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pin, setPin] = useState("");

    const toggleReason = (reason: string) => {
        setSelectedReasons(prev => 
            prev.includes(reason) 
                ? prev.filter(r => r !== reason) 
                : [...prev, reason]
        );
    };

    const handleInitialDeleteClick = () => {
        if (selectedReasons.length === 0) {
            toast.error("Por favor, selecciona al menos un motivo.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmDeletion = async () => {
        if (!pin || pin.length !== 4) {
            toast.error("Por favor, ingresa tu PIN de 4 dígitos.");
            return;
        }

        try {
            await deleteAccount({ pin, reasons: selectedReasons });
            // The store handles logout and navigation on success via state update usually,
            // but here we might want to force navigation if store doesn't.
            // Based on authStore.ts, it sets user: undefined, token: undefined.
            // Our ProtectedRoute/AppRouter should take care of redirecting to /login.
            navigate("/login", { replace: true });
        } catch (error) {
            // Error handled by store toast
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">
                <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/user/profile")}
                >
                    <ArrowLeft size={18} />
                    Volver al perfil
                </Button>

                <GlassCard className="p-8 border-destructive/20 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Eliminar Cuenta</h1>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            Lamentamos que quieras irte. Ayúdanos a mejorar contándonos por qué has decidido cerrar tu cuenta.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShieldAlert size={18} className="text-primary" />
                                ¿Cuál es el motivo de tu baja?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {REASONS.map((reason) => (
                                    <div 
                                        key={reason}
                                        className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                            selectedReasons.includes(reason) 
                                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                            : "border-border hover:bg-muted"
                                        }`}
                                        onClick={() => toggleReason(reason)}
                                    >
                                        <Checkbox 
                                            id={reason} 
                                            checked={selectedReasons.includes(reason)}
                                            onCheckedChange={() => toggleReason(reason)}
                                        />
                                        <Label htmlFor={reason} className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {reason}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <Button 
                                variant="destructive" 
                                className="w-full h-12 text-lg font-bold shadow-lg shadow-destructive/20 transition-transform active:scale-95"
                                disabled={selectedReasons.length === 0}
                                onClick={handleInitialDeleteClick}
                            >
                                <Trash2 size={20} className="mr-2" />
                                Eliminar mi cuenta
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Al hacer clic en este botón, se iniciará el proceso de confirmación final.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Final Confirmation Modal */}
                <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <AlertDialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-destructive/30">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive flex items-center gap-2 text-2xl">
                                <AlertTriangle className="animate-bounce" />
                                ¡Advertencia Irreversible!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-foreground/80 space-y-4 pt-2">
                                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                                    <p className="font-bold text-destructive mb-2 text-base">Está a punto de:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Perder acceso permanente a su cuenta.</li>
                                        <li>Borrar sus datos personales de nuestro sistema activo.</li>
                                        <li>Anonimizar sus registros históricos (pedidos, facturas).</li>
                                    </ul>
                                </div>
                                <p className="text-sm font-medium">
                                    Para confirmar la baja definitiva, por favor ingrese su PIN de seguridad de 4 dígitos.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="my-6">
                            <Label htmlFor="confirm-pin" className="sr-only">PIN de 4 dígitos</Label>
                            <Input 
                                id="confirm-pin"
                                type="password" 
                                placeholder="● ● ● ●" 
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                                className="text-center text-2xl tracking-[1rem] h-14 bg-muted/50 border-destructive/20 focus-visible:ring-destructive"
                                autoFocus
                            />
                        </div>

                        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="mt-0">Mejor me quedo</AlertDialogCancel>
                            <Button 
                                variant="destructive" 
                                className="font-bold flex-1"
                                onClick={handleConfirmDeletion}
                                disabled={pin.length !== 4 || isLoading}
                            >
                                {isLoading ? (
                                    <div className={`loading-logo ${"mr-2 h-4 w-4 animate-pulse"}`}></div>
                                ) : (
                                    <Trash2 size={18} className="mr-2" />
                                )}
                                Confirmar Baja
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
