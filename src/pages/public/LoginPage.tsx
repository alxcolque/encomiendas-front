import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { Truck, Package, Building, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const roles: { role: UserRole; label: string; icon: typeof Truck; description: string }[] = [
  { role: "driver", label: "Conductor", icon: Truck, description: "Acepta entregas y gana" },
  { role: "client", label: "Cliente", icon: Package, description: "Rastrea tus envíos" },
  { role: "worker", label: "Oficina", icon: Building, description: "Gestiona paquetes" },
  { role: "admin", label: "Admin", icon: Users, description: "Panel de control" },
];

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("driver");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(phone || "+591 70000000", selectedRole);
    
    switch (selectedRole) {
      case "driver":
        navigate("/driver");
        break;
      case "client":
        navigate("/tracking");
        break;
      case "worker":
        navigate("/worker");
        break;
      case "admin":
        navigate("/admin");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background gradient effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-glow animate-float">
            <Package size={40} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient-primary">
              EnvíoExpress
            </h1>
            <p className="text-muted-foreground mt-1">
              Sistema de entregas gamificado
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <GlassCard className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Selecciona tu rol
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ role, label, icon: Icon, description }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  selectedRole === role
                    ? "border-primary bg-primary/10 glow-cyan"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Icon 
                  size={28} 
                  className={selectedRole === role ? "text-primary" : "text-muted-foreground"} 
                />
                <div className="text-center">
                  <p className={cn(
                    "font-semibold text-sm",
                    selectedRole === role ? "text-primary" : "text-foreground"
                  )}>
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Phone Input */}
        <GlassCard className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Número de teléfono
            </label>
            <Input
              type="tel"
              placeholder="+591 70000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 text-lg bg-muted/50 border-border rounded-xl"
            />
          </div>

          <Button 
            onClick={handleLogin} 
            variant="hero" 
            size="xl" 
            className="w-full"
          >
            Ingresar
          </Button>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Demo UI • Sin autenticación real
        </p>
      </div>
    </div>
  );
}
