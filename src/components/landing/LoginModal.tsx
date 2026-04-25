import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await login(phone, pin);
      onOpenChange(false);

      const user = useAuthStore.getState().user;
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
            navigate('/tracking');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error: any) {
      // Error is handled by authStore and toast is shown there
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setPin("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Acceso Administrativo
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-phone" className="text-foreground">Número de celular</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  🇧🇴 +591
                </span>
                <Input
                  id="admin-phone"
                  type="tel"
                  placeholder="70000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="pl-20 h-12 bg-muted/50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-pin" className="text-foreground">PIN de Acceso</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  id="admin-pin"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="pl-10 h-12 bg-muted/50 tracking-widest text-center"
                  maxLength={4}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={phone.length < 8 || pin.length < 4 || loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
            >
              {loading ? <div className={`loading-logo ${"w-5 h-5 animate-pulse"}`}></div> : "Ingresar"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
