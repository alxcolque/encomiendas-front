import { useEffect, useState, useRef } from "react";
import { Package, Globe, Users } from "lucide-react";
import aboutFleet from "/kolmox.jpeg";
import { useSettingsStore } from "@/stores/settingsStore";

const counters = [
  { icon: Package, target: 1000000, suffix: "+", label: "Paquetes Entregados" },
  { icon: Globe, target: 50, suffix: "+", label: "Ciudades Cubiertas" },
  { icon: Users, target: 50000, suffix: "+", label: "Clientes Felices" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-primary">
      {formatNumber(count)}{suffix}
    </div>
  );
}

export default function AboutSection() {
  const { general } = useSettingsStore();
  return (
    <section id="nosotros" className="py-10 md:py-16 bg-background overflow-hidden border-t border-border/50">
      <div className="max-w-screen-xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 group">
              <img
                src={aboutFleet}
                alt={`Flota logística ${general.siteName || 'KOLMOX'}`}
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0" />

            {/* Experience badge */}
            <div className="absolute -bottom-4 md:-bottom-8 -right-2 md:-right-8 bg-primary text-primary-foreground p-5 md:p-8 rounded-[2rem] shadow-2xl z-20 transform hover:scale-110 transition-transform cursor-default">
              <div className="text-3xl md:text-5xl font-extrabold leading-none">10+</div>
              <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 opacity-90">Años de<br />Experiencia</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 md:space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Sobre Nosotros
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                ¿Quiénes Somos?
              </h2>
              <div className="text-muted-foreground text-base md:text-xl leading-relaxed space-y-4">
                {general.siteDescription ? (
                  <p>{general.siteDescription}</p>
                ) : (
                  <>
                    <p>
                      En <span className="text-primary font-bold">{general.siteName || 'KOLMOX'}</span>, somos más que una empresa de logística.
                      Somos tu socio estratégico en el mundo de las entregas.
                    </p>
                    <p className="text-sm md:text-lg opacity-80">
                      Con más de una década de experiencia, hemos revolucionado la forma en que Bolivia envía y recibe paquetes.
                      Nuestra flota moderna y tecnología de punta garantizan entregas seguras y rápidas.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 pt-4">
              {counters.map((counter, index) => (
                <div key={index} className="flex flex-col items-center p-3 md:p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <counter.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <AnimatedCounter target={counter.target} suffix={counter.suffix} />
                  <div className="text-[9px] md:text-xs font-semibold text-muted-foreground uppercase tracking-tight mt-1 text-center">
                    {counter.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
