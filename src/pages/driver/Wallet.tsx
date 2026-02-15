
import { GlassCard } from "@/components/ui/GlassCard";
import { GamifiedProgress } from "@/components/ui/GamifiedProgress";
import { Button } from "@/components/ui/button";
import { useWalletStore, Transaction, TransactionType } from "@/stores/walletStore";
import { Wallet, Coins, Star, TrendingUp, TrendingDown, Gift, ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const transactionConfig: Record<TransactionType, { icon: typeof Coins; color: string; label: string }> = {
  delivery: { icon: TrendingUp, color: "text-success", label: "Entrega" },
  bonus: { icon: Gift, color: "text-gold", label: "Bono" },
  penalty: { icon: TrendingDown, color: "text-destructive", label: "Penalidad" },
  withdrawal: { icon: ArrowUpRight, color: "text-muted-foreground", label: "Retiro" },
  points_earned: { icon: Star, color: "text-primary", label: "Puntos" },
};

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const config = transactionConfig[transaction.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className={cn("p-2 rounded-lg bg-muted/50", config.color)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {format(transaction.date, "d MMM, HH:mm", { locale: es })}
        </p>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-bold",
          transaction.amount > 0 ? "text-success" : "text-destructive"
        )}>
          {transaction.amount > 0 ? "+" : ""}{transaction.amount} Bs
        </p>
        {transaction.points && (
          <p className="text-xs text-primary">+{transaction.points} pts</p>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { balance, points, transactions } = useWalletStore();

  const weeklyEarnings = transactions
    .filter(t => t.amount > 0 && t.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, t) => sum + t.amount, 0);

  return (

    <div className="p-4 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Money Balance */}
        <GlassCard glow className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet size={16} />
            <span className="text-xs">Saldo</span>
          </div>
          <p className="text-3xl font-bold">{balance} <span className="text-lg">Bs</span></p>
          <Button size="sm" variant="outline" className="w-full text-xs">
            Retirar
          </Button>
        </GlassCard>

        {/* Points Balance */}
        <GlassCard className="space-y-2 bg-primary/10 border-primary/30">
          <div className="flex items-center gap-2 text-primary">
            <Star size={16} />
            <span className="text-xs">Puntos</span>
          </div>
          <p className="text-3xl font-bold text-primary">{points.toLocaleString()}</p>
          <Button size="sm" variant="ghost" className="w-full text-xs text-primary">
            Canjear
          </Button>
        </GlassCard>
      </div>

      {/* Weekly Stats */}
      <GlassCard className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-muted-foreground" />
            <span className="font-semibold">Esta semana</span>
          </div>
          <span className="text-lg font-bold text-success">+{weeklyEarnings} Bs</span>
        </div>
        <GamifiedProgress
          value={weeklyEarnings}
          max={500}
          label="Meta semanal"
          variant="success"
        />
      </GlassCard>

      {/* Progress to next tier */}
      <GlassCard className="space-y-3">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-gold" />
          <span className="font-semibold">Próximo nivel: Platino</span>
        </div>
        <GamifiedProgress
          value={points}
          max={3000}
          variant="gold"
        />
        <p className="text-xs text-muted-foreground text-center">
          {3000 - points} puntos más para subir de nivel
        </p>
      </GlassCard>

      {/* Transactions */}
      <GlassCard>
        <h3 className="font-display font-bold mb-4">Historial</h3>
        <div className="divide-y divide-border/50">
          {transactions.slice(0, 10).map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </GlassCard>
    </div>

  );
}
