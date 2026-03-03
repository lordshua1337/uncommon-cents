"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Check,
  X,
  ArrowRight,
  BookOpen,
  CircleDot,
} from "lucide-react";
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

const MILESTONE_LABELS: Record<number, string> = {
  3: "3-Day Learner",
  7: "Week of Wealth",
  14: "Finance Fortnight",
  30: "Monthly Maven",
  60: "Two-Month Pro",
  100: "Century Club",
};

type QuizPhase = "intro" | "question" | "result";

function StreakBadge({ streak }: { readonly streak: StreakState }) {
  const isActive = streak.currentStreak > 0;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? "bg-gold/15 text-gold-light"
          : "bg-border-light text-text-muted"
      }`}
    >
      <Flame className={`w-3.5 h-3.5 ${isActive ? "text-gold" : ""}`} />
      {streak.currentStreak > 0 ? (
        <span>{streak.currentStreak} day streak</span>
      ) : (
        <span>Start a streak</span>
      )}
    </div>
  );
}

export default function DailyLessonCard() {
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    const loaded = loadStreak();
    setStreak(loaded);
    setLesson(getDailyLesson());
    if (loaded.completedToday) {
      setPhase("result");
    }
  }, []);

  function handleStartLesson() {
    setPhase("question");
  }

  function handleAnswer(option: QuizOption) {
    if (!streak || selectedOption) return;
    setSelectedOption(option);

    const updated = completeToday(streak, option.isCorrect);
    setStreak(updated);

    const reached = getReachedMilestone(updated.currentStreak);
    if (reached) {
      setMilestone(reached);
      setTimeout(() => setMilestone(null), 3000);
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

  const conceptProgress = getConceptProgress();
  const nextMilestone = getNextMilestone(streak.currentStreak);
  const progressToMilestone = streak.currentStreak / nextMilestone;
  const accuracy =
    streak.totalAnswers > 0
      ? Math.round((streak.correctAnswers / streak.totalAnswers) * 100)
      : 0;

  return (
    <div className="relative bg-surface rounded-xl border border-border p-6 card-hover overflow-hidden">
      {/* Milestone celebration overlay */}
      {milestone && (
        <div className="absolute inset-0 bg-accent/5 flex items-center justify-center z-10 rounded-xl animate-fade-in">
          <div className="text-center">
            <Flame className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-lg font-semibold text-accent">
              {MILESTONE_LABELS[milestone] || `${milestone}-Day Streak!`}
            </p>
            <p className="text-sm text-text-muted mt-1">Keep it up!</p>
          </div>
        </div>
      )}

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

      {/* Phase: Intro */}
      {phase === "intro" && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {lesson.concept.summary}
          </p>
          <button
            onClick={handleStartLesson}
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors"
          >
            Start Lesson
          </button>
        </div>
      )}

      {/* Phase: Question */}
      {phase === "question" && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {lesson.concept.layers.accessible.split(".").slice(0, 2).join(".") +
              "."}
          </p>

          <div className="border-t border-border-light pt-4">
            <p className="text-sm font-medium mb-3">{lesson.question}</p>
            <div className="space-y-2">
              {lesson.options.map((option, i) => {
                const isSelected = selectedOption?.text === option.text;
                const showResult = selectedOption !== null;
                const isCorrect = option.isCorrect;

                let optionStyle =
                  "border-border hover:border-accent/40 cursor-pointer";
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
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
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
                    <span className="leading-snug line-clamp-2">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Phase: Result */}
      {phase === "result" && (
        <div className="space-y-4">
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
        </div>
      )}

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
              {MILESTONE_LABELS[nextMilestone] ||
                `${nextMilestone}-day streak`}
            </span>
          </div>
          <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(progressToMilestone * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
