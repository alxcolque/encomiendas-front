import { Link } from "react-router-dom";
import { Clock, Building2, CreditCard, Handshake, ShoppingCart } from "lucide-react";

export default function ServicesGrid() {
    const services = [
        {
            name: "Estados",
            icon: <Clock className="w-7 h-7 md:w-8 md:h-8" />,
            href: "/tracking",
        },
        {
            name: "Agencias",
            icon: <Building2 className="w-7 h-7 md:w-8 md:h-8" />,
            href: "/offices",
        },
        {
            name: "Paga Aquí",
            icon: <CreditCard className="w-7 h-7 md:w-8 md:h-8" />,
            href: "/pay",
        },
        {
            name: "Mi Negocio",
            icon: <Handshake className="w-7 h-7 md:w-8 md:h-8" />,
            href: "/business",
        },
        {
            name: "Mi Tienda",
            icon: <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />,
            href: "/store",
        }
    ];

    return (
        <div className="w-full py-8 lg:py-16 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 md:gap-x-16">
                    {services.map((service) => (
                        <Link
                            key={service.name}
                            to={service.href}
                            className="flex flex-col items-center gap-3 group w-[28%] md:w-auto"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] border-primary flex items-center justify-center text-primary bg-white transition-all duration-300 group-hover:bg-primary group-hover:text-white shadow-sm">
                                    {service.icon}
                                </div>
                            </div>
                            <span className="text-[11px] md:text-sm font-bold text-primary text-center px-1">
                                {service.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
