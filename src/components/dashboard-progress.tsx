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
import { DashboardStageCard } from "@/components/life-stages/dashboard-stage-card";
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
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-8">
          <p
            className="text-label uppercase tracking-widest font-medium mb-2"
            style={{ color: "#E05A1B" }}
          >
            Your Progress
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "#1A1A1A" }}>
            Financial Command Center
          </h2>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Overall mastery */}
          <Link
            href="/explore"
            className="uc-card p-4 text-center block transition-all"
            style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
          >
            <p className="text-2xl font-bold font-mono" style={{ color: "#2C5F7C" }}>
              {data.overallPercent}%
            </p>
            <p className="text-[10px] mt-1" style={{ color: "#555555" }}>
              Overall Mastery
            </p>
          </Link>

          {/* Due reviews */}
          <Link
            href="/review"
            className="uc-card p-4 text-center block transition-all"
            style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Brain className="w-4 h-4" style={{ color: "#C4A67A" }} />
              <p className="text-2xl font-bold font-mono" style={{ color: "#C4A67A" }}>
                {data.dueReviews}
              </p>
            </div>
            <p className="text-[10px] mt-1" style={{ color: "#555555" }}>Due Reviews</p>
          </Link>

          {/* Simulations */}
          <Link
            href="/simulator"
            className="uc-card p-4 text-center block transition-all"
            style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Calculator className="w-4 h-4" style={{ color: "#2C5F7C" }} />
              <p className="text-2xl font-bold font-mono" style={{ color: "#2C5F7C" }}>
                {data.simulationsRun}/6
              </p>
            </div>
            <p className="text-[10px] mt-1" style={{ color: "#555555" }}>Simulations</p>
          </Link>

          {/* Achievements */}
          <Link
            href="/achievements"
            className="uc-card p-4 text-center block transition-all"
            style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4" style={{ color: "#E05A1B" }} />
              <p className="text-2xl font-bold font-mono" style={{ color: "#1A1A1A" }}>
                {data.achievements.unlocked.length}
              </p>
            </div>
            <p className="text-[10px] mt-1" style={{ color: "#555555" }}>
              Achievements
            </p>
          </Link>
        </div>

        {/* Life Path widget */}
        <DashboardStageCard />

        {/* Domain mastery grid */}
        <div
          className="uc-card p-5 mb-6"
          style={{ boxShadow: "0 2px 16px rgba(44,95,124,0.08)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#1A1A1A" }}>
              <Sparkles className="w-4 h-4" style={{ color: "#E05A1B" }} />
              Domain Mastery
            </h3>
            <Link
              href="/explore"
              className="text-[10px] transition-colors"
              style={{ color: "#2C5F7C" }}
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.domainProgress.map((d) => (
              <div key={d.domainId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium truncate" style={{ color: "#1A1A1A" }}>
                    {d.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "#555555" }}>
                    {d.percent}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(44,95,124,0.1)" }}>
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
            className="uc-card p-5 block transition-all"
            style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" style={{ color: "#1E3F2E" }} />
              <h3 className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Action Plan</h3>
            </div>
            {data.actionsTotal > 0 ? (
              <>
                <p className="text-xs mb-2" style={{ color: "#555555" }}>
                  {data.actionsCompleted} of {data.actionsTotal} completed
                </p>
                <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(44,95,124,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: "#1E3F2E",
                      width: `${(data.actionsCompleted / data.actionsTotal) * 100}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs" style={{ color: "#555555" }}>
                Generate your personalized action plan
              </p>
            )}
            <span className="text-[10px] mt-2 inline-flex items-center gap-1" style={{ color: "#2C5F7C" }}>
              View plan <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          {/* Level badge */}
          <Link
            href="/achievements"
            className="uc-card p-5 block transition-all"
            style={{
              border: "1px solid rgba(224,90,27,0.2)",
              boxShadow: "0 2px 12px rgba(44,95,124,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(224,90,27,0.08)",
                  border: "2px solid rgba(224,90,27,0.25)",
                }}
              >
                <span className="text-lg font-bold" style={{ color: "#E05A1B" }}>
                  {data.achievements.level}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
                  {data.achievements.levelTitle}
                </p>
                <p className="text-[10px] font-mono" style={{ color: "#555555" }}>
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
            className="flex items-center gap-3 uc-card px-4 py-3 transition-colors"
            style={{ boxShadow: "0 2px 8px rgba(44,95,124,0.06)" }}
          >
            <Search className="w-4 h-4" style={{ color: "#555555" }} />
            <span className="text-sm" style={{ color: "#555555" }}>
              Search concepts, simulators, strategies...
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
