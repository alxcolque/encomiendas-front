import { cn } from "@/lib/utils";
import { DeliveryType } from "@/stores/challengeStore";
import { Zap, Moon, Package, Layers } from "lucide-react";

interface DeliveryTypeBadgeProps {
  type: DeliveryType;
  size?: "sm" | "md" | "lg";
}

const typeConfig: Record<DeliveryType, { label: string; icon: typeof Zap; className: string }> = {
  normal: {
    label: "Normal",
    icon: Package,
    className: "bg-muted text-muted-foreground",
  },
  express: {
    label: "Express",
    icon: Zap,
    className: "gradient-express text-white",
  },
  night: {
    label: "Nocturno",
    icon: Moon,
    className: "gradient-night text-white",
  },
  combo: {
    label: "Combo",
    icon: Layers,
    className: "bg-gradient-to-r from-pink-500 to-orange-500 text-white",
  },
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
};

export function DeliveryTypeBadge({ type, size = "md" }: DeliveryTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}
