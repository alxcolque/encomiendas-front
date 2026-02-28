import { Truck, ShieldCheck, Zap } from "lucide-react";

export default function BusinessSection() {
    return (
        <section className="w-full px-4 py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Section */}
                    <div className="flex-1 space-y-8 order-2 lg:order-1">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-primary leading-tight tracking-tight">
                                Soluciones de Logística <br className="hidden md:block" />
                                <span className="text-foreground">Pensadas para tu Negocio</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                                Conectamos tus productos con tus clientes de la manera más eficiente,
                                segura y rápida en todo el territorio nacional.
                            </p>
                        </div>

                        {/* Feature mini-grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Truck, title: "Envío Prioritario", desc: "Entregas en tiempo récord" },
                                { icon: ShieldCheck, title: "Máxima Seguridad", desc: "Monitoreo constante 24/7" },
                                { icon: Zap, title: "Tecnología Avanzada", desc: "Rastreo en tiempo real" },
                                { icon: ShieldCheck, title: "Soporte Premium", desc: "Atención personalizada" },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-background shadow-sm border border-border/50">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{feature.title}</h4>
                                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-1 order-1 lg:order-2">
                        <div className="relative">
                            <div className="aspect-square md:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                                    alt="Logística Kolmox"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative badge */}
                            <div className="absolute -top-6 -right-6 lg:-right-12 bg-primary text-white p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                                <Zap className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
