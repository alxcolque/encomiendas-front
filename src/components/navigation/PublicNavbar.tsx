import { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Package, LogOut, LayoutDashboard, Home, Truck, MapPin, Search, HelpCircle, Phone, Sun, Moon, Monitor } from "lucide-react";
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
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
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

    // Theme handling
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    const applyTheme = (newTheme: "light" | "dark" | "system") => {
        const root = document.documentElement;
        if (newTheme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", systemDark);
        } else {
            root.classList.toggle("dark", newTheme === "dark");
        }
    };

    const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    };

    const themeIcon = {
        light: <Sun size={18} />,
        dark: <Moon size={18} />,
        system: <Monitor size={18} />
    };

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
        { name: "Agencias", href: "/offices", icon: MapPin },
        { name: "Seguimiento", href: "/tracking", icon: Search },
        { name: "FAQ", href: "/faq", icon: HelpCircle },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background shadow-sm border-b border-border/50",
                scrolled && "shadow-md bg-background/95 backdrop-blur-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
                {/* FIRST ROW: Logo and Auth (Mobile/Tablet/Desktop) */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <a href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                            <img
                                src={'logo.png'}
                                alt={general.siteName || "KOLMOX"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-primary', 'flex', 'items-center', 'justify-center');
                                }}
                            />
                            {/* <Package className="w-6 h-6 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block" /> */}
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-foreground">
                            {general.siteName || "KOLMOX"}
                        </span>
                    </a>

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
                        {/* Theme Toggle (single click) */}
                        <button
                            onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
                            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle theme"
                        >
                            {themeIcon[theme]}
                        </button>
                        {authStatus === 'auth' && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full flex items-center justify-center p-0">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                            <AvatarFallback className="bg-secondary">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 bg-popover/90 backdrop-blur-xl border-primary/20 rounded-2xl shadow-xl p-1 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2" align="end" forceMount>
                                    <div className="px-4 py-3 border-b border-border/50 mb-1">
                                        <p className="font-bold text-sm text-foreground">{user.name}</p>
                                        <p className="text-[10px] uppercase tracking-wider font-extrabold text-primary">
                                            {user.role}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to={getDashboardLink()}
                                                className="flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:bg-primary/10 focus:text-primary cursor-pointer"
                                            >
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Ir al Panel
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>

                                            <Link
                                                to={user.role === 'client' ? '/me' : '/user/profile'}
                                                className="flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:bg-primary/10 focus:text-primary cursor-pointer"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Mi Perfil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border/50" />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="flex items-center rounded-xl px-3 py-2 text-sm font-bold text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Cerrar Sesión
                                        </DropdownMenuItem>
                                    </div>
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
                <div className="md:hidden border-t border-border/50 -mx-4">
                    <div
                        className="flex overflow-x-auto no-scrollbar items-center justify-center py-2 px-4 gap-3 scroll-smooth"
                    >
                        {navLinks.map((link, index) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.href;

                            return (
                                <Fragment key={link.name}>
                                    <Link
                                        to={link.href}
                                        className={cn(
                                            "flex flex-col items-center min-w-fit gap-0.5 group transition-all px-2 pb-1 border-b-[3px] rounded-t-sm",
                                            isActive ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:border-border/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-1 rounded-lg transition-colors",
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
