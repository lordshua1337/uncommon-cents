"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  ChevronDown,
  BookOpen,
  Eye,
  Flame,
  Shield,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import {
  calculateHealthScore,
  saveScoreToHistory,
  getScoreGrade,
  type HealthScore,
  type PillarId,
  type PillarScore,
  type HealthScoreHistory,
} from "@/lib/health-score";
import { HealthScoreRing, PillarBar, getGradeColor } from "@/components/health-score-ring";
import { SPRING_GENTLE, SPRING_SNAPPY, STAGGER_MEDIUM } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Pillar icon map
// ---------------------------------------------------------------------------

const PILLAR_ICONS: Record<
  PillarId,
  React.ComponentType<{ className?: string }>
> = {
  knowledge: BookOpen,
  awareness: Eye,
  practice: Flame,
  defense: Shield,
  growth: TrendingUp,
};

// ---------------------------------------------------------------------------
// Pillar Detail Card
// ---------------------------------------------------------------------------

function PillarCard({ pillar, index = 0 }: { pillar: PillarScore; index?: number }) {
  const [open, setOpen] = useState(false);
  const [ariaExpanded, setAriaExpanded] = useState(false);
  const prefersReduced = useReducedMotion();
  const Icon = PILLAR_ICONS[pillar.id];
  const grade = getScoreGrade(pillar.score);

  // Clamp score defensively
  const clampedScore = Math.min(100, Math.max(0, pillar.score));

  const cardDelay = index * STAGGER_MEDIUM;
  const barDelay = cardDelay + 0.15;

  const cardInitial = prefersReduced ? undefined : { opacity: 0, y: 16 };
  const cardAnimate = prefersReduced ? undefined : { opacity: 1, y: 0 };
  const cardTransition = prefersReduced
    ? { duration: 0 }
    : { ...SPRING_GENTLE, delay: cardDelay };

  function handleToggle() {
    setOpen((prev) => !prev);
    setAriaExpanded((prev) => !prev);
  }

  return (
    <motion.div
      className="bg-surface border border-border-light rounded-xl overflow-hidden"
      initial={cardInitial}
      animate={cardAnimate}
      transition={cardTransition}
      whileHover={prefersReduced ? undefined : { scale: 1.005, y: -1 }}
      layout
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-alt transition-colors"
        role="button"
        aria-expanded={ariaExpanded}
        aria-controls={`pillar-detail-${pillar.id}`}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: pillar.color + "18" }}
        >
          <span style={{ color: pillar.color }}>
            <Icon className="w-4 h-4" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{pillar.label}</span>
            <span
              className="text-xs font-mono font-bold tabular-nums"
              style={{ color: pillar.color }}
              aria-label={`${pillar.label} score: ${clampedScore} out of 100`}
            >
              {clampedScore}/100
            </span>
          </div>
          <div
            className="h-1.5 bg-border-light rounded-full mt-1.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={clampedScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pillar.label} health bar`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${pillar.color} 0%, ${pillar.color}cc 100%)`,
              }}
              initial={prefersReduced ? undefined : { width: "0%" }}
              animate={{ width: `${clampedScore}%` }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { ...SPRING_GENTLE, delay: barDelay }
              }
            />
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: grade.color + "15",
            color: grade.color,
          }}
        >
          {grade.grade}
        </span>
        <motion.div
          animate={prefersReduced ? undefined : { rotate: open ? 180 : 0 }}
          transition={prefersReduced ? { duration: 0 } : SPRING_SNAPPY}
        >
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`pillar-detail-${pillar.id}`}
            initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            animate={prefersReduced ? undefined : { height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    height: { ...SPRING_GENTLE },
                    opacity: { duration: 0.2 },
                  }
            }
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-3 space-y-3"
              style={{ borderTop: `1px solid ${pillar.color}20` }}
            >
              {/* Detail metrics */}
              {pillar.details.map((detail) => (
                <div key={detail.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">{detail.label}</span>
                    <span className="font-mono">{detail.value}</span>
                  </div>
                  <div className="h-1 bg-border-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${detail.percent}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              {pillar.suggestions.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted mb-1.5">
                    How to improve
                  </p>
                  <ul className="space-y-1.5">
                    {pillar.suggestions.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-xs text-text-secondary"
                      >
                        <Lightbulb className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// History Sparkline
// ---------------------------------------------------------------------------

function ScoreSparkline({ history }: { history: HealthScoreHistory }) {
  if (history.entries.length < 2) return null;

  const entries = history.entries.slice(-14); // last 14 entries
  const width = 280;
  const height = 60;
  const padding = 4;

  const maxScore = 100;
  const stepX = (width - padding * 2) / (entries.length - 1);

  const points = entries
    .map((e, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((e.total / maxScore) * (height - padding * 2));
      return `${x},${y}`;
    })
    .join(" ");

  const lastEntry = entries[entries.length - 1];
  const prevEntry = entries[entries.length - 2];
  const diff = lastEntry.total - prevEntry.total;

  return (
    <div className="bg-surface border border-border-light rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-text-secondary">Score History</p>
        {diff !== 0 && (
          <span
            className={`text-xs font-mono ${
              diff > 0 ? "text-accent" : "text-red"
            }`}
          >
            {diff > 0 ? "+" : ""}
            {diff} pts
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: 60 }}
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots at each point */}
        {entries.map((e, i) => {
          const x = padding + i * stepX;
          const y =
            height - padding - ((e.total / maxScore) * (height - padding * 2));
          return (
            <circle
              key={e.timestamp}
              cx={x}
              cy={y}
              r={i === entries.length - 1 ? 3 : 1.5}
              fill="var(--color-accent)"
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-text-muted">
          {new Date(entries[0].timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="text-[9px] text-text-muted">
          {new Date(entries[entries.length - 1].timestamp).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          )}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ScorePage() {
  const [score, setScore] = useState<HealthScore | null>(null);
  const [history, setHistory] = useState<HealthScoreHistory>({ entries: [] });
  const [ariaAnnouncement, setAriaAnnouncement] = useState("Score loading...");

  useEffect(() => {
    const computed = calculateHealthScore();
    setScore(computed);
    const updated = saveScoreToHistory(computed);
    setHistory(updated);

    // Announce score to screen readers after animation completes
    const announceTimer = setTimeout(() => {
      const grade = getScoreGrade(computed.total);
      setAriaAnnouncement(
        `Your score: ${computed.total}. Grade: ${grade.grade}.`
      );
    }, 1500);

    return () => clearTimeout(announceTimer);
  }, []);

  if (!score) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm text-text-secondary" role="status">
          Calculating your financial health...
        </p>
      </div>
    );
  }

  const grade = getScoreGrade(score.total);
  const gradeColor = getGradeColor(score.total);

  return (
    <>
      {/* Screen reader live region */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </p>

      {/* Page entrance fade-in */}
      <motion.div
        className="min-h-screen pt-20 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING_GENTLE, duration: 0.3 }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Financial Health Score
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                A snapshot of where you stand -- and what to work on next.
              </p>
            </div>
          </div>

          {/* Score Ring -- atmospheric radial halo behind the ring */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${gradeColor}0d 0%, transparent 70%)`,
                padding: "24px",
                borderRadius: "50%",
              }}
            >
              <HealthScoreRing score={score} size={200} />
            </div>

            {/* Grade badge -- fades in after ring completes */}
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_GENTLE, delay: 1.3 }}
            >
              <span
                className="text-sm font-semibold px-4 py-1 rounded-full border"
                style={{
                  backgroundColor: gradeColor + "12",
                  color: gradeColor,
                  borderColor: gradeColor + "30",
                }}
              >
                {grade.grade} &mdash; {grade.label}
              </span>
            </motion.div>
          </div>

          {/* Pillar Overview */}
          <motion.div
            className="bg-surface border border-border-light rounded-xl p-5 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING_GENTLE, delay: 0.4 }}
          >
            <motion.h2
              className="text-sm font-semibold mb-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_GENTLE, delay: 0.3 }}
            >
              What makes up your score
            </motion.h2>
            <p className="text-xs text-text-secondary mb-4 -mt-2">
              Your score is built from five areas. Tap any pillar to see what&apos;s inside.
            </p>
            <div className="space-y-3">
              {score.pillars.map((p, i) => (
                <PillarBar
                  key={p.id}
                  label={p.label}
                  score={p.score}
                  color={p.color}
                  weight={p.weight}
                  index={i}
                />
              ))}
            </div>
          </motion.div>

          {/* History */}
          <ScoreSparkline history={history} />

          {/* Pillar Details */}
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold">Detailed Breakdown</h2>
            {score.pillars.map((p, i) => (
              <PillarCard key={p.id} pillar={p} index={i} />
            ))}
          </div>

          {/* Top Suggestions */}
          {(() => {
            const allSuggestions = score.pillars
              .filter((p) => p.score < 80)
              .sort((a, b) => a.score - b.score)
              .flatMap((p) =>
                p.suggestions.slice(0, 1).map((s) => ({
                  text: s,
                  pillar: p.label,
                  color: p.color,
                }))
              )
              .slice(0, 3);

            if (allSuggestions.length === 0) return null;

            return (
              <div className="mt-6 bg-accent-bg border border-accent/10 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-accent mb-3">
                  Top Actions to Improve
                </h2>
                <ul className="space-y-2">
                  {allSuggestions.map((s) => (
                    <li
                      key={s.text}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span>
                        <span className="font-medium text-text-primary">
                          {s.pillar}:
                        </span>{" "}
                        {s.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          <p className="text-[10px] text-text-muted text-center mt-8">
            Score updates every time you visit this page. Not financial advice.
          </p>
        </div>
      </motion.div>
    </>
  );
}

