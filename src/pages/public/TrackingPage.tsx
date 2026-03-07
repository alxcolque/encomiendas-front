import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  delivered: CheckCircle,
};

const statusLabels: Record<ShipmentStatus, string> = {
  created: "Paquete Recibido",
  in_transit: "En Tránsito",
  at_office: "En Oficina",
  delivered: "Entregado",
};

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const { currentShipment, trackShipment, isLoading } = useShipmentStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let queryCode = params.get("CODE_TRACKING") || params.get("code");

    // Fallback para atrapar formatos como ?=CODE_TRACKING=KOL-... 
    if (!queryCode) {
      const match = window.location.search.match(/(KOL-[a-zA-Z0-9-]+)/i);
      if (match) {
        queryCode = match[1];
      }
    }

    if (queryCode) {
      const formattedCode = queryCode.toUpperCase();
      setCode(formattedCode);
      trackShipment(formattedCode);
      setSearched(true);
    }
  }, [trackShipment]);

  const handleSearch = () => {
    trackShipment(code);
    setSearched(true);
  };

  const allStatuses: ShipmentStatus[] = ["created", "in_transit", "at_office", "delivered"];

  const getStatusIndex = (status: ShipmentStatus) => allStatuses.indexOf(status);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-6">
            <Package size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Rastrear Envío</h1>
          <p className="text-muted-foreground text-base md:text-lg mt-2 max-w-md mx-auto">
            Ingresa tu código de seguimiento para conocer el estado de tu encomienda en tiempo real.
          </p>
        </div>

        {/* Search */}
        <Card className="max-w-xl mx-auto border-border/50 shadow-md rounded-2xl">
          <CardContent className="pt-8 space-y-6">
            <div className="relative">
              <Input
                placeholder="KOL-(Ciudad a)-(Ciudad b)-9999"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoFocus
                className="h-16 text-xl bg-muted/30 border-border rounded-xl pr-12 font-mono shadow-inner"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Buscando...
                </div>
              ) : (
                "Buscar Paquete"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && !currentShipment && (
          <Card className="max-w-xl mx-auto text-center py-12 border-border/50 shadow-md rounded-2xl">
            <CardContent className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-black text-2xl">Envío no encontrado</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                No pudimos encontrar un envío con ese código. Por favor verifica los caracteres e intenta nuevamente.
              </p>
            </CardContent>
          </Card>
        )}

        {currentShipment && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Shipment Info */}
            <Card className="border-border/50 shadow-md rounded-2xl overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Código de Seguimiento</p>
                  <p className="font-mono font-black text-2xl text-primary">{currentShipment.trackingCode}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm ${currentShipment.currentStatus === 'delivered'
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-primary text-primary-foreground shadow-primary/20'
                  }`}>
                  {statusLabels[currentShipment.currentStatus]}
                </div>
              </div>

              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Remitente</p>
                        <p className="font-bold">{currentShipment.senderName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Origen</p>
                        <p className="font-bold">{currentShipment.origin}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <User size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Destinatario</p>
                        <p className="font-bold">{currentShipment.receiverName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <MapPin size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Destino</p>
                        <p className="font-bold">{currentShipment.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                    <Calendar size={64} />
                  </div>
                  <div className="p-3 rounded-xl bg-white shadow-sm">
                    <Calendar size={24} className="text-primary" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Entrega estimada</p>
                    <p className="text-xl font-black text-primary capitalize">
                      {format(currentShipment.estimatedDelivery, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-border/50 shadow-md rounded-2xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                  <Clock size={20} className="text-primary" />
                  Historial de Eventos
                </h3>
                <div className="pl-4">
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
