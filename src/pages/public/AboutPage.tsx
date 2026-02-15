import { Building2, Users, Target, Rocket } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
    return (
        <div className="container py-12 space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                    Sobre KOLMOX
                </h1>
                <p className="text-xl text-muted-foreground">
                    Revolucionando la logística en Bolivia con tecnología y pasión.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-4" glow>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Nuestra Misión</h2>
                    <p className="text-muted-foreground">
                        Proporcionar soluciones logísticas integrales que conecten a personas y empresas de manera rápida, segura y confiable, impulsando el crecimiento de nuestros clientes y el desarrollo de la región.
                    </p>
                </GlassCard>

                <GlassCard className="p-8 space-y-4" glow>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Nuestra Visión</h2>
                    <p className="text-muted-foreground">
                        Ser la empresa líder en logística y transporte en Bolivia, reconocida por nuestra innovación tecnológica, excelencia operativa y compromiso con la satisfacción del cliente.
                    </p>
                </GlassCard>
            </section>

            {/* Values */}
            <section>
                <h2 className="text-3xl font-display font-bold text-center mb-12">Nuestros Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4 p-6 rounded-2xl bg-muted/30">
                        <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center shadow-sm">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Trabajo en Equipo</h3>
                        <p className="text-muted-foreground">
                            Colaboramos estrechamente para lograr objetivos comunes y superar expectativas.
                        </p>
                    </div>
                    <div className="text-center space-y-4 p-6 rounded-2xl bg-muted/30">
                        <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center shadow-sm">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Integridad</h3>
                        <p className="text-muted-foreground">
                            Actuamos con honestidad y transparencia en todas nuestras operaciones y relaciones.
                        </p>
                    </div>
                    <div className="text-center space-y-4 p-6 rounded-2xl bg-muted/30">
                        <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center shadow-sm">
                            <Rocket className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Innovación</h3>
                        <p className="text-muted-foreground">
                            Buscamos constantemente nuevas formas de mejorar y optimizar nuestros servicios.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
