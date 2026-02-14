import { cn } from "@/lib/utils";
import { AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: Date;
  urgency: "low" | "medium" | "high";
  className?: string;
}

export function CountdownTimer({ expiresAt, urgency, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const urgencyClasses = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive animate-pulse",
  };

  const Icon = urgency === "high" ? AlertTriangle : Clock;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        urgencyClasses[urgency],
        className
      )}
    >
      <Icon size={12} />
      <span>{timeLeft}</span>
    </div>
  );
}
