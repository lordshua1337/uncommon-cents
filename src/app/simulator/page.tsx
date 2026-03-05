"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Landmark,
  Home,
  CreditCard,
  Heart,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { ALL_SCENARIOS } from "@/lib/simulator/scenarios";
import type { ScenarioDefinition } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// Category icons + colors
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG = {
  tax: { icon: Receipt, color: "text-amber-400", bg: "bg-amber-400/10" },
  debt: { icon: CreditCard, color: "text-red-400", bg: "bg-red-400/10" },
  investing: { icon: Landmark, color: "text-blue-400", bg: "bg-blue-400/10" },
  retirement: { icon: PiggyBank, color: "text-green-400", bg: "bg-green-400/10" },
  insurance: { icon: Heart, color: "text-purple-400", bg: "bg-purple-400/10" },
} as const;

// ---------------------------------------------------------------------------
// Scenario Card
// ---------------------------------------------------------------------------

function ScenarioCard({ scenario }: { scenario: ScenarioDefinition }) {
  const config = CATEGORY_CONFIG[scenario.category];
  const Icon = config.icon;

  return (
    <Link
      href={`/simulator/${scenario.slug}`}
      className="bg-surface border border-border-light rounded-xl p-5 hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider ${config.color}`}
          >
            {scenario.category}
          </span>
          <h3 className="text-sm font-semibold mt-0.5 group-hover:text-accent transition-colors">
            {scenario.title}
          </h3>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {scenario.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SimulatorIndexPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent" />
              Scenario Simulator
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Run real financial scenarios with your numbers. Compare options,
              see the math, make better decisions.
            </p>
          </div>
        </div>

        {/* Scenarios grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_SCENARIOS.map((scenario) => (
            <ScenarioCard key={scenario.slug} scenario={scenario} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-text-secondary text-center mt-8">
          These calculators use simplified models for educational purposes. Real
          financial decisions should account for your full picture. Not financial
          advice.
        </p>
      </div>
    </div>
  );
}
