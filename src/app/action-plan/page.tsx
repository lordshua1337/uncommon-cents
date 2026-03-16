"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Target,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
  Calculator,
  Brain,
  RefreshCw,
  Sparkles,
  Zap,
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
import { SPRING_GENTLE, SPRING_SNAPPY, SPRING_BOUNCY, STAGGER_FAST } from "@/lib/animation-constants";
import { ActionProgressBar } from "@/components/action-progress-bar";
import {
  ActionPlanCelebration,
  hasActionPlanCelebrationSeen,
  markActionPlanCelebrationSeen,
} from "@/components/action-plan-celebration";

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

const CATEGORY_ORDER = ["learn", "do", "review", "simulate"] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const CATEGORY_CONFIG: Record<
  Category,
  {
    icon: React.ElementType;
    color: string;
    borderColor: string;
    bgColor: string;
    label: string;
    accentRgb: string;
  }
> = {
  learn: {
    icon: BookOpen,
    color: "text-[#2C5F7C]",
    borderColor: "border-l-[#2C5F7C]",
    bgColor: "bg-[#2C5F7C]/5",
    label: "Learn",
    accentRgb: "44,95,124",
  },
  do: {
    icon: Zap,
    color: "text-[#E05A1B]",
    borderColor: "border-l-[#E05A1B]",
    bgColor: "bg-[#E05A1B]/5",
    label: "Do",
    accentRgb: "224,90,27",
  },
  review: {
    icon: Brain,
    color: "text-[#1E3F2E]",
    borderColor: "border-l-[#1E3F2E]",
    bgColor: "bg-[#1E3F2E]/5",
    label: "Review",
    accentRgb: "30,63,46",
  },
  simulate: {
    icon: Calculator,
    color: "text-[#C4A67A]",
    borderColor: "border-l-[#C4A67A]",
    bgColor: "bg-[#C4A67A]/10",
    label: "Simulate",
    accentRgb: "196,166,122",
  },
};

const STATUS_CONFIG: Record<
  ActionStatus,
  { icon: React.ElementType; color: string }
> = {
  not_started: { icon: Circle, color: "text-[#555555]" },
  in_progress: { icon: Clock, color: "text-[#C4A67A]" },
  completed: { icon: CheckCircle2, color: "text-[#1E3F2E]" },
  skipped: { icon: MinusCircle, color: "text-slate-400" },
};

// ---------------------------------------------------------------------------
// Group items by category in canonical order
// ---------------------------------------------------------------------------

function groupByCategory(
  items: readonly ActionItem[]
): Array<{ category: Category; items: ActionItem[] }> {
  const map = new Map<Category, ActionItem[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const item of items) {
    const cat = item.category as Category;
    if (map.has(cat)) {
      map.get(cat)!.push(item as ActionItem);
    }
  }
  return CATEGORY_ORDER.filter((cat) => (map.get(cat)?.length ?? 0) > 0).map(
    (cat) => ({ category: cat, items: map.get(cat)! })
  );
}

// ---------------------------------------------------------------------------
// Sort items within a category: active first, done last (preserving priority)
// ---------------------------------------------------------------------------

function sortCategoryItems(items: ActionItem[]): ActionItem[] {
  return [...items].sort((a, b) => {
    const aDone = a.status === "completed" || a.status === "skipped" ? 1 : 0;
    const bDone = b.status === "completed" || b.status === "skipped" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return a.priority - b.priority;
  });
}

// ---------------------------------------------------------------------------
// Completion pulse hook -- transient flag that auto-resets after durationMs
// ---------------------------------------------------------------------------

function useCompletionPulse(durationMs: number) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    setActive(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(false), durationMs);
  }, [durationMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { active, trigger };
}

// ---------------------------------------------------------------------------
// Action Item Card — D3.19 completion micro-interactions
// Spring-physics checkbox, green pulse, animated strikethrough, card settle,
// layout reorder via Framer Motion layout prop, useReducedMotion guard.
// ---------------------------------------------------------------------------

function ActionItemCard({
  item,
  onStatusChange,
  prefersReduced,
  ariaLiveRef,
}: {
  item: ActionItem;
  onStatusChange: (status: ActionStatus) => void;
  prefersReduced: boolean;
  ariaLiveRef: React.RefObject<HTMLDivElement | null>;
}) {
  const catConfig = CATEGORY_CONFIG[item.category as Category];
  const CatIcon = catConfig.icon;
  const statusConfig = STATUS_CONFIG[item.status];
  const StatusIcon = statusConfig.icon;

  // Detect status transitions to fire animation sequences
  const prevStatusRef = useRef<ActionStatus>(item.status);
  // Changing iconKey re-mounts the motion.div, replaying the spring
  const [iconKey, setIconKey] = useState(0);

  const completedPulse = useCompletionPulse(600);
  const skippedPulse = useCompletionPulse(500);

  useEffect(() => {
    const prev = prevStatusRef.current;
    const next = item.status;
    if (prev === next) return;

    if (next === "completed" && !prefersReduced) {
      completedPulse.trigger();
      setIconKey((k) => k + 1);
      // Announce for screen readers
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = `${item.title} marked complete`;
      }
    } else if (next === "skipped" && !prefersReduced) {
      skippedPulse.trigger();
      setIconKey((k) => k + 1);
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = `${item.title} skipped`;
      }
    }
    prevStatusRef.current = next;
  }, [item.status, item.title, prefersReduced, completedPulse, skippedPulse, ariaLiveRef]);

  const isCompleted = item.status === "completed";
  const isSkipped = item.status === "skipped";
  const isTerminal = isCompleted || isSkipped;

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

  // Background flash: category-appropriate success or skip color
  const pulseBackground = completedPulse.active
    ? `rgba(${catConfig.accentRgb},0.10)`
    : skippedPulse.active
      ? "rgba(148,163,184,0.10)"
      : undefined;

  // Card opacity dims in completed/skipped state
  const cardOpacity = isCompleted ? 0.72 : isSkipped ? 0.48 : 1;

  return (
    // layout="position" enables Framer Motion to smoothly animate this card
    // to its new position when the sorted order changes after completion.
    <motion.div
      layout="position"
      animate={{
        opacity: cardOpacity,
        ...(pulseBackground ? { backgroundColor: pulseBackground } : {}),
        // Card settle: brief scale dip then spring back to 1
        ...(completedPulse.active && !prefersReduced
          ? { scale: [1, 0.98, 1.005, 1] }
          : skippedPulse.active && !prefersReduced
            ? { scale: [1, 0.97, 1] }
            : {}),
      }}
      transition={
        completedPulse.active || skippedPulse.active
          ? { ...SPRING_SNAPPY, delay: 0.1 }
          : SPRING_GENTLE
      }
      className={[
        "group relative flex items-start gap-3 p-4 rounded-xl border border-l-2 overflow-hidden",
        catConfig.borderColor,
        isTerminal
          ? "border-[rgba(196,166,122,0.2)] bg-white/40"
          : `${catConfig.bgColor} border-[rgba(196,166,122,0.2)]`,
      ].join(" ")}
      style={{
        boxShadow: isTerminal ? "none" : `0 2px 12px rgba(44,95,124,0.06)`,
      }}
      whileHover={
        prefersReduced || isTerminal
          ? {}
          : {
              y: -2,
              boxShadow: `0 8px 24px rgba(${catConfig.accentRgb},0.12), 0 0 0 1px rgba(${catConfig.accentRgb},0.08)`,
            }
      }
      whileTap={prefersReduced || isTerminal ? {} : { scale: 0.99 }}
      role="listitem"
    >
      {/* Status icon — springs in on completion/skip transition */}
      <button
        onClick={() => {
          if (!isTerminal) onStatusChange(nextStatus);
        }}
        disabled={isTerminal}
        aria-label={`${item.title} — ${
          isCompleted
            ? "Done"
            : isSkipped
              ? "Skipped"
              : item.status === "in_progress"
                ? "In progress"
                : "Not started"
        }. ${isTerminal ? "" : "Click to advance."}`}
        className={[
          "mt-0.5 shrink-0 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded",
          statusConfig.color,
          isTerminal
            ? "opacity-60 cursor-not-allowed pointer-events-none"
            : "hover:opacity-70",
        ].join(" ")}
      >
        {/* key prop re-mounts this element, replaying the spring animation */}
        <motion.div
          key={iconKey}
          aria-hidden="true"
          animate={
            prefersReduced
              ? {}
              : isCompleted
                ? { scale: [0, 1.3, 1], opacity: [0, 1, 1] }
                : isSkipped
                  ? { scale: [0, 1.15, 1], opacity: [0, 1, 1] }
                  : {}
          }
          transition={
            isCompleted
              ? { ...SPRING_BOUNCY, duration: 0.3 }
              : isSkipped
                ? {
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94] as [
                      number,
                      number,
                      number,
                      number,
                    ],
                  }
                : {}
          }
          style={{ display: "inline-flex", overflow: "visible" }}
        >
          <StatusIcon className="w-5 h-5" />
        </motion.div>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CatIcon
            className={`w-3.5 h-3.5 ${catConfig.color} shrink-0`}
            strokeWidth={1.5}
          />
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide ${catConfig.color}`}
          >
            {catConfig.label}
          </span>
          <span className="text-[10px]" style={{ color: "#555555" }}>
            #{item.priority}
          </span>
        </div>

        {/* Title with animated strikethrough line on completion */}
        <div className="relative">
          <p
            className="text-sm font-medium leading-snug transition-colors duration-300"
            style={{
              color: isCompleted ? "#555555" : isSkipped ? "#888888" : "#1A1A1A",
            }}
          >
            {item.title}
          </p>
          {/* Animated strikethrough: line draws left-to-right, category-colored at 45% */}
          <AnimatePresence>
            {isCompleted && !prefersReduced && (
              <motion.div
                key="strikethrough"
                initial={{ width: "0%", opacity: 1 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: "0%", opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: "1px",
                  backgroundColor: `rgba(${catConfig.accentRgb},0.45)`,
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#555555" }}>
          {item.description}
        </p>

        <div className="flex items-center gap-2 mt-2">
          {linkHref && (
            <Link
              href={linkHref}
              className={`text-[10px] font-medium ${catConfig.color} hover:opacity-70 transition-opacity`}
            >
              Go to {catConfig.label} &rarr;
            </Link>
          )}
          {!isTerminal && (
            <button
              onClick={() => onStatusChange("skipped")}
              className="text-[10px] transition-colors ml-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/50 rounded"
              style={{ color: "#555555" }}
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay: 0.1 }}
      className="uc-card p-10 text-center"
      style={{
        border: "1px solid rgba(196,166,122,0.2)",
        boxShadow: "0 2px 12px rgba(44,95,124,0.06)",
      }}
    >
      <Target className="w-10 h-10 mx-auto mb-3" style={{ color: "#555555" }} />
      <p className="text-sm font-medium mb-1" style={{ color: "#1A1A1A" }}>
        Your plan is being built.
      </p>
      <p className="text-xs mb-4 max-w-xs mx-auto" style={{ color: "#555555" }}>
        Complete the money script quiz to generate your personalized action
        plan.
      </p>
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: "#E05A1B" }}
      >
        Take the quiz &rarr;
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// All-skipped/completed state
// ---------------------------------------------------------------------------

function AllSkippedState({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay: 0.1 }}
      className="uc-card p-10 text-center"
      style={{
        border: "1px solid rgba(196,166,122,0.2)",
        boxShadow: "0 2px 12px rgba(44,95,124,0.06)",
      }}
    >
      <RefreshCw className="w-10 h-10 mx-auto mb-3" style={{ color: "#555555" }} />
      <p className="text-sm font-medium mb-1" style={{ color: "#1A1A1A" }}>
        Nothing left to act on.
      </p>
      <p className="text-xs mb-4 max-w-xs mx-auto" style={{ color: "#555555" }}>
        {"You've skipped or completed everything. Retake the quiz to generate a fresh plan."}
      </p>
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: "#E05A1B" }}
      >
        Retake quiz &rarr;
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ActionPlanPage() {
  const [plan, setPlan] = useState<ActionPlanState | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  // Track if this is the initial mount so we don't replay entrance on re-renders
  const hasAnimated = useRef(false);
  const prefersReduced = useReducedMotion() ?? false;
  // aria-live region ref -- passed to each ActionItemCard so it can announce
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = loadActionPlan();
    setPlan(existing ?? generateActionPlan());
    hasAnimated.current = false;
  }, []);

  // After entrance stagger completes, mark as done so re-renders don't replay
  useEffect(() => {
    if (plan && !hasAnimated.current) {
      const timer = setTimeout(() => {
        hasAnimated.current = true;
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [plan]);

  // Detect full plan completion and trigger D3.20 celebration
  useEffect(() => {
    if (!plan) return;
    const nonSkipped = plan.items.filter((i) => i.status !== "skipped");
    if (nonSkipped.length === 0) return;
    const allComplete = nonSkipped.every((i) => i.status === "completed");
    if (allComplete && !hasActionPlanCelebrationSeen()) {
      setShowCelebration(true);
    }
  }, [plan]);

  const handleStatusChange = useCallback(
    (actionId: string, status: ActionStatus) => {
      if (!plan) return;
      const updated = updateActionStatus(plan, actionId, status);
      setPlan(updated);
    },
    [plan]
  );

  const handleRegenerate = useCallback(() => {
    hasAnimated.current = false;
    markActionPlanCelebrationSeen();
    setShowCelebration(false);
    setPlan(generateActionPlan());
  }, []);

  // Loading skeleton
  if (!plan) {
    return (
      <div className="min-h-screen linen-texture pt-20 pb-16 px-4 flex items-center justify-center">
        <p className="text-sm animate-pulse" style={{ color: "#555555" }}>
          Building your action plan...
        </p>
      </div>
    );
  }

  const progress = getActionPlanProgress(plan);
  const grouped = groupByCategory(plan.items);
  const allDoneOrSkipped =
    plan.items.length > 0 &&
    plan.items.every((i) => i.status === "completed" || i.status === "skipped");

  // Pre-compute stagger delays for entrance animation
  let globalCardIndex = 0;
  const groupDelays = grouped.map((group) => {
    const headerDelay = prefersReduced ? 0 : globalCardIndex * STAGGER_FAST + 0.1;
    const firstCardDelay = prefersReduced ? 0 : headerDelay + 0.1;
    globalCardIndex += group.items.length + 1;
    return { ...group, headerDelay, firstCardDelay };
  });

  const shouldAnimate = !hasAnimated.current && !prefersReduced;

  return (
    <div
      className="min-h-screen linen-texture pt-20 pb-16 px-4"
      role="main"
      aria-label="Your personalized action plan"
    >
      {/* Screen reader live region for completion announcements */}
      <div
        ref={ariaLiveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="max-w-[960px] mx-auto">
        {/* Page header */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg transition-colors hover:bg-white/60"
              style={{ color: "#555555" }}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="space-y-0.5">
              <h1 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: "#1A1A1A" }}>
                <Sparkles className="w-5 h-5" style={{ color: "#E05A1B" }} />
                Your Action Plan
              </h1>
              <p className="text-sm font-normal" style={{ color: "#555555" }}>
                Personalized next steps based on your money script, knowledge
                gaps, and simulator activity.
              </p>
            </div>
          </div>
          <button
            onClick={handleRegenerate}
            className="p-2 rounded-lg transition-colors hover:bg-white/60"
            style={{ color: "#555555" }}
            title="Regenerate plan"
            aria-label="Regenerate action plan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Animated progress bar (D3.18) */}
        <motion.div
          initial={
            shouldAnimate ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: shouldAnimate ? 0.1 : 0 }}
        >
          <ActionProgressBar
            completed={progress.completed}
            total={progress.total}
            className="mb-8"
          />
        </motion.div>

        {/* Empty state */}
        {plan.items.length === 0 && (
          <EmptyState prefersReduced={prefersReduced} />
        )}

        {/* All done/skipped state */}
        {allDoneOrSkipped && plan.items.length > 0 && (
          <AllSkippedState prefersReduced={prefersReduced} />
        )}

        {/* Category-grouped action items */}
        {!allDoneOrSkipped && plan.items.length > 0 && (
          <div className="flex flex-col gap-6">
            {groupDelays.map(({ category, items, headerDelay, firstCardDelay }) => {
              const catConfig = CATEGORY_CONFIG[category];
              const CatIcon = catConfig.icon;
              // Sort: active items first, completed/skipped last -- reorder
              // triggered by status changes drives Framer Motion layout animation
              const sorted = sortCategoryItems(items);

              return (
                <section
                  key={category}
                  role="group"
                  aria-label={`${catConfig.label} actions`}
                >
                  {/* Category header */}
                  <motion.div
                    initial={
                      shouldAnimate
                        ? { opacity: 0, x: -8 }
                        : { opacity: 1, x: 0 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_GENTLE, delay: headerDelay }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <CatIcon
                      className={`w-3.5 h-3.5 ${catConfig.color}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-xs font-semibold uppercase tracking-widest ${catConfig.color}`}
                    >
                      {catConfig.label}
                    </span>
                    <span className="text-[10px]" style={{ color: "#555555" }}>
                      {items.length} {items.length === 1 ? "action" : "actions"}
                    </span>
                  </motion.div>

                  {/* Card list -- LayoutGroup scopes layout animations to this
                      category so completed cards only reorder within their group */}
                  <LayoutGroup id={`category-${category}`}>
                    <div className="flex flex-col gap-2.5" role="list">
                      {sorted.map((item, cardIndex) => (
                        <motion.div
                          key={item.id}
                          // layout="position" on this wrapper enables the
                          // category-scoped reorder animation. When sortCategoryItems
                          // changes order after a completion, Framer Motion
                          // interpolates each card to its new position.
                          layout="position"
                          initial={
                            shouldAnimate
                              ? { opacity: 0, y: 16 }
                              : { opacity: 1, y: 0 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            layout: SPRING_GENTLE,
                            ...SPRING_GENTLE,
                            delay: shouldAnimate
                              ? firstCardDelay + cardIndex * STAGGER_FAST
                              : 0,
                          }}
                        >
                          <ActionItemCard
                            item={item}
                            onStatusChange={(status) =>
                              handleStatusChange(item.id, status)
                            }
                            prefersReduced={prefersReduced}
                            ariaLiveRef={ariaLiveRef}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </LayoutGroup>
                </section>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-center mt-10" style={{ color: "#555555" }}>
          Actions are generated from your quiz results, mastery progress, and
          simulator usage. Not financial advice.
        </p>
      </div>

      {/* Full plan completion celebration overlay (D3.20) */}
      <ActionPlanCelebration
        visible={showCelebration}
        completedCount={plan.items.filter((i) => i.status === "completed").length}
        onDismiss={() => setShowCelebration(false)}
      />
    </div>
  );
}
