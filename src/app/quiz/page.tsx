"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
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

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({
  current,
  total,
}: {
  readonly current: number;
  readonly total: number;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted">
          Question {current} of {total}
        </span>
        <span className="text-xs text-text-muted font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Likert Scale
// ---------------------------------------------------------------------------

function LikertScale({
  value,
  onChange,
}: {
  readonly value: number | null;
  readonly onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 mt-6">
      {LIKERT_LABELS.map((label, i) => {
        const val = i + 1;
        const isSelected = value === val;

        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
            style={{
              background: isSelected ? "var(--color-accent-bg)" : "var(--color-surface)",
              borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
            }}
          >
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
              }}
            >
              {isSelected && (
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
              )}
            </div>
            <span
              className="text-sm transition-colors"
              style={{
                color: isSelected
                  ? "var(--color-accent-dark)"
                  : "var(--color-text-secondary)",
              }}
            >
              {label}
            </span>
          </button>
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
}: {
  readonly scriptId: ScriptId;
  readonly normalized: number;
  readonly label: string;
}) {
  const script = getScriptById(scriptId);
  const color = SCRIPT_COLORS[scriptId];
  const Icon = SCRIPT_ICONS[scriptId];

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results View
// ---------------------------------------------------------------------------

function ResultsView({
  result,
  onRetake,
}: {
  readonly result: QuizResult;
  readonly onRetake: () => void;
}) {
  const dominant = result.dominant;
  const interp = SCRIPT_INTERPRETATIONS[dominant];
  const script = getScriptById(dominant);
  const counterMove = getCounterMoveByScriptId(dominant);
  const color = SCRIPT_COLORS[dominant];
  const Icon = SCRIPT_ICONS[dominant];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: color + "15", color }}
          >
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Money Script</h1>
          <p className="text-lg font-semibold" style={{ color }}>
            {script?.name}
          </p>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
            {interp.headline}
          </p>
        </div>

        {/* Score bars */}
        <div className="flex flex-col gap-3 mb-8">
          {result.scores.map((s) => (
            <ScoreBar
              key={s.scriptId}
              scriptId={s.scriptId}
              normalized={s.normalized}
              label={s.label}
            />
          ))}
        </div>

        {/* Interpretation card */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: color + "08", border: `1px solid ${color}30` }}
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
        </div>

        {/* Counter-move */}
        {counterMove && (
          <div className="bg-surface border border-border rounded-xl p-5 mb-6">
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
          </div>
        )}

        {/* Secondary script */}
        {result.secondary && (
          <div className="bg-surface border border-border rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold mb-2">Secondary Script</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              You also scored high on{" "}
              <span className="font-semibold" style={{ color: SCRIPT_COLORS[result.secondary] }}>
                {getScriptById(result.secondary)?.name}
              </span>
              . Multiple active scripts can create internal conflict -- for example,
              avoidance + worship creates a push-pull between wanting more money and
              feeling guilty about it.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link
            href="/scripts"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-light transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Learn About All Scripts
          </Link>
          <button
            onClick={onRetake}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-text-muted text-center leading-relaxed">
          Based on research by Klontz et al. (Financial Planning Association).
          This assessment is educational -- not clinical advice. For financial
          therapy, consult a certified financial therapist (CFT).
        </p>
      </div>
    </div>
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

  // Load existing result on mount
  useEffect(() => {
    const existing = loadQuizResult();
    if (existing) setResult(existing);
    setLoaded(true);
  }, []);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] ?? null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const handleAnswer = useCallback(
    (value: number) => {
      const wasUnanswered = answers[currentQuestion.id] === undefined;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

      // Auto-advance only for first-time answers (not revisions)
      if (wasUnanswered && currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
        }, 400);
      }
    },
    [currentQuestion, answers, currentIndex, questions.length]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(() => {
    const quizAnswers: QuizAnswer[] = Object.entries(answers).map(
      ([questionId, value]) => ({ questionId, value })
    );
    const scored = scoreQuiz(quizAnswers);
    setResult(scored);
    saveQuizResult(scored);
  }, [answers]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    clearQuizResult();
  }, []);

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

  // Show results if completed
  if (result) {
    return <ResultsView result={result} onRetake={handleRetake} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
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

        {/* Question */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <p className="text-base font-medium text-text-primary leading-relaxed">
            {currentQuestion.text}
          </p>

          <LikertScale value={currentAnswer} onChange={handleAnswer} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {allAnswered ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-accent text-white hover:bg-accent-light transition-colors"
            >
              See My Results
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentAnswer === null || currentIndex === questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
