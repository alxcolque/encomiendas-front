import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, ArrowLeft, Shield } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (phone.length >= 8) {
      setLoading(true);
      // Simulate sending code
      setTimeout(() => {
        setLoading(false);
        setStep("otp");
      }, 1000);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      setLoading(true);
      // Simulate verification
      setTimeout(() => {
        login(phone, "driver");
        setLoading(false);
        onOpenChange(false);
        navigate("/driver");
      }, 1000);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
  };

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            {step === "phone" ? "Iniciar Sesión" : "Verificar Código"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === "phone" ? (
            <div className="space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-muted-foreground text-sm">
                Ingresa tu número de celular para recibir un código de verificación
              </p>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Número de celular</Label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 bg-muted rounded-lg border border-input text-sm text-muted-foreground">
                    +591
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="70000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="flex-1 bg-background"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSendCode}
                disabled={phone.length < 8 || loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
              >
                {loading ? "Enviando..." : "Enviar Código"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Cambiar número
              </button>

              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-1">
                <p className="text-muted-foreground text-sm">
                  Ingresa el código de 4 dígitos enviado a
                </p>
                <p className="text-foreground font-semibold">+591 {phone}</p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className="w-14 h-14 text-xl bg-background border-input" />
                    <InputOTPSlot index={1} className="w-14 h-14 text-xl bg-background border-input" />
                    <InputOTPSlot index={2} className="w-14 h-14 text-xl bg-background border-input" />
                    <InputOTPSlot index={3} className="w-14 h-14 text-xl bg-background border-input" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 4 || loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
              >
                {loading ? "Verificando..." : "Verificar"}
              </Button>

              {/* Resend */}
              <p className="text-center text-sm text-muted-foreground">
                ¿No recibiste el código?{" "}
                <button className="text-primary hover:underline font-medium">
                  Reenviar
                </button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
