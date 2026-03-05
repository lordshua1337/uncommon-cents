// All scenario definitions -- single import point

import { rothConversion } from "./roth-conversion";
import { rentVsBuy } from "./rent-vs-buy";
import { debtPayoff } from "./debt-payoff";
import { hsaVsTraditional } from "./hsa-vs-traditional";
import { earlyRetirement } from "./early-retirement";
import { taxLossHarvest } from "./tax-loss-harvest";
import type { ScenarioDefinition } from "../types";

export const ALL_SCENARIOS: readonly ScenarioDefinition[] = [
  rothConversion,
  rentVsBuy,
  debtPayoff,
  hsaVsTraditional,
  earlyRetirement,
  taxLossHarvest,
];

export function getScenarioBySlug(slug: string): ScenarioDefinition | undefined {
  return ALL_SCENARIOS.find((s) => s.slug === slug);
}

export {
  rothConversion,
  rentVsBuy,
  debtPayoff,
  hsaVsTraditional,
  earlyRetirement,
  taxLossHarvest,
};
