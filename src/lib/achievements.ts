// Achievements + XP System -- gamification layer across mastery, quiz, simulator, review

import { loadMastery, getAllDomainMastery, getOverallMastery } from "@/lib/mastery";
import { loadQuizResult } from "@/lib/quiz-engine";
import { loadSavedSimulations } from "@/lib/simulator/types";
import { loadReviewState, getReviewStats } from "@/lib/spaced-repetition/engine";
import { loadActionPlan, getActionPlanProgress } from "@/lib/action-plan";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AchievementCategory =
  | "mastery"
  | "streak"
  | "simulator"
  | "review"
  | "quiz"
  | "action"
  | "explorer";

export interface AchievementDef {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: AchievementCategory;
  readonly icon: string; // lucide icon name
  readonly xp: number;
  readonly check: (ctx: AchievementContext) => boolean;
}

export interface UnlockedAchievement {
  readonly achievementId: string;
  readonly unlockedAt: string;
}

export interface AchievementState {
  readonly unlocked: readonly UnlockedAchievement[];
  readonly totalXp: number;
  readonly level: number;
  readonly levelTitle: string;
}

export interface AchievementContext {
  readonly conceptsVisited: number;
  readonly conceptsAtAdvanced: number;
  readonly domainsMastered: number; // domains at 100%
  readonly domainsStarted: number; // domains with any visit
  readonly overallMastery: number; // 0-100
  readonly quizCompleted: boolean;
  readonly simulationsRun: number;
  readonly reviewCardsMastered: number;
  readonly reviewSessionsDone: number; // cards reviewed total
  readonly actionsCompleted: number;
  readonly uniqueDomainsExplored: number;
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

const LEVELS: readonly { readonly minXp: number; readonly title: string }[] = [
  { minXp: 0, title: "Financial Novice" },
  { minXp: 50, title: "Curious Saver" },
  { minXp: 150, title: "Money Student" },
  { minXp: 300, title: "Budget Apprentice" },
  { minXp: 500, title: "Wealth Explorer" },
  { minXp: 800, title: "Finance Strategist" },
  { minXp: 1200, title: "Money Master" },
  { minXp: 1800, title: "Uncommon" },
];

function getLevelFromXp(xp: number): { level: number; title: string } {
  let level = 1;
  let title = LEVELS[0].title;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      level = i + 1;
      title = LEVELS[i].title;
      break;
    }
  }
  return { level, title };
}

export function getNextLevelXp(currentXp: number): number | null {
  for (const l of LEVELS) {
    if (l.minXp > currentXp) return l.minXp;
  }
  return null; // max level
}

// ---------------------------------------------------------------------------
// Achievement definitions (25+)
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  // Mastery
  { id: "first_concept", title: "First Steps", description: "Visit your first concept.", category: "mastery", icon: "BookOpen", xp: 10, check: (c) => c.conceptsVisited >= 1 },
  { id: "ten_concepts", title: "Knowledge Seeker", description: "Visit 10 concepts.", category: "mastery", icon: "BookOpen", xp: 25, check: (c) => c.conceptsVisited >= 10 },
  { id: "twenty_five_concepts", title: "Deep Diver", description: "Visit 25 concepts.", category: "mastery", icon: "BookOpen", xp: 50, check: (c) => c.conceptsVisited >= 25 },
  { id: "fifty_concepts", title: "Half Century", description: "Visit 50 concepts.", category: "mastery", icon: "BookOpen", xp: 75, check: (c) => c.conceptsVisited >= 50 },
  { id: "all_concepts", title: "Encyclopedia", description: "Visit all 80+ concepts.", category: "mastery", icon: "Crown", xp: 150, check: (c) => c.conceptsVisited >= 80 },
  { id: "first_advanced", title: "Going Deep", description: "Read a concept at the advanced layer.", category: "mastery", icon: "Layers", xp: 20, check: (c) => c.conceptsAtAdvanced >= 1 },
  { id: "ten_advanced", title: "Scholar", description: "Read 10 concepts at the advanced layer.", category: "mastery", icon: "GraduationCap", xp: 50, check: (c) => c.conceptsAtAdvanced >= 10 },
  { id: "domain_master", title: "Domain Expert", description: "Reach 100% mastery in one domain.", category: "mastery", icon: "Trophy", xp: 100, check: (c) => c.domainsMastered >= 1 },
  { id: "three_domains", title: "Triple Threat", description: "Reach 100% mastery in 3 domains.", category: "mastery", icon: "Trophy", xp: 150, check: (c) => c.domainsMastered >= 3 },

  // Explorer
  { id: "three_domains_started", title: "Branching Out", description: "Explore concepts in 3 different domains.", category: "explorer", icon: "Compass", xp: 15, check: (c) => c.uniqueDomainsExplored >= 3 },
  { id: "seven_domains_started", title: "Renaissance Mind", description: "Explore concepts in 7 different domains.", category: "explorer", icon: "Globe", xp: 40, check: (c) => c.uniqueDomainsExplored >= 7 },
  { id: "all_domains_started", title: "Worldly Wise", description: "Explore concepts in every domain.", category: "explorer", icon: "Globe", xp: 75, check: (c) => c.uniqueDomainsExplored >= 14 },
  { id: "overall_25", title: "Quarter Mark", description: "Reach 25% overall mastery.", category: "explorer", icon: "TrendingUp", xp: 30, check: (c) => c.overallMastery >= 25 },
  { id: "overall_50", title: "Halfway There", description: "Reach 50% overall mastery.", category: "explorer", icon: "TrendingUp", xp: 60, check: (c) => c.overallMastery >= 50 },
  { id: "overall_75", title: "Almost There", description: "Reach 75% overall mastery.", category: "explorer", icon: "TrendingUp", xp: 100, check: (c) => c.overallMastery >= 75 },
  { id: "overall_100", title: "Uncommon", description: "Reach 100% overall mastery.", category: "explorer", icon: "Star", xp: 200, check: (c) => c.overallMastery >= 100 },

  // Quiz
  { id: "quiz_complete", title: "Know Thyself", description: "Complete the Money Scripts quiz.", category: "quiz", icon: "ClipboardCheck", xp: 25, check: (c) => c.quizCompleted },

  // Simulator
  { id: "first_sim", title: "Number Cruncher", description: "Run your first simulation.", category: "simulator", icon: "Calculator", xp: 15, check: (c) => c.simulationsRun >= 1 },
  { id: "three_sims", title: "Scenario Planner", description: "Run 3 different simulations.", category: "simulator", icon: "Calculator", xp: 30, check: (c) => c.simulationsRun >= 3 },
  { id: "all_sims", title: "Master Simulator", description: "Run all 6 simulations.", category: "simulator", icon: "Calculator", xp: 75, check: (c) => c.simulationsRun >= 6 },

  // Review
  { id: "first_review", title: "Memory Lane", description: "Complete your first review session.", category: "review", icon: "Brain", xp: 15, check: (c) => c.reviewSessionsDone >= 1 },
  { id: "ten_reviews", title: "Retention Builder", description: "Review 10 cards.", category: "review", icon: "Brain", xp: 30, check: (c) => c.reviewSessionsDone >= 10 },
  { id: "fifty_reviews", title: "Steel Trap", description: "Review 50 cards.", category: "review", icon: "Brain", xp: 60, check: (c) => c.reviewSessionsDone >= 50 },
  { id: "five_mastered", title: "Locked In", description: "Master 5 review cards.", category: "review", icon: "Lock", xp: 40, check: (c) => c.reviewCardsMastered >= 5 },

  // Action plan
  { id: "first_action", title: "Taking Action", description: "Complete your first action plan item.", category: "action", icon: "CheckCircle", xp: 15, check: (c) => c.actionsCompleted >= 1 },
  { id: "five_actions", title: "Action Hero", description: "Complete 5 action plan items.", category: "action", icon: "Zap", xp: 40, check: (c) => c.actionsCompleted >= 5 },
  { id: "all_actions", title: "Mission Complete", description: "Complete all action plan items.", category: "action", icon: "Flag", xp: 100, check: (c) => c.actionsCompleted >= 8 },
];

// ---------------------------------------------------------------------------
// Build context from current app state
// ---------------------------------------------------------------------------

export function buildAchievementContext(): AchievementContext {
  const mastery = loadMastery();
  const quiz = loadQuizResult();
  const sims = loadSavedSimulations();
  const reviewState = loadReviewState();
  const reviewStats = getReviewStats(reviewState);
  const actionPlan = loadActionPlan();
  const actionProgress = actionPlan ? getActionPlanProgress(actionPlan) : null;
  const domainMasteries = getAllDomainMastery(mastery);
  const overall = getOverallMastery(mastery);

  const conceptsAtAdvanced = mastery.concepts.filter((c) =>
    c.visitedLayers.includes("advanced")
  ).length;

  const uniqueDomains = new Set(mastery.concepts.map((c) => {
    // conceptId format: "c1-01" -> domainId "d1"
    const match = c.conceptId.match(/^c(\d+)-/);
    return match ? `d${match[1]}` : "";
  }));

  return {
    conceptsVisited: mastery.concepts.length,
    conceptsAtAdvanced,
    domainsMastered: domainMasteries.filter((d) => d.masteryPercent >= 100).length,
    domainsStarted: domainMasteries.filter((d) => d.visitedConcepts > 0).length,
    overallMastery: overall.overallPercent,
    quizCompleted: quiz !== null,
    simulationsRun: new Set(sims.map((s) => s.scenarioSlug)).size,
    reviewCardsMastered: reviewStats.mastered,
    reviewSessionsDone: reviewState.cards.reduce((sum, c) => sum + c.repetitions, 0),
    actionsCompleted: actionProgress?.completed ?? 0,
    uniqueDomainsExplored: uniqueDomains.size,
  };
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon_cents_achievements";

export function loadAchievementState(): AchievementState {
  if (typeof window === "undefined") {
    return { unlocked: [], totalXp: 0, level: 1, levelTitle: "Financial Novice" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: [], totalXp: 0, level: 1, levelTitle: "Financial Novice" };
    return JSON.parse(raw) as AchievementState;
  } catch {
    return { unlocked: [], totalXp: 0, level: 1, levelTitle: "Financial Novice" };
  }
}

function saveAchievementState(state: AchievementState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full
  }
}

// ---------------------------------------------------------------------------
// Achievement checker -- returns newly unlocked achievements
// ---------------------------------------------------------------------------

export function checkAchievements(
  current: AchievementState
): { state: AchievementState; newlyUnlocked: readonly AchievementDef[] } {
  const ctx = buildAchievementContext();
  const unlockedIds = new Set(current.unlocked.map((u) => u.achievementId));
  const newlyUnlocked: AchievementDef[] = [];
  const newUnlockedEntries: UnlockedAchievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;
    if (achievement.check(ctx)) {
      newlyUnlocked.push(achievement);
      newUnlockedEntries.push({
        achievementId: achievement.id,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  if (newlyUnlocked.length === 0) {
    return { state: current, newlyUnlocked: [] };
  }

  const newXp = newlyUnlocked.reduce((sum, a) => sum + a.xp, 0);
  const totalXp = current.totalXp + newXp;
  const { level, title } = getLevelFromXp(totalXp);

  const updated: AchievementState = {
    unlocked: [...current.unlocked, ...newUnlockedEntries],
    totalXp,
    level,
    levelTitle: title,
  };

  saveAchievementState(updated);
  return { state: updated, newlyUnlocked };
}
