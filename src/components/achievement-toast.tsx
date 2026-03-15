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
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            className="max-w-xs pointer-events-auto p-4"
            style={{
              background: "#FFFDF8",
              border: "1px solid rgba(202,138,4,0.30)",
              borderRadius: "0.875rem",
              boxShadow: "0 8px 24px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FAF3E6 0%, #F7E7C5 100%)",
                  border: "1px solid rgba(202,138,4,0.25)",
                  borderRadius: "50%",
                  width: "2.5rem",
                  height: "2.5rem",
                }}
              >
                <Trophy className="w-5 h-5 text-[#CA8A04]" />
              </div>
              <div>
                <p
                  className="text-[10px] uppercase font-medium text-[#CA8A04]"
                  style={{ letterSpacing: "0.06em" }}
                >
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
