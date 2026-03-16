"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Particle {
  id: number;
  x: number; // start x % from left
  delay: number;
  duration: number;
  rotateStart: number;
  rotateEnd: number;
  xDrift: number;
  shape: "rect" | "square" | "circle";
  colorIndex: number;
}

interface LessonConfettiProps {
  visible: boolean;
  accentColor: string;
  count?: number;
  onDone?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function buildParticles(accentColor: string, count: number, seed: number): Particle[] {
  const rand = seededRandom(seed);
  const shapes: Particle["shape"][] = ["rect", "square", "circle"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    delay: rand() * 0.3,
    duration: 1.8 + rand() * 0.8,
    rotateStart: rand() * 360 - 180,
    rotateEnd: rand() * 360 - 180,
    xDrift: rand() * 160 - 80,
    shape: shapes[Math.floor(rand() * shapes.length)],
    colorIndex: Math.floor(rand() * 4),
  }));
}

function getParticleColor(
  index: number,
  accentColor: string,
): string {
  const palette = [accentColor, "#1E3F2E", "#C4A67A", "#F5EDE0"];
  return palette[index % palette.length];
}

function getParticleClass(shape: Particle["shape"]): string {
  switch (shape) {
    case "rect":
      return "w-2.5 h-[5px]";
    case "square":
      return "w-2 h-2";
    case "circle":
      return "w-2 h-2 rounded-full";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonConfetti({
  visible,
  accentColor,
  count = 24,
  onDone,
}: LessonConfettiProps) {
  const prefersReduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use a stable seed so particles don't shift on re-render
  const seed = 12345;
  const particles = buildParticles(accentColor, count, seed);

  useEffect(() => {
    if (!visible) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDone?.();
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onDone]);

  // Skip all animation if user prefers reduced motion
  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lesson-confetti"
          className="fixed inset-0 pointer-events-none z-[200] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-sm ${getParticleClass(p.shape)}`}
              style={{
                left: `${p.x}%`,
                top: "0%",
                backgroundColor: getParticleColor(p.colorIndex, accentColor),
              }}
              initial={{
                opacity: 0,
                y: 0,
                x: 0,
                rotate: p.rotateStart,
                scale: 1,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -80, -140, 80],
                x: [0, p.xDrift * 0.4, p.xDrift, p.xDrift * 1.2],
                rotate: [p.rotateStart, p.rotateEnd],
                scale: [1, 1, 0.8, 0.4],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
