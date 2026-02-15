
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { DeliveryTypeBadge } from "@/components/ui/DeliveryTypeBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useChallengeStore } from "@/stores/challengeStore";
import { useWalletStore } from "@/stores/walletStore";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Truck, Building, PackageCheck, MapPin, Coins, Star, Package } from "lucide-react";
import { useState } from "react";

const statusSteps = [
  { label: "Desafío Aceptado", icon: CheckCircle },
  { label: "En Camino", icon: Truck },
  { label: "En Oficina Destino", icon: Building },
  { label: "Entregado", icon: PackageCheck },
];

export default function ActiveDeliveryPage() {
  const { activeChallenge, completeChallenge } = useChallengeStore();
  const { addTransaction } = useWalletStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < statusSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete delivery
      if (activeChallenge) {
        addTransaction({
          type: "delivery",
          amount: activeChallenge.reward,
          points: activeChallenge.points,
          description: `Entrega ${activeChallenge.type} - ${activeChallenge.destination}`,
        });
        completeChallenge();
        navigate("/driver");
      }
    }
  };

  if (!activeChallenge) {
    return (

      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package size={64} className="text-muted-foreground mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">Sin entregas activas</h2>
        <p className="text-muted-foreground mb-6">
          Acepta un desafío para comenzar a ganar
        </p>
        <Button onClick={() => navigate("/driver")} variant="hero">
          Ver Desafíos
        </Button>
      </div>

    );
  }

  const progress = ((currentStep + 1) / statusSteps.length) * 100;

  return (

    <div className="p-4 space-y-6">
      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing progress={progress} size={140}>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
            <p className="text-xs text-muted-foreground">Completado</p>
          </div>
        </ProgressRing>
      </div>

      {/* Delivery Info Card */}
      <GlassCard glow className="space-y-4">
        <div className="flex items-center justify-between">
          <DeliveryTypeBadge type={activeChallenge.type} size="lg" />
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Coins size={16} className="text-gold" />
              <span className="font-bold">{activeChallenge.reward} Bs</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Star size={14} className="text-primary" />
              <span className="text-sm text-primary">+{activeChallenge.points} pts</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Origen</p>
              <p className="font-medium">{activeChallenge.origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-success mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium">{activeChallenge.destination}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{activeChallenge.distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package size={14} />
            <span>{activeChallenge.packages} paquetes</span>
          </div>
        </div>
      </GlassCard>

      {/* Status Timeline */}
      <GlassCard>
        <h3 className="font-display font-bold mb-4">Estado de Entrega</h3>
        <StatusTimeline
          items={statusSteps.map((step, index) => ({
            label: step.label,
            icon: step.icon,
            completed: index < currentStep,
            active: index === currentStep,
          }))}
        />
      </GlassCard>

      {/* Action Button */}
      <Button
        onClick={handleNextStep}
        variant={currentStep === statusSteps.length - 1 ? "success" : "hero"}
        size="xl"
        className="w-full"
      >
        {currentStep === statusSteps.length - 1 ? (
          <>
            <PackageCheck size={20} />
            Completar Entrega
          </>
        ) : (
          <>
            Siguiente Paso
          </>
        )}
      </Button>
    </div>

  );
}
