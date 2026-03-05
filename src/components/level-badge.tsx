"use client";

import { getNextLevelXp, type AchievementState } from "@/lib/achievements";

export function LevelBadge({ state }: { state: AchievementState }) {
  const nextXp = getNextLevelXp(state.totalXp);
  const progress = nextXp
    ? ((state.totalXp / nextXp) * 100).toFixed(0)
    : "100";

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
        <span className="text-sm font-bold text-accent">{state.level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{state.levelTitle}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex-1 h-1.5 bg-background rounded-full">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-text-secondary font-mono">
            {state.totalXp}{nextXp ? `/${nextXp}` : ""} XP
          </span>
        </div>
      </div>
    </div>
  );
}
