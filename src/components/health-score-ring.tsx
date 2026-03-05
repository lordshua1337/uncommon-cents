"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { HealthScore } from "@/lib/health-score";
import { getScoreGrade } from "@/lib/health-score";

// ---------------------------------------------------------------------------
// Ring Component
// ---------------------------------------------------------------------------

const RING_SIZE = 200;
const STROKE_WIDTH = 14;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
  useEffect(() => setMounted(true), []);

  const scale = size / RING_SIZE;
  const radius = RADIUS;
  const circumference = CIRCUMFERENCE;
  const grade = getScoreGrade(score.total);

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

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-border-light"
        />

        {/* Pillar segments */}
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
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{
                strokeDasharray: `${arc.length} ${circumference - arc.length}`,
              }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          ))}
      </svg>

      {/* Center text */}
      {showGrade && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: grade.color, fontSize: 36 * scale }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score.total}
          </motion.span>
          <motion.span
            className="text-xs text-text-secondary"
            style={{ fontSize: 11 * scale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {grade.label}
          </motion.span>
        </div>
      )}
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
