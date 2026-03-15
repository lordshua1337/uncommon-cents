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
      className={`rounded-xl bg-surface border border-border overflow-hidden cursor-default shadow-sm ${className}`}
      initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={cardAnimate}
      transition={cardTransition}
      whileHover={
        prefersReduced
          ? undefined
          : { y: -2, boxShadow: "0 6px 20px rgba(26,122,69,0.1)" }
      }
      whileTap={prefersReduced ? undefined : { scale: 0.99 }}
    >
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #1A7A45, #22C55E)' }} />
      <div className="p-5 text-center">
        <div className="flex items-baseline gap-0.5 justify-center">
          {prefix && (
            <span className="text-xl text-accent font-semibold select-none">
              {prefix}
            </span>
          )}
          <AnimatedCounter
            value={isVisible ? value : 0}
            format="integer"
            className="text-3xl sm:text-4xl font-bold text-accent"
          />
          {suffix && (
            <span className="text-xl text-accent font-semibold select-none">
              {suffix}
            </span>
          )}
        </div>

        <motion.p
          className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={labelTransition}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}
