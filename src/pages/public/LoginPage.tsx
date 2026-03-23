import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Package, UserPlus, LogIn } from "lucide-react";
import { LoadingLogo } from "@/components/shared/LoadingLogo";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginModal from "@/components/landing/LoginModal";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [ciNit, setCiNit] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  const { clientLogin, clientRegister, isLoading, user, authStatus } = useAuthStore();
  const { general, fetchPublicSettings } = useSettingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicSettings();
  }, []);

  useEffect(() => {
    if (authStatus === 'auth' && user) {
      navigate('/');
    }
  }, [authStatus, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !ciNit) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    await clientLogin(phone, ciNit);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !ciNit) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    await clientRegister(name, phone, ciNit);
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
          <div className={`inline-flex items-center justify-center animate-float ${general?.logo ? '' : 'w-20 h-20 shadow-glow rounded-2xl gradient-primary'}`}>
          {general?.logo ? (
            <img src={general.logo} alt="Logo" className="h-28 w-auto object-contain drop-shadow-md" />
          ) : (
            <Package size={40} className="text-primary-foreground" />
          )}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient-primary">
              {general?.siteName || "Kolmox"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Ingresa a tu cuenta
            </p>
          </div>
        </div>

        {/* Login/Register Tabs */}
        <GlassCard className="p-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Ingresar
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 px-2 pb-2">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Número de Celular</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                      🇧🇴 +591
                    </span>
                    <Input
                      type="tel"
                      placeholder="70000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="h-12 bg-muted/50 border-border rounded-xl pl-20"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">CI / NIT</label>
                  <Input
                    type="text"
                    placeholder="1234567"
                    value={ciNit}
                    onChange={(e) => setCiNit(e.target.value)}
                    className="h-12 bg-muted/50 border-border rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full h-12 text-base mt-2" disabled={isLoading || !phone || !ciNit}>
                  {isLoading ? <LoadingLogo className="w-5 h-5 animate-pulse" /> : "Ingresar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 px-2 pb-2">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Nombre Completo / Razón Social</label>
                  <Input
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-muted/50 border-border rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Número de Celular</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                      🇧🇴 +591
                    </span>
                    <Input
                      type="tel"
                      placeholder="70000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="h-12 bg-muted/50 border-border rounded-xl pl-20"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">CI / NIT</label>
                  <Input
                    type="text"
                    placeholder="1234567"
                    value={ciNit}
                    onChange={(e) => setCiNit(e.target.value)}
                    className="h-12 bg-muted/50 border-border rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full h-12 text-base mt-2" disabled={isLoading || !name || !phone || !ciNit}>
                  {isLoading ? <LoadingLogo className="w-5 h-5 animate-pulse" /> : "Registrarse"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </GlassCard>

        {/* Footer */}
        <div className="text-center space-y-4 mt-6">
          <p className="text-xs text-muted-foreground">
            Al registrarte aceptas nuestros <a href="#" className="underline hover:text-primary">Términos y Condiciones</a>
          </p>
          <button
            onClick={() => setAdminLoginOpen(true)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Acceso Administrativo
          </button>
        </div>
      </div>

      <LoginModal open={adminLoginOpen} onOpenChange={setAdminLoginOpen} />
    </div>
  );
}
