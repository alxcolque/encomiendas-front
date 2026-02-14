"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GamifiedProgressProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "gold" | "success";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  default: "gradient-primary",
  gold: "gradient-gold",
  success: "bg-success",
};

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function GamifiedProgress({
  value,
  max,
  label,
  showValue = true,
  variant = "default",
  size = "md",
}: GamifiedProgressProps) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-foreground">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", variantClasses[variant])}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
