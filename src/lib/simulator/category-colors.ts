// Category color mapping for simulator scenarios
// Each category gets a brand-tinted accent used in celebrations, borders, shadows

import type { ScenarioDefinition } from "./types";

export const CATEGORY_COLORS: Readonly<Record<ScenarioDefinition["category"], string>> = {
  tax: "#CA8A04",       // gold -- tax is complex, serious, gold = authority
  debt: "#DC2626",      // red -- debt is urgent, high-stakes
  investing: "#4A6CB8", // brand primary tint-500 -- analytical, calm confidence
  retirement: "#16A34A",// green -- retirement is the growth goal, main accent
  insurance: "#334155", // brand secondary Slate -- protection, shield, security
} as const;

export function getCategoryColor(category: ScenarioDefinition["category"]): string {
  return CATEGORY_COLORS[category] ?? "#16A34A";
}
