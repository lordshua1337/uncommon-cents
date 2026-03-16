"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getWarmthColor, getWarmthTier, type StreakStatus } from "@/lib/streak-status";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FlameSize = "sm" | "md" | "lg";

interface StreakFlameProps {
  readonly streak: number;
  readonly status?: StreakStatus;
  readonly size?: FlameSize;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_PX: Record<FlameSize, number> = {
  sm: 14,
  md: 20,
  lg: 32,
};

// Glow blur radius in px, by tier (0-6)
const GLOW_BLUR: readonly number[] = [0, 4, 4, 8, 8, 12, 12];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StreakFlame({ streak, status = "active", size = "md" }: StreakFlameProps) {
  const prefersReduced = useReducedMotion();
  const tier = getWarmthTier(streak);
  const color = getWarmthColor(streak);
  const px = SIZE_PX[size];
  const glowBlur = GLOW_BLUR[tier];

  // Frozen/grace state: blue tint at 60% opacity
  const isGrace = status === "grace";
  const isAtRisk = status === "at-risk";
  const isBroken = status === "broken" || status === "dormant";

  // Grace uses the blue section color; broken uses muted; active uses VROOM orange or warmth color
  const resolvedColor = isGrace
    ? "#2C5F7C"
    : isBroken
    ? "#555555"
    : tier === 0
    ? "#E05A1B"
    : color;

  const opacity = isGrace ? 0.6 : isBroken ? 0.5 : 1;

  // Pulse at tier 2+ (7+ day streak) unless reduced motion preferred or special state
  const shouldPulse = !prefersReduced && tier >= 2 && !isGrace && !isBroken;
  const shouldAtRiskPulse = !prefersReduced && isAtRisk;

  return (
    <motion.div
      aria-hidden="true"
      style={{ width: px, height: px, opacity }}
      animate={
        shouldAtRiskPulse
          ? { scale: [1, 1.12, 1] }
          : shouldPulse
          ? { scale: [1, 1.08, 1] }
          : { scale: 1 }
      }
      transition={
        shouldAtRiskPulse
          ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
          : shouldPulse
          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
          : undefined
      }
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glowBlur > 0 && !isBroken
            ? `drop-shadow(0 0 ${glowBlur}px ${resolvedColor})`
            : "none",
        }}
      >
        {/* Custom flame SVG: 2-curve organic shape */}
        <path
          d="M10 22C5.5 22 2 18.5 2 14C2 10 4.5 7 7 5C6.5 8 8 9.5 9 10C9 7 10.5 3 13 1C13.5 4.5 15 6 16 8C17.5 6.5 18 4.5 17.5 2.5C19.5 5 20 8 18.5 11.5C19.5 10 20 9 20 9C20 14 17.5 17.5 15 19.5C15.5 18 15 16 14 15C13.5 17.5 12 20 10 22Z"
          fill={resolvedColor}
        />
        {/* Inner highlight for depth */}
        {tier >= 2 && !isBroken && !isGrace && (
          <path
            d="M10 19C8 19 6.5 17 6.5 15C6.5 13 7.5 11.5 9 11C8.8 12.5 9.5 13.5 10.5 14C10.5 12.5 11 11 12 10C12 11.5 13 12.5 13.5 14C14 13 14 11.5 13.5 10.5C14.5 12 14.5 14 13.5 16C13.5 15 13 14 12 13.5C12 15.5 11.5 17.5 10 19Z"
            fill="rgba(255,255,255,0.25)"
          />
        )}
      </svg>
    </motion.div>
  );
}
