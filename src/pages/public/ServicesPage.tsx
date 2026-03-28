import { Truck, Package, Clock, ShieldCheck, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
    {
        icon: Truck,
        title: "Envíos Nacionales",
        description: "Transporte de carga y paquetería a nivel nacional con cobertura en las principales ciudades de Bolivia.",
        features: ["Salidas diarias", "Rastreo en tiempo real", "Seguro de carga incluido"]
    },
    {
        icon: Zap,
        title: "Servicio Express",
        description: "Entregas urgentes garantizadas en 24 horas para tus envíos más importantes.",
        features: ["Prioridad de embarque", "Entrega puerta a puerta", "Confirmación inmediata"]
    },
    {
        icon: Globe,
        title: "Carga Corporativa",
        description: "Soluciones logísticas a medida para empresas, con gestión de flotas y tarifas preferenciales.",
        features: ["Cuenta empresarial", "Facturación mensual", "Gestor de cuenta dedicado"]
    },
    {
        icon: ShieldCheck,
        title: "Carga Valorada",
        description: "Transporte especializado de mercancías de alto valor con protocolos de seguridad reforzados.",
        features: ["Custodia satelital", "Vehículos blindados", "Seguro al 100%"]
    },
    {
        icon: Package,
        title: "Ecommerce Fulfillment",
        description: "Almacenaje, empaquetado y distribución para tiendas online.",
        features: ["Integración API", "Control de stock", "Logística inversa"]
    },
    {
        icon: Clock,
        title: "Almacenaje Temporal",
        description: "Servicio de bodegaje para mercancías en tránsito o espera de distribución.",
        features: ["Seguridad 24/7", "Control de inventario", "Ubicación estratégica"]
    }
];

export default function ServicesPage() {
    return (
        <div className="space-y-20 pb-20">
            {/* Header */}
            <section className="bg-primary/5 py-20">
                <div className="container text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
                        Nuestros Servicios
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Soluciones logísticas diseñadas para adaptarse a tus necesidades personales y empresariales.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                            <p className="text-muted-foreground mb-6">
                                {service.description}
                            </p>
                            <ul className="space-y-2 mb-8">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="outline" className="w-full">Más información</Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container">
                <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground space-y-6">
                    <h2 className="text-3xl font-display font-bold">¿Necesitas una solución personalizada?</h2>
                    <p className="text-primary-foreground/80 max-w-xl mx-auto">
                        Contáctanos hoy mismo y uno de nuestros asesores te ayudará a encontrar la mejor opción logística para tu negocio.
                    </p>
                    {/* WhatsApp Button with link to WhatsApp */}
                    <a href="https://wa.me/59167239563" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="lg" className="font-semibold text-primary">
                            Contactar Asesor
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
