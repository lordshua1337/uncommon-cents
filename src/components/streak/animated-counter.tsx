"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// AnimatedCounter
// Uses Framer Motion spring to count from 0 (or previous value) to target.
// Renders a motion.span with tabular-nums font-mono for stable layout.
//
// format options:
//   "integer"  -- rounds to integer (default)
//   "currency" -- rounds to integer, adds comma separators
//   "percent"  -- 1 decimal place (use `decimals` to override)
//   "decimal"  -- fixed decimal places
// ---------------------------------------------------------------------------

type CounterFormat = "integer" | "currency" | "percent" | "decimal";

function applyFormat(v: number, format: CounterFormat, decimals: number): string {
  switch (format) {
    case "currency":
      return Math.round(Math.max(0, v)).toLocaleString();
    case "percent":
      return Math.max(0, v).toFixed(decimals);
    case "decimal":
      return Math.max(0, v).toFixed(decimals);
    case "integer":
    default:
      return Math.round(Math.max(0, v)).toString();
  }
}

interface AnimatedCounterProps {
  readonly value: number;
  readonly format?: CounterFormat;
  readonly decimals?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly "aria-hidden"?: boolean | "true" | "false";
}

export function AnimatedCounter({
  value,
  format = "integer",
  decimals = 1,
  className,
  style,
  "aria-hidden": ariaHidden,
}: AnimatedCounterProps) {
  const prefersReduced = useReducedMotion();

  const spring = useSpring(0, { stiffness: 200, damping: 25 });
  const display = useTransform(spring, (v) => applyFormat(v, format, decimals));

  useEffect(() => {
    spring.set(isFinite(value) ? value : 0);
  }, [value, spring]);

  if (prefersReduced) {
    return (
      <span
        className={`font-mono tabular-nums ${className ?? ""}`}
        style={style}
        aria-hidden={ariaHidden}
      >
        {applyFormat(isFinite(value) ? value : 0, format, decimals)}
      </span>
    );
  }

  return (
    <motion.span
      className={`font-mono tabular-nums ${className ?? ""}`}
      style={style}
      aria-hidden={ariaHidden}
    >
      {display}
    </motion.span>
  );
}
