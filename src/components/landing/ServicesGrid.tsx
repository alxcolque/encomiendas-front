import { Link } from "react-router-dom";
import { Clock, Building2, CreditCard, Handshake, ShoppingCart, MapPin } from "lucide-react";

export default function ServicesGrid() {
    const services = [
        {
            name: "Estados",
            icon: <Clock className="w-8 h-8" />,
            href: "/tracking",
            color: "bg-orange-500", // Solid orange circle
        },
        {
            name: "Agencias",
            icon: <Building2 className="w-8 h-8" />,
            href: "/offices",
            color: "bg-white border-2 border-orange-500 text-orange-500", // Outlined style variation to match image if needed, but let's stick to solid for consistency or alternating. Image shows outlining for "Agencias" but solid for "Estados" is unclear. Let's make them all uniform first or follow the orange circle style.
            // Actually image shows:
            // Estados, Agencias, Paga Aqui, Mi Negocio, Mi Tienda
            // All look like orange thin icons inside a circle?
            // "Estados" -> Clock in circle
            // "Agencias" -> Building in circle
            // Let's use outlining circles with orange icons as seen in the "Table Mode" image, or the "Orange Mode" image has white icons on orange background.
            // The user attached 2 images.
            // 1. White background, orange icons.
            // 2. Orange background, white icons.
            // I'll stick to White Background (Image 1) for the main content area usually, but let's check the request.
            // "Rediseña el landing page como en el adjunto de modo tablet y modo telefono".
            // Image 1 (Mobile view?) has white BG, orange icons in circles.
            // Image 2 (Tablet view split?) shows One orange version and one white version.
            // I'll implement the "White BG, Orange Icons" style as it's cleaner for general use, but use Orange circles for emphasis if needed.
            // Let's go with: Orange Border, Transparent BG, Orange Icon.
            style: "border-2 border-primary text-primary"
        },
        {
            name: "Paga Aqui",
            icon: <CreditCard className="w-8 h-8" />,
            href: "/pay",
            style: "border-2 border-primary text-primary"
        },
        {
            name: "Mi Negocio",
            icon: <Handshake className="w-8 h-8" />,
            href: "/business",
            style: "border-2 border-primary text-primary"
        },
        {
            name: "Mi Tienda",
            icon: <ShoppingCart className="w-8 h-8" />,
            href: "/store",
            style: "border-2 border-primary text-primary"
        },
        { // Added for symmetry/grid balance if needed, or stick to 5.
            name: "Ubicación",
            icon: <MapPin className="w-8 h-8" />,
            href: "/location",
            style: "border-2 border-primary text-primary"
        }
    ];

    return (
        <div className="w-full px-4 py-8">
            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                {services.map((service) => (
                    <Link
                        key={service.name}
                        to={service.href}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white ${service.style}`}>
                            {service.icon}
                        </div>
                        <span className="text-sm font-medium text-stone-600 text-center leading-tight">
                            {service.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
