"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, useAnimate } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  Shield,
  AlertTriangle,
  Target,
  Eye,
  BookOpen,
  Check,
} from "lucide-react";
import { SPRING_SNAPPY, SPRING_BOUNCY, SPRING_GENTLE, STAGGER_FAST, STAGGER_MEDIUM } from "@/lib/animation-constants";
import {
  type QuizAnswer,
  type QuizResult,
  type ScriptId,
  getOrderedQuestions,
  LIKERT_LABELS,
  scoreQuiz,
  saveQuizResult,
  loadQuizResult,
  clearQuizResult,
  SCRIPT_INTERPRETATIONS,
} from "@/lib/quiz-engine";
import {
  getScriptById,
  getCounterMoveByScriptId,
} from "@/lib/money-scripts-data";
import { QuizCompletionCelebration } from "@/components/quiz/quiz-completion-celebration";

// ---------------------------------------------------------------------------
// Script color map
// ---------------------------------------------------------------------------

const SCRIPT_COLORS: Record<ScriptId, string> = {
  avoidance: "#DC2626",
  worship: "#CA8A04",
  status: "#7C3AED",
  vigilance: "#16A34A",
};

const SCRIPT_ICONS: Record<ScriptId, typeof Shield> = {
  avoidance: Eye,
  worship: Target,
  status: AlertTriangle,
  vigilance: Shield,
};

// Fallback color if script ID lookup fails
const FALLBACK_COLOR = "#16A34A";

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

// Brand accent for the quiz progress fill (green, matching --color-accent)
const QUIZ_ACCENT = "#16A34A";

function ProgressBar({
  current,
  total,
}: {
  readonly current: number;
  readonly total: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  // Clamp percent between 0 and 100 -- guards against bad prop values
  const rawPct = total > 0 ? (current / total) * 100 : 0;
  const pct = Math.min(100, Math.max(0, Math.round(rawPct)));

  // Color intensity ramp: 0.6 opacity at question 1, 1.0 at final question
  // Gives the bar a sense of "building up energy" as the quiz progresses
  const intensityRatio = total > 0 ? (current - 1) / Math.max(total - 1, 1) : 0;
  const fillOpacity = 0.6 + intensityRatio * 0.4;

  const isComplete = pct === 100;

  // Completion glow: a branded shadow that replaces the shimmer at 100%
  const completionGlow = isComplete
    ? { boxShadow: `0 0 10px rgba(22,163,74,0.45), 0 0 4px rgba(22,163,74,0.25)` }
    : {};

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <motion.span
          key={current}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="text-xs text-text-muted font-mono"
          aria-hidden="true"
        >
          Q {current} of {total}
        </motion.span>
        <span className="text-xs text-text-muted font-mono" aria-hidden="true">
          {pct}%
        </span>
      </div>

      {/*
        Track: full-width container. overflow-hidden clips the shimmer
        so it never escapes the rounded bar bounds.
      */}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Quiz progress: ${current} of ${total} questions answered`}
        className="h-1.5 md:h-2 rounded-full overflow-hidden relative"
        style={{ background: "rgba(0,0,0,0.08)" }}
      >
        {/*
          Fill: motion.div so Framer Motion owns the width animation.
          CSS width transition is intentionally absent -- spring only.
          A stable key ensures the motion.div is never unmounted between
          question advances (prevents width reset to 0 on reconciliation).
        */}
        <motion.div
          key="progress-fill"
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%`, ...completionGlow }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { ...SPRING_GENTLE }
          }
          style={{
            background: QUIZ_ACCENT,
            opacity: fillOpacity,
          }}
        >
          {/*
            Shimmer overlay: a child div that runs a pure CSS translateX
            animation. Framer Motion controls width on the parent; CSS
            controls the shimmer translate on this child. No conflict.
            Hidden at 100% -- replaced by completion glow on the parent.
          */}
          {!isComplete && !shouldReduceMotion && (
            <div
              aria-hidden="true"
              className="quiz-shimmer-bar absolute inset-0 pointer-events-none"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LikertOption -- single answer button with spring micro-interaction
// Extracted so each option can own its own useAnimate scope for the
// selection pulse without polluting the parent's animation context.
// ---------------------------------------------------------------------------

function LikertOption({
  label,
  val,
  total,
  isSelected,
  hasSelection,
  reducedMotion,
  entranceDelay,
  onSelect,
}: {
  readonly label: string;
  readonly val: number;
  readonly total: number;
  readonly isSelected: boolean;
  readonly hasSelection: boolean;
  readonly reducedMotion: boolean;
  readonly entranceDelay: number;
  readonly onSelect: (v: number) => void;
}) {
  // useAnimate gives us imperative control over the selection pulse sequence.
  // We keep it separate from the declarative animate/whileTap props so the
  // entrance stagger and the selection pulse never conflict.
  const [scope, animate] = useAnimate();

  const handleClick = () => {
    onSelect(val);

    // Spring scale pulse: compress -> overshoot -> settle
    // Gives a physical "button press" sensation.
    // Reduced motion: skip the scale entirely.
    if (!reducedMotion && scope.current) {
      animate(
        scope.current,
        { scale: [1, 0.95, 1.03, 1] },
        { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      );
    }
  };

  // Entrance: slide up + fade in with stagger delay.
  // Reduced motion: fade only, no y translation.
  const optionInitial = reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 };
  const optionAnimate = {
    opacity: 1,
    y: 0,
    transition: reducedMotion
      ? { duration: 0.1 }
      : { ...SPRING_SNAPPY, delay: entranceDelay },
  };

  // Box shadow drives the selection glow via Framer.
  // CSS transitions can't animate box-shadow reliably for the branded ring,
  // so we use Framer Motion's animate prop instead.
  const glowShadow = isSelected
    ? "0 0 0 2px var(--color-accent), 0 0 16px rgba(22,163,74,0.25)"
    : "0 0 0 1px transparent";

  // Dimming of unselected options after a choice is made.
  // We use Framer animate so opacity transitions smoothly rather than jumping.
  const dimOpacity = hasSelection && !isSelected ? 0.55 : 1;

  // Hover effect only makes sense before any selection; once locked in,
  // hovering an unselected option shouldn't mislead the user.
  const hoverProps =
    reducedMotion || hasSelection ? {} : { scale: 1.01, x: 3 };

  return (
    <motion.button
      ref={scope}
      key={val}
      type="button"
      initial={optionInitial}
      animate={{
        ...optionAnimate,
        opacity: dimOpacity,
        boxShadow: glowShadow,
      }}
      role="radio"
      aria-checked={isSelected}
      aria-label={isSelected ? `Selected: ${label}` : `${label}, option ${val} of ${total}`}
      onClick={handleClick}
      whileHover={hoverProps}
      whileTap={reducedMotion ? {} : { scale: 0.97 }}
      transition={SPRING_SNAPPY}
      // overflow-visible ensures the ring glow is never clipped by a parent
      // container that has overflow-hidden. relative + isolate keeps stacking
      // context clean so the checkmark badge sits on top.
      className="relative overflow-visible isolate flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left min-h-[52px] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 cursor-pointer"
      style={{
        background: isSelected
          ? "var(--color-accent-bg)"
          : "var(--color-surface)",
        borderColor: isSelected
          ? "var(--color-accent)"
          : "var(--color-border)",
        // Accent left-border treatment on selected option
        borderLeft: isSelected ? "4px solid var(--color-accent)" : undefined,
      }}
    >
      {/* Radio dot indicator */}
      <div
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          borderColor: isSelected
            ? "var(--color-accent)"
            : "var(--color-border)",
        }}
      >
        {isSelected && (
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        )}
      </div>

      {/* Option label text -- semibold when selected for non-color signal (WCAG) */}
      <span
        className={`text-sm transition-colors ${isSelected ? "font-semibold" : "font-medium"}`}
        style={{
          color: isSelected
            ? "var(--color-accent-dark)"
            : "var(--color-text-secondary)",
        }}
      >
        {label}
      </span>

      {/*
        Checkmark badge -- springs in on selection, springs out on deselection.
        aria-hidden: the selection state is already communicated via aria-checked.
        Positioned absolute at right edge, vertically centered.
      */}
      <AnimatePresence>
        {isSelected && (
          <motion.span
            key="checkmark"
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: "var(--color-accent)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              reducedMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [0, 1.25, 1], opacity: 1 }
            }
            exit={{ scale: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { ...SPRING_SNAPPY }}
          >
            <Check
              className="w-3 h-3"
              style={{ color: "#fff" }}
              strokeWidth={3}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Animated Likert Scale
// Stagger: options arrive at 0.12s, 0.16s, 0.20s, 0.24s, 0.28s after mount
// Key on the parent forces a full remount on each question change,
// so the stagger entrance replays fresh for every question.
// ---------------------------------------------------------------------------

function LikertScale({
  value,
  onChange,
  reducedMotion,
}: {
  readonly value: number | null;
  readonly onChange: (v: number) => void;
  readonly reducedMotion: boolean;
}) {
  const hasSelection = value !== null;

  return (
    <div
      className="flex flex-col gap-2 mt-6"
      role="radiogroup"
      aria-label="How much do you agree with this statement?"
    >
      {LIKERT_LABELS.length > 0 &&
        LIKERT_LABELS.map((label, i) => {
          const val = i + 1;
          const isSelected = value === val;

          return (
            <LikertOption
              key={val}
              label={label}
              val={val}
              total={LIKERT_LABELS.length}
              isSelected={isSelected}
              hasSelection={hasSelection}
              reducedMotion={reducedMotion}
              entranceDelay={0.12 + i * STAGGER_FAST}
              onSelect={onChange}
            />
          );
        })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score Bar (horizontal gauge for results)
// ---------------------------------------------------------------------------

function ScoreBar({
  scriptId,
  normalized,
  label,
  animationDelay = 0,
}: {
  readonly scriptId: ScriptId;
  readonly normalized: number;
  readonly label: string;
  readonly animationDelay?: number;
}) {
  const script = getScriptById(scriptId);
  const color = SCRIPT_COLORS[scriptId] ?? FALLBACK_COLOR;
  const Icon = SCRIPT_ICONS[scriptId];

  return (
    <motion.div
      className="bg-surface border border-border rounded-xl p-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_BOUNCY, delay: animationDelay }}
      aria-label={`${script?.name ?? scriptId}: ${normalized} out of 100`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: color + "15", color }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-semibold">{script?.name ?? scriptId}</span>
        <span
          className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: color + "15", color }}
        >
          {label}
        </span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${normalized}%`, background: color }}
        />
      </div>
      <p className="text-[10px] text-text-muted mt-1 text-right font-mono">
        {normalized}/100
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Results View
// ---------------------------------------------------------------------------

function ResultsView({
  result,
  onRetake,
  visible,
}: {
  readonly result: QuizResult;
  readonly onRetake: () => void;
  readonly visible: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const dominant = result.dominant;
  const interp = SCRIPT_INTERPRETATIONS[dominant];
  const script = getScriptById(dominant);
  const counterMove = getCounterMoveByScriptId(dominant);
  const color = SCRIPT_COLORS[dominant] ?? FALLBACK_COLOR;
  const Icon = SCRIPT_ICONS[dominant];
  const [retakeConfirm, setRetakeConfirm] = useState(false);
  const dominantHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Move focus to the dominant script card when results become visible (a11y)
  useEffect(() => {
    if (visible && dominantHeadingRef.current) {
      dominantHeadingRef.current.focus();
    }
  }, [visible]);

  // Card stagger delay -- 0 when reduced motion is active
  const cardDelay = (index: number) =>
    prefersReduced ? 0 : index * STAGGER_MEDIUM;

  // Split script name into words for word-by-word reveal
  const scriptWords = script?.name?.split(" ") ?? [];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="min-h-screen pt-24 pb-16 px-4"
          initial={{ opacity: prefersReduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Screen reader live region announces result after celebration */}
          <div aria-live="polite" className="sr-only">
            {`Your dominant money script is ${script?.name ?? dominant}. ${interp.headline}`}
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Page heading */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_GENTLE, delay: cardDelay(0) }}
            >
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2">
                Quiz Complete
              </p>
              <h1
                className="text-2xl font-bold mb-1"
                ref={dominantHeadingRef}
                tabIndex={-1}
              >
                {"Here\u2019s how you think about money."}
              </h1>
              <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                {
                  "Everyone has a money script \u2014 the beliefs quietly running their financial decisions. Yours shapes how you earn, spend, save, and stress."
                }
              </p>
            </motion.div>

            {/* Dominant script card -- most elevated, branded shadow */}
            <motion.div
              className="rounded-2xl p-6 mb-5"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING_BOUNCY, delay: cardDelay(1) }}
              style={{
                background: color + "0F",
                border: `1px solid ${color}30`,
                boxShadow: `0 0 0 1px ${color}20, 0 8px 32px ${color}25`,
              }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-widest mb-4"
                style={{ color }}
              >
                Your dominant script
              </p>

              <div className="flex items-start gap-4">
                {/* Script icon with trophy wiggle */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color + "18", color }}
                  animate={
                    prefersReduced
                      ? {}
                      : { rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.08, 1] }
                  }
                  transition={{ duration: 0.6, delay: cardDelay(1) + 0.4 }}
                  aria-hidden="true"
                >
                  <Icon className="w-7 h-7" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Word-by-word script name reveal */}
                  <div
                    className="text-4xl font-bold tracking-tight mb-1 overflow-hidden leading-tight"
                    style={{ color }}
                    aria-label={script?.name ?? dominant}
                  >
                    {scriptWords.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        style={{ display: "inline-block", whiteSpace: "pre" }}
                      >
                        {word.split("").map((char, charIndex) => (
                          <motion.span
                            key={charIndex}
                            aria-hidden="true"
                            style={{ display: "inline-block" }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.15,
                              delay: cardDelay(1) + 0.3 + wordIndex * 0.06,
                              ease: "easeOut",
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                        {wordIndex < scriptWords.length - 1 && (
                          <span aria-hidden="true">&nbsp;</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm font-medium mb-2" style={{ color }}>
                    This is your strongest pattern.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {interp.headline}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Interpretation card */}
            <motion.div
              className="rounded-2xl p-6 mb-5"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING_BOUNCY, delay: cardDelay(2) }}
              style={{
                background: color + "08",
                border: `1px solid ${color}20`,
              }}
            >
              <h2 className="text-sm font-semibold mb-3">What This Means</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {interp.description}
              </p>

              <h3 className="text-xs font-semibold text-text-primary mb-1.5">
                Watch For:
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {interp.watchFor}
              </p>

              <h3 className="text-xs font-semibold text-text-primary mb-1.5">
                Your Strength:
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {interp.strength}
              </p>
            </motion.div>

            {/* Counter-move */}
            {counterMove && (
              <motion.div
                className="bg-surface border border-border rounded-2xl p-5 mb-5"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: cardDelay(3) }}
              >
                <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  Your Counter-Move
                </h2>
                <p className="text-sm font-medium text-accent mb-2">
                  {counterMove.intervention}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {counterMove.mechanism}
                </p>
              </motion.div>
            )}

            {/* Secondary script */}
            {result.secondary && (
              <motion.div
                className="rounded-2xl p-5 mb-5"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: cardDelay(4) }}
                style={{
                  background: (SCRIPT_COLORS[result.secondary] ?? FALLBACK_COLOR) + "0A",
                  border: `1px solid ${(SCRIPT_COLORS[result.secondary] ?? FALLBACK_COLOR)}20`,
                }}
              >
                <p
                  className="text-[10px] font-mono uppercase tracking-widest mb-3"
                  style={{ color: SCRIPT_COLORS[result.secondary] ?? FALLBACK_COLOR }}
                >
                  Your secondary script
                </p>
                <p className="text-sm font-semibold mb-1">
                  <span style={{ color: SCRIPT_COLORS[result.secondary] ?? FALLBACK_COLOR }}>
                    {getScriptById(result.secondary)?.name}
                  </span>
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {"This one shows up when your primary pattern isn\u2019t enough. "}
                  {"You also scored high on "}
                  <span
                    className="font-semibold"
                    style={{ color: SCRIPT_COLORS[result.secondary] ?? FALLBACK_COLOR }}
                  >
                    {getScriptById(result.secondary)?.name}
                  </span>
                  {
                    ". Multiple active scripts can create internal conflict \u2014 for example, avoidance + worship creates a push-pull between wanting more money and feeling guilty about it."
                  }
                </p>
              </motion.div>
            )}

            {/* Score breakdown */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_GENTLE, delay: cardDelay(5) }}
            >
              <h2 className="text-sm font-semibold mb-1">How your scores break down</h2>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                {"The quiz measures four money scripts. Here\u2019s how yours scored."}
              </p>
              <div className="flex flex-col gap-3">
                {result.scores.map((s, i) => (
                  <ScoreBar
                    key={s.scriptId}
                    scriptId={s.scriptId}
                    normalized={s.normalized}
                    label={s.label}
                    animationDelay={cardDelay(5) + i * STAGGER_MEDIUM}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA section */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_GENTLE, delay: cardDelay(6) }}
            >
              <Link
                href="/scripts"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: color }}
              >
                <BookOpen className="w-4 h-4" />
                Build your action plan
              </Link>
              <button
                onClick={() => setRetakeConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake quiz
              </button>
            </motion.div>

            {/* Retake confirmation */}
            <AnimatePresence>
              {retakeConfirm && (
                <motion.div
                  className="bg-surface border border-border rounded-2xl p-5 mb-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-sm font-semibold mb-1">Retake the quiz?</h3>
                  <p className="text-xs text-text-secondary mb-4">
                    Your current results will be replaced. Your progress and streak stay the same.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={onRetake}
                      className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-opacity hover:opacity-90"
                      style={{ background: color }}
                    >
                      Yes, retake it
                    </button>
                    <button
                      onClick={() => setRetakeConfirm(false)}
                      className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-border text-text-secondary hover:bg-surface-alt transition-colors"
                    >
                      Keep my results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <motion.p
              className="text-[10px] text-text-muted text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: cardDelay(7) }}
            >
              Based on research by Klontz et al. (Financial Planning Association).
              This assessment is educational &mdash; not clinical advice. For financial
              therapy, consult a certified financial therapist (CFT).
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function QuizPage() {
  const questions = useMemo(() => getOrderedQuestions(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  // direction: 1 = forward (new enters from right), -1 = backward (new enters from left)
  const [direction, setDirection] = useState<1 | -1>(1);
  // Track previous index to derive direction on state-driven navigation (auto-advance)
  const prevIndexRef = useRef(0);
  // Live region for screen reader question announcements
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion() ?? false;

  // Load existing result on mount
  useEffect(() => {
    const existing = loadQuizResult();
    if (existing) {
      setResult(existing);
      // Previous session result: skip celebration, show results directly
      setResultsVisible(true);
    }
    setLoaded(true);
  }, []);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] ?? null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  // Announce the new question to screen readers whenever the index changes
  useEffect(() => {
    if (!loaded || !currentQuestion) return;
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Question ${currentIndex + 1} of ${questions.length}. ${currentQuestion.text}`;
    }
  }, [currentIndex, loaded, currentQuestion, questions.length]);

  // Central navigation function -- always sets direction before updating index
  const navigateToIndex = useCallback((nextIndex: number) => {
    const newDirection = nextIndex >= prevIndexRef.current ? 1 : -1;
    setDirection(newDirection as 1 | -1);
    prevIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      const wasUnanswered = answers[currentQuestion.id] === undefined;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

      // Auto-advance only for first-time answers (not revisions)
      if (wasUnanswered && currentIndex < questions.length - 1) {
        setTimeout(() => {
          navigateToIndex(currentIndex + 1);
        }, 400);
      }
    },
    [currentQuestion, answers, currentIndex, questions.length, navigateToIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      navigateToIndex(currentIndex + 1);
    }
  }, [currentIndex, questions.length, navigateToIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      navigateToIndex(currentIndex - 1);
    }
  }, [currentIndex, navigateToIndex]);

  const handleSubmit = useCallback(() => {
    const quizAnswers: QuizAnswer[] = Object.entries(answers).map(
      ([questionId, value]) => ({ questionId, value })
    );
    // Data FIRST, then celebration -- spec requirement
    const scored = scoreQuiz(quizAnswers);
    saveQuizResult(scored);
    setResult(scored);
    // Hide results until celebration dismisses
    setResultsVisible(false);
    setShowCelebration(true);
  }, [answers]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setDirection(1);
    prevIndexRef.current = 0;
    setResult(null);
    setShowCelebration(false);
    setResultsVisible(false);
    clearQuizResult();
    // Navigate to index 0 last so direction is already reset
    setCurrentIndex(0);
  }, []);

  const handleCelebrationReveal = useCallback(() => {
    setShowCelebration(false);
    setResultsVisible(true);
  }, []);

  // Directional slide variants: x offset flips based on navigation direction
  // Reduced motion: opacity-only crossfade, no x slide
  const questionVariants = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        // Enter: comes from the direction of travel
        initial: { opacity: 0, x: direction * 40 },
        animate: {
          opacity: 1,
          x: 0,
          transition: SPRING_SNAPPY,
        },
        // Exit: leaves toward the opposite direction of travel
        exit: {
          opacity: 0,
          x: direction * -40,
          transition: { duration: 0.15, ease: "easeIn" as const },
        },
      };

  // Question text enters slightly after the container, giving a layered feel
  const questionTextVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.1 } } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0, transition: { ...SPRING_GENTLE, delay: 0.08 } },
      };

  // Counter (e.g. "3 of 16") fades in from slightly above
  const counterVariants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.1 } } }
    : {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
      };

  if (!loaded) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse h-8 w-64 bg-border rounded-lg mx-auto mb-4" />
          <div className="animate-pulse h-4 w-48 bg-border rounded mx-auto" />
        </div>
      </div>
    );
  }

  // Resolve dominant script info for the celebration overlay
  const dominantScriptColor = result
    ? (SCRIPT_COLORS[result.dominant] ?? FALLBACK_COLOR)
    : FALLBACK_COLOR;
  const dominantScriptName = result
    ? (getScriptById(result.dominant)?.name ?? result.dominant)
    : "";

  // If we have a result, show celebration + results (quiz questions hidden)
  if (result) {
    return (
      <>
        <QuizCompletionCelebration
          visible={showCelebration}
          dominantScriptName={dominantScriptName}
          dominantScriptColor={dominantScriptColor}
          onReveal={handleCelebrationReveal}
        />
        <ResultsView
          result={result}
          onRetake={handleRetake}
          visible={resultsVisible}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Accessible live region -- screen reader hears question change */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/scripts"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold">Money Script Quiz</h1>
        </div>
        <p className="text-xs text-text-muted mb-6 pl-11">
          16 questions. Takes about 3 minutes. Be honest -- there are no wrong answers.
        </p>

        {/* Progress */}
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {/*
          Question region wrapper:
          - layout prop lets Framer Motion smoothly handle height changes between
            short and tall questions (prevents abrupt CLS).
          - minHeight prevents surrounding chrome from jumping when very short
            questions transition to very long ones.
        */}
        <motion.div layout style={{ minHeight: 200 }} className="mb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              // Use question ID as key so AnimatePresence detects the change.
              // If question IDs could repeat across retakes, append a retake
              // counter here (e.g., `${retakeCount}-${currentQuestion.id}`).
              key={currentQuestion.id}
              variants={questionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-surface ring-1 ring-zinc-200/60 rounded-xl p-6"
            >
              {/* Question counter -- keyed separately so it fades in sync with question */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`counter-${currentIndex}`}
                  variants={counterVariants}
                  initial="initial"
                  animate="animate"
                  className="block text-xs text-text-muted font-mono tabular-nums mb-3"
                  aria-hidden="true"
                >
                  {currentIndex + 1} of {questions.length}
                </motion.span>
              </AnimatePresence>

              {/* Question text -- enters slightly after container to layer the entrance */}
              <motion.p
                variants={questionTextVariants}
                initial="initial"
                animate="animate"
                className="text-base font-medium leading-snug"
                style={{ color: "var(--color-text-primary)" }}
              >
                {currentQuestion.text}
              </motion.p>

              {/*
                LikertScale is keyed by question ID so it fully remounts on
                each question change. This ensures the stagger animation
                replays from scratch for every new question.
              */}
              <LikertScale
                key={currentQuestion.id}
                value={currentAnswer}
                onChange={handleAnswer}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.96 }}
            transition={SPRING_SNAPPY}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </motion.button>

          {allAnswered ? (
            <motion.button
              onClick={handleSubmit}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              transition={SPRING_SNAPPY}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-accent text-white hover:bg-accent-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
            >
              See My Results
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              disabled={
                currentAnswer === null || currentIndex === questions.length - 1
              }
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              transition={SPRING_SNAPPY}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        {/* Answer count */}
        <p className="text-[10px] text-text-muted text-center mt-6">
          {answeredCount} of {questions.length} answered
        </p>
      </div>
    </div>
  );
}
