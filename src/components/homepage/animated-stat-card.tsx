"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { SPRING_GENTLE, STAGGER_FAST } from "@/lib/animation-constants";

export interface AnimatedStatCardProps {
  readonly value: number;
  readonly label: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly index: number;
  readonly className?: string;
}

// Accent colors for each card index (domains, concepts, calculators, free)
const ACCENT_COLORS = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b"] as const;

export function AnimatedStatCard({
  value,
  label,
  prefix,
  suffix,
  index,
  className = "",
}: AnimatedStatCardProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Fall back to immediate trigger if IntersectionObserver is unavailable
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [prefersReduced]);

  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const cardDelay = index * STAGGER_FAST;

  const cardAnimate = isVisible
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 12 };

  const cardTransition = prefersReduced
    ? { duration: 0 }
    : { ...SPRING_GENTLE, delay: cardDelay };

  const labelTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.3, delay: cardDelay + 0.1 };

  return (
    <motion.div
      ref={ref}
      role="listitem"
      aria-label={`${prefix ?? ""}${value}${suffix ?? ""} ${label}`}
      className={`rounded-2xl bg-slate-800/50 border border-slate-700/40 p-5 flex flex-col gap-1 cursor-default ${className}`}
      style={{ borderLeftColor: accentColor, borderLeftWidth: 2 }}
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={cardAnimate}
      transition={cardTransition}
      whileHover={
        prefersReduced
          ? undefined
          : { y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", borderColor: "rgba(148,163,184,0.6)" }
      }
      whileTap={prefersReduced ? undefined : { scale: 0.99 }}
    >
      {/* Number row */}
      <div className="flex items-baseline gap-0.5">
        {prefix && (
          <span className="text-xl text-slate-400 font-semibold select-none">
            {prefix}
          </span>
        )}
        <AnimatedCounter
          value={isVisible ? value : 0}
          format="integer"
          className="text-3xl sm:text-4xl font-bold text-white"
        />
        {suffix && (
          <span className="text-xl text-slate-400 font-semibold select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Label -- fades in 100ms after number starts */}
      <motion.p
        className="text-xs sm:text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={labelTransition}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
