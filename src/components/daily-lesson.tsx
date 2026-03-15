"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, ArrowRight, BookOpen, CircleDot, Snowflake } from "lucide-react";
import {
  loadStreak,
  completeToday,
  getReachedMilestone,
  getNextMilestone,
  type StreakState,
} from "@/lib/daily-streak";
import {
  getDailyLesson,
  getConceptProgress,
  type DailyLesson,
  type QuizOption,
} from "@/lib/daily-lesson";
import { StreakFlame } from "@/components/streak/streak-flame";
import { MilestoneCelebration } from "@/components/streak/milestone-celebration";
import { getStreakStatus, getWarmthColor } from "@/lib/streak-status";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MILESTONE_LABELS: Readonly<Record<number, string>> = {
  3: "3-Day Learner",
  7: "Week of Wealth",
  14: "Finance Fortnight",
  30: "Monthly Maven",
  60: "Two-Month Pro",
  100: "Century Club",
} as const;

// ---------------------------------------------------------------------------
// StreakBadge
// ---------------------------------------------------------------------------

function StreakBadge({ streak }: { readonly streak: StreakState }) {
  const status = getStreakStatus(streak);
  const isActive = streak.currentStreak > 0;
  const warmthColor = getWarmthColor(streak.currentStreak);

  let badgeStyle = "";
  let labelText = "";
  let extra: React.ReactNode = null;

  switch (status) {
    case "active":
      badgeStyle = "bg-gold/15 text-gold-light";
      labelText = `${streak.currentStreak} day streak`;
      break;
    case "at-risk":
      badgeStyle = "bg-amber-900/30 text-amber-300 border border-amber-500/40";
      labelText = "Last chance!";
      break;
    case "grace":
      badgeStyle = "bg-blue-900/30 text-blue-300 border border-blue-500/40";
      labelText = "Frozen";
      extra = <Snowflake className="w-3 h-3 text-blue-400" />;
      break;
    case "broken":
      badgeStyle = "bg-red-900/20 text-red-400";
      labelText = "Streak broken";
      break;
    case "dormant":
      badgeStyle = "bg-border-light text-text-muted";
      labelText = "Start a streak";
      break;
  }

  const flameOpacity = status === "grace" ? 0.6 : 1;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${badgeStyle}`}
      style={isActive ? { borderColor: `${warmthColor}30` } : undefined}
    >
      <span style={{ opacity: flameOpacity }}>
        <StreakFlame streak={streak.currentStreak} status={status} size="sm" />
      </span>
      {extra}
      <span>{labelText}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DailyLessonCard
// ---------------------------------------------------------------------------

type QuizPhase = "intro" | "question" | "result";

export default function DailyLessonCard() {
  const prefersReduced = useReducedMotion();
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [shakeOption, setShakeOption] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadStreak();
    setStreak(loaded);
    setLesson(getDailyLesson());
    if (loaded.completedToday) {
      setPhase("result");
    }
    // Animate progress bar from 0 to actual width
    const next = getNextMilestone(loaded.currentStreak);
    const pct = Math.min((loaded.currentStreak / next) * 100, 100);
    const t = setTimeout(() => setProgressWidth(pct), 120);
    return () => clearTimeout(t);
  }, []);

  const handleDismissMilestone = useCallback(() => setMilestone(null), []);

  function handleStartLesson() {
    setPhase("question");
  }

  function handleAnswer(option: QuizOption) {
    if (!streak || selectedOption) return;
    setSelectedOption(option);

    if (!option.isCorrect) {
      setShakeOption(option.text);
      setTimeout(() => setShakeOption(null), 600);
    }

    const updated = completeToday(streak, option.isCorrect);
    setStreak(updated);

    const reached = getReachedMilestone(updated.currentStreak);
    if (reached) {
      setMilestone(reached);
    }

    setTimeout(() => setPhase("result"), 1200);
  }

  // SSR placeholder
  if (!streak || !lesson) {
    return (
      <div className="bg-surface rounded-xl border border-border p-6 animate-pulse">
        <div className="h-4 bg-border-light rounded w-28 mb-4" />
        <div className="h-6 bg-border-light rounded w-48 mb-3" />
        <div className="h-4 bg-border-light rounded w-full mb-2" />
        <div className="h-4 bg-border-light rounded w-3/4" />
      </div>
    );
  }

  const status = getStreakStatus(streak);
  const warmthColor = getWarmthColor(streak.currentStreak);

  const nextMilestone = getNextMilestone(streak.currentStreak);
  const accuracy =
    streak.totalAnswers > 0
      ? Math.round((streak.correctAnswers / streak.totalAnswers) * 100)
      : 0;

  // Phase transition variants
  const phaseVariants = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReduced ? 0 : -8 },
  };
  const phaseDuration = 0.25;

  return (
    <motion.div
      className="relative bg-surface rounded-xl border border-border p-6 card-hover overflow-hidden"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Milestone celebration overlay (replaces old inline overlay) */}
      <MilestoneCelebration milestone={milestone} onDismiss={handleDismissMilestone} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <span className="text-xs text-accent uppercase tracking-widest font-medium">
            Daily Money Minute
          </span>
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Domain tag */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${lesson.domainColor}15`,
            color: lesson.domainColor,
          }}
        >
          {lesson.domainName}
        </span>
        {!streak.completedToday && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
            New
          </span>
        )}
      </div>

      {/* Concept title */}
      <h3 className="text-lg font-semibold mb-2">{lesson.concept.name}</h3>

      {/* Phase content with AnimatePresence transitions */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: phaseDuration }}
            className="space-y-4"
          >
            <p className="text-sm text-text-secondary leading-relaxed">
              {lesson.concept.summary}
            </p>
            <button
              onClick={handleStartLesson}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors"
            >
              Start Lesson
            </button>
          </motion.div>
        )}

        {phase === "question" && (
          <motion.div
            key="question"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: phaseDuration }}
            className="space-y-4"
          >
            <p className="text-sm text-text-secondary leading-relaxed">
              {lesson.concept.layers.accessible.split(".").slice(0, 2).join(".") + "."}
            </p>

            <div className="border-t border-border-light pt-4">
              <p className="text-sm font-medium mb-3">{lesson.question}</p>
              <div className="space-y-2">
                {lesson.options.map((option, i) => {
                  const isSelected = selectedOption?.text === option.text;
                  const showResult = selectedOption !== null;
                  const isCorrect = option.isCorrect;
                  const isShaking = shakeOption === option.text;

                  let optionStyle = "border-border hover:border-accent/40 cursor-pointer";
                  if (showResult && isSelected && isCorrect) {
                    optionStyle = "border-accent bg-accent/5";
                  } else if (showResult && isSelected && !isCorrect) {
                    optionStyle = "border-red bg-red/5";
                  } else if (showResult && isCorrect) {
                    optionStyle = "border-accent/40 bg-accent/5";
                  } else if (showResult) {
                    optionStyle = "border-border opacity-50";
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                      initial={{ opacity: 0, x: prefersReduced ? 0 : -8 }}
                      animate={
                        isShaking && !prefersReduced
                          ? { x: [-4, 4, -4, 4, 0], opacity: 1 }
                          : showResult && isSelected && isCorrect && !prefersReduced
                          ? { scale: [1, 1.03, 1], opacity: 1 }
                          : { opacity: 1, x: 0 }
                      }
                      transition={
                        isShaking
                          ? { duration: 0.4, ease: "easeInOut" }
                          : showResult && isSelected && isCorrect
                          ? { duration: 0.25 }
                          : {
                              duration: 0.25,
                              delay: prefersReduced ? 0 : i * 0.06,
                            }
                      }
                    >
                      <span className="flex-shrink-0 mt-0.5">
                        {showResult && isCorrect ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : showResult && isSelected ? (
                          <X className="w-4 h-4 text-red" />
                        ) : (
                          <CircleDot className="w-4 h-4 text-text-muted" />
                        )}
                      </span>
                      <span className="leading-snug line-clamp-2">{option.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            variants={phaseVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: phaseDuration }}
            className="space-y-4"
          >
            {selectedOption && (
              <div
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  selectedOption.isCorrect ? "text-accent" : "text-gold"
                }`}
              >
                {selectedOption.isCorrect ? (
                  <>
                    <Check className="w-4 h-4" /> Correct!
                  </>
                ) : (
                  <>Got it -- here&apos;s the explanation:</>
                )}
              </div>
            )}

            <p className="text-sm text-text-secondary leading-relaxed">
              {lesson.explanation}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
                <Check className="w-4 h-4" />
                Done for today
              </div>
              <Link
                href={`/concepts/${lesson.concept.slug}`}
                className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
              >
                Deep dive
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress footer */}
      {streak.currentStreak > 0 && (
        <div className="mt-4 pt-3 border-t border-border-light">
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
            <span>
              {streak.totalDaysActive} lessons
              {streak.totalAnswers > 0 ? ` -- ${accuracy}% accuracy` : ""}
            </span>
            <span>
              {nextMilestone - streak.currentStreak} to{" "}
              {MILESTONE_LABELS[nextMilestone] ?? `${nextMilestone}-day streak`}
            </span>
          </div>
          <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${warmthColor}99, ${warmthColor})`,
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
