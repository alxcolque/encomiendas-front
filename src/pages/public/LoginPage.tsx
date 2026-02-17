import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuthStore } from "@/stores/authStore";
import { Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const { login, isLoading, user, authStatus } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'auth' && user) {
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'driver': navigate('/driver'); break;
        case 'worker': navigate('/worker'); break;
        case 'client': navigate('/tracking'); break;
        default: navigate('/');
      }
    }
  }, [authStatus, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      // Sending strictly phone and pin as requested
      await login(phone, pin);
      // Redirect is handled by the ProtectedRoute or we can explicit redirect here based on role if needed.
      // But fetchUser saves the user, and ProtectedRoute will verify it.
      // Usually good to redirect to a default dashboard.
      // Let's rely on standard navigation or check role.
      // For now, let's navigate to /admin or root and let router decide?
      // Actually, after login, we usually want to know where to go.
      // Redirect based on role
      const user = useAuthStore.getState().user;
      //console.log(user);
      if (user) {
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'driver':
            navigate('/driver');
            break;
          case 'worker':
            navigate('/worker');
            break;
          case 'client':
            navigate('/tracking'); // Clients usually want to track packages
            break;
          default:
            navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Credenciales incorrectas");
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
              Ingresa a tu cuenta
            </p>
          </div>
        </div>

        {/* Login Form */}
        <GlassCard className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Número de Celular
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  🇧🇴 +591
                </span>
                <Input
                  type="tel"
                  placeholder="70000000"
                  value={phone}
                  onChange={(e) => {
                    // Allow only numbers and max 8 chars
                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPhone(val);
                  }}
                  className="h-12 bg-muted/50 border-border rounded-xl pl-20" // padding left for +591
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                PIN de Acceso
              </label>
              <Input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPin(val);
                }}
                className="h-12 bg-muted/50 border-border rounded-xl tracking-widest text-center"
                disabled={isLoading}
                maxLength={4}
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12 text-base"
              disabled={isLoading || phone.length < 8 || pin.length < 4}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar"}
            </Button>
          </form>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Sistema de Gestión Interna • Privado
        </p>
      </div>
    </div>
  );
}
