"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Lock,
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  CheckCircle,
  Compass,
  Zap,
  Star,
} from "lucide-react";
import {
  ACHIEVEMENTS,
  loadAchievementState,
  checkAchievements,
  getNextLevelXp,
  type AchievementState,
  type AchievementCategory,
  type AchievementDef,
} from "@/lib/achievements";
import { showAchievementToasts } from "@/components/achievement-toast";

// ---------------------------------------------------------------------------
// Icon map (lucide icons referenced by string name in achievement defs)
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  CheckCircle,
  Compass,
  Trophy,
  Zap,
  Star,
  Lock,
  // Fallbacks for icons not imported -- just use Star
  Crown: Star,
  Layers: BookOpen,
  GraduationCap: BookOpen,
  Globe: Compass,
  TrendingUp: Zap,
  Flag: CheckCircle,
  Map: Compass,
  Swords: Zap,
  Timer: Zap,
  Route: Compass,
};

const CATEGORY_META: Record<
  AchievementCategory,
  { label: string; color: string; bg: string }
> = {
  mastery: { label: "Mastery", color: "#2C5F7C", bg: "rgba(44,95,124,0.1)" },
  explorer: { label: "Explorer", color: "#2C5F7C", bg: "rgba(44,95,124,0.08)" },
  quiz: { label: "Quiz", color: "#1E3F2E", bg: "rgba(30,63,46,0.1)" },
  simulator: { label: "Simulator", color: "#C4A67A", bg: "rgba(196,166,122,0.15)" },
  review: { label: "Review", color: "#E05A1B", bg: "rgba(224,90,27,0.1)" },
  action: { label: "Action", color: "#1E3F2E", bg: "rgba(30,63,46,0.1)" },
  streak: { label: "Streak", color: "#E05A1B", bg: "rgba(224,90,27,0.1)" },
  path: { label: "Life Path", color: "#2C5F7C", bg: "rgba(44,95,124,0.1)" },
};

// ---------------------------------------------------------------------------
// Achievement Card
// ---------------------------------------------------------------------------

function AchievementCard({
  def,
  unlocked,
  unlockedAt,
}: {
  def: AchievementDef;
  unlocked: boolean;
  unlockedAt: string | null;
}) {
  const Icon = ICON_MAP[def.icon] ?? Star;
  const cat = CATEGORY_META[def.category];

  return (
    <div
      className="uc-card p-4 transition-all"
      style={{
        opacity: unlocked ? 1 : 0.5,
        border: unlocked
          ? "1px solid rgba(44,95,124,0.2)"
          : "1px solid rgba(196,166,122,0.3)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: unlocked ? "rgba(44,95,124,0.1)" : "rgba(196,166,122,0.08)",
          }}
        >
          {unlocked ? (
            <Icon className="w-5 h-5 text-[#2C5F7C]" />
          ) : (
            <Lock className="w-4 h-4" style={{ color: "#555555" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: cat.bg, color: cat.color }}
            >
              {cat.label}
            </span>
            <span className="text-[10px] font-mono" style={{ color: "#E05A1B" }}>
              +{def.xp} XP
            </span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{def.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
            {def.description}
          </p>
          {unlocked && unlockedAt && (
            <p className="text-[10px] mt-1" style={{ color: "#555555" }}>
              Unlocked{" "}
              {new Date(unlockedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AchievementsPage() {
  const [state, setState] = useState<AchievementState | null>(null);
  const [filter, setFilter] = useState<AchievementCategory | "all">("all");

  useEffect(() => {
    const current = loadAchievementState();
    const { state: updated, newlyUnlocked } = checkAchievements(current);
    setState(updated);
    if (newlyUnlocked.length > 0) {
      showAchievementToasts(newlyUnlocked);
    }
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm" style={{ color: "#555555" }}>Loading achievements...</p>
      </div>
    );
  }

  const unlockedMap = new Map(
    state.unlocked.map((u) => [u.achievementId, u.unlockedAt])
  );

  const nextXp = getNextLevelXp(state.totalXp);
  const progressPercent = nextXp
    ? Math.round((state.totalXp / nextXp) * 100)
    : 100;

  const categories: (AchievementCategory | "all")[] = [
    "all",
    "mastery",
    "explorer",
    "quiz",
    "simulator",
    "review",
    "action",
  ];

  const filtered =
    filter === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === filter);

  // Sort: unlocked first, then by priority
  const sorted = [...filtered].sort((a, b) => {
    const aUnlocked = unlockedMap.has(a.id) ? 1 : 0;
    const bUnlocked = unlockedMap.has(b.id) ? 1 : 0;
    if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked;
    return a.xp - b.xp;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: "#F5EDE0" }}>
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#555555" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-semibold flex items-center gap-2" style={{ color: "#1A1A1A" }}>
              <Trophy className="w-5 h-5" style={{ color: "#E05A1B" }} />
              Achievements
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
              {state.unlocked.length} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {/* Level card */}
        <div
          className="uc-card p-5 mb-6"
          style={{ border: "1px solid rgba(44,95,124,0.2)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(44,95,124,0.1)",
                border: "2px solid rgba(44,95,124,0.3)",
              }}
            >
              <span className="text-xl font-bold" style={{ color: "#2C5F7C" }}>
                {state.level}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold" style={{ color: "#1A1A1A" }}>{state.levelTitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 rounded-full" style={{ background: "#F5EDE0" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#2C5F7C" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs font-mono" style={{ color: "#2C5F7C" }}>
                  {state.totalXp}
                  {nextXp ? `/${nextXp}` : ""} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {categories.map((cat) => {
            const meta = cat === "all" ? null : CATEGORY_META[cat];
            const count =
              cat === "all"
                ? ACHIEVEMENTS.length
                : ACHIEVEMENTS.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                style={
                  filter === cat
                    ? { background: "rgba(44,95,124,0.1)", color: "#2C5F7C" }
                    : { color: "#555555" }
                }
              >
                {cat === "all" ? "All" : meta?.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Achievement grid */}
        <div className="space-y-3">
          {sorted.map((def) => (
            <AchievementCard
              key={def.id}
              def={def}
              unlocked={unlockedMap.has(def.id)}
              unlockedAt={unlockedMap.get(def.id) ?? null}
            />
          ))}
        </div>

        <p className="text-[10px] text-center mt-8" style={{ color: "#555555" }}>
          Achievements unlock automatically as you explore, learn, and take
          action. Not financial advice.
        </p>
      </div>
    </div>
  );
}
