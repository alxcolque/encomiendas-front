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
import kolmoxLogo from "@/assets/kolmox-logo.png";

type Theme = "light" | "dark" | "system";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
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
    <header className={cn("sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border", className)}>
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* App Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/driver")}
        >
          <img
            src={kolmoxLogo}
            alt="KOLMOX Logo"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="font-display font-bold text-lg">KOLMOX</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                {themeIcon[theme]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem
                onClick={() => handleThemeChange("light")}
                className={cn(theme === "light" && "bg-accent text-accent-foreground")}
              >
                <Sun size={16} className="mr-2" />
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("dark")}
                className={cn(theme === "dark" && "bg-accent text-accent-foreground")}
              >
                <Moon size={16} className="mr-2" />
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("system")}
                className={cn(theme === "system" && "bg-accent text-accent-foreground")}
              >
                <Monitor size={16} className="mr-2" />
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              {user && (
                <>
                  <div className="px-3 py-2">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* ADMIN MOBILE MENU (Visible only on < lg) */}
                  {/* Ideally we check role, but request says 'In tablet/mobile... user profile dropdown'. 
                      We can show these ALWAYS for admin role, regardless of screen size, OR strictly for mobile.
                      Request: "En tablet y móvil, las opciones... dentro del dropdown".
                      Implies Desktop has Sidebar, Mobile has Dropdown.
                      We can use `lg:hidden` class on these items to hide them on desktop if needed, 
                      or just show them always as quick access. Let's start with showing them if role=admin.
                  */}
                  {user.role === 'admin' && (
                    <div className="lg:hidden">
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/shipments')}>
                        <Package size={16} className="mr-2" />
                        Encomiendas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                        <Users size={16} className="mr-2" />
                        Usuarios
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/clients')}>
                        <UserCheck size={16} className="mr-2" />
                        Clientes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/businesses')}>
                        <Building2 size={16} className="mr-2" />
                        Empresas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/drivers')}>
                        <Truck size={16} className="mr-2" />
                        Conductores
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/offices')}>
                        <Building2 size={16} className="mr-2" />
                        Oficinas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/cities')}>
                        <MapPin size={16} className="mr-2" />
                        Ciudades y Rutas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/reports')}>
                        <FileBarChart size={16} className="mr-2" />
                        Reportes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                        <Settings size={16} className="mr-2" />
                        Configuración
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                  )}

                </>
              )}
              <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                <User size={16} className="mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/wallet")}>
                <Settings size={16} className="mr-2" />
                Ajustes Generales
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
