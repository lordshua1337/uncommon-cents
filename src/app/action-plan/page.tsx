"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Target,
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  SkipForward,
  Calculator,
  Brain,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  loadActionPlan,
  generateActionPlan,
  updateActionStatus,
  getActionPlanProgress,
  type ActionPlanState,
  type ActionItem,
  type ActionStatus,
} from "@/lib/action-plan";

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG = {
  learn: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10", label: "Learn" },
  do: { icon: Target, color: "text-green-400", bg: "bg-green-400/10", label: "Do" },
  review: { icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10", label: "Review" },
  simulate: { icon: Calculator, color: "text-amber-400", bg: "bg-amber-400/10", label: "Simulate" },
} as const;

const STATUS_CONFIG = {
  not_started: { icon: Circle, color: "text-text-secondary" },
  in_progress: { icon: Clock, color: "text-amber-400" },
  completed: { icon: CheckCircle, color: "text-green-400" },
  skipped: { icon: SkipForward, color: "text-text-secondary" },
} as const;

// ---------------------------------------------------------------------------
// Action Item Card
// ---------------------------------------------------------------------------

function ActionItemCard({
  item,
  onStatusChange,
}: {
  item: ActionItem;
  onStatusChange: (status: ActionStatus) => void;
}) {
  const catConfig = CATEGORY_CONFIG[item.category];
  const CatIcon = catConfig.icon;
  const statusConfig = STATUS_CONFIG[item.status];
  const StatusIcon = statusConfig.icon;

  const nextStatus: ActionStatus =
    item.status === "not_started"
      ? "in_progress"
      : item.status === "in_progress"
        ? "completed"
        : item.status;

  const linkHref = item.linkedConceptSlug
    ? `/concepts/${item.linkedConceptSlug}`
    : item.linkedSimulatorSlug
      ? `/simulator/${item.linkedSimulatorSlug}`
      : item.linkedQuiz
        ? "/quiz"
        : item.category === "review"
          ? "/review"
          : null;

  return (
    <div
      className={`bg-surface border rounded-xl p-4 transition-all ${
        item.status === "completed"
          ? "border-green-400/20 opacity-60"
          : item.status === "skipped"
            ? "border-border-light opacity-40"
            : "border-border-light"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={() => onStatusChange(nextStatus)}
          className={`mt-0.5 shrink-0 ${statusConfig.color} hover:opacity-70 transition-opacity`}
          disabled={item.status === "completed" || item.status === "skipped"}
        >
          <StatusIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catConfig.bg} ${catConfig.color}`}
            >
              {catConfig.label}
            </span>
            <span className="text-[10px] text-text-secondary">
              #{item.priority}
            </span>
          </div>
          <p
            className={`text-sm font-medium ${
              item.status === "completed" ? "line-through text-text-secondary" : ""
            }`}
          >
            {item.title}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {item.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {linkHref && (
              <Link
                href={linkHref}
                className="text-[10px] text-accent hover:text-accent-light transition-colors"
              >
                Go to {item.category} --&gt;
              </Link>
            )}
            {item.status !== "skipped" && item.status !== "completed" && (
              <button
                onClick={() => onStatusChange("skipped")}
                className="text-[10px] text-text-secondary hover:text-text-primary transition-colors ml-auto"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ActionPlanPage() {
  const [plan, setPlan] = useState<ActionPlanState | null>(null);

  useEffect(() => {
    const existing = loadActionPlan();
    if (existing) {
      setPlan(existing);
    } else {
      setPlan(generateActionPlan());
    }
  }, []);

  const handleStatusChange = useCallback(
    (actionId: string, status: ActionStatus) => {
      if (!plan) return;
      const updated = updateActionStatus(plan, actionId, status);
      setPlan(updated);
    },
    [plan]
  );

  const handleRegenerate = useCallback(() => {
    setPlan(generateActionPlan());
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm text-text-secondary">
          Building your action plan...
        </p>
      </div>
    );
  }

  const progress = getActionPlanProgress(plan);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Action Plan
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Personalized next steps based on your progress
              </p>
            </div>
          </div>
          <button
            onClick={handleRegenerate}
            className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-surface transition-colors"
            title="Regenerate plan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-surface border border-border-light rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-secondary">
              {progress.completed} of {progress.total} actions completed
            </p>
            <p className="text-xs font-mono text-accent">
              {Math.round(progress.completionRate * 100)}%
            </p>
          </div>
          <div className="h-2 bg-background rounded-full">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${progress.completionRate * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Action items */}
        <div className="space-y-3">
          {plan.items.map((item) => (
            <ActionItemCard
              key={item.id}
              item={item}
              onStatusChange={(status) => handleStatusChange(item.id, status)}
            />
          ))}
        </div>

        {/* Empty state */}
        {plan.items.length === 0 && (
          <div className="bg-surface border border-border-light rounded-xl p-8 text-center">
            <Target className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              No actions generated. Take the quiz and explore some concepts
              first.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-text-secondary text-center mt-8">
          Actions are generated from your quiz results, mastery progress, and
          simulator usage. Not financial advice.
        </p>
      </div>
    </div>
  );
}
