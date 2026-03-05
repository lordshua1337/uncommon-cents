// Scenario Simulator Types
// Each scenario has inputs, computes two options, and produces a verdict

export interface SimulatorInput {
  readonly id: string;
  readonly label: string;
  readonly type: "number" | "percent" | "currency" | "years";
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly defaultValue: number;
  readonly hint?: string;
}

export interface SimulatorOption {
  readonly label: string;
  readonly description: string;
  readonly futureValue: number;
  readonly taxCost: number;
  readonly netBenefit: number;
  readonly details: readonly string[];
}

export interface SimulatorResult {
  readonly optionA: SimulatorOption;
  readonly optionB: SimulatorOption;
  readonly verdict: string;
  readonly winner: "A" | "B" | "tie";
  readonly caveat: string;
  readonly relatedConcepts: readonly string[];
}

export interface ScenarioDefinition {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly category: "tax" | "debt" | "investing" | "retirement" | "insurance";
  readonly inputs: readonly SimulatorInput[];
  readonly compute: (values: Record<string, number>) => SimulatorResult;
  readonly relatedConcepts: readonly string[];
}

// ---------------------------------------------------------------------------
// Saved simulations persistence
// ---------------------------------------------------------------------------

export interface SavedSimulation {
  readonly id: string;
  readonly scenarioSlug: string;
  readonly inputs: Record<string, number>;
  readonly result: SimulatorResult;
  readonly savedAt: string;
  readonly label?: string;
}

const STORAGE_KEY = "uncommon_cents_simulations";
const MAX_SAVED = 50;

export function loadSavedSimulations(): readonly SavedSimulation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedSimulation[];
  } catch {
    return [];
  }
}

export function saveSimulation(
  sim: Omit<SavedSimulation, "id" | "savedAt">
): readonly SavedSimulation[] {
  const saved = [...loadSavedSimulations()];
  const entry: SavedSimulation = {
    ...sim,
    id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    savedAt: new Date().toISOString(),
  };
  const updated = [entry, ...saved].slice(0, MAX_SAVED);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage full
    }
  }
  return updated;
}

export function deleteSavedSimulation(
  id: string
): readonly SavedSimulation[] {
  const updated = loadSavedSimulations().filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage full
    }
  }
  return updated;
}
