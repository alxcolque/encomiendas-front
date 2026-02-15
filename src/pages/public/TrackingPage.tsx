import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { useShipmentStore, ShipmentStatus } from "@/stores/shipmentStore";
import { Package, Search, MapPin, Calendar, User, Building, Truck, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusIcons: Record<ShipmentStatus, typeof Package> = {
  created: Package,
  in_transit: Truck,
  at_office: Building,
  out_for_delivery: Truck,
  delivered: CheckCircle,
};

const statusLabels: Record<ShipmentStatus, string> = {
  created: "Paquete Recibido",
  in_transit: "En Tránsito",
  at_office: "En Oficina",
  out_for_delivery: "En Reparto",
  delivered: "Entregado",
};

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const { currentShipment, trackShipment } = useShipmentStore();

  const handleSearch = () => {
    trackShipment(code);
    setSearched(true);
  };

  const allStatuses: ShipmentStatus[] = ["created", "in_transit", "at_office", "out_for_delivery", "delivered"];
  
  const getStatusIndex = (status: ShipmentStatus) => allStatuses.indexOf(status);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Package size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold">Rastrear Envío</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ingresa tu código de seguimiento
          </p>
        </div>

        {/* Search */}
        <GlassCard className="space-y-4">
          <div className="relative">
            <Input
              placeholder="ENV-2025-001"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-14 text-lg bg-muted/50 border-border rounded-xl pr-12 font-mono"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          </div>
          <Button onClick={handleSearch} variant="hero" size="lg" className="w-full">
            Buscar
          </Button>
        </GlassCard>

        {/* Demo codes */}
        <p className="text-center text-xs text-muted-foreground">
          Prueba: <span className="text-primary font-mono">ENV-2025-001</span> o{" "}
          <span className="text-primary font-mono">ENV-2025-002</span>
        </p>

        {/* Results */}
        {searched && !currentShipment && (
          <GlassCard className="text-center py-8">
            <Package size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Envío no encontrado</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Verifica el código e intenta nuevamente
            </p>
          </GlassCard>
        )}

        {currentShipment && (
          <>
            {/* Shipment Info */}
            <GlassCard glow className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="font-mono font-bold text-lg">{currentShipment.trackingCode}</p>
                </div>
                <div className={`status-chip ${
                  currentShipment.currentStatus === 'delivered' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-primary/20 text-primary'
                }`}>
                  {statusLabels[currentShipment.currentStatus]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Remitente</p>
                    <p className="text-sm font-medium">{currentShipment.senderName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Destinatario</p>
                    <p className="text-sm font-medium">{currentShipment.receiverName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  <span>{currentShipment.origin}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-success" />
                  <span>{currentShipment.destination}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                <Calendar size={16} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Entrega estimada</p>
                  <p className="font-medium">
                    {format(currentShipment.estimatedDelivery, "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Timeline */}
            <GlassCard>
              <h3 className="font-display font-bold mb-4">Historial de Eventos</h3>
              <StatusTimeline
                items={allStatuses.map((status, index) => {
                  const currentIndex = getStatusIndex(currentShipment.currentStatus);
                  const event = currentShipment.events.find(e => e.status === status);
                  
                  return {
                    label: statusLabels[status],
                    icon: statusIcons[status],
                    completed: index <= currentIndex,
                    active: index === currentIndex,
                    timestamp: event 
                      ? format(event.timestamp, "d MMM, HH:mm", { locale: es })
                      : undefined,
                  };
                })}
              />
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
