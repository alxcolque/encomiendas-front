import { MapPin, Phone, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { IOffice } from "@/interfaces/public.interface";
import { PublicService } from "@/services/public.service";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function OfficesPage() {
    const [offices, setOffices] = useState<IOffice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const data = await PublicService.getOffices();
                setOffices(data);
            } catch (error) {
                toast.error("Error al cargar agencias");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    // Centro de Bolivia (aproximado)
    const defaultCenter: [number, number] = [-16.2902, -63.5887];

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || loading) return;

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: 5,
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Clear existing markers (if any other than tile layer)
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for offices
        offices.forEach((office) => {
            if (office.coordinates) {
                const parts = office.coordinates.split(',');
                if (parts.length === 2) {
                    const lat = parseFloat(parts[0].trim());
                    const lng = parseFloat(parts[1].trim());
                    if (!isNaN(lat) && !isNaN(lng)) {
                        const popupContent = `
                            <div style="font-family: inherit; min-width: 150px;">
                                <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${office.name}</div>
                                <div style="font-size: 12px; color: #4b5563;">${office.address}</div>
                                <div style="font-size: 12px; font-weight: 500; margin-top: 4px;">${office.city.name}</div>
                            </div>
                        `;
                        L.marker([lat, lng]).bindPopup(popupContent).addTo(map);
                    }
                }
            }
        });

        // Cleanup on unmount (important for strict mode doubly-calls)
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [offices, loading]);

    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-display font-bold">Nuestras Agencias</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Encuentra la sucursal más cercana a ti. Estamos presentes en las principales ciudades del país.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Mapa de Agencias */}
                    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border shadow-lg relative z-0">
                        <div ref={mapContainerRef} className="w-full h-full" />
                    </div>

                    {/* Tarjetas de Agencias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {offices.map((office) => (
                            <div key={office.id} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={office.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}
                                        alt={`Agencia ${office.city.name}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 space-y-4">
                                    <h2 className="text-2xl font-bold">{office.name}</h2>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span>{office.address}, {office.city.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Phone className="w-5 h-5 text-primary shrink-0" />
                                            <span>{office.phone || "No especificado"}</span>
                                        </div>
                                        {/* <div className="flex items-start gap-3 text-muted-foreground">
                                            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span>{office.hours || "No especificado"}</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
