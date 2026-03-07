import { useAuthStore } from "@/stores/authStore";
import { User as UserIcon, LogOut, ArrowLeft, Package, Calendar, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ClientProfilePage() {
    const { user, authStatus, logout } = useAuthStore();
    const navigate = useNavigate();

    if (authStatus !== "auth" || user?.role !== "client") {
        // Should be handled by ProtectedRoute, but double check
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background p-6 flex justify-center">
            {/* Background gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mt-8">
                {/* Header / Nav */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver al Inicio
                    </Button>
                    <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg tracking-tight">KOLMOX</span>
                    </div>
                </div>

                {/* Profile Card */}
                <GlassCard className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* Simple Icon Avatar */}
                        <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
                            <UserIcon className="w-16 h-16 text-primary" />
                        </div>

                        {/* User Details */}
                        <div className="flex-1 space-y-6 w-full">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                                    {user.name}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase tracking-wider">
                                        Cliente
                                    </span>
                                    {user.created_at && (
                                        <span className="flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Miembro desde {format(new Date(user.created_at), "MMMM yyyy", { locale: es })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                                    <div className="flex items-center text-muted-foreground mb-1">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span className="text-xs uppercase font-semibold tracking-wider">Celular</span>
                                    </div>
                                    <p className="font-medium text-foreground">+591 {user.phone}</p>
                                </div>

                                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                                    <div className="flex items-center text-muted-foreground mb-1">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span className="text-xs uppercase font-semibold tracking-wider">CI / NIT</span>
                                    </div>
                                    <p className="font-medium text-foreground">{user.ci_nit || "No registrado"}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end">
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="w-full sm:w-auto"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </div>

                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
