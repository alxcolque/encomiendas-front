"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusTimelineItem {
  label: string;
  icon: LucideIcon;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

interface StatusTimelineProps {
  items: StatusTimelineItem[];
  className?: string;
}

export function StatusTimeline({ items, className }: StatusTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex gap-4">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  item.completed
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : item.active
                    ? "border-primary bg-primary/20 text-primary animate-pulse-glow"
                    : "border-muted bg-muted/50 text-muted-foreground"
                )}
              >
                <Icon size={18} />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[40px]",
                    item.completed ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <p
                className={cn(
                  "font-semibold",
                  item.completed || item.active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </p>
              {item.timestamp && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
