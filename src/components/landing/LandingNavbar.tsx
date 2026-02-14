import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoginModal from "./LoginModal";
import kolmoxLogo from "@/assets/kolmox-logo.png";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const navLinks = [
    { name: "Servicios", href: "#servicios" },
    { name: "Cobertura", href: "#cobertura" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
  ];

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

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                onClick={() => setLoginOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Iniciar Sesión
              </Button>
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
            <Button 
              onClick={() => {
                setLoginOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
