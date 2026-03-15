"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// AnimatedCounter
// Uses Framer Motion spring to count from 0 (or previous value) to target.
// Renders a motion.span with tabular-nums font-mono for stable layout.
// ---------------------------------------------------------------------------

interface AnimatedCounterProps {
  readonly value: number;
  readonly className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const prefersReduced = useReducedMotion();

  const spring = useSpring(0, { stiffness: 400, damping: 25 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  if (prefersReduced) {
    return (
      <span className={`font-mono tabular-nums ${className ?? ""}`}>
        {value}
      </span>
    );
  }

  return (
    <motion.span
      className={`font-mono tabular-nums ${className ?? ""}`}
    >
      {display}
    </motion.span>
  );
}
