import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';
import { useRefreshStore } from '@/stores/refreshStore';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  className?: string;
}

const PULL_THRESHOLD = 80;
const INDICATOR_HEIGHT = 60;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, className }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const { triggerRefresh, isRefreshing, refreshFn } = useRefreshStore();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset indicator when refreshing finishes
  useEffect(() => {
    if (!isRefreshing) {
      controls.start({ y: 0 });
      setPullDistance(0);
    }
  }, [isRefreshing, controls]);

  const handlePan = (event: any, info: PanInfo) => {
    if (isRefreshing || !refreshFn) return;

    // Get the scroll container (either window or the closest scrollable parent)
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto') || document.documentElement;
    const scrollTop = scrollContainer === document.documentElement ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;

    if (scrollTop > 5) return; // Add a small buffer

    const y = Math.max(0, info.offset.y);
    // Apply resistance
    const distance = Math.pow(y, 0.85);
    setPullDistance(distance);
    controls.set({ y: distance });
  };

  const handlePanEnd = (_: any, info: PanInfo) => {
    if (isRefreshing || !refreshFn) return;

    if (pullDistance >= PULL_THRESHOLD) {
      // Trigger refresh
      controls.start({ y: INDICATOR_HEIGHT });
      triggerRefresh();
    } else {
      // Snap back
      controls.start({ y: 0 });
      setPullDistance(0);
    }
  };

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Pull Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{ height: INDICATOR_HEIGHT, top: -INDICATOR_HEIGHT }}
        animate={controls}
      >
        <div className={cn(
          "bg-card border border-border shadow-lg rounded-full p-2 transition-all duration-200",
          pullProgress >= 1 ? "scale-110 border-primary/50" : "scale-100"
        )}>
          {isRefreshing ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <motion.div
              style={{ rotate: pullProgress * 180 }}
            >
              <ArrowDown
                className={cn(
                  "w-5 h-5 transition-colors opacity-40 transition-opacity",
                  pullProgress >= 1 ? "text-primary" : "text-muted-foreground"
                )}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Content Wrapper */}
      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={controls}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
