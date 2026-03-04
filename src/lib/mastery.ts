// Domain mastery tracking -- localStorage-backed concept progress
// Tracks which concepts have been visited at each depth level
// Mastery = weighted score across three depth layers per concept
// All operations are immutable -- returns new state

import { getConceptsByDomain } from "./concepts";
import { domains } from "./domains";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DepthLevel = "accessible" | "intermediate" | "advanced";

export interface ConceptProgress {
  readonly conceptId: string;
  readonly visitedLayers: readonly DepthLevel[];
  readonly firstVisited: string; // ISO date
  readonly lastVisited: string; // ISO date
}

export interface MasteryState {
  readonly concepts: readonly ConceptProgress[];
}

export interface DomainMastery {
  readonly domainId: string;
  readonly totalConcepts: number;
  readonly visitedConcepts: number;
  readonly masteryPercent: number; // 0-100, weighted by depth
  readonly conceptsAtAccessible: number;
  readonly conceptsAtIntermediate: number;
  readonly conceptsAtAdvanced: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "uncommon-cents-mastery";

// Weights: accessible=1, intermediate=2, advanced=3
// Max per concept = 6 (all three layers)
const LAYER_WEIGHTS: Record<DepthLevel, number> = {
  accessible: 1,
  intermediate: 2,
  advanced: 3,
};
const MAX_WEIGHT_PER_CONCEPT = 6; // 1 + 2 + 3

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export function loadMastery(): MasteryState {
  if (typeof window === "undefined") return { concepts: [] };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { concepts: [] };
    return JSON.parse(raw) as MasteryState;
  } catch {
    return { concepts: [] };
  }
}

export function saveMastery(state: MasteryState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------------------------------------------------------------------------
// Operations (immutable)
// ---------------------------------------------------------------------------

export function recordConceptVisit(
  state: MasteryState,
  conceptId: string,
  layer: DepthLevel,
): MasteryState {
  const now = new Date().toISOString();
  const existing = state.concepts.find((c) => c.conceptId === conceptId);

  if (existing) {
    // Already visited this layer? Just update lastVisited
    if (existing.visitedLayers.includes(layer)) {
      return {
        ...state,
        concepts: state.concepts.map((c) =>
          c.conceptId === conceptId ? { ...c, lastVisited: now } : c,
        ),
      };
    }

    // Add the new layer
    return {
      ...state,
      concepts: state.concepts.map((c) =>
        c.conceptId === conceptId
          ? {
              ...c,
              visitedLayers: [...c.visitedLayers, layer],
              lastVisited: now,
            }
          : c,
      ),
    };
  }

  // First visit to this concept
  const newProgress: ConceptProgress = {
    conceptId,
    visitedLayers: [layer],
    firstVisited: now,
    lastVisited: now,
  };

  return {
    ...state,
    concepts: [...state.concepts, newProgress],
  };
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

function getConceptScore(progress: ConceptProgress): number {
  let score = 0;
  for (const layer of progress.visitedLayers) {
    score += LAYER_WEIGHTS[layer];
  }
  return score;
}

export function getDomainMastery(
  state: MasteryState,
  domainId: string,
): DomainMastery {
  const domainConcepts = getConceptsByDomain(domainId);
  const totalConcepts = domainConcepts.length;

  if (totalConcepts === 0) {
    return {
      domainId,
      totalConcepts: 0,
      visitedConcepts: 0,
      masteryPercent: 0,
      conceptsAtAccessible: 0,
      conceptsAtIntermediate: 0,
      conceptsAtAdvanced: 0,
    };
  }

  const conceptIds = new Set(domainConcepts.map((c) => c.id));
  const relevantProgress = state.concepts.filter((cp) =>
    conceptIds.has(cp.conceptId),
  );

  let totalScore = 0;
  let atAccessible = 0;
  let atIntermediate = 0;
  let atAdvanced = 0;

  for (const cp of relevantProgress) {
    totalScore += getConceptScore(cp);
    if (cp.visitedLayers.includes("accessible")) atAccessible++;
    if (cp.visitedLayers.includes("intermediate")) atIntermediate++;
    if (cp.visitedLayers.includes("advanced")) atAdvanced++;
  }

  const maxScore = totalConcepts * MAX_WEIGHT_PER_CONCEPT;
  const masteryPercent = Math.round((totalScore / maxScore) * 100);

  return {
    domainId,
    totalConcepts,
    visitedConcepts: relevantProgress.length,
    masteryPercent,
    conceptsAtAccessible: atAccessible,
    conceptsAtIntermediate: atIntermediate,
    conceptsAtAdvanced: atAdvanced,
  };
}

export function getAllDomainMastery(
  state: MasteryState,
): readonly DomainMastery[] {
  return domains.map((d) => getDomainMastery(state, d.id));
}

export function getOverallMastery(state: MasteryState): {
  readonly totalConcepts: number;
  readonly visitedConcepts: number;
  readonly overallPercent: number;
} {
  const allDomains = getAllDomainMastery(state);
  const totalConcepts = allDomains.reduce((sum, d) => sum + d.totalConcepts, 0);
  const visitedConcepts = allDomains.reduce(
    (sum, d) => sum + d.visitedConcepts,
    0,
  );
  const totalWeighted = allDomains.reduce(
    (sum, d) => sum + d.masteryPercent * d.totalConcepts,
    0,
  );
  const overallPercent =
    totalConcepts > 0 ? Math.round(totalWeighted / totalConcepts) : 0;

  return { totalConcepts, visitedConcepts, overallPercent };
}

export function getHighestDepth(
  state: MasteryState,
  conceptId: string,
): DepthLevel | null {
  const cp = state.concepts.find((c) => c.conceptId === conceptId);
  if (!cp || cp.visitedLayers.length === 0) return null;

  if (cp.visitedLayers.includes("advanced")) return "advanced";
  if (cp.visitedLayers.includes("intermediate")) return "intermediate";
  return "accessible";
}
