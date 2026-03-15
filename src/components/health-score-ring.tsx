"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { SPRING_GENTLE } from "@/lib/animation-constants";
import type { HealthScore } from "@/lib/health-score";
import { getScoreGrade } from "@/lib/health-score";

// ---------------------------------------------------------------------------
// Ring constants
// ---------------------------------------------------------------------------

const RING_SIZE = 200;
const STROKE_WIDTH = 14;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ---------------------------------------------------------------------------
// Grade color utility (exported for use in score/page.tsx)
// ---------------------------------------------------------------------------

export function getGradeColor(score: number): string {
  return getScoreGrade(score).color;
}

// ---------------------------------------------------------------------------
// Ring Component
// ---------------------------------------------------------------------------

interface HealthScoreRingProps {
  readonly score: HealthScore;
  readonly size?: number;
  readonly showGrade?: boolean;
}

export function HealthScoreRing({
  score,
  size = RING_SIZE,
  showGrade = true,
}: HealthScoreRingProps) {
  const [mounted, setMounted] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (glowTimer.current) clearTimeout(glowTimer.current);
    };
  }, []);

  // Fire the glow pulse once the ring animation completes (~1.2s)
  useEffect(() => {
    if (!mounted) return;
    if (score.total === 0) return; // no glow for empty ring

    const delay = prefersReduced ? 0 : 1300;
    glowTimer.current = setTimeout(() => {
      setGlowActive(true);
      // Remove glow after one cycle
      setTimeout(() => setGlowActive(false), 800);
    }, delay);

    return () => {
      if (glowTimer.current) clearTimeout(glowTimer.current);
    };
  }, [mounted, score.total, prefersReduced]);

  const scale = size / RING_SIZE;
  const radius = RADIUS;
  const circumference = CIRCUMFERENCE;
  const grade = getScoreGrade(score.total);
  const gradeColor = grade.color;

  // Build segmented ring -- each pillar gets a proportional arc
  const segments = score.pillars.map((pillar) => {
    const segmentLength = (pillar.score / 100) * pillar.weight * circumference;
    return {
      id: pillar.id,
      color: pillar.color,
      length: segmentLength,
      gap: circumference * pillar.weight - segmentLength,
    };
  });

  // Calculate offsets for each segment
  let offset = 0;
  const arcs = segments.map((seg) => {
    const currentOffset = offset;
    offset += seg.length + seg.gap;
    return { ...seg, offset: currentOffset };
  });

  // Transition config: instant for reduced motion, spring + 1.2s duration otherwise
  const arcTransition = prefersReduced
    ? { duration: 0 }
    : { ...SPRING_GENTLE, duration: 1.2 };

  // Grade letter animation
  const gradeLetterVariants = {
    initial: { opacity: 0, scale: 0.8 as number },
    animate: {
      opacity: 1,
      scale: 1 as number,
      transition: prefersReduced
        ? { duration: 0 }
        : { ...SPRING_GENTLE, delay: 0.9 },
    },
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`Financial health score ring showing ${score.total}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background track -- tinted to grade color for depth */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          fill="none"
          stroke={gradeColor + "18"}
          strokeWidth={STROKE_WIDTH}
        />

        {/* Pillar segments -- animated from empty to full */}
        {mounted &&
          arcs.map((arc) => (
            <motion.circle
              key={arc.id}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
              initial={
                prefersReduced
                  ? undefined
                  : { strokeDasharray: `0 ${circumference}` }
              }
              animate={{
                strokeDasharray: `${arc.length} ${circumference - arc.length}`,
              }}
              transition={arcTransition}
            />
          ))}

        {/* Glow pulse layer -- a blurred sibling circle that pulses once on completion */}
        {mounted && score.total > 0 && (
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={radius}
            fill="none"
            stroke={gradeColor}
            strokeWidth={6}
            strokeDasharray={`${(score.total / 100) * circumference} ${circumference}`}
            animate={
              glowActive
                ? { opacity: [0, 0.55, 0] }
                : { opacity: 0 }
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ filter: "blur(6px)" }}
            aria-hidden="true"
          />
        )}
      </svg>

      {/* Center text */}
      {showGrade && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          {/* Subtle backing circle to separate numbers from ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: size * 0.58,
              height: size * 0.58,
              background: "var(--color-surface, rgba(255,255,255,0.5))",
              opacity: 0.5,
            }}
          />

          {/* Score number -- AnimatedCounter counts 0 to score */}
          <div className="relative flex flex-col items-center">
            <AnimatedCounter
              value={score.total}
              className="font-bold tabular-nums"
              style={{
                color: gradeColor,
                fontSize: 36 * scale,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            />

            {/* Grade letter -- fades in after counter (~0.9s) */}
            <motion.span
              className="font-bold tracking-tight"
              style={{ color: gradeColor, fontSize: 11 * scale }}
              variants={gradeLetterVariants}
              initial="initial"
              animate="animate"
            >
              {grade.grade}
            </motion.span>
          </div>
        </div>
      )}

      {/* Screen reader announcement -- hidden from visual rendering */}
      <span className="sr-only">
        Financial health score: {score.total} out of 100. Grade: {grade.grade}.
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pillar Bar (horizontal detail bar for each pillar)
// ---------------------------------------------------------------------------

interface PillarBarProps {
  readonly label: string;
  readonly score: number;
  readonly color: string;
  readonly weight: number;
}

export function PillarBar({ label, score, color, weight }: PillarBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-mono" style={{ color }}>
            {score}
          </span>
        </div>
        <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      <span className="text-[10px] text-text-muted w-8 text-right shrink-0">
        {Math.round(weight * 100)}%
      </span>
    </div>
  );
}
