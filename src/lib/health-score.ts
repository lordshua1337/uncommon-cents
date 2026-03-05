// Financial Health Score Engine
// Composite score (0-100) from 5 pillars: Knowledge, Awareness, Practice, Defense, Growth

import { loadMastery, getOverallMastery, getAllDomainMastery } from "./mastery";
import { loadAchievementState } from "./achievements";
import { loadStreak } from "./daily-streak";
import { loadActionPlan, getActionPlanProgress } from "./action-plan";
import { loadReviewState, getDueCount, getReviewStats } from "./spaced-repetition/engine";
import { loadQuizResult } from "./quiz-engine";
import { getConceptProgress } from "./daily-lesson";
import { loadSavedSimulations } from "./simulator/types";
import { fraudDefenses } from "./fraud-defenses-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PillarScore {
  readonly id: PillarId;
  readonly label: string;
  readonly score: number; // 0-100
  readonly weight: number; // fraction of total (sums to 1)
  readonly color: string; // tailwind-compatible hex
  readonly details: readonly PillarDetail[];
  readonly suggestions: readonly string[];
}

export interface PillarDetail {
  readonly label: string;
  readonly value: string;
  readonly percent: number; // 0-100 contribution to this pillar
}

export interface HealthScore {
  readonly total: number; // 0-100 weighted composite
  readonly pillars: readonly PillarScore[];
  readonly timestamp: string; // ISO date
}

export interface HealthScoreHistory {
  readonly entries: readonly HealthScoreEntry[];
}

export interface HealthScoreEntry {
  readonly total: number;
  readonly pillarScores: Record<PillarId, number>;
  readonly timestamp: string;
}

export type PillarId =
  | "knowledge"
  | "awareness"
  | "practice"
  | "defense"
  | "growth";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon_cents_health_history";
const MAX_HISTORY = 30;

const PILLAR_COLORS: Record<PillarId, string> = {
  knowledge: "#2563EB",
  awareness: "#8B5CF6",
  practice: "#16A34A",
  defense: "#DC2626",
  growth: "#CA8A04",
};

const PILLAR_WEIGHTS: Record<PillarId, number> = {
  knowledge: 0.3,
  awareness: 0.15,
  practice: 0.2,
  defense: 0.15,
  growth: 0.2,
};

// ---------------------------------------------------------------------------
// Pillar Calculators
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreKnowledge(): PillarScore {
  const mastery = loadMastery();
  const overall = getOverallMastery(mastery);
  const domains = getAllDomainMastery(mastery);
  const conceptProgress = getConceptProgress();

  // 60% domain mastery, 40% concept coverage
  const domainScore = overall.overallPercent;
  const coverageScore = conceptProgress;
  const score = clamp(Math.round(domainScore * 0.6 + coverageScore * 0.4), 0, 100);

  const domainsStarted = domains.filter((d) => d.visitedConcepts > 0).length;
  const domainsMastered = domains.filter((d) => d.masteryPercent >= 80).length;

  const suggestions: string[] = [];
  if (overall.visitedConcepts < overall.totalConcepts) {
    const remaining = overall.totalConcepts - overall.visitedConcepts;
    suggestions.push(`Read ${remaining} more concept${remaining === 1 ? "" : "s"} to complete your knowledge base`);
  }
  if (domainsStarted < domains.length) {
    suggestions.push(`Explore ${domains.length - domainsStarted} untouched domain${domains.length - domainsStarted === 1 ? "" : "s"}`);
  }
  if (domainsMastered < domainsStarted && domainsStarted > 0) {
    suggestions.push("Deepen your mastery by reading intermediate and advanced layers");
  }

  return {
    id: "knowledge",
    label: "Knowledge",
    score,
    weight: PILLAR_WEIGHTS.knowledge,
    color: PILLAR_COLORS.knowledge,
    details: [
      {
        label: "Concepts read",
        value: `${overall.visitedConcepts}/${overall.totalConcepts}`,
        percent: overall.totalConcepts > 0
          ? Math.round((overall.visitedConcepts / overall.totalConcepts) * 100)
          : 0,
      },
      {
        label: "Domain mastery",
        value: `${Math.round(overall.overallPercent)}%`,
        percent: Math.round(overall.overallPercent),
      },
      {
        label: "Domains explored",
        value: `${domainsStarted}/${domains.length}`,
        percent: domains.length > 0
          ? Math.round((domainsStarted / domains.length) * 100)
          : 0,
      },
    ],
    suggestions,
  };
}

function scoreAwareness(): PillarScore {
  const quizResult = loadQuizResult();

  // Quiz taken = 70 base points. Having both dominant + secondary = +15 each.
  let score = 0;
  const details: PillarDetail[] = [];
  const suggestions: string[] = [];

  if (quizResult) {
    score = 70;
    details.push({
      label: "Money script quiz",
      value: "Completed",
      percent: 100,
    });
    details.push({
      label: "Dominant script",
      value: quizResult.dominant.charAt(0).toUpperCase() + quizResult.dominant.slice(1),
      percent: 100,
    });
    if (quizResult.secondary) {
      score += 15;
      details.push({
        label: "Secondary script",
        value: quizResult.secondary.charAt(0).toUpperCase() + quizResult.secondary.slice(1),
        percent: 100,
      });
    }
    // Bonus for score spread awareness (understanding all 4 scripts)
    const allScoresAboveZero = quizResult.scores.every((s) => s.normalized > 10);
    if (allScoresAboveZero) {
      score += 15;
    }
    suggestions.push("Retake the quiz periodically to track how your money mindset evolves");
  } else {
    details.push({
      label: "Money script quiz",
      value: "Not taken",
      percent: 0,
    });
    suggestions.push("Take the Money Script Quiz to discover your financial biases");
  }

  return {
    id: "awareness",
    label: "Awareness",
    score: clamp(score, 0, 100),
    weight: PILLAR_WEIGHTS.awareness,
    color: PILLAR_COLORS.awareness,
    details,
    suggestions,
  };
}

function scorePractice(): PillarScore {
  const streak = loadStreak();
  const actionPlan = loadActionPlan();

  // 40% streak consistency, 30% action plan, 30% daily engagement
  const streakScore = clamp(streak.currentStreak * 10, 0, 100); // 10 days = max
  const todayBonus = streak.completedToday ? 100 : 0;

  let actionScore = 0;
  const details: PillarDetail[] = [];
  const suggestions: string[] = [];

  if (actionPlan) {
    const progress = getActionPlanProgress(actionPlan);
    actionScore = Math.round(progress.completionRate);
    details.push({
      label: "Action plan",
      value: `${progress.completed}/${progress.total} done`,
      percent: actionScore,
    });
  } else {
    details.push({
      label: "Action plan",
      value: "Not started",
      percent: 0,
    });
    suggestions.push("Create an action plan to set concrete financial goals");
  }

  details.unshift({
    label: "Current streak",
    value: `${streak.currentStreak} day${streak.currentStreak === 1 ? "" : "s"}`,
    percent: clamp(streak.currentStreak * 10, 0, 100),
  });
  details.push({
    label: "Active today",
    value: streak.completedToday ? "Yes" : "No",
    percent: todayBonus,
  });

  const score = clamp(
    Math.round(streakScore * 0.4 + actionScore * 0.3 + todayBonus * 0.3),
    0,
    100
  );

  if (streak.currentStreak === 0) {
    suggestions.push("Start a learning streak by completing today's review");
  } else if (streak.currentStreak < 7) {
    suggestions.push(`${7 - streak.currentStreak} more day${7 - streak.currentStreak === 1 ? "" : "s"} to hit a 7-day streak`);
  }
  if (!streak.completedToday) {
    suggestions.push("Complete today's activity to keep your streak alive");
  }

  return {
    id: "practice",
    label: "Practice",
    score,
    weight: PILLAR_WEIGHTS.practice,
    color: PILLAR_COLORS.practice,
    details,
    suggestions,
  };
}

function scoreDefense(): PillarScore {
  const mastery = loadMastery();
  const sims = loadSavedSimulations();

  // Check fraud defense concepts visited
  const fraudDefenseIds = fraudDefenses.map((d) => d.id);
  const visitedDefenses = mastery.concepts.filter((c) =>
    fraudDefenseIds.includes(c.conceptId)
  ).length;
  const defensePercent = fraudDefenseIds.length > 0
    ? Math.round((visitedDefenses / fraudDefenseIds.length) * 100)
    : 0;

  // Simulator usage shows practical defense thinking
  const simCount = sims.length;
  const simScore = clamp(simCount * 20, 0, 100); // 5 sims = max

  const score = clamp(
    Math.round(defensePercent * 0.6 + simScore * 0.4),
    0,
    100
  );

  const details: PillarDetail[] = [
    {
      label: "Fraud defenses read",
      value: `${visitedDefenses}/${fraudDefenseIds.length}`,
      percent: defensePercent,
    },
    {
      label: "Simulations run",
      value: `${simCount}`,
      percent: simScore,
    },
  ];

  const suggestions: string[] = [];
  if (visitedDefenses < fraudDefenseIds.length) {
    suggestions.push(`Read ${fraudDefenseIds.length - visitedDefenses} more fraud defense${fraudDefenseIds.length - visitedDefenses === 1 ? "" : "s"}`);
  }
  if (simCount === 0) {
    suggestions.push("Run your first financial scenario simulation");
  } else if (simCount < 3) {
    suggestions.push("Try more simulators to test different financial decisions");
  }

  return {
    id: "defense",
    label: "Defense",
    score,
    weight: PILLAR_WEIGHTS.defense,
    color: PILLAR_COLORS.defense,
    details,
    suggestions,
  };
}

function scoreGrowth(): PillarScore {
  const reviewState = loadReviewState();
  const stats = getReviewStats(reviewState);
  const streak = loadStreak();
  const achievements = loadAchievementState();

  // 40% review mastery, 30% achievements, 30% consistency
  const masteredPercent = stats.total > 0
    ? Math.round((stats.mastered / stats.total) * 100)
    : 0;
  const achievementPercent = achievements.unlocked.length > 0
    ? clamp(achievements.unlocked.length * 5, 0, 100) // 20 achievements = max
    : 0;
  const consistencyScore = clamp(streak.totalDaysActive * 5, 0, 100); // 20 days = max

  const score = clamp(
    Math.round(
      masteredPercent * 0.4 +
      achievementPercent * 0.3 +
      consistencyScore * 0.3
    ),
    0,
    100
  );

  const dueCount = getDueCount(reviewState);

  const details: PillarDetail[] = [
    {
      label: "Review cards mastered",
      value: `${stats.mastered}/${stats.total}`,
      percent: masteredPercent,
    },
    {
      label: "Achievements unlocked",
      value: `${achievements.unlocked.length}`,
      percent: achievementPercent,
    },
    {
      label: "Total days active",
      value: `${streak.totalDaysActive}`,
      percent: consistencyScore,
    },
  ];

  const suggestions: string[] = [];
  if (dueCount > 0) {
    suggestions.push(`Review ${dueCount} card${dueCount === 1 ? "" : "s"} due for spaced repetition`);
  }
  if (stats.mastered < stats.total && stats.total > 0) {
    suggestions.push("Keep reviewing to master more concept cards");
  }
  if (achievements.unlocked.length < 5) {
    suggestions.push("Unlock more achievements by exploring different features");
  }

  return {
    id: "growth",
    label: "Growth",
    score,
    weight: PILLAR_WEIGHTS.growth,
    color: PILLAR_COLORS.growth,
    details,
    suggestions,
  };
}

// ---------------------------------------------------------------------------
// Main Score Calculator
// ---------------------------------------------------------------------------

export function calculateHealthScore(): HealthScore {
  const pillars: readonly PillarScore[] = [
    scoreKnowledge(),
    scoreAwareness(),
    scorePractice(),
    scoreDefense(),
    scoreGrowth(),
  ];

  const total = Math.round(
    pillars.reduce((sum, p) => sum + p.score * p.weight, 0)
  );

  return {
    total,
    pillars,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// History (localStorage)
// ---------------------------------------------------------------------------

export function loadScoreHistory(): HealthScoreHistory {
  if (typeof window === "undefined") {
    return { entries: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as HealthScoreHistory;
    return { entries: parsed.entries ?? [] };
  } catch {
    return { entries: [] };
  }
}

export function saveScoreToHistory(score: HealthScore): HealthScoreHistory {
  const history = loadScoreHistory();
  const entry: HealthScoreEntry = {
    total: score.total,
    pillarScores: Object.fromEntries(
      score.pillars.map((p) => [p.id, p.score])
    ) as Record<PillarId, number>,
    timestamp: score.timestamp,
  };

  // Only save once per day (replace if same day exists)
  const today = new Date().toISOString().slice(0, 10);
  const filtered = history.entries.filter(
    (e) => e.timestamp.slice(0, 10) !== today
  );

  const updated: HealthScoreHistory = {
    entries: [...filtered, entry].slice(-MAX_HISTORY),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage full -- silently skip
  }

  return updated;
}

// ---------------------------------------------------------------------------
// Grade helpers
// ---------------------------------------------------------------------------

export function getScoreGrade(score: number): {
  readonly grade: string;
  readonly label: string;
  readonly color: string;
} {
  if (score >= 90) return { grade: "A+", label: "Exceptional", color: "#16A34A" };
  if (score >= 80) return { grade: "A", label: "Excellent", color: "#22C55E" };
  if (score >= 70) return { grade: "B+", label: "Great", color: "#84CC16" };
  if (score >= 60) return { grade: "B", label: "Good", color: "#CA8A04" };
  if (score >= 50) return { grade: "C+", label: "Fair", color: "#EAB308" };
  if (score >= 40) return { grade: "C", label: "Developing", color: "#F97316" };
  if (score >= 25) return { grade: "D", label: "Getting Started", color: "#DC2626" };
  return { grade: "F", label: "Just Beginning", color: "#DC2626" };
}
