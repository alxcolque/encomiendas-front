import { MapPin, Phone, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { IOffice } from "@/interfaces/public.interface";
import { PublicService } from "@/services/public.service";
import { toast } from "sonner";

export default function OfficesPage() {
    const [offices, setOffices] = useState<IOffice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const data = await PublicService.getOffices();
                setOffices(data);
            } catch (error) {
                toast.error("Error al cargar oficinas");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-display font-bold">Nuestras Oficinas</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Encuentra la sucursal más cercana a ti. Estamos presentes en las principales video del país.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {offices.map((office) => (
                        <div key={office.id} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={office.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}
                                    alt={`Oficina ${office.city}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 space-y-4">
                                <h2 className="text-2xl font-bold">{office.name}</h2>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span>{office.address}, {office.city}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-5 h-5 text-primary shrink-0" />
                                        <span>{office.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span>{office.hours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
