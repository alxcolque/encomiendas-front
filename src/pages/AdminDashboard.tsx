import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChallengeStore, DeliveryType, Challenge } from "@/stores/challengeStore";
import { 
  Plus, Package, Users, TrendingUp, MapPin, Zap, Moon, Layers, 
  BarChart3, Trophy, Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

const deliveryTypes: { type: DeliveryType; label: string; icon: typeof Zap }[] = [
  { type: "normal", label: "Normal", icon: Package },
  { type: "express", label: "Express", icon: Zap },
  { type: "night", label: "Nocturno", icon: Moon },
  { type: "combo", label: "Combo", icon: Layers },
];

const mockOffices = [
  "Oficina Central - La Paz",
  "El Alto - Villa Adela",
  "Miraflores",
  "San Miguel",
  "Sopocachi",
  "Santa Cruz - Centro",
  "Cochabamba - Norte",
];

export default function AdminDashboard() {
  const { availableChallenges, addChallenge } = useChallengeStore();
  const [showForm, setShowForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    type: "normal" as DeliveryType,
    origin: "",
    destination: "",
    reward: 30,
    points: 100,
    packages: 1,
  });

  const handleCreateChallenge = () => {
    const challenge: Challenge = {
      id: `ch-${Date.now()}`,
      type: newChallenge.type,
      origin: newChallenge.origin || mockOffices[0],
      destination: newChallenge.destination || mockOffices[1],
      reward: newChallenge.reward,
      points: newChallenge.points,
      distance: `${Math.floor(Math.random() * 20) + 5} km`,
      zone: "Multi-zona",
      urgency: newChallenge.type === "express" ? "high" : "medium",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      status: "available",
      packages: newChallenge.packages,
    };
    addChallenge(challenge);
    setShowForm(false);
    setNewChallenge({
      type: "normal",
      origin: "",
      destination: "",
      reward: 30,
      points: 100,
      packages: 1,
    });
  };

  return (
    <MobileLayout title="Panel Admin">
      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package size={16} />
              <span className="text-xs">Entregas Activas</span>
            </div>
            <p className="text-2xl font-bold">{availableChallenges.length}</p>
          </GlassCard>
          <GlassCard className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck size={16} />
              <span className="text-xs">Conductores</span>
            </div>
            <p className="text-2xl font-bold text-primary">24</p>
          </GlassCard>
          <GlassCard className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp size={16} />
              <span className="text-xs">Completadas Hoy</span>
            </div>
            <p className="text-2xl font-bold text-success">156</p>
          </GlassCard>
          <GlassCard className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 size={16} />
              <span className="text-xs">Ingresos Hoy</span>
            </div>
            <p className="text-2xl font-bold text-gold">4,250 Bs</p>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <h3 className="font-display font-bold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="hero" 
              onClick={() => setShowForm(!showForm)}
              className="h-auto py-4 flex-col gap-2"
            >
              <Plus size={24} />
              <span>Crear Desafío</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
            >
              <Trophy size={24} />
              <span>Ver Ranking</span>
            </Button>
          </div>
        </GlassCard>

        {/* Create Challenge Form */}
        {showForm && (
          <GlassCard glow className="space-y-4">
            <h3 className="font-display font-bold">Nuevo Desafío</h3>
            
            {/* Type Selection */}
            <div className="grid grid-cols-4 gap-2">
              {deliveryTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setNewChallenge({ ...newChallenge, type })}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                    newChallenge.type === type
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon size={20} className={newChallenge.type === type ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Origin & Destination */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Origen</label>
                <select
                  value={newChallenge.origin}
                  onChange={(e) => setNewChallenge({ ...newChallenge, origin: e.target.value })}
                  className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground"
                >
                  <option value="">Seleccionar oficina</option>
                  {mockOffices.map((office) => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Destino</label>
                <select
                  value={newChallenge.destination}
                  onChange={(e) => setNewChallenge({ ...newChallenge, destination: e.target.value })}
                  className="w-full h-12 px-4 bg-muted/50 border border-border rounded-xl text-foreground"
                >
                  <option value="">Seleccionar oficina</option>
                  {mockOffices.map((office) => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Recompensa (Bs)</label>
                <Input
                  type="number"
                  value={newChallenge.reward}
                  onChange={(e) => setNewChallenge({ ...newChallenge, reward: Number(e.target.value) })}
                  className="h-12 bg-muted/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Puntos</label>
                <Input
                  type="number"
                  value={newChallenge.points}
                  onChange={(e) => setNewChallenge({ ...newChallenge, points: Number(e.target.value) })}
                  className="h-12 bg-muted/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Paquetes</label>
                <Input
                  type="number"
                  value={newChallenge.packages}
                  onChange={(e) => setNewChallenge({ ...newChallenge, packages: Number(e.target.value) })}
                  className="h-12 bg-muted/50"
                />
              </div>
            </div>

            <Button onClick={handleCreateChallenge} variant="success" className="w-full">
              Crear Desafío
            </Button>
          </GlassCard>
        )}

        {/* Active Challenges */}
        <GlassCard>
          <h3 className="font-display font-bold mb-4">Desafíos Activos</h3>
          <div className="space-y-3">
            {availableChallenges.slice(0, 5).map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    challenge.type === "express" ? "bg-express/20 text-express" :
                    challenge.type === "night" ? "bg-night/20 text-night" :
                    challenge.type === "combo" ? "bg-combo/20 text-combo" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{challenge.destination}</p>
                    <p className="text-xs text-muted-foreground">{challenge.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{challenge.reward} Bs</p>
                  <p className="text-xs text-primary">+{challenge.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MobileLayout>
  );
}
