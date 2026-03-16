"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { SPRING_SNAPPY } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// ScoreTrend
// Shows an animated trend arrow and delta counter inline with the score.
// Handles up/down/neutral directions with appropriate color and icon.
// ---------------------------------------------------------------------------

interface ScoreTrendProps {
  readonly delta: number;
  readonly className?: string;
}

const UP_COLOR = "#1E3F2E";
const DOWN_COLOR = "#DC2626";
const NEUTRAL_COLOR = "#9CA3AF";

type Direction = "up" | "down" | "neutral";

function getDirection(delta: number): Direction {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

function getColor(direction: Direction): string {
  if (direction === "up") return UP_COLOR;
  if (direction === "down") return DOWN_COLOR;
  return NEUTRAL_COLOR;
}

export function ScoreTrend({ delta, className }: ScoreTrendProps) {
  const prefersReduced = useReducedMotion();
  const direction = getDirection(delta);
  const color = getColor(direction);

  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  const iconStyle = {
    color,
    filter: `drop-shadow(0 0 4px ${color}60)`,
  };

  // Reduced motion: static icon and static number, no animations
  if (prefersReduced) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${className ?? ""}`}
        style={{ backgroundColor: `${color}14` }}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" style={iconStyle} />
        {direction !== "neutral" && (
          <span className="text-xs font-mono tabular-nums" style={{ color }}>
            {direction === "up" ? "+" : "-"}
            {Math.abs(delta)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${className ?? ""}`}
      style={{ backgroundColor: `${color}14` }}
    >
      {/* Arrow entrance with optional float for up direction */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={
          direction === "up"
            ? { scale: 1, opacity: 1, y: [0, -2, 0] }
            : { scale: 1, opacity: 1 }
        }
        transition={
          direction === "up"
            ? {
                scale: { ...SPRING_SNAPPY, delay: 0.5 },
                opacity: { duration: 0.2, delay: 0.5 },
                y: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.8,
                },
              }
            : { ...SPRING_SNAPPY, delay: 0.5 }
        }
        style={{ display: "flex", alignItems: "center" }}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" style={iconStyle} />
      </motion.div>

      {/* Delta number with sign prefix -- hidden for neutral */}
      {direction !== "neutral" && (
        <motion.span
          className="text-xs font-mono tabular-nums"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          {direction === "up" ? "+" : "-"}
          <AnimatedCounter value={Math.abs(delta)} format="integer" />
        </motion.span>
      )}
    </span>
  );
}
