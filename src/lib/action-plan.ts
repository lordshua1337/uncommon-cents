// Financial Action Plan -- personalized action list from quiz results + mastery gaps

import { loadQuizResult, type QuizResult } from "@/lib/quiz-engine";
import { loadMastery } from "@/lib/mastery";
import { concepts } from "@/lib/concepts";
import { loadSavedSimulations } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActionStatus = "not_started" | "in_progress" | "completed" | "skipped";

export interface ActionItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: "learn" | "do" | "review" | "simulate";
  readonly priority: number; // 1 = highest
  readonly linkedConceptSlug?: string;
  readonly linkedSimulatorSlug?: string;
  readonly linkedQuiz?: boolean;
  readonly status: ActionStatus;
}

export interface ActionPlanState {
  readonly items: readonly ActionItem[];
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon_cents_action_plan";

export function loadActionPlan(): ActionPlanState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActionPlanState;
  } catch {
    return null;
  }
}

function saveActionPlan(state: ActionPlanState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full
  }
}

// ---------------------------------------------------------------------------
// Status updates (immutable)
// ---------------------------------------------------------------------------

export function updateActionStatus(
  state: ActionPlanState,
  actionId: string,
  status: ActionStatus
): ActionPlanState {
  const updated: ActionPlanState = {
    ...state,
    items: state.items.map((item) =>
      item.id === actionId ? { ...item, status } : item
    ),
  };
  saveActionPlan(updated);
  return updated;
}

// ---------------------------------------------------------------------------
// Plan generator
// ---------------------------------------------------------------------------

export function generateActionPlan(): ActionPlanState {
  const quiz = loadQuizResult();
  const masteryState = loadMastery();
  const simulations = loadSavedSimulations();

  const items: ActionItem[] = [];
  let priority = 1;

  // 1. Quiz-based actions (money script awareness)
  if (!quiz) {
    items.push({
      id: "action_quiz",
      title: "Take the Money Scripts Quiz",
      description: "Discover your money script -- the unconscious beliefs driving your financial decisions.",
      category: "do",
      priority: priority++,
      linkedQuiz: true,
      status: "not_started",
    });
  } else {
    const dominant = quiz.dominant;
    const scriptActions: Record<string, { title: string; description: string }[]> = {
      avoidance: [
        { title: "Set up automatic transfers", description: "Your avoidance script means you avoid thinking about money. Automation removes the need for willpower." },
        { title: "Schedule a monthly money date", description: "15 minutes once a month to review your accounts. Avoidance gets worse when ignored." },
      ],
      worship: [
        { title: "Calculate your 'enough number'", description: "Money worship has no finish line. Define what 'enough' actually looks like for you." },
        { title: "Track non-financial wins weekly", description: "Break the link between money and happiness by noting what actually made you happy this week." },
      ],
      status: [
        { title: "Audit your 'status spending'", description: "Review last month's expenses. How much was for others' perception vs. your actual needs?" },
        { title: "Unfollow financial influencers", description: "Status script feeds on comparison. Reduce the input." },
      ],
      vigilance: [
        { title: "Define your risk tolerance in writing", description: "Vigilance can become paralysis. Write down what risks you're actually willing to take." },
        { title: "Set a decision deadline for one financial choice", description: "Over-research is a vigilance trap. Pick one pending decision and commit to deciding by a date." },
      ],
    };

    const actions = scriptActions[dominant] ?? [];
    for (const action of actions) {
      items.push({
        id: `action_script_${dominant}_${priority}`,
        title: action.title,
        description: action.description,
        category: "do",
        priority: priority++,
        status: "not_started",
      });
    }
  }

  // 2. Mastery gap actions (concepts not yet explored)
  const masteredIds = new Set(masteryState.concepts.map((m) => m.conceptId));
  const unmasteredDomains = new Map<string, number>();

  for (const concept of concepts) {
    if (!masteredIds.has(concept.id)) {
      const count = unmasteredDomains.get(concept.domainId) ?? 0;
      unmasteredDomains.set(concept.domainId, count + 1);
    }
  }

  // Top 3 domains with most unread concepts
  const topGaps = Array.from(unmasteredDomains.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [domainId, count] of topGaps) {
    const firstConcept = concepts.find(
      (c) => c.domainId === domainId && !masteredIds.has(c.id)
    );
    if (firstConcept) {
      items.push({
        id: `action_learn_${domainId}`,
        title: `Explore ${firstConcept.name}`,
        description: `You have ${count} concepts to explore in this domain. Start with this one.`,
        category: "learn",
        priority: priority++,
        linkedConceptSlug: firstConcept.slug,
        status: "not_started",
      });
    }
  }

  // 3. Simulator actions (scenarios not yet run)
  const simulatedSlugs = new Set(simulations.map((s) => s.scenarioSlug));
  const unrunScenarios = [
    { slug: "roth-conversion", title: "Run the Roth Conversion Calculator" },
    { slug: "rent-vs-buy", title: "Compare Renting vs Buying" },
    { slug: "debt-payoff", title: "Optimize Your Debt Payoff Strategy" },
    { slug: "early-retirement", title: "Check Your Early Retirement Number" },
    { slug: "hsa-vs-traditional", title: "Compare HSA vs Traditional Insurance" },
    { slug: "tax-loss-harvest", title: "Calculate Tax-Loss Harvesting Savings" },
  ].filter((s) => !simulatedSlugs.has(s.slug));

  for (const scenario of unrunScenarios.slice(0, 2)) {
    items.push({
      id: `action_sim_${scenario.slug}`,
      title: scenario.title,
      description: "Run the numbers with your actual financial situation.",
      category: "simulate",
      priority: priority++,
      linkedSimulatorSlug: scenario.slug,
      status: "not_started",
    });
  }

  // 4. Review actions
  items.push({
    id: "action_review",
    title: "Review due flashcards",
    description: "Spaced repetition helps you retain financial concepts long-term.",
    category: "review",
    priority: priority++,
    status: "not_started",
  });

  const plan: ActionPlanState = {
    items,
    generatedAt: new Date().toISOString(),
  };

  saveActionPlan(plan);
  return plan;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export function getActionPlanProgress(state: ActionPlanState): {
  total: number;
  completed: number;
  inProgress: number;
  skipped: number;
  completionRate: number;
} {
  const completed = state.items.filter((i) => i.status === "completed").length;
  const inProgress = state.items.filter((i) => i.status === "in_progress").length;
  const skipped = state.items.filter((i) => i.status === "skipped").length;

  return {
    total: state.items.length,
    completed,
    inProgress,
    skipped,
    completionRate: state.items.length > 0 ? completed / state.items.length : 0,
  };
}
