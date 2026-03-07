import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoginModal from "./LoginModal";
import kolmoxLogo from "@/assets/kolmox-logo.png";
import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, authStatus, logout } = useAuthStore();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Servicios", href: "#servicios" },
    { name: "Cobertura", href: "#cobertura" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src={kolmoxLogo}
                alt="KOLMOX Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-foreground tracking-tight">
                KOLMOX
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Button / User Profile */}
            <div className="hidden md:flex items-center gap-4">
              {authStatus === 'auth' && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full border border-border bg-muted/50 hover:bg-muted overflow-hidden">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.phone}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer text-foreground">
                      <Link to="/me">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Link to="/login">
                    Iniciar Sesión
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border/50",
            mobileMenuOpen ? "max-h-80" : "max-h-0"
          )}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {authStatus === 'auth' && user ? (
              <div className="border-t border-border pt-4 mt-2">
                <div className="flex items-center px-2 py-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/me">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/login">
                  Iniciar Sesión
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
