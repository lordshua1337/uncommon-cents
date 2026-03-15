"use client";

import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SPRING_GENTLE, STAGGER_FAST } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// AnimatedBarChart
//
// Renders a comparison bar chart for two options (A vs B) with animated
// bar growth from 0 to final height using spring physics.
// Bars grow from the bottom baseline, staggered left-to-right.
// Each bar's color uses the scenario accent color with an opacity ramp
// (first bar = 60% opacity, second bar = 100%) to signal "better" visually.
// ---------------------------------------------------------------------------

export interface BarChartBar {
  readonly label: string;
  readonly value: number;
  readonly sublabel?: string;
  readonly isWinner?: boolean;
}

interface AnimatedBarChartProps {
  readonly bars: readonly BarChartBar[];
  readonly accentColor?: string;
  readonly animate?: boolean;
  readonly className?: string;
  readonly formatValue?: (value: number) => string;
  readonly ariaLabel?: string;
}

const MAX_BAR_HEIGHT = 120; // px

function formatDefault(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

interface TooltipProps {
  readonly label: string;
  readonly value: number;
  readonly formatValue: (v: number) => string;
}

function BarTooltip({ label, value, formatValue }: TooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
    >
      <div
        className="rounded-lg px-3 py-2 whitespace-nowrap"
        style={{
          background: "#FFFDF8",
          border: "1px solid #E8E4DB",
          boxShadow: "0 4px 16px rgba(15,23,42,0.10)",
        }}
      >
        <p
          className="text-[10px] uppercase"
          style={{ color: "#5C6A7A", letterSpacing: "0.06em" }}
        >
          {label}
        </p>
        <p
          className="text-sm"
          style={{
            color: "#0F172A",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
          }}
        >
          {formatValue(value)}
        </p>
      </div>
      {/* Tooltip arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"
        style={{ borderTopColor: "#E8E4DB" }}
      />
    </motion.div>
  );
}

export function AnimatedBarChart({
  bars,
  accentColor = "#16A34A",
  animate = true,
  className = "",
  formatValue = formatDefault,
  ariaLabel,
}: AnimatedBarChartProps) {
  const prefersReduced = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldAnimate = animate && !prefersReduced;

  const maxValue = Math.max(...bars.map((b) => Math.abs(b.value)), 1);

  if (bars.length === 0) {
    return (
      <div
        className={`rounded-xl p-4 ${className}`}
        style={{
          background: "rgba(255,253,248,0.6)",
          border: "1px solid #E8E4DB",
          borderRadius: "0.75rem",
        }}
        role="img"
        aria-label="No chart data available"
      >
        <p className="text-xs text-center py-8" style={{ color: "#5C6A7A" }}>No data</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay: 0.6 }}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: "rgba(255,253,248,0.6)",
        border: "1px solid #E8E4DB",
        borderRadius: "0.75rem",
        padding: "1rem",
      }}
      role="img"
      aria-label={ariaLabel ?? "Bar chart comparing options"}
    >
      {/* Aria live region for animation state */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {shouldAnimate ? "Loading chart..." : "Chart loaded"}
      </div>

      <div className="flex items-end justify-around gap-2" style={{ height: `${MAX_BAR_HEIGHT + 40}px` }}>
        {bars.map((bar, index) => {
          const barHeightPx = Math.max(4, (Math.abs(bar.value) / maxValue) * MAX_BAR_HEIGHT);
          const opacityRamp = bars.length > 1
            ? 0.5 + (index / (bars.length - 1)) * 0.5
            : 1;
          const isHovered = hoveredIndex === index;
          const isSibling = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center gap-1 flex-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${bar.label}: ${formatValue(bar.value)}`}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <BarTooltip
                    label={bar.label}
                    value={bar.value}
                    formatValue={formatValue}
                  />
                )}
              </AnimatePresence>

              {/* Winner badge */}
              {bar.isWinner && (
                <span
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded"
                  style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                >
                  BEST
                </span>
              )}

              {/* Bar track */}
              <div
                className="relative w-full flex-1 flex items-end rounded-t-sm"
                style={{ background: `${accentColor}08` }}
              >
                {/* Animated bar fill -- scaleY from 0->1 with transformOrigin bottom */}
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{
                    backgroundColor: accentColor,
                    height: barHeightPx,
                    transformOrigin: "bottom",
                  }}
                  initial={shouldAnimate ? { scaleY: 0, opacity: opacityRamp } : { scaleY: 1, opacity: opacityRamp }}
                  animate={{
                    scaleY: 1,
                    opacity: isSibling ? 0.35 : opacityRamp,
                  }}
                  transition={{
                    scaleY: { ...SPRING_GENTLE, delay: shouldAnimate ? index * STAGGER_FAST + 0.7 : 0 },
                    opacity: { duration: 0.15 },
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="text-[10px] text-center leading-tight mt-1 max-w-full truncate px-1"
                style={{ color: "#5C6A7A" }}
              >
                {bar.sublabel ?? bar.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Value labels below chart */}
      <div className="flex justify-around gap-2 mt-1">
        {bars.map((bar, index) => (
          <p
            key={index}
            className="flex-1 text-center text-[11px] font-semibold"
            style={{ fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums", color: accentColor }}
          >
            {formatValue(bar.value)}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
