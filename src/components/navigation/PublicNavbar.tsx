import { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Package, LogOut, LayoutDashboard, Home, Truck, MapPin, Search, HelpCircle, Phone, Plus } from "lucide-react";
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
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";

export default function PublicNavbar() {
    const { general } = useSettingsStore();
    const { user, logout, authStatus } = useAuthStore();
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
        { name: "Inicio", href: "/", icon: Home },
        { name: "Servicios", href: "/services", icon: Truck },
        { name: "Oficinas", href: "/offices", icon: MapPin },
        { name: "Seguimiento", href: "/tracking", icon: Search },
        { name: "FAQ", href: "/faq", icon: HelpCircle },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm border-b border-gray-100",
                scrolled && "shadow-md bg-white/95 backdrop-blur-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* FIRST ROW: Logo and Auth (Mobile/Tablet/Desktop) */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
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

                    {/* Desktop Navigation (Hidden on Mobile/Tablet) */}
                    <div className="hidden md:flex items-center gap-1 mx-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5",
                                    location.pathname === link.href
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center">
                        {authStatus === 'auth' && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full flex items-center justify-center p-0">
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
                                <Button
                                    variant="default"
                                    className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-9 md:h-10 px-4 md:px-6"
                                >
                                    Ingresar
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* SECOND ROW: Mobile/Tablet Horizontal Menu (Hidden on Desktop) */}
                <div className="md:hidden border-t border-gray-50 -mx-4">
                    <div
                        className="flex overflow-x-auto no-scrollbar items-center py-2 px-4 gap-6 scroll-smooth"
                    >
                        {navLinks.map((link, index) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.href;

                            return (
                                <Fragment key={link.name}>
                                    {/* Insert Registration Button in the middle (after 2nd item) */}
                                    {index === 2 && (
                                        <NewShipmentModal
                                            trigger={
                                                <button
                                                    type="button"
                                                    className="flex flex-col items-center min-w-fit gap-1 group transition-all px-2 active:scale-95"
                                                >
                                                    <div className="p-2.5 rounded-full bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10">
                                                        <Plus className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-primary whitespace-nowrap">
                                                        Registrar
                                                    </span>
                                                </button>
                                            }
                                        />
                                    )}

                                    <Link
                                        to={link.href}
                                        className={cn(
                                            "flex flex-col items-center min-w-fit gap-1 group transition-colors px-1",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-1.5 rounded-lg transition-colors",
                                            isActive ? "bg-primary/10" : "group-hover:bg-muted"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-medium whitespace-nowrap">
                                            {link.name}
                                        </span>
                                    </Link>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
