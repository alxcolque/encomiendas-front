import { MobileLayout } from "@/components/layout/MobileLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { TierBadge } from "@/components/ui/TierBadge";
import { GamifiedProgress } from "@/components/ui/GamifiedProgress";
import { useRankingStore, RankingPeriod, RankedDriver } from "@/stores/rankingStore";
import { Trophy, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const periodLabels: Record<RankingPeriod, string> = {
  daily: "Diario",
  weekly: "Semanal",
  monthly: "Mensual",
};

function RankingRow({ driver, isCurrentUser }: { driver: RankedDriver; isCurrentUser: boolean }) {
  const getRankIcon = () => {
    if (driver.position === 1) return <Crown size={20} className="text-gold" />;
    if (driver.position === 2) return <Medal size={20} className="text-silver" />;
    if (driver.position === 3) return <Medal size={20} className="text-bronze" />;
    return <span className="w-5 text-center font-bold text-muted-foreground">{driver.position}</span>;
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl transition-all",
      isCurrentUser ? "bg-primary/10 border border-primary glow-cyan" : "hover:bg-muted/50"
    )}>
      <div className="flex items-center justify-center w-8">
        {getRankIcon()}
      </div>
      <img
        src={driver.avatar}
        alt={driver.name}
        className={cn(
          "w-10 h-10 rounded-full border-2",
          driver.position === 1 ? "border-gold" :
          driver.position === 2 ? "border-silver" :
          driver.position === 3 ? "border-bronze" : "border-border"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{driver.name}</p>
        <div className="flex items-center gap-2">
          <TierBadge tier={driver.tier} size="sm" />
          <span className="text-xs text-muted-foreground">
            {driver.deliveries} entregas
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary">{driver.points.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">puntos</p>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const { period, setPeriod, leaderboard, currentUserRank, nextRewardPoints } = useRankingStore();

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <MobileLayout title="Ranking">
      <div className="p-4 space-y-6">
        {/* Period Tabs */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
          {(["daily", "weekly", "monthly"] as RankingPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                period === p
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 pt-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <img
              src={topThree[1]?.avatar}
              alt={topThree[1]?.name}
              className="w-14 h-14 rounded-full border-3 border-silver mb-2"
            />
            <p className="text-xs font-medium truncate max-w-[80px]">{topThree[1]?.name}</p>
            <p className="text-sm font-bold text-silver">{topThree[1]?.points.toLocaleString()}</p>
            <div className="w-16 h-16 bg-gradient-to-t from-silver/50 to-silver/20 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-silver">2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-4">
            <Crown size={32} className="text-gold mb-1 animate-float" />
            <img
              src={topThree[0]?.avatar}
              alt={topThree[0]?.name}
              className="w-18 h-18 w-[72px] rounded-full border-4 border-gold mb-2 shadow-[0_0_20px_hsl(45_93%_58%/0.5)]"
            />
            <p className="text-sm font-bold truncate max-w-[90px]">{topThree[0]?.name}</p>
            <p className="text-base font-bold text-gold">{topThree[0]?.points.toLocaleString()}</p>
            <div className="w-20 h-20 bg-gradient-to-t from-gold/50 to-gold/20 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-3xl font-bold text-gold">1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <img
              src={topThree[2]?.avatar}
              alt={topThree[2]?.name}
              className="w-14 h-14 rounded-full border-3 border-bronze mb-2"
            />
            <p className="text-xs font-medium truncate max-w-[80px]">{topThree[2]?.name}</p>
            <p className="text-sm font-bold text-bronze">{topThree[2]?.points.toLocaleString()}</p>
            <div className="w-16 h-14 bg-gradient-to-t from-bronze/50 to-bronze/20 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-bronze">3</span>
            </div>
          </div>
        </div>

        {/* Current User Progress */}
        {currentUserRank && (
          <GlassCard glow className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-primary" />
                <span className="font-semibold">Tu posición: #{currentUserRank.position}</span>
              </div>
              <TierBadge tier={currentUserRank.tier} />
            </div>
            <GamifiedProgress
              value={currentUserRank.points}
              max={nextRewardPoints}
              label="Próxima recompensa"
              variant="gold"
            />
          </GlassCard>
        )}

        {/* Leaderboard */}
        <GlassCard>
          <h3 className="font-display font-bold mb-4">Clasificación</h3>
          <div className="space-y-2">
            {rest.map((driver) => (
              <RankingRow
                key={driver.id}
                driver={driver}
                isCurrentUser={driver.id === currentUserRank?.id}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </MobileLayout>
  );
}
