"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TrendingUp, X } from "lucide-react";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { SPRING_BOUNCY, CONFETTI_COUNTS } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const CELEBRATION_STORAGE_KEY = "uc-grade-celebration-seen";

function getCelebrationKey(prev: string, next: string): string {
  return `grade-${prev}-${next}`;
}

export function hasGradeCelebrationSeen(prev: string, next: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    if (!raw) return false;
    const seen = JSON.parse(raw) as Record<string, boolean>;
    return seen[getCelebrationKey(prev, next)] === true;
  } catch {
    return false;
  }
}

export function markGradeCelebrationSeen(prev: string, next: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    const seen: Record<string, boolean> = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    const updated = { ...seen, [getCelebrationKey(prev, next)]: true };
    localStorage.setItem(CELEBRATION_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage unavailable -- silently skip
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GradeCelebrationProps {
  readonly visible: boolean;
  readonly previousGrade: string;
  readonly newGrade: string;
  readonly accentColor?: string;
  readonly onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GradeCelebration({
  visible,
  previousGrade,
  newGrade,
  accentColor = "#2C5F7C",
  onDismiss,
}: GradeCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAPlus = newGrade === "A+";
  const confettiCount = isAPlus ? CONFETTI_COUNTS.major : CONFETTI_COUNTS.medium;

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!visible) return;
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [visible, onDismiss]);

  // ESC key dismiss
  useEffect(() => {
    if (!visible) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onDismiss();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onDismiss]);

  return (
    <>
      {/* Confetti layer -- skip when reduced motion is preferred */}
      {!prefersReduced && (
        <LessonConfetti
          visible={visible}
          accentColor={accentColor}
          count={confettiCount}
        />
      )}

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[400]"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {visible && (
            <motion.div
              key="grade-celebration-toast"
              className="rounded-2xl p-4 border shadow-lg"
              style={{
                backgroundColor: "#FAFAF8",
                borderColor: accentColor + "4d",
                boxShadow: `0 8px 24px ${accentColor}26`,
              }}
              initial={prefersReduced ? undefined : { opacity: 0, y: 24, scale: 0.9 }}
              animate={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 12, scale: 0.95 }}
              transition={prefersReduced ? { duration: 0 } : SPRING_BOUNCY}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accentColor + "1a" }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: accentColor }}
                  >
                    Grade Up!
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {previousGrade}{" "}
                    <span className="text-text-muted">to</span>{" "}
                    {newGrade}
                  </p>
                </div>

                {/* Grade badge with scale pulse */}
                <motion.span
                  className="text-sm font-bold px-2.5 py-1 rounded-full border shrink-0"
                  style={{
                    backgroundColor: accentColor + "1a",
                    color: accentColor,
                    borderColor: accentColor + "40",
                  }}
                  animate={
                    prefersReduced
                      ? undefined
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.4 }
                  }
                >
                  {newGrade}
                </motion.span>

                {/* Dismiss button */}
                <button
                  onClick={onDismiss}
                  className="ml-1 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                  aria-label="Dismiss grade celebration"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
