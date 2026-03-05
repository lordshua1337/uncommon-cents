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
};

const CATEGORY_META: Record<
  AchievementCategory,
  { label: string; color: string; bg: string }
> = {
  mastery: { label: "Mastery", color: "text-blue-400", bg: "bg-blue-400/10" },
  explorer: { label: "Explorer", color: "text-teal-400", bg: "bg-teal-400/10" },
  quiz: { label: "Quiz", color: "text-purple-400", bg: "bg-purple-400/10" },
  simulator: { label: "Simulator", color: "text-amber-400", bg: "bg-amber-400/10" },
  review: { label: "Review", color: "text-pink-400", bg: "bg-pink-400/10" },
  action: { label: "Action", color: "text-green-400", bg: "bg-green-400/10" },
  streak: { label: "Streak", color: "text-orange-400", bg: "bg-orange-400/10" },
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
      className={`bg-surface border rounded-xl p-4 transition-all ${
        unlocked
          ? "border-accent/20"
          : "border-border-light opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            unlocked ? "bg-accent/10" : "bg-surface"
          }`}
        >
          {unlocked ? (
            <Icon className="w-5 h-5 text-accent" />
          ) : (
            <Lock className="w-4 h-4 text-text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cat.bg} ${cat.color}`}
            >
              {cat.label}
            </span>
            <span className="text-[10px] text-accent font-mono">
              +{def.xp} XP
            </span>
          </div>
          <p className="text-sm font-semibold">{def.title}</p>
          <p className="text-xs text-text-secondary mt-0.5">
            {def.description}
          </p>
          {unlocked && unlockedAt && (
            <p className="text-[10px] text-text-secondary mt-1">
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
        <p className="text-sm text-text-secondary">Loading achievements...</p>
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
    <div className="min-h-screen pt-20 pb-16 px-4">
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
              <Trophy className="w-5 h-5 text-accent" />
              Achievements
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              {state.unlocked.length} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {/* Level card */}
        <div className="bg-surface border border-accent/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">
                {state.level}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">{state.levelTitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-background rounded-full">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs font-mono text-accent">
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
                className={`text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  filter === cat
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
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

        <p className="text-[10px] text-text-secondary text-center mt-8">
          Achievements unlock automatically as you explore, learn, and take
          action. Not financial advice.
        </p>
      </div>
    </div>
  );
}
