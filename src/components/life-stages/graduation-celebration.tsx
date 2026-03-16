"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  ArrowRight,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import type { LifeStage, StageLesson } from "@/lib/life-stages/types";
import { lifeStages } from "@/lib/life-stages/stages";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GraduationCelebrationProps {
  visible: boolean;
  stage: LifeStage;
  completedLessons: readonly string[];
  totalXpEarned: number;
  onDismiss: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotateStart: number;
  rotateEnd: number;
  xDrift: number;
  shape: "rect" | "square" | "circle";
  colorIndex: number;
  size: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONFETTI_COUNT = 80;
const CELEBRATION_LOCK_MS = 2000; // dismiss not available for 2s
const GRAD_STORAGE_KEY = "uncommon-cents-grad-seen";

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

function buildConfetti(count: number, seed: number): ConfettiParticle[] {
  const rand = seededRandom(seed);
  const shapes: ConfettiParticle["shape"][] = ["rect", "square", "circle"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    delay: rand() * 0.8,
    duration: 2.8 + rand() * 1.2,
    rotateStart: rand() * 360 - 180,
    rotateEnd: rand() * 360 - 180,
    xDrift: rand() * 200 - 100,
    shape: shapes[Math.floor(rand() * shapes.length)],
    colorIndex: Math.floor(rand() * 4),
    size: Math.floor(rand() * 3) + 1, // 1-3
  }));
}

function getParticleColor(index: number, accentColor: string): string {
  const palette = [accentColor, "#1E3F2E", "#C4A67A", "#F5EDE0"];
  return palette[index % palette.length];
}

function getParticleStyle(
  p: ConfettiParticle,
): { width: string; height: string; borderRadius?: string } {
  const base = (p.size + 1) * 4;
  switch (p.shape) {
    case "rect":
      return { width: `${base + 4}px`, height: `${base / 2}px` };
    case "square":
      return { width: `${base}px`, height: `${base}px` };
    case "circle":
      return {
        width: `${base}px`,
        height: `${base}px`,
        borderRadius: "50%",
      };
  }
}

function getNextStage(currentStage: LifeStage): LifeStage | null {
  const idx = lifeStages.findIndex((s) => s.id === currentStage.id);
  if (idx >= 0 && idx < lifeStages.length - 1) {
    return lifeStages[idx + 1];
  }
  return null;
}

function formatCompletionDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function hasGradBeenSeen(stageId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(GRAD_STORAGE_KEY);
    if (!raw) return false;
    const seen = JSON.parse(raw) as string[];
    return seen.includes(stageId);
  } catch {
    return false;
  }
}

function markGradSeen(stageId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(GRAD_STORAGE_KEY);
    const seen: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!seen.includes(stageId)) {
      localStorage.setItem(GRAD_STORAGE_KEY, JSON.stringify([...seen, stageId]));
    }
  } catch {
    // Storage full -- ignore
  }
}

function isAllStagesComplete(graduatedStages: readonly string[]): boolean {
  return lifeStages.every((s) => graduatedStages.includes(s.id));
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CornerOrnament({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const transforms: Record<string, string> = {
    tl: "translate(0, 0)",
    tr: "translate(0, 0) scaleX(-1)",
    bl: "translate(0, 0) scaleY(-1)",
    br: "translate(0, 0) scale(-1, -1)",
  };

  const posClass: Record<string, string> = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };

  return (
    <div className={`absolute ${posClass[position]} w-8 h-8 opacity-40`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: transforms[position] }}
      >
        <path
          d="M2 30 L2 8 Q2 2 8 2 L30 2"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="5" cy="5" r="2" fill={color} />
      </svg>
    </div>
  );
}

function LessonCheckRow({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <CheckCircle2
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: "#1E3F2E" }}
      />
      <span
        className="text-xs leading-snug truncate"
        style={{ color: "#4B5563", fontFamily: "var(--font-sans)" }}
      >
        {title}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function GraduationCelebration({
  visible,
  stage,
  completedLessons,
  totalXpEarned,
  onDismiss,
}: GraduationCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const [dismissable, setDismissable] = useState(false);
  const [fireConfetti, setFireConfetti] = useState(false);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextStage = getNextStage(stage);
  const completionDate = formatCompletionDate(new Date().toISOString());
  const completedLessonDefs = stage.lessons.filter((l) =>
    completedLessons.includes(l.id),
  );

  const particles = buildConfetti(CONFETTI_COUNT, parseInt(stage.id.replace(/\D/g, ""), 10) * 99 + 1);

  const handleDismiss = useCallback(() => {
    if (!dismissable) return;
    markGradSeen(stage.id);
    onDismiss();
  }, [dismissable, stage.id, onDismiss]);

  // Keyboard dismiss
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) handleDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, dismissable, handleDismiss]);

  // Lock timer + confetti trigger
  useEffect(() => {
    if (!visible) {
      setDismissable(false);
      setFireConfetti(false);
      return;
    }

    // Fire confetti 300ms after mount
    confettiRef.current = setTimeout(() => setFireConfetti(true), 300);

    // Allow dismiss after 2s
    lockRef.current = setTimeout(() => setDismissable(true), CELEBRATION_LOCK_MS);

    return () => {
      if (lockRef.current) clearTimeout(lockRef.current);
      if (confettiRef.current) clearTimeout(confettiRef.current);
    };
  }, [visible]);

  // Backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && dismissable) handleDismiss();
    },
    [dismissable, handleDismiss],
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="graduation-celebration"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${stage.title} graduation ceremony`}
        >
          {/* Radial color burst background */}
          {!prefersReduced && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{
                background: `radial-gradient(circle at 50% 50%, ${stage.accentColor}00 0%, transparent 100%)`,
              }}
              animate={{
                background: [
                  `radial-gradient(circle at 50% 50%, ${stage.accentColor}CC 0%, ${stage.accentColor}66 20%, ${stage.accentColor}11 60%, transparent 100%)`,
                  `radial-gradient(circle at 50% 50%, ${stage.accentColor}12 0%, #0F111766 60%, #0F1117CC 100%)`,
                ],
              }}
              transition={{ duration: 0.8, ease: "easeOut", times: [0, 1] }}
            />
          )}

          {/* Static dark overlay for reduced-motion */}
          {prefersReduced && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(15,17,23,0.88)" }}
            />
          )}

          {/* Confetti particles */}
          {!prefersReduced && fireConfetti && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: "-2%",
                    backgroundColor: getParticleColor(p.colorIndex, stage.accentColor),
                    ...getParticleStyle(p),
                  }}
                  initial={{
                    opacity: 0,
                    y: 0,
                    x: 0,
                    rotate: p.rotateStart,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: ["0%", "30vh", "70vh", "110vh"],
                    x: [0, p.xDrift * 0.3, p.xDrift, p.xDrift * 0.8],
                    rotate: [p.rotateStart, p.rotateEnd],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          )}

          {/* Certificate card */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={
              prefersReduced
                ? { duration: 0.2 }
                : {
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    delay: 0.1,
                  }
            }
          >
            {/* Outer border ring */}
            <div
              className="rounded-3xl p-[2px]"
              style={{
                background: `linear-gradient(135deg, ${stage.accentColor}, ${stage.accentColor}40)`,
                boxShadow: `0 24px 64px ${stage.accentColor}40, 0 8px 24px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Inner card */}
              <div
                className="relative rounded-[22px] p-8 overflow-hidden"
                style={{ background: "#FAFAF8" }}
              >
                {/* Inner accent border */}
                <div
                  className="absolute inset-[6px] rounded-2xl pointer-events-none"
                  style={{ border: `1px solid ${stage.accentColor}40` }}
                />

                {/* Corner ornaments */}
                <CornerOrnament position="tl" color={stage.accentColor} />
                <CornerOrnament position="tr" color={stage.accentColor} />
                <CornerOrnament position="bl" color={stage.accentColor} />
                <CornerOrnament position="br" color={stage.accentColor} />

                {/* Header */}
                <div className="text-center mb-6">
                  {/* Glow circle + trophy */}
                  <div
                    className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4"
                    style={{
                      background: `${stage.accentColor}18`,
                      boxShadow: `0 0 0 8px ${stage.accentColor}08`,
                    }}
                  >
                    <motion.div
                      animate={!prefersReduced ? { rotate: [0, -8, 8, -4, 4, 0] } : {}}
                      transition={{ delay: 0.6, duration: 0.5, ease: "easeInOut" }}
                    >
                      <Trophy
                        className="w-10 h-10"
                        style={{ color: stage.accentColor }}
                      />
                    </motion.div>
                  </div>

                  {/* Overline */}
                  <p
                    className="text-[10px] uppercase tracking-widest font-medium"
                    style={{
                      color: stage.accentColor,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Path Complete
                  </p>

                  {/* Stage name — the hero */}
                  <h1
                    className="text-3xl font-extrabold tracking-tight mt-1 mb-1"
                    style={{ color: "#1A1A1A", fontFamily: "var(--font-sans)", lineHeight: 1.15 }}
                  >
                    {stage.title}
                  </h1>

                  {/* Divider */}
                  <div
                    className="w-full h-px my-3"
                    style={{ background: `${stage.accentColor}30` }}
                  />

                  {/* Date + stats */}
                  <div className="flex items-center justify-between text-center gap-4">
                    <div className="flex-1">
                      <p
                        className="text-xs"
                        style={{
                          color: "#9CA3AF",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {completionDate}
                      </p>
                    </div>
                    <div
                      className="w-px h-6"
                      style={{ background: `${stage.accentColor}30` }}
                    />
                    <div className="flex-1">
                      <p
                        className="text-2xl font-bold tabular-nums"
                        style={{
                          color: stage.accentColor,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        +{totalXpEarned}
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#9CA3AF" }}
                      >
                        XP Earned
                      </p>
                    </div>
                    <div
                      className="w-px h-6"
                      style={{ background: `${stage.accentColor}30` }}
                    />
                    <div className="flex-1">
                      <p
                        className="text-2xl font-bold tabular-nums"
                        style={{
                          color: stage.accentColor,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {completedLessonDefs.length}
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#9CA3AF" }}
                      >
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lessons recap — compact, max 5 shown */}
                {completedLessonDefs.length > 0 && (
                  <div
                    className="rounded-xl p-3 mb-5"
                    style={{
                      background: `${stage.accentColor}08`,
                      border: `1px solid ${stage.accentColor}20`,
                    }}
                  >
                    {completedLessonDefs.slice(0, 5).map((l) => (
                      <LessonCheckRow key={l.id} title={l.title} />
                    ))}
                    {completedLessonDefs.length > 5 && (
                      <p
                        className="text-[10px] mt-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        +{completedLessonDefs.length - 5} more lessons completed
                      </p>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-2.5">
                  {nextStage ? (
                    <Link
                      href={`/paths/${nextStage.slug}`}
                      onClick={() => markGradSeen(stage.id)}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{
                        background: stage.accentColor,
                        color: "#FFFFFF",
                        boxShadow: `0 4px 16px ${stage.accentColor}44`,
                      }}
                    >
                      Continue to {nextStage.title}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/paths"
                      onClick={() => markGradSeen(stage.id)}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{
                        background: stage.accentColor,
                        color: "#FFFFFF",
                        boxShadow: `0 4px 16px ${stage.accentColor}44`,
                      }}
                    >
                      All Paths Complete — View Journey
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    href="/paths"
                    onClick={() => markGradSeen(stage.id)}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{
                      background: `${stage.accentColor}12`,
                      color: stage.accentColor,
                      border: `1px solid ${stage.accentColor}30`,
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Back to Journey Map
                  </Link>
                </div>

                {/* Dismiss X — appears after lock */}
                <AnimatePresence>
                  {dismissable && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleDismiss}
                      className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
                      aria-label="Dismiss celebration"
                    >
                      <X className="w-4 h-4" style={{ color: "#888888" }} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { hasGradBeenSeen, markGradSeen, isAllStagesComplete };
