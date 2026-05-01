
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { DeliveryTypeBadge } from "@/components/ui/DeliveryTypeBadge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useChallengeStore, Challenge } from "@/stores/challengeStore";
import { useWalletStore } from "@/stores/walletStore";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, Coins, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegisterRefresh } from "@/stores/refreshStore";

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { acceptChallenge } = useChallengeStore();
  const { addTransaction } = useWalletStore();
  const navigate = useNavigate();

  const handleAccept = () => {
    acceptChallenge(challenge.id);
    navigate("/driver/active");
  };

  return (
    <GlassCard className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <DeliveryTypeBadge type={challenge.type} />
        <CountdownTimer expiresAt={challenge.expiresAt} urgency={challenge.urgency} />
      </div>

      {/* Route */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">{challenge.origin}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-foreground font-medium">{challenge.destination}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin size={14} className="text-muted-foreground" />
          <span>{challenge.distance}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Package size={14} className="text-muted-foreground" />
          <span>{challenge.packages} paq.</span>
        </div>
      </div>

      {/* Rewards */}
      <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Coins size={18} className="text-gold" />
            <span className="font-bold text-lg">{challenge.reward} Bs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={18} className="text-primary" />
            <span className="font-semibold text-primary">+{challenge.points} pts</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button
        onClick={handleAccept}
        variant="hero"
        className="w-full gap-2"
      >
        Aceptar Desafío
        <ArrowRight size={18} />
      </Button>
    </GlassCard>
  );
}

export default function DriverHomePage() {
  const { availableChallenges, activeChallenge } = useChallengeStore();
  
  // Register refresh (gesture only for now, would link to a fetch if store had it)
  useRegisterRefresh(async () => {
    console.log("Refreshing driver challenges...");
    // If challengeStore has a fetch method, call it here
  });

  return (

    <div className="p-4 space-y-4">
      {/* Active challenge banner */}
      {activeChallenge && (
        <GlassCard glow className="bg-primary/10 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                Entrega activa
              </p>
              <p className="font-medium mt-1">{activeChallenge.destination}</p>
            </div>
            <Button size="sm" onClick={() => window.location.href = "/driver/active"}>
              Ver
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="text-center py-3">
          <p className="text-2xl font-bold text-primary">{availableChallenges.length}</p>
          <p className="text-xs text-muted-foreground">Disponibles</p>
        </GlassCard>
        <GlassCard className="text-center py-3">
          <p className="text-2xl font-bold text-gold">485 Bs</p>
          <p className="text-xs text-muted-foreground">Hoy</p>
        </GlassCard>
        <GlassCard className="text-center py-3">
          <p className="text-2xl font-bold text-success">12</p>
          <p className="text-xs text-muted-foreground">Completadas</p>
        </GlassCard>
      </div>

      {/* Challenge list */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg">Desafíos Disponibles</h2>
        {availableChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>

  );
}
