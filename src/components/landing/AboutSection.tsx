import { useEffect, useState, useRef } from "react";
import { Package, Globe, Users } from "lucide-react";
import aboutFleet from "@/assets/about-fleet.jpg";

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
  return (
    <section id="nosotros" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutFleet}
                alt="Flota logística KOLMOX"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl hidden md:block">
              <div className="text-4xl font-bold">10+</div>
              <div className="text-sm">Años de Experiencia</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Quiénes Somos?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                En <span className="text-primary font-semibold">KOLMOX</span>, somos más que una empresa de logística. 
                Somos tu socio estratégico en el mundo de las entregas. Con más de una década de experiencia, 
                hemos revolucionado la forma en que Bolivia envía y recibe paquetes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nuestra flota moderna, tecnología de punta y un equipo comprometido nos permiten 
                garantizar entregas seguras, rápidas y con rastreo en tiempo real. Desde documentos 
                hasta mercancías, conectamos personas y negocios en todo el país.
              </p>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-6">
              {counters.map((counter, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <counter.icon className="w-6 h-6 text-primary" />
                  </div>
                  <AnimatedCounter target={counter.target} suffix={counter.suffix} />
                  <div className="text-xs text-muted-foreground mt-1">
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
