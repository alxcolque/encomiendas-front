import { Package, Clock, ThumbsUp, Truck } from "lucide-react";

const stats = [
  { icon: Package, value: "+1M", label: "Paquetes" },
  { icon: Clock, value: "99%", label: "Eficiencia" },
  { icon: ThumbsUp, value: "98%", label: "Confianza" },
  { icon: Truck, value: "50+", label: "Ciudades" },
];

const partners = [
  "DHL", "FedEx", "UPS", "MercadoLibre", "Amazon"
];

export default function TrustBar() {
  return (
    <div className="bg-background border-y border-border py-12 md:py-20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">Números que Avalan</h3>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">Resultados que Generan Confianza</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="group p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-background hover:shadow-xl transition-all duration-500 text-center">
              <div className="flex justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                <div className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partners Scroll/Grid */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Nuestros Aliados Estratégicos</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-xl md:text-3xl font-black text-muted-foreground/30 hover:text-primary/40 transition-colors duration-300 select-none"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
