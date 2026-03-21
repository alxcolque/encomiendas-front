import { useEffect, useState } from "react";
import { ENV } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { Package, MapPin, Calendar, ArrowRight, Loader2, AlertCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";

// Extend with origin_office and destination_office full objects
interface IShipment {
    id: number;
    tracking_code: string;
    current_status: string;
    created_at: string;
    price: number;
    origin_office: { name: string };
    destination_office: { name: string };
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    quote: { label: "Cotización", color: "bg-background text-red-500 border-red-500 uppercase font-bold tracking-wider" },
    created: { label: "Registrado", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    in_transit: { label: "En Tránsito", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    at_office: { label: "En Agencia Destino", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    delivered: { label: "Entregado", color: "bg-green-500/10 text-green-500 border-green-500/20" },
};

export default function ClientOrderHistory() {
    const [shipments, setShipments] = useState<IShipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, authStatus } = useAuthStore();

    useEffect(() => {
        if (authStatus === 'auth' && user?.role === 'client') {
            fetchShipments();
        }
    }, [authStatus, user]);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await ENV.get("/client/shipments");
            setShipments(data.shipments);
        } catch (err: any) {
            console.error("Error fetching shipments:", err);
            setError("No se pudo cargar el historial de pedidos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuote = async (id: number) => {
        if (!window.confirm("¿Está seguro que desea eliminar esta cotización?")) return;
        try {
            await ENV.delete(`/shipments/${id}`);
            setShipments(prev => prev.filter(s => s.id !== id));
            toast.success("Cotización eliminada correctamente");
        } catch (err: any) {
            console.error("Error deleting quote:", err);
            toast.error("No se pudo eliminar la cotización.");
        }
    };

    if (authStatus !== 'auth' || user?.role !== 'client') {
        return null;
    }

    return (
        <section className="py-12 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-foreground">
                            Mi Historial de Pedidos
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Rastrea y revisa el estado de tus encomiendas recientes.
                        </p>
                    </div>
                    {user && (
                        <NewShipmentModal
                            defaultSender={{
                                id: user.id || "",
                                name: user.name || "",
                                ci: user.ci_nit || "",
                                phone: user.phone || ""
                            }}
                            trigger={
                                <Button
                                    size="lg"
                                    className="gradient-primary glow-primary text-white shadow-lg shadow-primary/20 font-semibold gap-2 hover:opacity-90 hover:scale-[1.01] transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5" />
                                    Nueva Encomienda
                                </Button>
                            }
                        />
                    )}
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-border shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Cargando tus encomiendas...</p>
                    </div>
                ) : shipments.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No hay encomiendas</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Aún no tienes encomiendas registradas con tu número de teléfono y CI/NIT.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[650px] sm:max-h-[750px] overflow-y-auto pr-2 pb-2 overflow-x-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shipments.map((shipment) => {
                                const statusInfo = STATUS_MAP[shipment.current_status] || { label: shipment.current_status, color: "bg-muted text-foreground" };

                                return (
                                    <div
                                        key={shipment.id}
                                        className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all rounded-2xl p-6 group hover:shadow-glow flex flex-col relative"
                                    >
                                        {shipment.current_status === 'quote' && (
                                            <button
                                                onClick={() => handleDeleteQuote(shipment.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-full transition-colors absolute top-2 right-2 bg-background shadow-sm z-10"
                                                title="Eliminar cotización"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}

                                        <div className="flex justify-between items-start mb-4 relative">
                                            <div>
                                                {shipment.current_status === 'quote' && (
                                                    <div className="mb-1">
                                                        <Badge variant="outline" className="bg-background text-red-500 border-red-500 uppercase font-bold text-[10px] tracking-wider px-1.5 py-0 border-2 rounded-sm rounded-tr-xl">
                                                            Cotización
                                                        </Badge>
                                                    </div>
                                                )}
                                                <h3 className="font-mono font-semibold text-lg text-foreground tracking-tight pr-8">
                                                    {shipment.tracking_code}
                                                </h3>
                                                <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(shipment.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {shipment.current_status !== 'quote' && (
                                                    <Badge variant="outline" className={statusInfo.color}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                )}

                                                <div className="mt-1 flex items-baseline justify-end h-8">
                                                    <span className="text-3xl font-display font-medium text-orange-500 tracking-tight">
                                                        {shipment.price ? Number(shipment.price).toFixed(2) : "0.00"}
                                                    </span>
                                                    <span className="text-lg font-medium text-orange-500 ml-1 uppercase">
                                                        Bs.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6 flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Origen</p>
                                                    <p className="text-sm font-medium text-foreground">{shipment.origin_office?.name || 'Agencia'}</p>
                                                </div>
                                            </div>

                                            <div className="ml-4 border-l-2 border-dashed border-border h-4" />

                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Destino</p>
                                                    <p className="text-sm font-medium text-foreground">{shipment.destination_office?.name || 'Destino'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {shipment.current_status === 'quote' ? (
                                            <Button disabled variant="ghost" className="w-full justify-between transition-colors opacity-50 cursor-not-allowed">
                                                <span>Ver ubicación</span>
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        ) : (
                                            <Button asChild variant="ghost" className="w-full justify-between hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                <Link to={`/tracking?code=${shipment.tracking_code}`}>
                                                    Ver ubicación
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
