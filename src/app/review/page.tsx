"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------

type ReviewMode = "self-rate" | "quiz";

// ---------------------------------------------------------------------------
// Self-Rating Card
// ---------------------------------------------------------------------------

function SelfRateCard({
  card,
  onRate,
}: {
  card: ReviewCard;
  onRate: (rating: number) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const concept = concepts.find((c) => c.id === card.conceptId);

  if (!concept) return null;

  const ratings = [
    { value: 0, label: "Blackout", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    { value: 1, label: "Wrong", color: "bg-red-400/10 text-red-400 border-red-400/20" },
    { value: 2, label: "Hard", color: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
    { value: 3, label: "OK", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
    { value: 4, label: "Good", color: "bg-green-400/10 text-green-400 border-green-400/20" },
    { value: 5, label: "Easy", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  ];

  return (
    <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
      {/* Front */}
      <div className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
        <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">
          What do you remember about...
        </p>
        <h2 className="text-lg font-semibold text-text-primary">
          {concept.name}
        </h2>
        <p className="text-xs text-text-secondary mt-2">{concept.summary}</p>
      </div>

      {/* Flip / Answer */}
      {!flipped ? (
        <div className="border-t border-border-light p-4 text-center">
          <button
            onClick={() => setFlipped(true)}
            className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Show Answer
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border-light"
        >
          <div className="p-4 bg-accent/5">
            <p className="text-xs text-text-secondary leading-relaxed">
              {concept.layers.accessible.slice(0, 300)}
              {concept.layers.accessible.length > 300 ? "..." : ""}
            </p>
          </div>
          <div className="p-4">
            <p className="text-[10px] text-text-secondary mb-2 text-center">
              How well did you remember this?
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {ratings.map((r) => (
                <button
                  key={r.value}
                  onClick={() => onRate(r.value)}
                  className={`py-2 rounded-lg border text-[10px] font-medium transition-colors hover:opacity-80 ${r.color}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
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
    <div className="bg-surface border border-border-light rounded-xl p-6">
      <p className="text-[10px] text-accent uppercase tracking-wider mb-2">
        {question.conceptName}
      </p>
      <h3 className="text-sm font-semibold mb-4">{question.question}</h3>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          let optionClass = "border-border-light hover:border-accent/30";
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
              className={`w-full text-left px-4 py-3 rounded-lg border text-xs transition-all ${optionClass}`}
            >
              <div className="flex items-center gap-2">
                {revealed && i === question.correctIndex && (
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                )}
                {revealed && i === selected && i !== question.correctIndex && (
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
          className="mt-3 p-3 bg-accent/5 border border-accent/10 rounded-lg"
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
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  useEffect(() => {
    const loaded = loadReviewState();
    // Auto-add concepts if no cards exist
    if (loaded.cards.length === 0) {
      let s = loaded;
      // Add first 10 concepts to get started
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

  const handleSelfRate = useCallback(
    (rating: number) => {
      if (!state || !currentCard) return;
      const updated = processReview(state, currentCard.conceptId, rating);
      setState(updated);
      setSessionTotal((t) => t + 1);
      if (rating >= 3) setSessionCorrect((c) => c + 1);

      if (currentIndex + 1 < dueCards.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        setSessionComplete(true);
      }
    },
    [state, currentCard, currentIndex, dueCards.length]
  );

  const handleQuizAnswer = useCallback(
    (correct: boolean) => {
      if (!state || !currentCard) return;
      const rating = correct ? 4 : 1;
      const updated = processReview(state, currentCard.conceptId, rating);
      setState(updated);
      setSessionTotal((t) => t + 1);
      if (correct) setSessionCorrect((c) => c + 1);

      setTimeout(() => {
        if (currentIndex + 1 < dueCards.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          setSessionComplete(true);
        }
      }, 500);
    },
    [state, currentCard, currentIndex, dueCards.length]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSessionComplete(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setState(loadReviewState());
  }, []);

  if (!state || !stats) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Loading review cards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                Review
              </h1>
              <p className="text-xs text-text-secondary">
                {stats.due} cards due -- {stats.mastered} mastered
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-surface border border-border-light rounded-lg p-0.5">
            <button
              onClick={() => setMode("self-rate")}
              className={`text-[10px] px-3 py-1.5 rounded transition-colors ${
                mode === "self-rate"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary"
              }`}
            >
              Flashcard
            </button>
            <button
              onClick={() => setMode("quiz")}
              className={`text-[10px] px-3 py-1.5 rounded transition-colors ${
                mode === "quiz"
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary"
              }`}
            >
              Quiz
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono">{stats.total}</p>
            <p className="text-[10px] text-text-secondary">Total</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-amber-400">
              {stats.due}
            </p>
            <p className="text-[10px] text-text-secondary">Due</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-blue-400">
              {stats.learning}
            </p>
            <p className="text-[10px] text-text-secondary">Learning</p>
          </div>
          <div className="bg-surface border border-border-light rounded-lg p-3 text-center">
            <p className="text-lg font-bold font-mono text-green-400">
              {stats.mastered}
            </p>
            <p className="text-[10px] text-text-secondary">Mastered</p>
          </div>
        </div>

        {/* No cards due */}
        {dueCards.length === 0 && !sessionComplete && (
          <div className="bg-surface border border-border-light rounded-xl p-8 text-center">
            <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
            <h2 className="text-sm font-semibold mb-1">All Caught Up</h2>
            <p className="text-xs text-text-secondary mb-4">
              No cards due for review right now. Come back later or add more
              concepts.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent-light transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Explore Concepts
            </Link>
          </div>
        )}

        {/* Session complete */}
        {sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-accent/20 rounded-xl p-8 text-center"
          >
            <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-1">Session Complete</h2>
            <p className="text-sm text-text-secondary mb-4">
              {sessionCorrect}/{sessionTotal} correct (
              {sessionTotal > 0
                ? Math.round((sessionCorrect / sessionTotal) * 100)
                : 0}
              %)
            </p>
            <button
              onClick={handleRestart}
              className="text-xs text-accent hover:text-accent-light transition-colors flex items-center gap-1 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Review Again
            </button>
          </motion.div>
        )}

        {/* Active review */}
        {!sessionComplete && currentCard && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-text-secondary">
                Card {currentIndex + 1} of {dueCards.length}
              </span>
              <span className="text-[10px] text-accent font-mono">
                {sessionCorrect}/{sessionTotal} correct
              </span>
            </div>
            <div className="h-1 bg-surface rounded-full mb-4">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{
                  width: `${((currentIndex + 1) / dueCards.length) * 100}%`,
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCard.conceptId}_${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {mode === "self-rate" ? (
                  <SelfRateCard card={currentCard} onRate={handleSelfRate} />
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

        {/* Add concepts link */}
        <div className="mt-6 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-[10px] text-text-secondary hover:text-accent transition-colors"
          >
            <Layers className="w-3 h-3" />
            Add more concepts to review
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
