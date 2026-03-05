import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, Monitor, LogOut, User, UserCheck, Settings, ChevronDown, LayoutDashboard, Package, Users, Truck, Building2, FileBarChart, MapPin } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSettingsStore } from '@/stores/settingsStore';
import defaultLogo from '@/assets/kolmox-logo.png';

type Theme = "light" | "dark" | "system";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { general } = useSettingsStore();
  const [theme, setTheme] = useState<Theme>("dark");
  const [notificationCount] = useState(3);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const themeIcon = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    system: <Monitor size={18} />,
  };

  return (
    <header className={cn("sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50", className)}>
      <div className="flex items-center justify-between lg:justify-end px-2 py-3 max-w-screen-xl mx-auto">
        {/* App Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer lg:hidden"
          onClick={() => navigate("/driver")}
        >
          <img
            src={general.logo ?? defaultLogo}
            alt={general.siteName ?? "Logo"}
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="font-display font-bold text-lg">{general.siteName ?? "KOLMOX"}</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {/* Theme Toggle (single click) */}
          <button
            onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
            className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                {user ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg border-2 border-primary object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover/90 backdrop-blur-xl border-primary/20 rounded-2xl shadow-xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
              {user && (
                <>
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="font-bold text-sm text-foreground">{user.name}</p>
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-primary">{user.role}</p>
                  </div>
                  <div className="p-1">
                    {user.role === 'admin' && (
                      <div className="lg:hidden space-y-1">
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <LayoutDashboard size={16} className="mr-2" />
                          <span className="font-medium">Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/shipments')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Package size={16} className="mr-2" />
                          <span className="font-medium">Encomiendas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/users')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Users size={16} className="mr-2" />
                          <span className="font-medium">Usuarios</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/clients')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <UserCheck size={16} className="mr-2" />
                          <span className="font-medium">Clientes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/businesses')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Building2 size={16} className="mr-2" />
                          <span className="font-medium">Empresas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/drivers')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Truck size={16} className="mr-2" />
                          <span className="font-medium">Conductores</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/offices')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Building2 size={16} className="mr-2" />
                          <span className="font-medium">Oficinas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/cities')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <MapPin size={16} className="mr-2" />
                          <span className="font-medium">Ciudades y Rutas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/reports')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <FileBarChart size={16} className="mr-2" />
                          <span className="font-medium">Reportes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                          <Settings size={16} className="mr-2" />
                          <span className="font-medium">Configuración</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="p-1 space-y-1">
                <DropdownMenuItem onClick={() => navigate("/user/profile")} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                  <User size={16} className="mr-2" />
                  <span className="font-medium">Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wallet")} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                  <Settings size={16} className="mr-2" />
                  <span className="font-medium">Ajustes Generales</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-bold">
                  <LogOut size={16} className="mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
