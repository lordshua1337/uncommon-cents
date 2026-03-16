"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy, RefreshCcw, Compass, X } from "lucide-react";
import Link from "next/link";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import {
  SPRING_BOUNCY,
  SPRING_GENTLE,
  STAGGER_MEDIUM,
  CONFETTI_COUNTS,
} from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uc-action-plan-celebrated";
const DISMISS_LOCK_MS = 2000;
const AUTO_DISMISS_MS = 5000;
const ACCENT = "#2C5F7C";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

export function hasActionPlanCelebrationSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markActionPlanCelebrationSeen(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Storage full -- ignore
  }
}

export function resetActionPlanCelebration(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActionPlanCelebrationProps {
  readonly visible: boolean;
  readonly completedCount: number;
  readonly onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Corner ornament (matching GraduationCelebration pattern)
// ---------------------------------------------------------------------------

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const transforms: Record<string, string> = {
    tl: "translate(0, 0)",
    tr: "translate(0, 0) scaleX(-1)",
    bl: "translate(0, 0) scaleY(-1)",
    br: "translate(0, 0) scale(-1, -1)",
  };

  const posClass: Record<string, string> = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };

  return (
    <div className={`absolute ${posClass[position]} w-8 h-8 opacity-40`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: transforms[position] }}
      >
        <path
          d="M2 30 L2 8 Q2 2 8 2 L30 2"
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="5" cy="5" r="2" fill={ACCENT} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat cell
// ---------------------------------------------------------------------------

function StatCell({
  value,
  label,
  delay,
  prefersReduced,
}: {
  value: number;
  label: string;
  delay: number;
  prefersReduced: boolean | null;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay }}
    >
      <AnimatedCounter
        value={value}
        className="text-4xl font-bold text-white"
      />
      <span
        className="text-[10px] uppercase tracking-widest font-medium"
        style={{ color: "#6B7280", fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ActionPlanCelebration({
  visible,
  completedCount,
  onDismiss,
}: ActionPlanCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const [dismissable, setDismissable] = useState(false);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // XP estimate: 10 per completed action
  const xpEarned = completedCount * 10;

  const handleDismiss = useCallback(() => {
    if (!dismissable) return;
    markActionPlanCelebrationSeen();
    onDismiss();
  }, [dismissable, onDismiss]);

  // Keyboard dismiss
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) handleDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, dismissable, handleDismiss]);

  // Lock + auto-dismiss timers
  useEffect(() => {
    if (!visible) {
      setDismissable(false);
      return;
    }

    lockRef.current = setTimeout(() => setDismissable(true), DISMISS_LOCK_MS);

    autoRef.current = setTimeout(() => {
      markActionPlanCelebrationSeen();
      onDismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      if (lockRef.current) clearTimeout(lockRef.current);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [visible, onDismiss]);

  // Backdrop click dismiss
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && dismissable) handleDismiss();
    },
    [dismissable, handleDismiss]
  );

  return (
    <>
      {/* Confetti fires above the overlay */}
      <LessonConfetti
        visible={visible}
        accentColor={ACCENT}
        count={CONFETTI_COUNTS.major}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            key="action-plan-celebration"
            className="fixed inset-0 z-[600] flex items-center justify-center px-4"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-plan-celebration-title"
            aria-label="Congratulations! You completed your entire action plan."
          >
            {/* Animated radial burst background */}
            {!prefersReduced ? (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{
                  background: `radial-gradient(circle at 50% 50%, ${ACCENT}00 0%, transparent 100%)`,
                }}
                animate={{
                  background: [
                    `radial-gradient(circle at 50% 50%, ${ACCENT}CC 0%, ${ACCENT}66 20%, ${ACCENT}11 60%, transparent 100%)`,
                    `radial-gradient(circle at 50% 50%, ${ACCENT}12 0%, #0F111766 60%, #0F1117EE 100%)`,
                  ],
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ) : (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(15,17,23,0.92)" }}
              />
            )}

            {/* Card */}
            <motion.div
              className="relative z-10 w-full max-w-md"
              initial={prefersReduced ? false : { opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={
                prefersReduced
                  ? { duration: 0.2 }
                  : { ...SPRING_BOUNCY, delay: 0.1 }
              }
            >
              {/* Outer gradient border */}
              <div
                className="rounded-3xl p-[2px]"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}40)`,
                  boxShadow: `0 24px 64px ${ACCENT}40, 0 8px 24px rgba(0,0,0,0.35)`,
                }}
              >
                {/* Inner card */}
                <div
                  className="relative rounded-[22px] p-8 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                  }}
                >
                  {/* Inner accent border */}
                  <div
                    className="absolute inset-[6px] rounded-2xl pointer-events-none"
                    style={{ border: `1px solid ${ACCENT}25` }}
                  />

                  {/* Corner ornaments */}
                  <CornerOrnament position="tl" />
                  <CornerOrnament position="tr" />
                  <CornerOrnament position="bl" />
                  <CornerOrnament position="br" />

                  {/* Header section */}
                  <div className="text-center mb-6">
                    {/* Trophy container */}
                    <div
                      className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4"
                      style={{
                        background: `${ACCENT}18`,
                        boxShadow: `0 0 0 8px ${ACCENT}08`,
                      }}
                    >
                      {/* Trophy entrance + wiggle */}
                      <motion.div
                        initial={prefersReduced ? false : { scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={
                          prefersReduced ? { duration: 0 } : { ...SPRING_BOUNCY, delay: 0.2 }
                        }
                      >
                        <motion.div
                          animate={
                            prefersReduced
                              ? {}
                              : { rotate: [0, -8, 8, -4, 4, 0] }
                          }
                          transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
                        >
                          <Trophy
                            className="w-10 h-10"
                            style={{
                              color: ACCENT,
                              filter: `drop-shadow(0 0 12px ${ACCENT}80) drop-shadow(0 0 24px ${ACCENT}40)`,
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Overline */}
                    <p
                      className="text-[10px] uppercase tracking-widest font-medium mb-1"
                      style={{
                        color: ACCENT,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Action Plan Complete
                    </p>

                    {/* Headline */}
                    <motion.h2
                      id="action-plan-celebration-title"
                      className="text-3xl font-bold text-white tracking-tight mb-1"
                      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING_GENTLE, delay: 0.3 }}
                    >
                      Action Plan Complete!
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                      className="text-sm text-slate-400"
                      initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING_GENTLE, delay: 0.35 }}
                    >
                      You did every step.
                    </motion.p>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px mb-5"
                    style={{ background: `${ACCENT}30` }}
                  />

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatCell
                      value={completedCount}
                      label="actions completed"
                      delay={0.45}
                      prefersReduced={prefersReduced}
                    />
                    <StatCell
                      value={xpEarned}
                      label="experience points earned"
                      delay={0.45 + STAGGER_MEDIUM}
                      prefersReduced={prefersReduced}
                    />
                  </div>

                  {/* Encouragement */}
                  <motion.p
                    className="text-center text-xs text-slate-500 mb-6"
                    initial={prefersReduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    Most people never get this far. You did.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    className="flex flex-col gap-3 sm:flex-row"
                    initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING_GENTLE, delay: 0.65 }}
                  >
                    {/* Primary: Explore concepts */}
                    <motion.div
                      className="flex-1"
                      whileHover={prefersReduced ? {} : { scale: 1.02 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                      transition={SPRING_BOUNCY}
                    >
                      <Link
                        href="/concepts"
                        onClick={() => markActionPlanCelebrationSeen()}
                        className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        style={{
                          background: ACCENT,
                          color: "#FFFFFF",
                          boxShadow: `0 4px 16px ${ACCENT}44`,
                        }}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Explore more concepts
                      </Link>
                    </motion.div>

                    {/* Secondary: Retake quiz */}
                    <motion.div
                      className="flex-1"
                      whileHover={prefersReduced ? {} : { scale: 1.01 }}
                      whileTap={prefersReduced ? {} : { scale: 0.98 }}
                      transition={SPRING_BOUNCY}
                    >
                      <Link
                        href="/quiz"
                        onClick={() => markActionPlanCelebrationSeen()}
                        className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        style={{
                          background: `${ACCENT}12`,
                          color: ACCENT,
                          border: `1px solid ${ACCENT}30`,
                        }}
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Retake the quiz
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Dismiss X -- appears after lock period */}
                  <AnimatePresence>
                    {dismissable && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
                        aria-label="Dismiss celebration"
                      >
                        <X className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Live region for screen readers */}
                  <div
                    aria-live="assertive"
                    className="sr-only"
                    role="status"
                  >
                    {visible
                      ? `Congratulations! Action plan complete. ${completedCount} actions completed.`
                      : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
