// Category color mapping for simulator scenarios
// Each category gets a brand-tinted accent used in celebrations, borders, shadows

import type { ScenarioDefinition } from "./types";

export const CATEGORY_COLORS: Readonly<Record<ScenarioDefinition["category"], string>> = {
  tax: "#C4A67A",       // tan -- tax is complex, serious
  debt: "#E05A1B",      // VROOM orange -- debt is urgent, high-stakes
  investing: "#2C5F7C", // blue -- investing is analytical, calm confidence
  retirement: "#1E3F2E",// green -- retirement is the growth goal
  insurance: "#2C5F7C", // blue -- protection, shield, security
} as const;

export function getCategoryColor(category: ScenarioDefinition["category"]): string {
  return CATEGORY_COLORS[category] ?? "#2C5F7C";
}
