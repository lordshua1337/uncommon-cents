"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import {
  SPRING_BOUNCY,
  CONFETTI_COUNTS,
} from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizCompletionCelebrationProps {
  readonly visible: boolean;
  readonly dominantScriptName: string;
  readonly dominantScriptColor: string;
  readonly onReveal: () => void;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.4, delay: 0.1 } },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.88, y: 24 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_BOUNCY, delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
};

const trophyVariants = {
  animate: {
    rotate: [0, -8, 8, -4, 4, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, delay: 0.6, ease: "easeInOut" as const },
  },
};

const ctaVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 1.5 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizCompletionCelebration({
  visible,
  dominantScriptName,
  dominantScriptColor,
  onReveal,
}: QuizCompletionCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"celebrating" | "done">("celebrating");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("done");
    onReveal();
  }, [onReveal]);

  useEffect(() => {
    if (!visible) return;

    // Reset phase on each new visibility
    setPhase("celebrating");

    if (prefersReduced) {
      // Reduced motion: auto-dismiss faster, no overlay animation
      timerRef.current = setTimeout(() => {
        setPhase("done");
        onReveal();
      }, 1500);
    } else {
      timerRef.current = setTimeout(() => {
        setPhase("done");
        onReveal();
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, prefersReduced, onReveal]);

  const isCelebrating = visible && phase === "celebrating";

  // Character array for typewriter reveal
  const characters = dominantScriptName.split("");

  // Radial gradient background using script color
  const overlayBackground = `radial-gradient(circle at 50% 50%, ${dominantScriptColor}CC 0%, ${dominantScriptColor}66 20%, ${dominantScriptColor}11 60%, transparent 100%)`;

  return (
    <>
      {/* Confetti layer -- aria-hidden, above everything else */}
      <LessonConfetti
        visible={isCelebrating}
        accentColor={dominantScriptColor}
        count={CONFETTI_COUNTS.major}
      />

      {/* Celebration overlay */}
      <AnimatePresence>
        {isCelebrating && (
          <motion.div
            key="quiz-celebration-overlay"
            className="fixed inset-0 z-[600] flex items-center justify-center"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Quiz complete"
            // Backdrop click dismisses immediately
            onClick={dismiss}
          >
            {/* Radial color background */}
            <div
              className="absolute inset-0"
              style={{ background: overlayBackground }}
              aria-hidden="true"
            />

            {/* Semi-dark scrim for legibility */}
            <div
              className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Card -- stop click propagation so clicking inside doesn't dismiss */}
            <motion.div
              key="celebration-card"
              className="relative mx-4 max-w-md w-full"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient border wrapper */}
              <div
                className="rounded-3xl p-[2px]"
                style={{
                  background: `linear-gradient(135deg, ${dominantScriptColor}80, ${dominantScriptColor}30, ${dominantScriptColor}60)`,
                }}
              >
                {/* Inner card */}
                <div className="rounded-[22px] p-8 bg-[#FAFAF8] dark:bg-[#0f172a] flex flex-col items-center text-center">
                  {/* Overline */}
                  <p
                    className="text-[10px] uppercase tracking-widest font-mono mb-5"
                    style={{ color: dominantScriptColor }}
                  >
                    Your Money Script
                  </p>

                  {/* Trophy icon with wiggle */}
                  <motion.div
                    variants={trophyVariants}
                    animate="animate"
                    aria-hidden="true"
                  >
                    <Trophy
                      className="mb-5"
                      size={64}
                      style={{
                        color: dominantScriptColor,
                        filter: `drop-shadow(0 0 12px ${dominantScriptColor}80)`,
                      }}
                    />
                  </motion.div>

                  {/* Celebration headline */}
                  <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-1">
                    You finished the quiz!
                  </h2>
                  <p className="text-sm text-[#555555] dark:text-[#aaaaaa] mb-6">
                    Your money profile is ready.
                  </p>

                  {/* Script name -- character-by-character reveal */}
                  {/* Screen reader reads the full name instantly via aria-label */}
                  <div
                    className="text-4xl font-bold tracking-tight leading-tight mb-6 overflow-hidden max-w-full"
                    style={{ color: dominantScriptColor }}
                    aria-label={dominantScriptName}
                  >
                    {characters.map((char, index) => (
                      <motion.span
                        key={index}
                        aria-hidden="true"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.15,
                          delay: 0.3 + index * 0.04,
                          ease: "easeOut",
                        }}
                        style={{
                          display: "inline-block",
                          whiteSpace: char === " " ? "pre" : "normal",
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  {/* CTA button -- fades in after 1.5s */}
                  {!prefersReduced && (
                    <motion.button
                      variants={ctaVariants}
                      initial="initial"
                      animate="animate"
                      onClick={dismiss}
                      className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        background: dominantScriptColor,
                      }}
                    >
                      See My Results
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessible live region for screen readers */}
      <div aria-live="assertive" className="sr-only">
        {isCelebrating ? "Quiz complete! Discovering your money script..." : ""}
      </div>
    </>
  );
}
