"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { StreakFlame } from "@/components/streak/streak-flame";
import { getWarmthColor } from "@/lib/streak-status";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MILESTONE_LABELS: Readonly<Record<number, string>> = {
  3: "3-Day Learner",
  7: "Week of Wealth",
  14: "Finance Fortnight",
  30: "Monthly Maven",
  60: "Two-Month Pro",
  100: "Century Club",
} as const;

const MILESTONE_XP: Readonly<Record<number, number>> = {
  3: 15,
  7: 25,
  14: 40,
  30: 75,
  60: 100,
  100: 200,
} as const;

// Particle counts scale with milestone tier
const MILESTONE_PARTICLE_COUNTS: Readonly<Record<number, number>> = {
  3: 16,
  7: 24,
  14: 32,
  30: 48,
  60: 64,
  100: 80,
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MilestoneCelebrationProps {
  readonly milestone: number | null;
  readonly onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MilestoneCelebration({ milestone, onDismiss }: MilestoneCelebrationProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!milestone) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [milestone, onDismiss]);

  const accentColor = milestone ? getWarmthColor(milestone) : "#16A34A";
  const label = milestone ? (MILESTONE_LABELS[milestone] ?? `${milestone}-Day Streak`) : "";
  const xp = milestone ? (MILESTONE_XP[milestone] ?? 25) : 0;
  const particleCount = milestone ? (MILESTONE_PARTICLE_COUNTS[milestone] ?? 24) : 24;

  return (
    <>
      {/* Full-screen confetti -- always rendered, visibility via prop */}
      {!prefersReduced && (
        <LessonConfetti
          visible={milestone !== null}
          accentColor={accentColor}
          count={particleCount}
          onDone={onDismiss}
        />
      )}

      {/* Overlay card */}
      <AnimatePresence>
        {milestone !== null && (
          <motion.div
            key={`milestone-${milestone}`}
            className="absolute inset-0 flex items-center justify-center z-10 rounded-xl"
            style={{ backgroundColor: `${accentColor}08` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={onDismiss}
            role="status"
            aria-live="polite"
          >
            <motion.div
              className="text-center px-6"
              initial={{ scale: 0.8, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex justify-center mb-3">
                <StreakFlame streak={milestone} size="lg" status="active" />
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                style={{ color: accentColor }}
              >
                Milestone Reached
              </p>
              <p className="text-xl font-bold text-white mb-1">{label}</p>
              <p className="text-sm text-gray-400 mb-2">{milestone} days strong -- keep it up!</p>
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                +{xp} XP
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
