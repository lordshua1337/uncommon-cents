"use client";

import { getNextLevelXp, type AchievementState } from "@/lib/achievements";

export function LevelBadge({ state }: { state: AchievementState }) {
  const nextXp = getNextLevelXp(state.totalXp);
  const progress = nextXp
    ? ((state.totalXp / nextXp) * 100).toFixed(0)
    : "100";

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(44,95,124,0.1)",
          border: "1px solid rgba(44,95,124,0.3)",
        }}
      >
        <span className="text-sm font-bold" style={{ color: "#2C5F7C" }}>{state.level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "#1A1A1A" }}>{state.levelTitle}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <div
            className="flex-1 h-1.5 rounded-full"
            style={{ background: "rgba(196,166,122,0.25)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "#2C5F7C" }}
            />
          </div>
          <span
            className="text-[10px] font-mono"
            style={{ color: "#555555" }}
          >
            {state.totalXp}{nextXp ? `/${nextXp}` : ""} XP
          </span>
        </div>
      </div>
    </div>
  );
}
