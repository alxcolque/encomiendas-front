import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, Monitor, LogOut, User, Settings, ChevronDown } from "lucide-react";
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

export function TopNavbar() {
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
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
                </>
              )}
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User size={16} className="mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/wallet")}>
                <Settings size={16} className="mr-2" />
                Configuración
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
