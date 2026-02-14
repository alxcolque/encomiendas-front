import { Package, Clock, ThumbsUp, Truck } from "lucide-react";

const stats = [
  { icon: Package, value: "+1M", label: "Paquetes Entregados" },
  { icon: Clock, value: "99%", label: "Entregas a Tiempo" },
  { icon: ThumbsUp, value: "98%", label: "Clientes Satisfechos" },
  { icon: Truck, value: "50+", label: "Ciudades Cubiertas" },
];

const partners = [
  "DHL", "FedEx", "UPS", "MercadoLibre", "Amazon"
];

export default function TrustBar() {
  return (
    <div className="bg-muted/50 border-y border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="text-lg md:text-xl font-bold text-muted-foreground grayscale"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
