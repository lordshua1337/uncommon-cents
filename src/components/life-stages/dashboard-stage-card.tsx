"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map,
  ArrowRight,
  Trophy,
  KeyRound,
  Briefcase,
  Heart,
  House,
  Star,
  Zap,
  Compass,
  Crown,
  CheckCircle,
  X,
} from "lucide-react";
import {
  loadStageProgress,
  getStageCompletionPercent,
  isStageGraduated,
} from "@/lib/life-stages/progress";
import { lifeStages } from "@/lib/life-stages/stages";
import type { LifeStageState } from "@/lib/life-stages/types";

// ---------------------------------------------------------------------------
// Stage icon map
// ---------------------------------------------------------------------------

const STAGE_ICON_MAP: Record<string, React.ElementType> = {
  KeyRound,
  Briefcase,
  Heart,
  House,
  Star,
  Zap,
  Compass,
  Crown,
};

const DISMISSED_KEY = "uc_path_widget_dismissed";

// ---------------------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------------------

const widgetVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1, ease: "easeOut" as const },
  },
};

const progressBarVariants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.2 },
  }),
};

const badgeContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const badgeVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring" as const, stiffness: 500 },
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WidgetSkeleton() {
  return (
    <div className="bg-[#F5F5F0] animate-pulse h-[84px] rounded-xl mb-6" />
  );
}

function EmptyState() {
  const previewStages = lifeStages.slice(0, 3);
  return (
    <div>
      <p className="text-xs text-[#888888] mb-3">Start your financial life path</p>
      <div className="flex gap-1.5 mb-3">
        {previewStages.map((stage) => (
          <span
            key={stage.id}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${stage.accentColor}12`,
              color: stage.accentColor,
            }}
          >
            {stage.title.replace("You ", "").replace("Your ", "")}
          </span>
        ))}
      </div>
      <Link
        href="/paths"
        className="mt-1 inline-flex items-center gap-1.5 bg-accent text-white text-xs px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
      >
        Begin Path
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function AllCompleteState() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
        <Trophy className="w-4 h-4 text-accent" />
      </div>
      <div>
        <p className="text-sm font-semibold text-accent">All Paths Complete!</p>
        <Link
          href="/achievements"
          className="text-[10px] text-[#888888] inline-flex items-center gap-1 hover:text-accent transition-colors"
        >
          View your journey <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function ActiveStageState({ stageState }: { stageState: LifeStageState }) {
  const activeStage = lifeStages.find((s) => s.id === stageState.activeStageId);

  if (!activeStage) return <EmptyState />;

  const stageProgress = stageState.stages.find((sp) => sp.stageId === activeStage.id);
  const completedCount = stageProgress?.lessonsCompleted.length ?? 0;
  const totalLessons = activeStage.lessons.length;
  const percent = Math.round((completedCount / Math.max(totalLessons, 1)) * 100);

  const completedStages = stageState.graduatedStages
    .map((gid) => lifeStages.find((s) => s.id === gid))
    .filter(Boolean) as typeof lifeStages;

  const nextLesson = activeStage.lessons.find(
    (l) => !stageProgress?.lessonsCompleted.includes(l.id),
  );

  const IconComponent = STAGE_ICON_MAP[activeStage.icon] ?? Map;
  const stageSlug = activeStage.slug;
  const nextLessonHref = nextLesson
    ? `/paths/${stageSlug}/${nextLesson.id}`
    : `/paths/${stageSlug}`;

  return (
    <div>
      {/* Current stage row */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{
            backgroundColor: `${activeStage.accentColor}18`,
            borderColor: `${activeStage.accentColor}40`,
          }}
        >
          <IconComponent className="w-4 h-4" style={{ color: activeStage.accentColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{activeStage.title}</p>
          <p className="text-[10px] text-[#888888] font-mono">
            {completedCount} of {totalLessons} lessons done
          </p>
        </div>
      </div>

      {/* Mini progress bar */}
      <div className="h-1.5 bg-[#E5E5E0] rounded-full mt-2.5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: activeStage.accentColor }}
          custom={percent}
          variants={progressBarVariants}
          initial="hidden"
          animate="visible"
        />
      </div>

      {/* Completed stage badges */}
      {completedStages.length > 0 && (
        <motion.div
          className="flex gap-1 mt-3"
          variants={badgeContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {completedStages.slice(0, 5).map((cs) => {
            const CsIcon = STAGE_ICON_MAP[cs.icon] ?? Map;
            return (
              <motion.div
                key={cs.id}
                variants={badgeVariants}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cs.accentColor }}
                title={cs.title}
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </motion.div>
            );
          })}
          {completedStages.length > 5 && (
            <span className="text-[10px] text-[#888888] self-center ml-1">
              +{completedStages.length - 5} more
            </span>
          )}
        </motion.div>
      )}

      {/* Continue CTA */}
      <Link
        href={nextLessonHref}
        className="mt-3 text-[10px] text-accent inline-flex items-center gap-1 group hover:text-accent-dark transition-colors"
      >
        Continue learning
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function DashboardStageCard() {
  const [stageState, setStageState] = useState<LifeStageState | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    setDismissed(isDismissed);
    setStageState(loadStageProgress());
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  }

  function handleUndo() {
    localStorage.removeItem(DISMISSED_KEY);
    setDismissed(false);
    setShowUndo(false);
  }

  if (dismissed) {
    if (showUndo) {
      return (
        <div className="flex items-center gap-3 bg-[#F5F5F0] rounded-xl px-4 py-3 mb-6 text-xs text-[#888888]">
          <span>Widget hidden.</span>
          <button
            onClick={handleUndo}
            className="text-accent font-medium hover:text-accent-dark transition-colors"
          >
            Undo
          </button>
        </div>
      );
    }
    return null;
  }

  // Loading skeleton
  if (!stageState) return <WidgetSkeleton />;

  const allGraduated =
    stageState.graduatedStages.length === lifeStages.length && lifeStages.length > 0;
  const hasActiveStage = stageState.activeStageId !== null;
  const hasStartedAny = stageState.stages.length > 0;

  return (
    <motion.div
      variants={widgetVariants}
      initial="hidden"
      animate="visible"
      className="bg-surface border border-[#EFEFEA] rounded-xl p-5 mb-6"
      style={{
        boxShadow: "0 4px 16px rgba(22,163,74,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">Life Path</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/paths"
            className="text-[10px] text-accent hover:text-accent-dark transition-colors"
          >
            View all
          </Link>
          <button
            onClick={handleDismiss}
            className="text-[#888888] hover:text-[#555555] transition-colors"
            aria-label="Dismiss Life Path widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {allGraduated ? (
        <AllCompleteState />
      ) : hasActiveStage || hasStartedAny ? (
        <ActiveStageState stageState={stageState} />
      ) : (
        <EmptyState />
      )}
    </motion.div>
  );
}
