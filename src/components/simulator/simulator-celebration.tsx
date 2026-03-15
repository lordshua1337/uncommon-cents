"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Calculator, X, Trophy } from "lucide-react";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { SPRING_BOUNCY, SPRING_GENTLE, CONFETTI_COUNTS } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CelebrationVariant = "first-sim" | "all-sims";

interface SimulatorCelebrationProps {
  readonly variant: CelebrationVariant | null;
  readonly scenarioName: string;
  readonly categoryColor: string;
  readonly onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_SIMS_COLOR = "#22C55E";
const AUTO_DISMISS_MS = 3000;

// ---------------------------------------------------------------------------
// Corner ornament (reused from graduation-celebration pattern)
// ---------------------------------------------------------------------------

function CornerOrnament({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const posClass: Record<string, string> = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };

  const transforms: Record<string, string> = {
    tl: "translate(0, 0)",
    tr: "translate(0, 0) scaleX(-1)",
    bl: "translate(0, 0) scaleY(-1)",
    br: "translate(0, 0) scale(-1, -1)",
  };

  return (
    <div className={`absolute ${posClass[position]} w-6 h-6 opacity-35`} aria-hidden="true">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: transforms[position] }}
      >
        <path
          d="M2 30 L2 8 Q2 2 8 2 L30 2"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="5" cy="5" r="2" fill={color} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// First sim card
// ---------------------------------------------------------------------------

function FirstSimCard({
  scenarioName,
  categoryColor,
  onDismiss,
}: {
  scenarioName: string;
  categoryColor: string;
  onDismiss: () => void;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      key="first-sim-card"
      className="relative max-w-sm w-full mx-4"
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={
        prefersReduced
          ? { duration: 0.15 }
          : { ...SPRING_BOUNCY, delay: 0.1 }
      }
    >
      {/* Glow border */}
      <div
        className="rounded-2xl p-[1.5px]"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}60, ${categoryColor}20)`,
          boxShadow: `0 16px 48px ${categoryColor}30, 0 4px 16px rgba(0,0,0,0.2)`,
        }}
      >
        <div
          className="relative rounded-[14px] p-6 overflow-hidden"
          style={{ background: "#FAFAF8" }}
        >
          {/* Calculator icon container */}
          <div className="flex justify-center mb-3">
            <div
              className="relative w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${categoryColor}18`,
                border: `1px solid ${categoryColor}30`,
                boxShadow: `0 0 0 6px ${categoryColor}08`,
              }}
            >
              <motion.div
                animate={
                  prefersReduced
                    ? {}
                    : { rotate: [0, -8, 8, -4, 4, 0] }
                }
                transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Calculator
                  className="w-6 h-6"
                  style={{ color: categoryColor }}
                />
              </motion.div>
            </div>
          </div>

          {/* Overline */}
          <motion.p
            className="text-[10px] uppercase tracking-widest font-semibold text-center"
            style={{ color: categoryColor, fontFamily: "var(--font-mono)" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.35 }}
          >
            First Simulation Complete
          </motion.p>

          {/* Headline */}
          <motion.h2
            className="text-xl font-bold text-center mt-1"
            style={{ color: "#1A1A1A", lineHeight: 1.2 }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.4 }}
          >
            First Simulation Complete!
          </motion.h2>

          {/* Scenario name */}
          <motion.p
            className="text-sm text-center mt-1"
            style={{ color: "#555555" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.45 }}
          >
            {scenarioName}
          </motion.p>

          {/* Divider */}
          <div
            className="w-full h-px my-4"
            style={{ background: `${categoryColor}25` }}
          />

          {/* Body */}
          <motion.p
            className="text-xs text-center leading-relaxed"
            style={{ color: "#888888" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.55 }}
          >
            Most people guess. You calculated.
          </motion.p>

          {/* Auto-dismiss indicator bar */}
          <motion.div
            className="mt-4 h-0.5 rounded-full overflow-hidden"
            style={{ background: `${categoryColor}20` }}
          >
            {!prefersReduced && (
              <motion.div
                className="h-full rounded-full"
                style={{ background: categoryColor }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear", delay: 0.2 }}
              />
            )}
          </motion.div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ "--tw-ring-color": categoryColor } as React.CSSProperties}
            aria-label="Dismiss celebration"
          >
            <X className="w-3.5 h-3.5" style={{ color: "#AAAAAA" }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// All sims card
// ---------------------------------------------------------------------------

function AllSimsCard({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const accentColor = ALL_SIMS_COLOR;

  return (
    <motion.div
      key="all-sims-card"
      className="relative max-w-md w-full mx-4"
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={
        prefersReduced
          ? { duration: 0.15 }
          : { ...SPRING_BOUNCY, delay: 0.1 }
      }
    >
      {/* Outer glow ring */}
      <div
        className="rounded-3xl p-[2px]"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}40)`,
          boxShadow: `0 24px 64px ${accentColor}40, 0 8px 24px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          className="relative rounded-[22px] p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #1C2A1C 0%, #0F1A0F 50%, #0A1410 100%)",
          }}
        >
          {/* Inner accent border */}
          <div
            className="absolute inset-[6px] rounded-2xl pointer-events-none"
            style={{ border: `1px solid ${accentColor}30` }}
          />

          {/* Corner ornaments */}
          <CornerOrnament position="tl" color={accentColor} />
          <CornerOrnament position="tr" color={accentColor} />
          <CornerOrnament position="bl" color={accentColor} />
          <CornerOrnament position="br" color={accentColor} />

          {/* Calculator icon */}
          <div className="flex justify-center mb-4">
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}35`,
                boxShadow: `0 0 0 8px ${accentColor}08, 0 0 32px ${accentColor}25`,
              }}
            >
              <motion.div
                animate={
                  prefersReduced
                    ? {}
                    : { rotate: [0, -8, 8, -4, 4, 0] }
                }
                transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Calculator
                  className="w-8 h-8"
                  style={{
                    color: accentColor,
                    filter: `drop-shadow(0 0 8px ${accentColor}80)`,
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Overline */}
          <motion.p
            className="text-[10px] uppercase tracking-widest font-semibold text-center"
            style={{ color: accentColor, fontFamily: "var(--font-mono)" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.35 }}
          >
            All Simulators Complete
          </motion.p>

          {/* Headline */}
          <motion.h2
            className="text-2xl font-extrabold tracking-tight text-center mt-1 mb-1"
            style={{ color: "#FAFAF8", lineHeight: 1.15 }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.4 }}
          >
            All Simulators Complete!
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            className="text-sm text-center"
            style={{ color: "#86EFAC" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.45 }}
          >
            Six for six.
          </motion.p>

          {/* Divider */}
          <div
            className="w-16 h-px mx-auto my-5"
            style={{ background: `${accentColor}40` }}
          />

          {/* Body */}
          <motion.p
            className="text-xs text-center leading-relaxed"
            style={{ color: "#86EFAC99" }}
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0.55 }}
          >
            {"You've run every scenario. You have a clearer picture of your finances than most people ever get."}
          </motion.p>

          {/* Trophy row */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-5"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReduced ? {} : { ...SPRING_BOUNCY, delay: 0.65 }}
          >
            <Trophy className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
            <span
              className="text-xs font-semibold"
              style={{ color: accentColor, fontFamily: "var(--font-mono)" }}
            >
              6 / 6 scenarios modeled
            </span>
            <Trophy className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
          </motion.div>

          {/* Auto-dismiss bar */}
          <motion.div
            className="mt-5 h-0.5 rounded-full overflow-hidden"
            style={{ background: `${accentColor}20` }}
          >
            {!prefersReduced && (
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear", delay: 0.2 }}
              />
            )}
          </motion.div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-green-400/50"
            aria-label="Dismiss celebration"
          >
            <X className="w-4 h-4" style={{ color: "#6B7280" }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main celebration component
// ---------------------------------------------------------------------------

export function SimulatorCelebration({
  variant,
  scenarioName,
  categoryColor,
  onDismiss,
}: SimulatorCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVisible = variant !== null;
  const isAllSims = variant === "all-sims";
  const accentColor = isAllSims ? ALL_SIMS_COLOR : categoryColor;
  const confettiCount = isAllSims ? CONFETTI_COUNTS.epic : CONFETTI_COUNTS.medium;

  // Auto-dismiss after 3s
  useEffect(() => {
    if (!isVisible) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, onDismiss]);

  // ESC key dismiss
  useEffect(() => {
    if (!isVisible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isVisible, onDismiss]);

  // Backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onDismiss();
    },
    [onDismiss],
  );

  const ariaLabel = isAllSims
    ? "Congratulations -- you've completed all six financial simulations!"
    : "Congratulations on completing your first financial simulation!";

  return (
    <>
      {/* Confetti layer -- full screen, behind overlay card */}
      {!prefersReduced && (
        <LessonConfetti
          visible={isVisible}
          accentColor={accentColor}
          count={confettiCount}
        />
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={`sim-celebration-${variant}`}
            className="fixed inset-0 z-[500] flex items-center justify-center"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="assertive"
            aria-label={ariaLabel}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={
                isAllSims
                  ? {
                      background:
                        "radial-gradient(ellipse at center, rgba(22,163,74,0.22) 0%, rgba(15,23,42,0.95) 60%)",
                    }
                  : {
                      background: "rgba(15,23,42,0.72)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                    }
              }
            />

            {/* Card */}
            {isAllSims ? (
              <AllSimsCard onDismiss={onDismiss} />
            ) : (
              <FirstSimCard
                scenarioName={scenarioName}
                categoryColor={categoryColor}
                onDismiss={onDismiss}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
