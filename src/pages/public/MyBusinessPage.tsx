import { useState, useEffect, useRef } from "react";
import { PublicService } from "@/services/public.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Phone, Building2, Search, CheckCircle2, AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Business Interface based on the database fields mentioned
interface BusinessData {
    company_name: string;
    phone: string;
    description: string;
    location: string; // Likely coordinates like "-16.5, -68.1"
    status: string;
}

export default function MyBusinessPage() {
    const [searchCode, setSearchCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [showInfo, setShowInfo] = useState(true);
    
    // Map reference and instance
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerInstance = useRef<L.Marker | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCode(e.target.value.toUpperCase());
    };

    const handleVerify = async () => {
        if (!searchCode.trim()) {
            toast.error("Por favor ingresa un código de verificación");
            return;
        }

        setIsLoading(true);
        try {
            const data = await PublicService.verifyBusinessByCode(searchCode);
            
            if (data && data.status === "activo") {
                setBusiness(data);
                setShowInfo(false);
                toast.success("Negocio verificado correctamente");
            } else if (data && data.status !== "activo") {
                toast.error("El negocio no se encuentra activo");
            } else {
                toast.error("No existe la empresa o el negocio");
            }
        } catch (error: any) {
            toast.error("No se encontró el negocio o hubo un error en la consulta");
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize/Update Map
    useEffect(() => {
        if (business && !showInfo && mapRef.current) {
            // Parse location (expecting "lat, lng")
            let coords: [number, number] = [-16.5000, -68.1193]; // Default La Paz
            if (business.location && business.location.includes(",")) {
                const parts = business.location.split(",");
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    coords = [lat, lng];
                }
            }

            if (!mapInstance.current) {
                // Initialize map
                mapInstance.current = L.map(mapRef.current).setView(coords, 15);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance.current);

                // Add custom marker
                const customIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                });

                markerInstance.current = L.marker(coords, { icon: customIcon }).addTo(mapInstance.current);
            } else {
                // Update map
                mapInstance.current.setView(coords, 15);
                if (markerInstance.current) {
                    markerInstance.current.setLatLng(coords);
                }
            }
            
            // Invalidate size to ensure it renders correctly after being hidden
            setTimeout(() => {
                mapInstance.current?.invalidateSize();
            }, 100);
        }
    }, [business, showInfo]);

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Title */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight">
                        KOLMOX MI NEGOCIO
                    </h1>
                    <div className="h-1.5 w-32 bg-primary mx-auto rounded-full" />
                </div>

                {/* Content / Info Section */}
                {showInfo && (
                    <div className="glass-card p-8 md:p-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-lg md:text-xl font-bold text-foreground text-center">
                            Verificamos empresas, negocios y emprendedores e-commerce para que tus compras sean 100% seguras.
                        </p>
                        
                        <div className="space-y-4 text-muted-foreground leading-relaxed md:text-lg">
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">✅</span>
                                <p>Todos los números de contacto de los negocios son oficiales. Si recibes otro número distinto, podría ser falso o intento de estafa.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">🔑</span>
                                <p>Cada negocio verificado recibe un código de confirmación, para que compruebes que hablas con un negocio real.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">📍</span>
                                <p>Comprobamos la ubicación del negocio y, si solo venden un producto, pueden dejarlo directamente en nuestra agencia.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">🛒</span>
                                <p>Si quieres comprar algún producto, pide que el negocio se registre en KOLMOX MI NEGOCIO, así podrás confirmar que es confiable y protegido.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">🌎</span>
                                <p>Ahora podrás realizar tus compras a nivel nacional.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className="text-2xl mt-1">📦</span>
                                <p>Si es con KOLMOX, tus envíos son seguros.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Business Details Section */}
                {business && !showInfo && (
                    <div className="glass-card overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>NEGOCIO VERIFICADO</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground uppercase">{business.company_name}</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Número Oficial</p>
                                        <p className="text-xl font-bold text-foreground">{business.phone}</p>
                                    </div>
                                    <div className="p-3 bg-primary/10 text-primary rounded-full">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                                            <Building2 className="h-4 w-4" />
                                            <span>Descripción</span>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed italic">
                                            "{business.description || "Sin descripción disponible."}"
                                        </p>
                                    </div>

                                    <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <div className="flex gap-3 text-sm">
                                            <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                                            <p className="text-muted-foreground">
                                                Para tu seguridad, solo realiza transacciones si los datos coinciden con el negocio verificado.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowInfo(true)}
                                        className="w-full sm:w-auto"
                                    >
                                        Volver a información
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                                        <MapPin className="h-4 w-4" />
                                        <span>Ubicación Verified</span>
                                    </div>
                                    <div 
                                        ref={mapRef} 
                                        className="h-[250px] w-full rounded-2xl border-4 border-background shadow-xl overflow-hidden z-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verification Widget */}
                <div className="max-w-md mx-auto space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-foreground">Verifica tu negocio</h3>
                        <p className="text-sm text-muted-foreground">Ingresa el código oficial de verificación</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={searchCode}
                                onChange={handleInputChange}
                                placeholder="KOLMOX-EN-VER-001"
                                className="pl-10 h-12 text-lg font-mono border-primary/20 focus:border-primary transition-colors uppercase"
                            />
                        </div>
                        <Button 
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="h-12 px-8 font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all uppercase"
                        >
                            {isLoading ? <div className={`loading-logo ${"h-5 w-5 mr-2 animate-pulse"}`}></div> : "Verificar"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
