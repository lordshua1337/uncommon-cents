// Streak status classifier -- pure function, no side effects
// Maps StreakState to a visual status label used by StreakFlame + StreakBadge

import { type StreakState } from "@/lib/daily-streak";

export type StreakStatus = "active" | "grace" | "at-risk" | "broken" | "dormant";

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, "0");
  const d = String(yesterday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDayBeforeYesterdayString(): string {
  const dby = new Date();
  dby.setDate(dby.getDate() - 2);
  const y = dby.getFullYear();
  const m = String(dby.getMonth() + 1).padStart(2, "0");
  const d = String(dby.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns the visual status of a streak:
 * - active:  completed today, streak > 0
 * - grace:   missed yesterday, still within grace window (lastActive = 2 days ago, streak > 0)
 * - at-risk: missed yesterday (lastActive = yesterday, not completed today, streak > 0)
 * - broken:  streak was reset (currentStreak === 0, longestStreak > 0)
 * - dormant: never started (currentStreak === 0, longestStreak === 0)
 */
export function getStreakStatus(streak: StreakState): StreakStatus {
  if (streak.currentStreak === 0) {
    return streak.longestStreak > 0 ? "broken" : "dormant";
  }

  if (streak.completedToday) return "active";

  const today = getTodayString();
  const yesterday = getYesterdayString();
  const dayBeforeYesterday = getDayBeforeYesterdayString();

  if (streak.lastActiveDate === yesterday) {
    // Missed today but still in grace period (streak intact)
    return "at-risk";
  }

  if (streak.lastActiveDate === dayBeforeYesterday) {
    // Used grace period yesterday, must complete today or lose streak
    return "grace";
  }

  // lastActiveDate is today (already handled above) or before grace window
  return "active";
}

// Warmth color palette -- 7 tiers indexed by streak day thresholds
export const WARMTH_COLORS: Readonly<Record<number, string>> = {
  0: "#888888",
  1: "#CA8A04",
  7: "#EAB308",
  14: "#F59E0B",
  30: "#F97316",
  60: "#EF4444",
  100: "#1E3F2E",
} as const;

export function getWarmthColor(streak: number): string {
  const thresholds = [100, 60, 30, 14, 7, 1, 0];
  for (const t of thresholds) {
    if (streak >= t) return WARMTH_COLORS[t];
  }
  return WARMTH_COLORS[0];
}

export function getWarmthTier(streak: number): number {
  if (streak >= 100) return 6;
  if (streak >= 60) return 5;
  if (streak >= 30) return 4;
  if (streak >= 14) return 3;
  if (streak >= 7) return 2;
  if (streak >= 1) return 1;
  return 0;
}
