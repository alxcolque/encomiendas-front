import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, Package, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kolmoxLogo from "@/assets/kolmox-logo.png";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PublicNavbar() {
    const { general } = useSettingsStore();
    const { user, logout, authStatus } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        switch (user.role) {
            case 'admin': return '/admin';
            case 'driver': return '/driver';
            case 'worker': return '/worker';
            // case 'client': return '/user'; // Future
            default: return '/tracking';
        }
    };

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
                            {authStatus === 'auth' && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email || user.phone}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to={getDashboardLink()} className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Ir al Panel</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link to="/login">
                                    <Button variant="default" className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex md:hidden items-center gap-3">
                            {authStatus === 'auth' && user ? (
                                <Link to={getDashboardLink()} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                    <User className="w-6 h-6" />
                                </Link>
                            ) : (
                                <Link to="/login" className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
                                    <User className="w-6 h-6" />
                                </Link>
                            )}

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
                        {authStatus === 'auth' && user ? (
                            <div className="space-y-2">
                                <div className="px-4 py-2 flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.role}</p>
                                    </div>
                                </div>
                                <Link to={getDashboardLink()}>
                                    <Button className="w-full text-lg h-12" variant="outline">
                                        <LayoutDashboard className="mr-2 h-5 w-5" />
                                        Ir al Panel
                                    </Button>
                                </Link>
                                <Button onClick={handleLogout} className="w-full text-lg h-12" variant="destructive">
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Cerrar Sesión
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login" className="block">
                                <Button className="w-full text-lg h-12">Iniciar Sesión</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
