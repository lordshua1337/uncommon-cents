"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { type AchievementDef } from "@/lib/achievements";

// ---------------------------------------------------------------------------
// Toast queue for showing achievement unlock notifications
// ---------------------------------------------------------------------------

interface ToastItem {
  readonly id: string;
  readonly achievement: AchievementDef;
}

let toastListener: ((items: readonly AchievementDef[]) => void) | null = null;

/** Call this from anywhere to show achievement toasts */
export function showAchievementToasts(achievements: readonly AchievementDef[]): void {
  if (achievements.length > 0 && toastListener) {
    toastListener(achievements);
  }
}

export function AchievementToastContainer() {
  const [queue, setQueue] = useState<readonly ToastItem[]>([]);

  useEffect(() => {
    toastListener = (achievements) => {
      const items = achievements.map((a) => ({
        id: `${a.id}_${Date.now()}`,
        achievement: a,
      }));
      setQueue((prev) => [...prev, ...items]);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (queue.length === 0) return;
    const timer = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [queue]);

  const current = queue[0] ?? null;

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="bg-surface border border-accent/30 rounded-xl p-4 shadow-lg shadow-accent/10 max-w-xs pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-accent uppercase tracking-wider font-medium">
                  Achievement Unlocked
                </p>
                <p className="text-sm font-semibold">
                  {current.achievement.title}
                </p>
                <p className="text-[10px] text-text-secondary">
                  +{current.achievement.xp} XP
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
