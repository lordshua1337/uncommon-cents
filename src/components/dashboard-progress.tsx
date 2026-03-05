"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  Calculator,
  Target,
  Sparkles,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  loadAchievementState,
  checkAchievements,
  type AchievementState,
} from "@/lib/achievements";
import { showAchievementToasts } from "@/components/achievement-toast";
import { loadMastery, getAllDomainMastery, getOverallMastery } from "@/lib/mastery";
import { getDueCount, loadReviewState } from "@/lib/spaced-repetition/engine";
import { loadActionPlan, getActionPlanProgress } from "@/lib/action-plan";
import { loadSavedSimulations } from "@/lib/simulator/types";
import { domains } from "@/lib/domains";

// ---------------------------------------------------------------------------
// Dashboard Progress Section (client component embedded in server page)
// ---------------------------------------------------------------------------

interface DashboardData {
  overallPercent: number;
  domainProgress: readonly { domainId: string; name: string; color: string; percent: number }[];
  dueReviews: number;
  simulationsRun: number;
  actionsCompleted: number;
  actionsTotal: number;
  achievements: AchievementState;
}

export function DashboardProgress() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const mastery = loadMastery();
    const overall = getOverallMastery(mastery);
    const domainMasteries = getAllDomainMastery(mastery);
    const reviewState = loadReviewState();
    const dueReviews = getDueCount(reviewState);
    const sims = loadSavedSimulations();
    const actionPlan = loadActionPlan();
    const actionProgress = actionPlan ? getActionPlanProgress(actionPlan) : null;

    const domainProgress = domainMasteries.map((dm) => {
      const domain = domains.find((d) => d.id === dm.domainId);
      return {
        domainId: dm.domainId,
        name: domain?.shortName ?? dm.domainId,
        color: domain?.color ?? "#888",
        percent: Math.round(dm.masteryPercent),
      };
    });

    // Check achievements
    const currentAchievements = loadAchievementState();
    const { state: updatedAchievements, newlyUnlocked } = checkAchievements(currentAchievements);
    if (newlyUnlocked.length > 0) {
      showAchievementToasts(newlyUnlocked);
    }

    setData({
      overallPercent: Math.round(overall.overallPercent),
      domainProgress,
      dueReviews,
      simulationsRun: new Set(sims.map((s) => s.scenarioSlug)).size,
      actionsCompleted: actionProgress?.completed ?? 0,
      actionsTotal: actionProgress?.total ?? 0,
      achievements: updatedAchievements,
    });
  }, []);

  if (!data) return null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
            Your Progress
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Financial Command Center
          </h2>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Overall mastery */}
          <Link
            href="/explore"
            className="bg-surface border border-border-light rounded-xl p-4 text-center card-hover block"
          >
            <p className="text-2xl font-bold font-mono text-accent">
              {data.overallPercent}%
            </p>
            <p className="text-[10px] text-text-secondary mt-1">
              Overall Mastery
            </p>
          </Link>

          {/* Due reviews */}
          <Link
            href="/review"
            className="bg-surface border border-border-light rounded-xl p-4 text-center card-hover block"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Brain className="w-4 h-4 text-amber-400" />
              <p className="text-2xl font-bold font-mono text-amber-400">
                {data.dueReviews}
              </p>
            </div>
            <p className="text-[10px] text-text-secondary mt-1">Due Reviews</p>
          </Link>

          {/* Simulations */}
          <Link
            href="/simulator"
            className="bg-surface border border-border-light rounded-xl p-4 text-center card-hover block"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-400" />
              <p className="text-2xl font-bold font-mono text-blue-400">
                {data.simulationsRun}/6
              </p>
            </div>
            <p className="text-[10px] text-text-secondary mt-1">Simulations</p>
          </Link>

          {/* Achievements */}
          <Link
            href="/achievements"
            className="bg-surface border border-border-light rounded-xl p-4 text-center card-hover block"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4 text-accent" />
              <p className="text-2xl font-bold font-mono">
                {data.achievements.unlocked.length}
              </p>
            </div>
            <p className="text-[10px] text-text-secondary mt-1">
              Achievements
            </p>
          </Link>
        </div>

        {/* Domain mastery grid */}
        <div className="bg-surface border border-border-light rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Domain Mastery
            </h3>
            <Link
              href="/explore"
              className="text-[10px] text-accent hover:text-accent-light transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.domainProgress.map((d) => (
              <div key={d.domainId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium truncate">
                    {d.name}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {d.percent}%
                  </span>
                </div>
                <div className="h-1.5 bg-background rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(d.percent, 100)}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action plan + Level row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Action plan progress */}
          <Link
            href="/action-plan"
            className="bg-surface border border-border-light rounded-xl p-5 card-hover block"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold">Action Plan</h3>
            </div>
            {data.actionsTotal > 0 ? (
              <>
                <p className="text-xs text-text-secondary mb-2">
                  {data.actionsCompleted} of {data.actionsTotal} completed
                </p>
                <div className="h-2 bg-background rounded-full">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{
                      width: `${(data.actionsCompleted / data.actionsTotal) * 100}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-text-secondary">
                Generate your personalized action plan
              </p>
            )}
            <span className="text-[10px] text-accent mt-2 inline-flex items-center gap-1">
              View plan <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          {/* Level badge */}
          <Link
            href="/achievements"
            className="bg-surface border border-accent/20 rounded-xl p-5 card-hover block"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <span className="text-lg font-bold text-accent">
                  {data.achievements.level}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {data.achievements.levelTitle}
                </p>
                <p className="text-[10px] text-text-secondary font-mono">
                  {data.achievements.totalXp} XP
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className="mt-6">
          <Link
            href="/search"
            className="flex items-center gap-3 bg-surface border border-border-light rounded-xl px-4 py-3 hover:border-accent/30 transition-colors"
          >
            <Search className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              Search concepts, simulators, strategies...
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
