"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimate,
} from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Check,
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
// Utilities
// ---------------------------------------------------------------------------

// Returns a hex color for each self-rate rating value (0-5)
function getRatingColor(rating: number): string {
  const palette: Record<number, string> = {
    0: "#DC2626",
    1: "#F87171",
    2: "#F59E0B",
    3: "#EAB308",
    4: "#2C5F7C",
    5: "#1E3F2E",
  };
  return palette[rating] ?? "#94a3b8";
}

// Returns the scale a selected rating button settles at
function getSelectedScale(rating: number): number {
  if (rating >= 4) return 1.05;
  if (rating >= 2) return 1.02;
  return 1.0;
}

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
      ? "text-[#2E7D4A]"
      : correctPct >= 60
        ? "text-[#C4A67A]"
        : "text-[#E05A1B]";

  const masteryLabel =
    stats.masteredThisSession === 1
      ? "1 concept mastered this session"
      : stats.masteredThisSession > 1
        ? `${stats.masteredThisSession} concepts mastered this session`
        : null;

  const statItems = [
    {
      icon: <Layers className="w-4 h-4" style={{ color: 'rgba(245,237,224,0.6)' }} aria-hidden="true" />,
      value: stats.reviewed,
      suffix: "",
      label: "Cards Reviewed",
      valueClass: "text-[#F5EDE0]",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" style={{ color: '#2E7D4A' }} aria-hidden="true" />,
      value: correctPct,
      suffix: "%",
      label: "Accuracy",
      valueClass: accuracyColor,
    },
    {
      icon: <Star className="w-4 h-4" style={{ color: '#C4A67A' }} aria-hidden="true" />,
      value: stats.masteredThisSession,
      suffix: "",
      label: "Mastered",
      valueClass: "text-[#C4A67A]",
    },
  ];

  const ariaAnnouncement = `Review session complete! ${stats.reviewed} cards reviewed. ${correctPct}% accuracy.`;

  // Reduced-motion: static card, no confetti, final values immediately
  if (prefersReduced) {
    return (
      <div
        role="region"
        aria-label="Review session summary"
        className="uc-metric max-w-sm mx-auto p-6"
        style={{
          boxShadow: "0 25px 50px -12px rgba(44,95,124,0.25), 0 0 0 1px rgba(44,95,124,0.12)",
        }}
      >
        <span className="sr-only" aria-live="assertive">
          {ariaAnnouncement}
        </span>

        <div className="text-center mb-6">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#2E7D4A' }} aria-hidden="true" />
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-xl font-bold outline-none"
            style={{ color: '#F5EDE0' }}
          >
            Session complete!
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(245,237,224,0.7)' }}>Good session.</p>
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
              <span className="text-[10px] font-medium uppercase tracking-wide text-center" style={{ color: 'rgba(245,237,224,0.6)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {stats.masteredThisSession > 0 && masteryLabel && (
          <div className="mt-4 px-4 py-2 rounded-lg text-center" style={{ background: 'rgba(46,125,74,0.2)', border: '1px solid rgba(46,125,74,0.35)' }}>
            <p className="text-sm font-semibold" style={{ color: '#2E7D4A' }}>{masteryLabel}</p>
          </div>
        )}

        <div className="mt-5 pt-4 flex gap-3" style={{ borderTop: '1px solid rgba(245,237,224,0.15)' }}>
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 outline-none cursor-pointer"
            style={{ border: '1px solid rgba(245,237,224,0.25)', color: 'rgba(245,237,224,0.8)' }}
          >
            Review more
          </button>
          <Link
            href="/explore"
            className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 outline-none"
            style={{ background: 'rgba(46,125,74,0.2)', border: '1px solid rgba(46,125,74,0.35)', color: '#F5EDE0' }}
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
        accentColor="#2E7D4A"
        count={CONFETTI_COUNTS.minor}
      />

      <motion.div
        role="region"
        aria-label="Review session summary"
        variants={summaryCardVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_BOUNCY }}
        className="uc-metric max-w-sm mx-auto p-6"
        style={{
          boxShadow: "0 25px 50px -12px rgba(44,95,124,0.25), 0 0 0 1px rgba(44,95,124,0.12)",
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
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#2E7D4A' }} aria-hidden="true" />
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-xl font-bold outline-none"
            style={{ color: '#F5EDE0' }}
          >
            Session complete!
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(245,237,224,0.7)' }}>Good session.</p>
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
              <span className="text-[10px] font-medium uppercase tracking-wide text-center" style={{ color: 'rgba(245,237,224,0.6)' }}>
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
              className="mt-4 px-4 py-2 rounded-lg text-center"
              style={{ background: 'rgba(46,125,74,0.2)', border: '1px solid rgba(46,125,74,0.35)' }}
            >
              <p className="text-sm font-semibold" style={{ color: '#2E7D4A' }}>{masteryLabel}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-5 pt-4 flex gap-3"
          style={{ borderTop: '1px solid rgba(245,237,224,0.15)' }}
        >
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ ...SPRING_SNAPPY }}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 outline-none cursor-pointer"
            style={{ border: '1px solid rgba(245,237,224,0.25)', color: 'rgba(245,237,224,0.8)' }}
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
              className="block w-full py-2.5 rounded-xl text-xs font-medium text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 outline-none"
              style={{ background: 'rgba(46,125,74,0.2)', border: '1px solid rgba(46,125,74,0.35)', color: '#F5EDE0' }}
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
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();
  const concept = concepts.find((c) => c.id === card.conceptId);
  const ariaRef = useRef<HTMLDivElement>(null);
  const ratingLiveRef = useRef<HTMLDivElement>(null);

  // Reset flip and selection state when card changes
  useEffect(() => {
    setFlipped(false);
    setSelectedRating(null);
  }, [cardKey]);

  // Announce flip to screen readers
  useEffect(() => {
    if (flipped && ariaRef.current) {
      ariaRef.current.focus();
    }
  }, [flipped]);

  if (!concept) return null;

  const ratings = [
    { value: 0, label: "Blackout" },
    { value: 1, label: "Blank" },
    { value: 2, label: "Hard" },
    { value: 3, label: "Got it" },
    { value: 4, label: "Easy" },
    { value: 5, label: "Nailed it" },
  ];

  function handleRate(value: number) {
    setSelectedRating(value);
    // Fire the parent handler immediately -- animation runs in parallel
    onRate(value);
  }

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
              className="uc-card rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(196,166,122,0.3)", boxShadow: "0 2px 8px rgba(44,95,124,0.08)", minHeight: 280 }}
            >
              <div className="p-8 flex flex-col items-center justify-center text-center h-full" style={{ minHeight: 220 }}>
                <motion.p
                  {...conceptNameVariants}
                  className="text-[10px] text-[#555555] uppercase tracking-wider mb-2"
                >
                  What do you remember about...
                </motion.p>
                <motion.h2
                  {...conceptNameVariants}
                  className="text-xl font-semibold"
                  style={{ color: '#1A1A1A' }}
                >
                  {concept.name}
                </motion.h2>
                <motion.p
                  {...descriptionVariants}
                  className="text-xs text-[#555555] mt-2 leading-relaxed"
                >
                  {concept.summary}
                </motion.p>
              </div>
              <div className="p-4 text-center"
              style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}>
                <button
                  onClick={() => setFlipped(true)}
                  aria-label="Flip card to see answer"
                  className="text-sm transition-colors flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-2 py-1"
                style={{ color: '#2C5F7C' }}
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
              className="rounded-2xl overflow-hidden"
              style={{ background: '#F5EDE0', border: '1px solid rgba(196,166,122,0.3)', borderTop: '2px solid #2C5F7C', boxShadow: "0 2px 8px rgba(44,95,124,0.08)", minHeight: 280 }}
            >
              <div className="p-8">
                <p
                  className="text-xs font-medium tracking-wide uppercase mb-3"
                  style={{ color: '#2C5F7C' }}
                  aria-hidden="true"
                >
                  {concept.name}
                </p>
                <p className="text-sm leading-relaxed"
                  style={{ color: '#1A1A1A' }}>
                  {concept.layers.accessible.slice(0, 300)}
                  {concept.layers.accessible.length > 300 ? "..." : ""}
                </p>
              </div>
              <div className="p-4"
              style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}>
                <p className="text-[10px] text-[#555555] mb-2 text-center">
                  How well did you remember this?
                </p>
                {/* Screen reader live region for selection announcement */}
                <div ref={ratingLiveRef} aria-live="polite" aria-atomic="true" className="sr-only">
                  {selectedRating !== null
                    ? `Rated ${selectedRating}: ${ratings[selectedRating]?.label ?? ""}. Moving to next card.`
                    : ""}
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {ratings.map((r) => {
                    const color = getRatingColor(r.value);
                    const isSelected = selectedRating === r.value;
                    const style: CSSProperties = isSelected
                      ? { borderColor: color, backgroundColor: `${color}22` }
                      : { borderColor: "rgba(161,161,170,0.3)" };
                    return (
                      <button
                        key={r.value}
                        onClick={() => handleRate(r.value)}
                        disabled={selectedRating !== null}
                        aria-label={isSelected ? `Selected rating: ${r.label}` : `Rate this card: ${r.label}`}
                        aria-pressed={isSelected}
                        style={style}
                        className="min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed flex flex-col items-center justify-center"
                      >
                        <span className="block text-sm font-semibold font-mono" style={{ color }}>
                          {r.value}
                        </span>
                        <span className="block text-[9px] leading-tight"
                        style={{ color: '#555555' }}>{r.label}</span>
                      </button>
                    );
                  })}
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
            style={{ backfaceVisibility: "hidden", border: "1px solid rgba(196,166,122,0.3)", boxShadow: "0 2px 8px rgba(44,95,124,0.08)" }}
            className="absolute inset-0 uc-card rounded-2xl overflow-hidden flex flex-col"
            aria-hidden={flipped}
          >
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 220 }}>
              <motion.p
                {...conceptNameVariants}
                className="text-[10px] text-[#555555] uppercase tracking-wider mb-2"
              >
                What do you remember about...
              </motion.p>
              <motion.h2
                {...conceptNameVariants}
                className="text-xl font-semibold"
                  style={{ color: '#1A1A1A' }}
              >
                {concept.name}
              </motion.h2>
              <motion.p
                {...descriptionVariants}
                className="text-xs text-[#555555] mt-2 leading-relaxed max-w-sm"
              >
                {concept.summary}
              </motion.p>
            </div>
            <div className="p-4 text-center"
              style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}>
              <motion.button
                onClick={() => setFlipped(true)}
                aria-label="Flip card to see answer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92, transition: { ...SPRING_SNAPPY } }}
                className="text-sm transition-colors flex items-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-2 py-1"
                style={{ color: '#2C5F7C' }}
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
              background: '#F5EDE0',
              border: '1px solid rgba(196,166,122,0.3)',
              borderTop: '2px solid #2C5F7C',
              boxShadow: "0 2px 8px rgba(44,95,124,0.08)",
            }}
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
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
                  className="text-xs font-medium tracking-wide uppercase mb-3"
                  style={{ color: '#2C5F7C' }}
                  aria-hidden="true"
                >
                  {concept.name}
                </p>
                <p
                  ref={flipped ? ariaRef : null}
                  tabIndex={flipped ? -1 : undefined}
                  className="text-sm leading-relaxed"
                  style={{ color: '#1A1A1A' }}
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
              className="p-4"
              style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}
            >
              <p className="text-[10px] text-[#555555] mb-2 text-center">
                How well did you remember this?
              </p>
              {/* Screen reader live region for selection announcement */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {selectedRating !== null
                  ? `Rated ${selectedRating}: ${ratings[selectedRating]?.label ?? ""}. Moving to next card.`
                  : ""}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center relative">
                {ratings.map((r) => {
                  const color = getRatingColor(r.value);
                  const isSelected = selectedRating === r.value;
                  const hasSelection = selectedRating !== null;
                  const settledScale = getSelectedScale(r.value);

                  const boxShadowSelected = `0 0 0 2px ${color}, 0 0 12px ${color}40`;

                  return (
                    <div key={r.value} className="relative">
                      {/* Tooltip label on hover */}
                      <AnimatePresence>
                        {hoveredRating === r.value && !hasSelection && (
                          <motion.div
                            key={`tooltip-${r.value}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium px-1.5 py-0.5 rounded pointer-events-none z-10"
                            style={{ background: '#1A1A1A', color: '#F5EDE0' }}
                          >
                            {r.label}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        onClick={() => handleRate(r.value)}
                        onHoverStart={() => setHoveredRating(r.value)}
                        onHoverEnd={() => setHoveredRating(null)}
                        disabled={hasSelection}
                        aria-label={isSelected ? `Selected rating: ${r.label}` : `Rate this card: ${r.label}`}
                        aria-pressed={isSelected}
                        whileTap={hasSelection ? {} : { scale: 0.92, transition: { ...SPRING_SNAPPY } }}
                        animate={{
                          scale: isSelected ? settledScale : hasSelection ? 1.0 : 1.0,
                          opacity: hasSelection && !isSelected ? 0.45 : 1,
                          boxShadow: isSelected ? boxShadowSelected : "0 0 0 0px transparent",
                        }}
                        transition={{ ...SPRING_SNAPPY }}
                        style={{
                          backgroundColor: `${color}${isSelected ? "22" : "14"}`,
                          borderColor: isSelected ? color : "rgba(161,161,170,0.4)",
                        }}
                        className="min-w-[44px] min-h-[44px] px-2 py-1.5 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed flex flex-col items-center justify-center"
                        data-testid={`rating-btn-${r.value}`}
                      >
                        <span
                          className="block text-sm font-semibold font-mono leading-none"
                          style={{ color }}
                        >
                          {r.value}
                        </span>
                        <span className="block text-[9px] leading-tight mt-0.5"
                        style={{ color: '#555555' }}>
                          {r.label}
                        </span>
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz Answer Button with animated correct/wrong states
// ---------------------------------------------------------------------------

function QuizAnswerButton({
  option,
  index,
  revealed,
  selected,
  correctIndex,
  onSelect,
  prefersReduced,
}: {
  option: string;
  index: number;
  revealed: boolean;
  selected: number | null;
  correctIndex: number;
  onSelect: (i: number) => void;
  prefersReduced: boolean | null;
}) {
  const [scope, animate] = useAnimate();
  const isCorrect = index === correctIndex;
  const isSelected = index === selected;
  const isWrong = revealed && isSelected && !isCorrect;
  const isRevealedCorrect = revealed && isCorrect;

  // Run shake on wrong answer
  useEffect(() => {
    if (!isWrong || prefersReduced) return;
    const shakeValues = [-4, 4, -3, 3, -2, 2, 0];
    void animate(scope.current, { x: shakeValues }, { duration: 0.35, ease: "easeInOut" });
  }, [isWrong, prefersReduced, animate, scope]);

  let borderColor = "rgba(161,161,170,0.3)";
  let bgColor = "transparent";
  if (isRevealedCorrect) {
    borderColor = "#2E7D4A";
    bgColor = "rgba(46,125,74,0.12)";
  } else if (isWrong) {
    borderColor = "rgba(161,161,170,0.3)";
    bgColor = "transparent";
  }

  const boxShadow = isRevealedCorrect && !prefersReduced
    ? "0 0 0 2px #2E7D4A, 0 0 16px rgba(46,125,74,0.25)"
    : "none";

  return (
    <motion.button
      ref={scope}
      onClick={() => onSelect(index)}
      disabled={revealed}
      aria-label={
        isRevealedCorrect
          ? `Correct answer: ${option}`
          : isWrong
            ? `Incorrect answer: ${option}`
            : option
      }
      animate={
        prefersReduced
          ? {}
          : {
              boxShadow,
              backgroundColor: bgColor,
              borderColor,
              opacity: revealed && !isSelected && !isCorrect ? 0.5 : 1,
            }
      }
      style={
        prefersReduced
          ? { borderColor, backgroundColor: bgColor }
          : undefined
      }
      whileTap={revealed || prefersReduced ? {} : { scale: 0.97, transition: { ...SPRING_SNAPPY } }}
      transition={{ duration: 0.2 }}
      className="w-full text-left px-4 py-3 rounded-xl border-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed relative overflow-hidden"
    >
      {/* Brief red tint overlay on wrong -- fades out */}
      <AnimatePresence>
        {isWrong && !prefersReduced && (
          <motion.span
            key="wrong-tint"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Spring-in checkmark on correct answer */}
        <AnimatePresence>
          {isRevealedCorrect && (
            <motion.span
              key="checkmark"
              initial={prefersReduced ? { opacity: 1 } : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={prefersReduced ? { duration: 0 } : { ...SPRING_SNAPPY, delay: 0.08 }}
              className="shrink-0"
              aria-hidden="true"
            >
              <Check className="w-3.5 h-3.5" style={{ color: '#2E7D4A' }} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* XCircle for wrong (accessible -- screen readers get aria-label) */}
        {isWrong && (
          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
        )}

        <span
          className={
            isRevealedCorrect
              ? "font-medium text-[#1E3F2E]"
              : isWrong
                ? "text-[#555555]"
                : "text-[#1A1A1A]"
          }
        >
          {option}
        </span>
      </div>
    </motion.button>
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
  const prefersReduced = useReducedMotion();
  const quizAriaRef = useRef<HTMLDivElement>(null);

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

  const isCorrect = selected !== null && selected === question.correctIndex;
  const isWrong = selected !== null && selected !== question.correctIndex;

  return (
    <div
      className="uc-card rounded-2xl p-6"
      style={{ border: "1px solid rgba(196,166,122,0.3)", boxShadow: "0 2px 8px rgba(44,95,124,0.08)", minHeight: 280 }}
    >
      {/* Screen reader live region for quiz result */}
      <div ref={quizAriaRef} aria-live="polite" aria-atomic="true" className="sr-only">
        {revealed && isCorrect && "Correct!"}
        {revealed && isWrong && `Incorrect. The correct answer was: ${question.options[question.correctIndex] ?? ""}`}
      </div>

      <motion.p
        {...conceptNameVariants}
        className="text-[10px] uppercase tracking-wider mb-2"
        style={{ color: '#2C5F7C' }}
      >
        {question.conceptName}
      </motion.p>
      <motion.h3
        {...descriptionVariants}
        className="text-sm font-semibold mb-4"
        style={{ color: '#1A1A1A' }}
      >
        {question.question}
      </motion.h3>

      <div className="space-y-2">
        {question.options.map((option, i) => (
          <QuizAnswerButton
            key={i}
            option={option}
            index={i}
            revealed={revealed}
            selected={selected}
            correctIndex={question.correctIndex}
            onSelect={handleSelect}
            prefersReduced={prefersReduced ?? false}
          />
        ))}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-3 p-3 rounded-xl"
          style={{ background: 'rgba(44,95,124,0.06)', border: '1px solid rgba(44,95,124,0.12)' }}
        >
          <p className="text-[10px] text-[#555555]">
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
  const [masteryCard, setMasteryCard] = useState<{ conceptName: string; updatedState: ReviewState; isLastCard: boolean } | null>(null);
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

  // Dismiss mastery overlay and advance to next card / finish session
  const handleMasteryDismiss = useCallback(() => {
    if (!masteryCard) return;
    const { updatedState, isLastCard } = masteryCard;
    setMasteryCard(null);
    if (isLastCard) {
      finishSession(updatedState);
    } else {
      setState(updatedState);
      setCurrentIndex((i) => i + 1);
    }
  }, [masteryCard, finishSession]);

  // Auto-dismiss mastery overlay after 3s, and handle ESC key
  useEffect(() => {
    if (!masteryCard) return;

    const timer = setTimeout(() => {
      handleMasteryDismiss();
    }, 3000);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleMasteryDismiss();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [masteryCard, handleMasteryDismiss]);

  const handleSelfRate = useCallback(
    (rating: number) => {
      if (!state || !currentCard) return;
      if (ratingSubmitted.current) return;
      ratingSubmitted.current = true;

      const updated = processReview(state, currentCard.conceptId, rating);
      sessionReviewedRef.current += 1;
      if (rating >= 3) sessionCorrectRef.current += 1;

      const updatedCard = updated.cards.find(
        (c) => c.conceptId === currentCard.conceptId
      );

      const crossedMastery =
        updatedCard !== undefined &&
        updatedCard.interval >= 21 &&
        currentCard.interval < 21;

      if (updatedCard && updatedCard.interval >= 21) {
        masteredThisSessionRef.current = new Set([
          ...masteredThisSessionRef.current,
          currentCard.conceptId,
        ]);
      }

      const isLastCard = currentIndex + 1 >= dueCards.length;

      if (crossedMastery && updatedCard) {
        const concept = concepts.find((c) => c.id === currentCard.conceptId);
        setMasteryCard({
          conceptName: concept?.name ?? currentCard.conceptId,
          updatedState: updated,
          isLastCard,
        });
      } else if (isLastCard) {
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

      const updatedCard = updated.cards.find(
        (c) => c.conceptId === currentCard.conceptId
      );

      const crossedMastery =
        updatedCard !== undefined &&
        updatedCard.interval >= 21 &&
        currentCard.interval < 21;

      if (updatedCard && updatedCard.interval >= 21) {
        masteredThisSessionRef.current = new Set([
          ...masteredThisSessionRef.current,
          currentCard.conceptId,
        ]);
      }

      const isLastCard = currentIndex + 1 >= dueCards.length;

      if (crossedMastery && updatedCard) {
        const concept = concepts.find((c) => c.id === currentCard.conceptId);
        setTimeout(() => {
          setMasteryCard({
            conceptName: concept?.name ?? currentCard.conceptId,
            updatedState: updated,
            isLastCard,
          });
        }, 500);
      } else {
        setTimeout(() => {
          if (isLastCard) {
            finishSession(updated);
          } else {
            setState(updated);
            setCurrentIndex((i) => i + 1);
          }
        }, 500);
      }
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
        <p className="text-sm text-[#555555]">Loading review cards...</p>
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
              className="p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-[rgba(44,95,124,0.06)]"
            style={{ color: '#555555' }}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5" style={{ color: '#2C5F7C' }} aria-hidden="true" />
                Review
              </h1>
              <p className="text-xs text-[#555555]">
                {stats.due} cards due &mdash; {stats.mastered} mastered
              </p>
            </div>
          </div>

          {/* Mode toggle -- hidden during session complete */}
          {!sessionComplete && (
            <div
              className="flex rounded-lg p-0.5"
              style={{ background: '#FFFFFF', border: '1px solid rgba(196,166,122,0.3)' }}
              role="group"
              aria-label="Review mode"
            >
              <button
                onClick={() => setMode("self-rate")}
                aria-pressed={mode === "self-rate"}
                className={`text-[10px] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
                  mode === "self-rate"
                    ? "text-[#2C5F7C]"
                    : "text-[#555555]"
                }`}
              >
                Flashcard
              </button>
              <button
                onClick={() => setMode("quiz")}
                aria-pressed={mode === "quiz"}
                className={`text-[10px] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 ${
                  mode === "quiz"
                    ? "text-[#2C5F7C]"
                    : "text-[#555555]"
                }`}
              >
                Quiz
              </button>
            </div>
          )}
        </div>

        {/* Stats bar -- animated counters on each number */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="uc-card rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(196,166,122,0.3)', boxShadow: '0 1px 4px rgba(44,95,124,0.06)' }}>
            <p className="text-lg font-bold font-mono">
              <AnimatedCounter value={stats.total} className="text-lg font-bold font-mono" />
            </p>
            <p className="text-[10px] text-[#555555]">Total</p>
          </div>
          <div className="uc-card rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(196,166,122,0.3)', boxShadow: '0 1px 4px rgba(44,95,124,0.06)' }}>
            <p className="text-lg font-bold font-mono text-amber-400">
              <AnimatedCounter value={stats.due} className="text-lg font-bold font-mono text-amber-400" />
            </p>
            <p className="text-[10px] text-[#555555]">Due</p>
          </div>
          <div className="uc-card rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(196,166,122,0.3)', boxShadow: '0 1px 4px rgba(44,95,124,0.06)' }}>
            <p className="text-lg font-bold font-mono text-blue-400">
              <AnimatedCounter value={stats.learning} className="text-lg font-bold font-mono text-blue-400" />
            </p>
            <p className="text-[10px] text-[#555555]">Learning</p>
          </div>
          <div className="uc-card rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(196,166,122,0.3)', boxShadow: '0 1px 4px rgba(44,95,124,0.06)' }}>
            <p className="text-lg font-bold font-mono" style={{ color: '#2E7D4A' }}>
              <AnimatedCounter value={stats.mastered} className="text-lg font-bold font-mono" />
            </p>
            <p className="text-[10px] text-[#555555]">Mastered</p>
          </div>
        </div>

        {/* No cards due */}
        {dueCards.length === 0 && !sessionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE }}
            className="uc-card rounded-2xl p-8 text-center"
            style={{ border: '1px solid rgba(196,166,122,0.3)', boxShadow: '0 2px 8px rgba(44,95,124,0.08)' }}
          >
            <Trophy
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: '#2C5F7C' }}
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold mb-1">Nothing due today.</h2>
            <p className="text-xs text-[#555555] mb-4">
              Your scheduled cards show up here each day. Check back tomorrow.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-xs transition-colors hover:opacity-80"
              style={{ color: '#2C5F7C' }}
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
              <span className="text-[10px] text-[#555555]">
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
              <span className="text-[10px] font-mono tabular-nums" style={{ color: '#2C5F7C' }}>
                {sessionCorrectRef.current}/{sessionReviewedRef.current} correct
              </span>
            </div>
            <div className="h-1 rounded-full mb-4"
              style={{ background: 'rgba(44,95,124,0.10)' }} role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={dueCards.length}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#2C5F7C' }}
                animate={{
                  width: `${((currentIndex + 1) / dueCards.length) * 100}%`,
                }}
                transition={{ ...SPRING_GENTLE }}
              />
            </div>

            {/* Card with directional slide transitions */}
            {/* Mastery confetti -- fires when overlay is visible */}
            {!prefersReduced && (
              <LessonConfetti
                visible={masteryCard !== null}
                accentColor="#2E7D4A"
                count={CONFETTI_COUNTS.minor}
              />
            )}

            <div style={{ position: "relative" }}>
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

              {/* Mastery celebration overlay */}
              <AnimatePresence>
                {masteryCard !== null && (
                  prefersReduced ? (
                    <div
                      key="mastery-overlay-reduced"
                      onClick={handleMasteryDismiss}
                      className="absolute inset-0 rounded-[inherit] z-10 flex flex-col items-center justify-center cursor-pointer"
                      style={{
                        backgroundColor: "rgba(30,63,46,0.95)",
                        border: "2px solid #2E7D4A",
                      }}
                      role="status"
                      aria-label="Mastered! This concept is now in long-term memory"
                    >
                      <Trophy
                        className="w-10 h-10 mb-3"
                        style={{ color: "#C4A67A" }}
                        aria-hidden="true"
                      />
                      <p className="text-2xl font-bold" style={{ color: '#F5EDE0' }}>Mastered!</p>
                      <p className="text-sm font-medium mt-1" style={{ color: '#F5EDE0' }}>{masteryCard.conceptName}</p>
                      <p className="text-xs mt-2" style={{ color: 'rgba(245,237,224,0.7)' }}>This concept is now in long-term memory</p>
                    </div>
                  ) : (
                    <motion.div
                      key="mastery-overlay"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ ...SPRING_BOUNCY }}
                      onClick={handleMasteryDismiss}
                      className="absolute inset-0 rounded-[inherit] z-10 flex flex-col items-center justify-center cursor-pointer"
                      style={{ backgroundColor: "rgba(30,63,46,0.95)" }}
                      role="status"
                      aria-label="Mastered! This concept is now in long-term memory"
                    >
                      <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Trophy
                          className="w-10 h-10 mb-3"
                          style={{
                            color: "#C4A67A",
                            filter: "drop-shadow(0 0 8px rgba(196,166,122,0.8))",
                          }}
                          aria-hidden="true"
                        />
                      </motion.div>
                      <p className="text-2xl font-bold" style={{ color: '#F5EDE0' }}>Mastered!</p>
                      <p className="text-sm font-medium mt-1" style={{ color: '#F5EDE0' }}>{masteryCard.conceptName}</p>
                      <p className="text-xs mt-2" style={{ color: 'rgba(245,237,224,0.7)' }}>This concept is now in long-term memory</p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Add concepts link -- hidden during session complete */}
        {!sessionComplete && (
          <div className="mt-6 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-2 py-1 hover:opacity-80"
              style={{ color: '#555555' }}
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
