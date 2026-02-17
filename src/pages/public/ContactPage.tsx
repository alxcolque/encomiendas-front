import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";

export default function ContactPage() {
    const { general } = useSettingsStore();

    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* Info Column */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-display font-bold">Contáctanos</h1>
                        <p className="text-muted-foreground text-lg">
                            Estamos aquí para ayudarte. Envíanos tus dudas, sugerencias o cotizaciones y te responderemos a la brevedad.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                                <Phone />
                            </div>
                            <div>
                                <p className="font-semibold">Llámanos</p>
                                <p className="text-muted-foreground">{general.supportPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                                <Mail />
                            </div>
                            <div>
                                <p className="font-semibold">Escríbenos</p>
                                <p className="text-muted-foreground">{general.supportEmail}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                                <MapPin />
                            </div>
                            <div>
                                <p className="font-semibold">Visítanos</p>
                                <p className="text-muted-foreground">{general.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input placeholder="Tu nombre" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apellido</label>
                                <Input placeholder="Tu apellido" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="tucorreo@ejemplo.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Asunto</label>
                            <Input placeholder="Consulta general" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mensaje</label>
                            <Textarea
                                placeholder="¿En qué podemos ayudarte?"
                                className="min-h-[150px]"
                            />
                        </div>

                        <Button className="w-full" size="lg">
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensaje
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );
}
