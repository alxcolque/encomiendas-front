import { cn } from "@/lib/utils";
import { RankTier } from "@/stores/rankingStore";
import { Trophy, Medal, Award, Star, Gem } from "lucide-react";

interface TierBadgeProps {
  tier: RankTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const tierConfig: Record<RankTier, { label: string; icon: typeof Trophy; className: string }> = {
  bronze: {
    label: "Bronce",
    icon: Medal,
    className: "badge-bronze",
  },
  silver: {
    label: "Plata",
    icon: Award,
    className: "badge-silver",
  },
  gold: {
    label: "Oro",
    icon: Trophy,
    className: "badge-gold",
  },
  platinum: {
    label: "Platino",
    icon: Star,
    className: "bg-gradient-to-r from-cyan-300 to-blue-400 text-background font-bold",
  },
  diamond: {
    label: "Diamante",
    icon: Gem,
    className: "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-background font-bold",
  },
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizes = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function TierBadge({ tier, size = "md", showLabel = true }: TierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
