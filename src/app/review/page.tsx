"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  Brain,
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Trophy,
  Layers,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  loadReviewState,
  getDueCards,
  processReview,
  getReviewStats,
  addCard,
  type ReviewState,
  type ReviewCard,
} from "@/lib/spaced-repetition/engine";
import {
  generateQuestion,
  type ReviewQuestion,
} from "@/lib/spaced-repetition/quiz-generator";
import { concepts } from "@/lib/concepts";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import {
  SPRING_SNAPPY,
  SPRING_GENTLE,
  SPRING_BOUNCY,
  STAGGER_MEDIUM,
  CONFETTI_COUNTS,
} from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const cardVariants = {
  initial: (reduced: boolean) =>
    reduced
      ? { opacity: 0 }
      : { opacity: 0, x: 60 },
  animate: (reduced: boolean) =>
    reduced
      ? { opacity: 1, transition: { duration: 0.15 } }
      : { opacity: 1, x: 0, transition: { ...SPRING_SNAPPY } },
  exit: (reduced: boolean) =>
    reduced
      ? { opacity: 0, transition: { duration: 0.1 } }
      : { opacity: 0, x: -60, transition: { duration: 0.15, ease: "easeIn" as const } },
};

const conceptNameVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_GENTLE, delay: 0.1 },
  },
};

const descriptionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_GENTLE, delay: 0.2 },
  },
};

const backContentVariants = {
  initial: { opacity: 0 },
  animate: (isFlipped: boolean) => ({
    opacity: isFlipped ? 1 : 0,
    transition: { duration: 0.2, delay: isFlipped ? 0.15 : 0 },
  }),
};

const progressCounterVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

// Summary card animation variants
const summaryCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const statCellVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const masteryHighlightVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReviewMode = "self-rate" | "quiz";

interface SessionStats {
  readonly reviewed: number;
  readonly correct: number;
  readonly masteredThisSession: number;
}

// ---------------------------------------------------------------------------
// Session Summary Card
// ---------------------------------------------------------------------------

function SessionSummary({
  stats,
  onRestart,
}: {
  stats: SessionStats;
  onRestart: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [masteryPulse, setMasteryPulse] = useState(false);

  // Move focus to heading when summary appears
  useEffect(() => {
    const timer = setTimeout(() => {
      headingRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Pulse the mastery callout once after it settles
  useEffect(() => {
    if (stats.masteredThisSession === 0) return;
    const timer = setTimeout(() => setMasteryPulse(true), 700);
    return () => clearTimeout(timer);
  }, [stats.masteredThisSession]);

  const correctPct =
    stats.reviewed > 0
      ? Math.round((stats.correct / stats.reviewed) * 100)
      : 0;

  // Color-code accuracy: green >= 80%, amber 60-79%, red < 60%
  const accuracyColor =
    correctPct >= 80
      ? "text-green-400"
      : correctPct >= 60
        ? "text-amber-400"
        : "text-red-400";

  const masteryLabel =
    stats.masteredThisSession === 1
      ? "1 concept mastered this session"
      : stats.masteredThisSession > 1
        ? `${stats.masteredThisSession} concepts mastered this session`
        : null;

  const statItems = [
    {
      icon: <Layers className="w-4 h-4 text-slate-400" aria-hidden="true" />,
      value: stats.reviewed,
      suffix: "",
      label: "Cards Reviewed",
      valueClass: "text-slate-200",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />,
      value: correctPct,
      suffix: "%",
      label: "Accuracy",
      valueClass: accuracyColor,
    },
    {
      icon: <Star className="w-4 h-4 text-green-400" aria-hidden="true" />,
      value: stats.masteredThisSession,
      suffix: "",
      label: "Mastered",
      valueClass: "text-green-400",
    },
  ];

  const ariaAnnouncement = `Review session complete! ${stats.reviewed} cards reviewed. ${correctPct}% accuracy.`;

  // Reduced-motion: static card, no confetti, final values immediately
  if (prefersReduced) {
    return (
      <div
        role="region"
        aria-label="Review session summary"
        className="max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-slate-800/95 to-slate-900/98 border border-slate-700/50 p-6"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.08)",
        }}
      >
        <span className="sr-only" aria-live="assertive">
          {ariaAnnouncement}
        </span>

        <div className="text-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" aria-hidden="true" />
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-white outline-none"
          >
            Session complete!
          </h2>
          <p className="text-sm text-slate-400 mt-1">Good session.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1"
              aria-label={`${item.label}: ${item.value}${item.suffix}`}
            >
              {item.icon}
              <span className={`text-3xl font-bold font-mono tabular-nums leading-none ${item.valueClass}`}>
                {item.value}{item.suffix}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {stats.masteredThisSession > 0 && masteryLabel && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-green-400 text-sm font-semibold">{masteryLabel}</p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-700/50 flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 rounded-xl border border-slate-600/60 text-slate-300 text-xs font-medium hover:border-green-500/40 hover:text-green-300 transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer"
          >
            Review more
          </button>
          <Link
            href="/explore"
            className="flex-1 py-2.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300 text-xs font-medium text-center hover:bg-green-500/25 transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none"
          >
            I&apos;m done for today
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confetti -- only fires if any cards were mastered this session */}
      <LessonConfetti
        visible={stats.masteredThisSession > 0}
        accentColor="#16A34A"
        count={CONFETTI_COUNTS.minor}
      />

      <motion.div
        role="region"
        aria-label="Review session summary"
        variants={summaryCardVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_BOUNCY }}
        className="max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-slate-800/95 to-slate-900/98 border border-slate-700/50 p-6"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.08)",
        }}
      >
        <span className="sr-only" aria-live="assertive">
          {ariaAnnouncement}
        </span>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="text-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" aria-hidden="true" />
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-white outline-none"
          >
            Session complete!
          </h2>
          <p className="text-sm text-slate-400 mt-1">Good session.</p>
        </motion.div>

        {/* Stats grid -- staggered reveal with AnimatedCounters */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              variants={statCellVariants}
              initial="initial"
              animate="animate"
              transition={{
                ...SPRING_GENTLE,
                delay: 0.2 + index * STAGGER_MEDIUM,
              }}
              className="flex flex-col items-center gap-1"
              aria-label={`${item.label}: ${item.value}${item.suffix}`}
            >
              {item.icon}
              <span className={`text-3xl md:text-4xl font-bold font-mono tabular-nums leading-none flex items-baseline gap-0.5 ${item.valueClass}`}>
                <AnimatedCounter
                  value={item.value}
                  className={`text-3xl md:text-4xl font-bold font-mono tabular-nums ${item.valueClass}`}
                />
                {item.suffix && (
                  <span className="text-xl">{item.suffix}</span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide text-center">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mastery callout -- conditional, only if mastered > 0 */}
        <AnimatePresence>
          {stats.masteredThisSession > 0 && masteryLabel && (
            <motion.div
              key="mastery-callout"
              variants={masteryHighlightVariants}
              initial="initial"
              animate={
                masteryPulse
                  ? { opacity: 1, scale: [1, 1.02, 1] }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                masteryPulse
                  ? { duration: 0.4, delay: 0 }
                  : { ...SPRING_SNAPPY, delay: 0.4 }
              }
              className="mt-4 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
            >
              <p className="text-green-400 text-sm font-semibold">{masteryLabel}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-5 pt-4 border-t border-slate-700/50 flex gap-3"
        >
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ ...SPRING_SNAPPY }}
            className="flex-1 py-2.5 rounded-xl border border-slate-600/60 text-slate-300 text-xs font-medium hover:border-green-500/40 hover:text-green-300 transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer"
          >
            Review more
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ ...SPRING_SNAPPY }}
            className="flex-1"
          >
            <Link
              href="/explore"
              className="block w-full py-2.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-300 text-xs font-medium text-center hover:bg-green-500/25 transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none"
            >
              I&apos;m done for today
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Self-Rating Card with 3D flip
// ---------------------------------------------------------------------------

function SelfRateCard({
  card,
  onRate,
  cardKey,
}: {
  card: ReviewCard;
  onRate: (rating: number) => void;
  cardKey: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const prefersReduced = useReducedMotion();
  const concept = concepts.find((c) => c.id === card.conceptId);
  const ariaRef = useRef<HTMLDivElement>(null);

  // Reset flip state when card changes
  useEffect(() => {
    setFlipped(false);
  }, [cardKey]);

  // Announce flip to screen readers
  useEffect(() => {
    if (flipped && ariaRef.current) {
      ariaRef.current.focus();
    }
  }, [flipped]);

  if (!concept) return null;

  const ratings = [
    {
      value: 0,
      label: "Blackout",
      color: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    {
      value: 1,
      label: "Wrong",
      color: "bg-red-400/10 text-red-400 border-red-400/20",
    },
    {
      value: 2,
      label: "Hard",
      color: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    },
    {
      value: 3,
      label: "OK",
      color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    },
    {
      value: 4,
      label: "Good",
      color: "bg-green-400/10 text-green-400 border-green-400/20",
    },
    {
      value: 5,
      label: "Easy",
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
  ];

  // For reduced motion: simple opacity toggle, no rotateY
  if (prefersReduced) {
    return (
      <div
        className="overflow-hidden"
        style={{ minHeight: 280 }}
        role="region"
        aria-label={`Flashcard: ${concept.name}`}
      >
        {/* Hidden live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {flipped
            ? `${concept.name} definition: ${concept.layers.accessible.slice(0, 100)}`
            : `Card loaded: ${concept.name}`}
        </div>

        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front-reduced"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl overflow-hidden"
              style={{ minHeight: 280 }}
            >
              <div className="p-8 flex flex-col items-center justify-center text-center h-full" style={{ minHeight: 220 }}>
                <motion.p
                  {...conceptNameVariants}
                  className="text-[10px] text-text-secondary uppercase tracking-wider mb-2"
                >
                  What do you remember about...
                </motion.p>
                <motion.h2
                  {...conceptNameVariants}
                  className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  {concept.name}
                </motion.h2>
                <motion.p
                  {...descriptionVariants}
                  className="text-xs text-text-secondary mt-2 leading-relaxed"
                >
                  {concept.summary}
                </motion.p>
              </div>
              <div className="border-t border-zinc-200/60 dark:border-zinc-700/60 p-4 text-center">
                <button
                  onClick={() => setFlipped(true)}
                  aria-label="Flip card to see answer"
                  className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600 rounded-md px-2 py-1"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Show Answer
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back-reduced"
              ref={ariaRef}
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-700/80 border border-zinc-200/60 dark:border-zinc-700/60 border-t-2 border-t-accent rounded-2xl overflow-hidden"
              style={{ minHeight: 280 }}
            >
              <div className="p-8">
                <p
                  className="text-xs font-medium tracking-wide uppercase text-accent mb-3"
                  aria-hidden="true"
                >
                  {concept.name}
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {concept.layers.accessible.slice(0, 300)}
                  {concept.layers.accessible.length > 300 ? "..." : ""}
                </p>
              </div>
              <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <p className="text-[10px] text-text-secondary mb-2 text-center">
                  How well did you remember this?
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {ratings.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => onRate(r.value)}
                      className={`py-2 rounded-lg border text-[10px] font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${r.color}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full 3D flip for motion-capable users
  const flipSpring = {
    type: "spring" as const,
    stiffness: 350,
    damping: 28,
  };

  return (
    <div style={{ minHeight: 280 }}>
      {/* Hidden live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {flipped
          ? `${concept.name} definition revealed`
          : `Card loaded: ${concept.name}`}
      </div>

      {/* 3D perspective container */}
      <div
        style={{
          perspective: "1000px",
          position: "relative",
          minHeight: 280,
        }}
        role="region"
        aria-label={`Flashcard: ${concept.name}`}
      >
        {/* Flip inner wrapper -- rotateY animates here */}
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            width: "100%",
            minHeight: 280,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={flipSpring}
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl overflow-hidden flex flex-col"
            aria-hidden={flipped}
          >
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 220 }}>
              <motion.p
                {...conceptNameVariants}
                className="text-[10px] text-text-secondary uppercase tracking-wider mb-2"
              >
                What do you remember about...
              </motion.p>
              <motion.h2
                {...conceptNameVariants}
                className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
              >
                {concept.name}
              </motion.h2>
              <motion.p
                {...descriptionVariants}
                className="text-xs text-text-secondary mt-2 leading-relaxed max-w-sm"
              >
                {concept.summary}
              </motion.p>
            </div>
            <div className="border-t border-zinc-200/60 dark:border-zinc-700/60 p-4 text-center">
              <motion.button
                onClick={() => setFlipped(true)}
                aria-label="Flip card to see answer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92, transition: { ...SPRING_SNAPPY } }}
                className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600 rounded-md px-2 py-1"
              >
                <motion.span
                  whileHover={{ rotate: 15 }}
                  transition={{ ...SPRING_SNAPPY }}
                  className="inline-flex"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </motion.span>
                Show Answer
              </motion.button>
            </div>
          </div>

          {/* Back face */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 bg-zinc-50 dark:bg-zinc-700/80 border border-zinc-200/60 dark:border-zinc-700/60 border-t-2 border-t-accent rounded-2xl overflow-hidden flex flex-col"
            aria-hidden={!flipped}
          >
            <div className="flex-1 p-8">
              <motion.div
                custom={flipped}
                variants={backContentVariants}
                initial="initial"
                animate="animate"
              >
                <p
                  className="text-xs font-medium tracking-wide uppercase text-accent mb-3"
                  aria-hidden="true"
                >
                  {concept.name}
                </p>
                <p
                  ref={flipped ? ariaRef : null}
                  tabIndex={flipped ? -1 : undefined}
                  className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200"
                >
                  {concept.layers.accessible.slice(0, 300)}
                  {concept.layers.accessible.length > 300 ? "..." : ""}
                </p>
              </motion.div>
            </div>
            <motion.div
              custom={flipped}
              variants={backContentVariants}
              initial="initial"
              animate="animate"
              className="p-4 border-t border-zinc-200/60 dark:border-zinc-700/60"
            >
              <p className="text-[10px] text-text-secondary mb-2 text-center">
                How well did you remember this?
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {ratings.map((r) => (
                  <motion.button
                    key={r.value}
                    onClick={() => onRate(r.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 rounded-lg border text-[10px] font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${r.color}`}
                  >
                    {r.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz Card
// ---------------------------------------------------------------------------

function QuizCard({
  question,
  onAnswer,
}: {
  question: ReviewQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = useCallback(
    (idx: number) => {
      if (revealed) return;
      setSelected(idx);
      setRevealed(true);
      setTimeout(() => {
        onAnswer(idx === question.correctIndex);
      }, 1500);
    },
    [revealed, question.correctIndex, onAnswer]
  );

  return (
    <div
      className="bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6"
      style={{ minHeight: 280 }}
    >
      <motion.p
        {...conceptNameVariants}
        className="text-[10px] text-accent uppercase tracking-wider mb-2"
      >
        {question.conceptName}
      </motion.p>
      <motion.h3
        {...descriptionVariants}
        className="text-sm font-semibold mb-4 text-zinc-900 dark:text-zinc-50"
      >
        {question.question}
      </motion.h3>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          let optionClass = "border-zinc-200/60 hover:border-accent/30";
          if (revealed) {
            if (i === question.correctIndex) {
              optionClass = "border-green-400/50 bg-green-400/5";
            } else if (i === selected) {
              optionClass = "border-red-400/50 bg-red-400/5";
            }
          } else if (i === selected) {
            optionClass = "border-accent/50 bg-accent/5";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 disabled:cursor-not-allowed ${optionClass}`}
            >
              <div className="flex items-center gap-2">
                {revealed && i === question.correctIndex && (
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                )}
                {revealed &&
                  i === selected &&
                  i !== question.correctIndex && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-3 p-3 bg-accent/5 border border-accent/10 rounded-xl"
        >
          <p className="text-[10px] text-text-secondary">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReviewPage() {
  const [state, setState] = useState<ReviewState | null>(null);
  const [mode, setMode] = useState<ReviewMode>("self-rate");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const prefersReduced = useReducedMotion();

  // Ref to track if rating was already submitted for current card (prevent duplicates)
  const ratingSubmitted = useRef(false);

  // Session outcome tracking via refs to avoid stale closure issues
  const sessionCorrectRef = useRef(0);
  const sessionReviewedRef = useRef(0);
  const masteredThisSessionRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loaded = loadReviewState();
    if (loaded.cards.length === 0) {
      let s = loaded;
      for (const c of concepts.slice(0, 10)) {
        s = addCard(s, c.id);
      }
      setState(s);
    } else {
      setState(loaded);
    }
  }, []);

  const dueCards = useMemo(
    () => (state ? getDueCards(state) : []),
    [state]
  );

  const stats = useMemo(
    () => (state ? getReviewStats(state) : null),
    [state]
  );

  const currentCard = dueCards[currentIndex] ?? null;

  const currentQuestion = useMemo(() => {
    if (!currentCard || mode !== "quiz") return null;
    return generateQuestion(currentCard.conceptId);
  }, [currentCard, mode]);

  // Reset duplicate-submission guard when card changes
  useEffect(() => {
    ratingSubmitted.current = false;
  }, [currentIndex]);

  const finishSession = useCallback((updatedState: ReviewState) => {
    const masteredCount = masteredThisSessionRef.current.size;
    setSessionStats({
      reviewed: sessionReviewedRef.current,
      correct: sessionCorrectRef.current,
      masteredThisSession: masteredCount,
    });
    setSessionComplete(true);
    setState(updatedState);
  }, []);

  const handleSelfRate = useCallback(
    (rating: number) => {
      if (!state || !currentCard) return;
      if (ratingSubmitted.current) return;
      ratingSubmitted.current = true;

      const updated = processReview(state, currentCard.conceptId, rating);
      sessionReviewedRef.current += 1;
      if (rating >= 3) sessionCorrectRef.current += 1;

      // Track mastery: card crosses interval >= 21
      const updatedCard = updated.cards.find(
        (c) => c.conceptId === currentCard.conceptId
      );
      if (updatedCard && updatedCard.interval >= 21) {
        masteredThisSessionRef.current = new Set([
          ...masteredThisSessionRef.current,
          currentCard.conceptId,
        ]);
      }

      const isLastCard = currentIndex + 1 >= dueCards.length;
      if (isLastCard) {
        finishSession(updated);
      } else {
        setState(updated);
        setCurrentIndex((i) => i + 1);
      }
    },
    [state, currentCard, currentIndex, dueCards.length, finishSession]
  );

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      if (!state || !currentCard) return;
      if (ratingSubmitted.current) return;
      ratingSubmitted.current = true;

      const rating = correct ? 4 : 1;
      const updated = processReview(state, currentCard.conceptId, rating);
      sessionReviewedRef.current += 1;
      if (correct) sessionCorrectRef.current += 1;

      // Track mastery: card crosses interval >= 21
      const updatedCard = updated.cards.find(
        (c) => c.conceptId === currentCard.conceptId
      );
      if (updatedCard && updatedCard.interval >= 21) {
        masteredThisSessionRef.current = new Set([
          ...masteredThisSessionRef.current,
          currentCard.conceptId,
        ]);
      }

      const isLastCard = currentIndex + 1 >= dueCards.length;
      setTimeout(() => {
        if (isLastCard) {
          finishSession(updated);
        } else {
          setState(updated);
          setCurrentIndex((i) => i + 1);
        }
      }, 500);
    },
    [state, currentCard, currentIndex, dueCards.length, finishSession]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSessionComplete(false);
    setSessionStats(null);
    ratingSubmitted.current = false;
    sessionCorrectRef.current = 0;
    sessionReviewedRef.current = 0;
    masteredThisSessionRef.current = new Set();
    setState(loadReviewState());
  }, []);

  if (!state || !stats) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Loading review cards...</p>
      </div>
    );
  }

  // Unique key for AnimatePresence: use conceptId + index to guarantee remount
  const cardAnimationKey = currentCard
    ? `${currentCard.conceptId}_${currentIndex}`
    : "empty";

  return (
    // overflow-x-hidden prevents horizontal slide from causing viewport scroll on mobile
    <div className="min-h-screen pt-20 pb-16 px-4 overflow-x-hidden">
      {/* Global screen reader live region for card transitions */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentCard
          ? `Card ${currentIndex + 1} of ${dueCards.length}. Concept: ${
              concepts.find((c) => c.id === currentCard.conceptId)?.name ?? ""
            }`
          : ""}
      </div>

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" aria-hidden="true" />
                Review
              </h1>
              <p className="text-xs text-text-secondary">
                {stats.due} cards due &mdash; {stats.mastered} mastered
              </p>
            </div>
          </div>

          {/* Mode toggle -- hidden during session complete */}
          {!sessionComplete && (
            <div
              className="flex bg-surface border border-border-light rounded-lg p-0.5"
              role="group"
              aria-label="Review mode"
            >
              <button
                onClick={() => setMode("self-rate")}
                aria-pressed={mode === "self-rate"}
                className={`text-[10px] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
                  mode === "self-rate"
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary"
                }`}
              >
                Flashcard
              </button>
              <button
                onClick={() => setMode("quiz")}
                aria-pressed={mode === "quiz"}
                className={`text-[10px] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
                  mode === "quiz"
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary"
                }`}
              >
                Quiz
              </button>
            </div>
          )}
        </div>

        {/* Stats bar -- animated counters on each number */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono">
              <AnimatedCounter value={stats.total} className="text-lg font-bold font-mono" />
            </p>
            <p className="text-[10px] text-text-secondary">Total</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-amber-400">
              <AnimatedCounter value={stats.due} className="text-lg font-bold font-mono text-amber-400" />
            </p>
            <p className="text-[10px] text-text-secondary">Due</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-blue-400">
              <AnimatedCounter value={stats.learning} className="text-lg font-bold font-mono text-blue-400" />
            </p>
            <p className="text-[10px] text-text-secondary">Learning</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-green-400">
              <AnimatedCounter value={stats.mastered} className="text-lg font-bold font-mono text-green-400" />
            </p>
            <p className="text-[10px] text-text-secondary">Mastered</p>
          </div>
        </div>

        {/* No cards due */}
        {dueCards.length === 0 && !sessionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE }}
            className="bg-surface border border-border-light rounded-2xl p-8 text-center"
          >
            <Trophy
              className="w-10 h-10 text-accent mx-auto mb-3"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold mb-1">Nothing due today.</h2>
            <p className="text-xs text-text-secondary mb-4">
              Your scheduled cards show up here each day. Check back tomorrow.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent-light transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              Explore concepts
            </Link>
          </motion.div>
        )}

        {/* Session complete -- animated summary card */}
        <AnimatePresence>
          {sessionComplete && sessionStats && (
            <SessionSummary
              key="session-summary"
              stats={sessionStats}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>

        {/* Active review */}
        {!sessionComplete && currentCard && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-text-secondary">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    variants={progressCounterVariants}
                    initial="initial"
                    animate="animate"
                    className="inline-block tabular-nums"
                    aria-label={`Card ${currentIndex + 1} of ${dueCards.length} due`}
                  >
                    Card {currentIndex + 1} of {dueCards.length}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-[10px] text-accent font-mono tabular-nums">
                {sessionCorrectRef.current}/{sessionReviewedRef.current} correct
              </span>
            </div>
            <div className="h-1 bg-surface rounded-full mb-4" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={dueCards.length}>
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{
                  width: `${((currentIndex + 1) / dueCards.length) * 100}%`,
                }}
                transition={{ ...SPRING_GENTLE }}
              />
            </div>

            {/* Card with directional slide transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={cardAnimationKey}
                custom={prefersReduced ?? false}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {mode === "self-rate" ? (
                  <SelfRateCard
                    card={currentCard}
                    onRate={handleSelfRate}
                    cardKey={cardAnimationKey}
                  />
                ) : currentQuestion ? (
                  <QuizCard
                    question={currentQuestion}
                    onAnswer={handleQuizAnswer}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Add concepts link -- hidden during session complete */}
        {!sessionComplete && (
          <div className="mt-6 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-[10px] text-text-secondary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 rounded-md px-2 py-1"
            >
              <Layers className="w-3 h-3" aria-hidden="true" />
              Add more concepts to review
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
