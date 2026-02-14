import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glow, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-4 transition-all duration-300",
        glow && "glow-primary",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
