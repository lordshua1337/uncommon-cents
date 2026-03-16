"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { SPRING_GENTLE } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// ActionProgressBar
// Spring-animated progress bar with color-coded stages, animated counters,
// and a shimmer effect at 100% completion. Respects prefers-reduced-motion.
// ---------------------------------------------------------------------------

interface ActionProgressBarProps {
  readonly completed: number;
  readonly total: number;
  readonly className?: string;
}

// ---------------------------------------------------------------------------
// Color stage helpers
// ---------------------------------------------------------------------------

function getStageColor(percent: number): string {
  if (percent >= 75) return "#1E3F2E";
  if (percent >= 50) return "#2C5F7C";
  if (percent >= 25) return "#C4A67A";
  return "#E05A1B";
}

function getStageGradient(percent: number): string {
  if (percent >= 75)
    return "linear-gradient(90deg, #1E3F2E 0%, #2C5F7C 100%)";
  if (percent >= 50)
    return "linear-gradient(90deg, #2C5F7C 0%, #4A7F9C 100%)";
  if (percent >= 25)
    return "linear-gradient(90deg, #C4A67A 0%, #D4B68A 100%)";
  return "linear-gradient(90deg, #E05A1B 0%, #F07040 100%)";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActionProgressBar({
  completed,
  total,
  className = "",
}: ActionProgressBarProps) {
  const prefersReduced = useReducedMotion();

  const safeCompleted = Math.max(0, Math.floor(completed));
  const safeTotal = Math.max(0, total);
  const percent =
    safeTotal > 0 ? Math.min(100, Math.round((safeCompleted / safeTotal) * 100)) : 0;

  const isComplete = percent === 100;
  const stageColor = getStageColor(percent);
  const stageGradient = getStageGradient(percent);

  // Shimmer fires after fill animation completes at 100%
  const [shimmerActive, setShimmerActive] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    if (isComplete) {
      setShimmerActive(true);
    }
  }, [isComplete]);

  // Aria label text
  const ariaLabel = isComplete
    ? `Action plan fully complete`
    : `Action plan progress: ${percent} percent complete`;

  // ---------------------------------------------------------------------------
  // Reduced motion render
  // ---------------------------------------------------------------------------

  if (prefersReduced) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Label row */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#1A1A1A]">Your Progress</p>
          <div className="flex items-center gap-1.5">
            {isComplete && (
              <CheckCircle className="w-4 h-4 text-[#1E3F2E] shrink-0" />
            )}
            <span
              className="text-2xl font-bold font-mono tabular-nums"
              style={{ color: stageColor }}
            >
              {percent}%
            </span>
          </div>
        </div>

        {/* Track */}
        <div
          className="w-full h-2 md:h-3 rounded-full overflow-hidden relative"
          style={{
            background: "rgba(0,0,0,0.06)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
          }}
          role="progressbar"
          aria-valuenow={safeCompleted}
          aria-valuemin={0}
          aria-valuemax={safeTotal}
          aria-label={ariaLabel}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: stageGradient,
              boxShadow: `0 0 8px ${stageColor}66`,
            }}
          />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-[#64748b] font-mono tabular-nums">
            {safeCompleted} of {safeTotal} complete
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full animated render
  // ---------------------------------------------------------------------------

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#1A1A1A]">Your Progress</p>
        <div className="flex items-center gap-1.5">
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING_GENTLE, delay: 0.6 }}
            >
              <CheckCircle className="w-4 h-4 text-[#1E3F2E] shrink-0" />
            </motion.div>
          )}
          <span
            className="text-2xl font-bold font-mono tabular-nums"
            style={{ color: stageColor }}
          >
            <AnimatedCounter value={percent} />%
          </span>
        </div>
      </div>

      {/* Track */}
      <div
        className="w-full h-2 md:h-3 rounded-full overflow-hidden relative"
        style={{
          background: "rgba(0,0,0,0.06)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
        }}
        role="progressbar"
        aria-valuenow={safeCompleted}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-label={ariaLabel}
      >
        {/* Fill */}
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{ ...SPRING_GENTLE, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
          style={{
            background: stageGradient,
            boxShadow: `0 0 8px ${stageColor}66`,
          }}
        >
          {/* Shimmer overlay -- child div so Framer Motion only controls width on parent */}
          {shimmerActive && (
            <div
              className="action-shimmer-overlay"
              aria-hidden="true"
            />
          )}
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-[#64748b] font-mono tabular-nums">
          <AnimatedCounter value={safeCompleted} /> of {safeTotal} complete
        </p>
      </div>
    </div>
  );
}
