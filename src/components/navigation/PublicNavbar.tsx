import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kolmoxLogo from "@/assets/kolmox-logo.png";
import { useSettingsStore } from "@/stores/settingsStore";

export default function PublicNavbar() {
    const { general } = useSettingsStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Servicios", href: "/services" },
        { name: "Oficinas", href: "/offices" },
        { name: "Seguimiento", href: "/tracking" },
        { name: "FAQ", href: "/faq" },
        { name: "Contacto", href: "/contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm border-b border-gray-100",
                scrolled && "shadow-md bg-white/95 backdrop-blur-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                            <img
                                src={kolmoxLogo}
                                alt={general.siteName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-primary', 'flex', 'items-center', 'justify-center');
                                }}
                            />
                            <Package className="w-6 h-6 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block" />
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-foreground">
                            {general.siteName}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5",
                                    location.pathname === link.href
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <Link to="/login">
                                <Button variant="default" className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex md:hidden items-center gap-3">
                            <Link to="/login" className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
                                <User className="w-6 h-6" />
                            </Link>
                            <button
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-8 h-8" />
                                ) : (
                                    <Menu className="w-8 h-8" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={cn(
                    "md:hidden fixed inset-x-0 top-[64px] bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ease-in-out overflow-hidden",
                    mobileMenuOpen ? "max-h-[500px] opacity-100 shadow-xl" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 py-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                location.pathname === link.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-border">
                        <Link to="/login" className="block">
                            <Button className="w-full text-lg h-12">Iniciar Sesión</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
