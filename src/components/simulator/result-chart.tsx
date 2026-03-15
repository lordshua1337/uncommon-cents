"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedBarChart, type BarChartBar } from "./animated-bar-chart";
import { SPRING_GENTLE } from "@/lib/animation-constants";
import type { SimulatorResult } from "@/lib/simulator/types";
import { getCategoryColor } from "@/lib/simulator/category-colors";
import type { ScenarioDefinition } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// ResultChart
//
// Builds bar chart data from a SimulatorResult, selecting the most meaningful
// metrics to visualize for each scenario type. Renders the animated bar chart
// with a chart heading and optional summary text.
//
// Chart selection logic (by scenario):
//   - All scenarios: compare optionA.netBenefit vs optionB.netBenefit (primary)
//   - Also show futureValue comparison when both options have non-zero futureValues
// ---------------------------------------------------------------------------

interface ResultChartProps {
  readonly result: SimulatorResult;
  readonly scenarioSlug: string;
  readonly scenarioCategory: ScenarioDefinition["category"];
  readonly animate?: boolean;
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${value < 0 ? "-" : ""}$${(abs / 1_000).toFixed(0)}k`;
  }
  return `${value < 0 ? "-" : ""}$${Math.abs(Math.round(value)).toLocaleString()}`;
}

function buildChartBars(
  result: SimulatorResult,
  slug: string
): readonly BarChartBar[] {
  const { optionA, optionB, winner } = result;

  // For debt-payoff: netBenefit is negative (interest paid), compare by magnitude
  if (slug === "debt-payoff") {
    const aBars = Math.abs(optionA.netBenefit);
    const bBars = Math.abs(optionB.netBenefit);
    return [
      {
        label: optionA.label,
        sublabel: "Interest Paid",
        value: aBars,
        isWinner: winner === "A",
      },
      {
        label: optionB.label,
        sublabel: "Interest Paid",
        value: bBars,
        isWinner: winner === "B",
      },
    ];
  }

  // For tax-loss-harvest: show this-year savings vs no-savings
  if (slug === "tax-loss-harvest") {
    const aNet = Math.max(0, optionA.netBenefit);
    const bNet = Math.max(0, Math.abs(optionB.netBenefit));
    return [
      {
        label: optionA.label,
        sublabel: "Net Benefit",
        value: aNet,
        isWinner: winner === "A",
      },
      {
        label: optionB.label,
        sublabel: "Tax Owed",
        value: bNet,
        isWinner: winner === "B",
      },
    ];
  }

  // For early-retirement: compare projected savings at each target age
  if (slug === "early-retirement") {
    return [
      {
        label: optionA.label,
        sublabel: "Projected Savings",
        value: Math.max(0, optionA.futureValue),
        isWinner: winner === "A",
      },
      {
        label: optionB.label,
        sublabel: "Projected Savings",
        value: Math.max(0, optionB.futureValue),
        isWinner: winner === "B",
      },
    ];
  }

  // Default: use futureValue if both are non-zero, otherwise netBenefit
  const bothHaveFutureValue = optionA.futureValue > 0 && optionB.futureValue > 0;
  if (bothHaveFutureValue) {
    return [
      {
        label: optionA.label,
        sublabel: "Projected Value",
        value: optionA.futureValue,
        isWinner: winner === "A",
      },
      {
        label: optionB.label,
        sublabel: "Projected Value",
        value: optionB.futureValue,
        isWinner: winner === "B",
      },
    ];
  }

  // Fallback to net benefit
  return [
    {
      label: optionA.label,
      sublabel: "Net Benefit",
      value: Math.max(0, optionA.netBenefit),
      isWinner: winner === "A",
    },
    {
      label: optionB.label,
      sublabel: "Net Benefit",
      value: Math.max(0, optionB.netBenefit),
      isWinner: winner === "B",
    },
  ];
}

function chartAriaLabel(result: SimulatorResult, slug: string): string {
  const { optionA, optionB } = result;
  return `Bar chart comparing ${optionA.label} versus ${optionB.label}. ${result.verdict}`;
}

export function ResultChart({ result, scenarioSlug, scenarioCategory, animate = true }: ResultChartProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;
  const accentColor = getCategoryColor(scenarioCategory);

  const bars = useMemo(
    () => buildChartBars(result, scenarioSlug),
    [result, scenarioSlug]
  );

  const allZero = bars.every((b) => b.value === 0);

  if (allZero) {
    return null;
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_GENTLE, delay: 0.55 }}
      className="mt-4"
    >
      {/* Section heading */}
      <p className="text-sm font-semibold text-slate-300 mb-3">
        How it plays out over time
      </p>

      <AnimatedBarChart
        bars={bars}
        accentColor={accentColor}
        animate={animate}
        formatValue={formatCurrency}
        ariaLabel={chartAriaLabel(result, scenarioSlug)}
      />
    </motion.div>
  );
}
