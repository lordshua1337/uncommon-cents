"use client";

import { useState, useCallback, useMemo, useRef, useId } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calculator,
  RotateCcw,
  Save,
  Trophy,
  AlertTriangle,
  Minus,
} from "lucide-react";
import { getScenarioBySlug } from "@/lib/simulator/scenarios";
import {
  saveSimulation,
  loadSavedSimulations,
  type SimulatorInput,
  type SimulatorResult,
} from "@/lib/simulator/types";
import { SimulatorCelebration, type CelebrationVariant } from "@/components/simulator/simulator-celebration";
import { getCategoryColor } from "@/lib/simulator/category-colors";
import { CalculationResultReveal } from "@/components/simulator/calculation-result-reveal";
import type { ResultGroup } from "@/components/simulator/calculation-result-reveal";
import { AnimatedTable } from "@/components/simulator/animated-table";
import { ResultChart } from "@/components/simulator/result-chart";
import type { ScenarioDefinition } from "@/lib/simulator/types";

// ---------------------------------------------------------------------------
// Celebration detection helpers
// ---------------------------------------------------------------------------

const FIRST_SIM_FLAG = "uc-first-sim-celebrated";
const ALL_SIMS_FLAG = "uc-all-sims-celebrated";
const TOTAL_SCENARIOS = 6;

function hasCelebrated(flag: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(flag) === "true";
  } catch {
    return false;
  }
}

function markCelebrated(flag: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(flag, "true");
  } catch {
    // Storage full -- continue silently
  }
}

/**
 * Returns the unique scenario slugs saved so far (before the current save).
 * Uses the existing uncommon_cents_simulations key from types.ts.
 */
function getSavedScenarioCount(): number {
  try {
    const sims = loadSavedSimulations();
    const slugs = new Set(sims.map((s) => s.scenarioSlug));
    return slugs.size;
  } catch {
    return 0;
  }
}

/**
 * Determines which celebration variant to show after a save, if any.
 * Priority: all-sims > first-sim > null
 */
function detectCelebrationVariant(scenarioSlug: string): CelebrationVariant | null {
  // Count unique scenarios BEFORE this save was persisted (current count reflects post-save)
  const postSaveCount = getSavedScenarioCount();

  // If all sims just completed (post-save count hits TOTAL_SCENARIOS) -- show all-sims
  if (postSaveCount >= TOTAL_SCENARIOS && !hasCelebrated(ALL_SIMS_FLAG)) {
    markCelebrated(ALL_SIMS_FLAG);
    // Also mark first-sim so it never fires retroactively
    markCelebrated(FIRST_SIM_FLAG);
    return "all-sims";
  }

  // If this is the first unique scenario ever saved -- show first-sim
  // post-save count === 1 means the slug we just saved is the only one in the store
  const sims = loadSavedSimulations();
  const slugs = new Set(sims.map((s) => s.scenarioSlug));
  const isFirstUniqueScenario = slugs.size === 1 && slugs.has(scenarioSlug);

  if (isFirstUniqueScenario && !hasCelebrated(FIRST_SIM_FLAG)) {
    markCelebrated(FIRST_SIM_FLAG);
    return "first-sim";
  }

  return null;
}

// ---------------------------------------------------------------------------
// Map SimulatorResult to ResultGroups for CalculationResultReveal
// ---------------------------------------------------------------------------

function buildResultGroups(
  result: SimulatorResult,
  accentColor: string,
): readonly ResultGroup[] {
  return [
    {
      heading: result.optionA.label,
      accentColor,
      metrics: [
        {
          label: "Future Value",
          value: Math.round(result.optionA.futureValue),
          format: "currency" as const,
          direction: "positive" as const,
          isPrimary: true,
        },
        {
          label: "Tax Cost",
          value: Math.round(result.optionA.taxCost),
          format: "currency" as const,
          direction:
            result.optionA.taxCost > 0
              ? ("negative" as const)
              : ("neutral" as const),
        },
        {
          label: "Net Benefit",
          value: Math.round(result.optionA.netBenefit),
          format: "currency" as const,
          direction:
            result.optionA.netBenefit > result.optionB.netBenefit
              ? ("positive" as const)
              : ("neutral" as const),
        },
      ],
    },
    {
      heading: result.optionB.label,
      accentColor,
      metrics: [
        {
          label: "Future Value",
          value: Math.round(result.optionB.futureValue),
          format: "currency" as const,
          direction: "positive" as const,
          isPrimary: true,
        },
        {
          label: "Tax Cost",
          value: Math.round(result.optionB.taxCost),
          format: "currency" as const,
          direction:
            result.optionB.taxCost > 0
              ? ("negative" as const)
              : ("neutral" as const),
        },
        {
          label: "Net Benefit",
          value: Math.round(result.optionB.netBenefit),
          format: "currency" as const,
          direction:
            result.optionB.netBenefit > result.optionA.netBenefit
              ? ("positive" as const)
              : ("neutral" as const),
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Input Field
// ---------------------------------------------------------------------------

function SimInput({
  input,
  value,
  onChange,
}: {
  input: SimulatorInput;
  value: number;
  onChange: (val: number) => void;
}) {
  const prefix = input.type === "currency" ? "$" : "";
  const suffix = input.type === "percent" ? "%" : input.type === "years" ? " yrs" : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-text-secondary">{input.label}</label>
        <span className="text-xs font-mono font-medium text-text-primary">
          {prefix}
          {input.type === "currency"
            ? value.toLocaleString()
            : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={input.min}
        max={input.max}
        step={input.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
      />
      {input.hint && (
        <p className="text-[10px] text-text-secondary mt-0.5">{input.hint}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result Display
// Renders verdict banner, animated detail tables, bar chart, caveat, concepts.
// ---------------------------------------------------------------------------

function ResultDisplay({
  result,
  accentColor,
  scenarioSlug,
  scenarioCategory,
}: {
  result: SimulatorResult;
  accentColor: string;
  scenarioSlug: string;
  scenarioCategory: ScenarioDefinition["category"];
}) {
  const winnerIcon =
    result.winner === "A" || result.winner === "B" ? Trophy : Minus;
  const WinnerIcon = winnerIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Verdict banner */}
      <div
        className="bg-surface border rounded-xl p-4"
        style={{ borderColor: `${accentColor}30` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}14` }}
          >
            <WinnerIcon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {result.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* Side by side comparison with animated detail tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option A */}
        <div
          className="bg-surface border rounded-xl p-4 overflow-hidden"
          style={{
            borderColor: result.winner === "A"
              ? `${accentColor}40`
              : "var(--color-border-light)",
          }}
        >
          {result.winner === "A" && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded mb-2 inline-block"
              style={{ color: accentColor, backgroundColor: `${accentColor}14` }}
            >
              WINNER
            </span>
          )}
          <h4 className="text-sm font-semibold mb-1">{result.optionA.label}</h4>
          <p className="text-xs text-text-secondary mb-3">
            {result.optionA.description}
          </p>
          {/* Animated cascading detail rows with AnimatedCounter on dollar amounts */}
          <AnimatedTable
            rows={result.optionA.details as string[]}
            accentColor={accentColor}
            animate={true}
            label={`${result.optionA.label} breakdown`}
          />
        </div>

        {/* Option B */}
        <div
          className="bg-surface border rounded-xl p-4 overflow-hidden"
          style={{
            borderColor: result.winner === "B"
              ? `${accentColor}40`
              : "var(--color-border-light)",
          }}
        >
          {result.winner === "B" && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded mb-2 inline-block"
              style={{ color: accentColor, backgroundColor: `${accentColor}14` }}
            >
              WINNER
            </span>
          )}
          <h4 className="text-sm font-semibold mb-1">{result.optionB.label}</h4>
          <p className="text-xs text-text-secondary mb-3">
            {result.optionB.description}
          </p>
          {/* Animated cascading detail rows with AnimatedCounter on dollar amounts */}
          <AnimatedTable
            rows={result.optionB.details as string[]}
            accentColor={accentColor}
            animate={true}
            label={`${result.optionB.label} breakdown`}
          />
        </div>
      </div>

      {/* Animated bar chart -- fires after results cascade with SPRING_GENTLE delay */}
      <ResultChart
        result={result}
        scenarioSlug={scenarioSlug}
        scenarioCategory={scenarioCategory}
        animate={true}
      />

      {/* Caveat */}
      {result.caveat && (
        <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            {result.caveat}
          </p>
        </div>
      )}

      {/* Related concepts */}
      {result.relatedConcepts.length > 0 && (
        <div>
          <p className="text-[10px] text-text-secondary mb-2">
            Related concepts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.relatedConcepts.map((concept) => (
              <Link
                key={concept}
                href={`/concepts/${concept}`}
                className="text-[10px] bg-surface border border-border-light px-2 py-1 rounded hover:border-accent/30 transition-colors"
              >
                {concept.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SimulatorRunnerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const scenario = useMemo(() => getScenarioBySlug(slug), [slug]);

  const [values, setValues] = useState<Record<string, number>>(() => {
    if (!scenario) return {};
    const defaults: Record<string, number> = {};
    for (const input of scenario.inputs) {
      defaults[input.id] = input.defaultValue;
    }
    return defaults;
  });

  const [saved, setSaved] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationVariant | null>(null);

  // D3.22: computing skeleton + animated result reveal state
  const [isComputing, setIsComputing] = useState(false);
  const [displayedResult, setDisplayedResult] = useState<SimulatorResult | null>(null);
  const [calculationId, setCalculationId] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const ariaLiveId = useId();

  const categoryColor = useMemo(
    () => (scenario ? getCategoryColor(scenario.category) : "#16A34A"),
    [scenario],
  );

  const resultGroups = useMemo<readonly ResultGroup[]>(() => {
    if (!displayedResult) return [];
    return buildResultGroups(displayedResult, categoryColor);
  }, [displayedResult, categoryColor]);

  const handleInputChange = useCallback((id: string, val: number) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!scenario) return;
    // Show computing skeleton; hold for 500ms minimum for perceived credibility
    setIsComputing(true);
    setDisplayedResult(null);
    const computed = scenario.compute(values);
    setTimeout(() => {
      setIsComputing(false);
      setDisplayedResult(computed);
      setCalculationId((id) => id + 1);
      requestAnimationFrame(() => {
        resultsRef.current?.focus();
      });
    }, 500);
  }, [scenario, values]);

  const handleReset = useCallback(() => {
    if (!scenario) return;
    const defaults: Record<string, number> = {};
    for (const input of scenario.inputs) {
      defaults[input.id] = input.defaultValue;
    }
    setValues(defaults);
    setDisplayedResult(null);
    setIsComputing(false);
    setSaved(false);
  }, [scenario]);

  const handleSave = useCallback(() => {
    if (!scenario || !displayedResult) return;

    // Save first so localStorage reflects the new state before detection
    saveSimulation({
      scenarioSlug: scenario.slug,
      inputs: { ...values },
      result: displayedResult,
      label: scenario.title,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Detect celebration after save (200ms delay lets results settle visually)
    setTimeout(() => {
      const variant = detectCelebrationVariant(scenario.slug);
      if (variant) {
        setCelebration(variant);
      }
    }, 200);
  }, [scenario, values, displayedResult]);

  const handleCelebrationDismiss = useCallback(() => {
    setCelebration(null);
  }, []);

  if (!scenario) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-3">
            Scenario not found.
          </p>
          <Link
            href="/simulator"
            className="text-xs text-accent hover:text-accent-light transition-colors"
          >
            Back to all scenarios
          </Link>
        </div>
      </div>
    );
  }

  const ariaStatusMessage = isComputing
    ? "Running your numbers..."
    : displayedResult
      ? "Results ready."
      : "";

  return (
    <>
      {/* Celebration overlay -- rendered outside the scrollable column so it covers full viewport */}
      <SimulatorCelebration
        variant={celebration}
        scenarioName={scenario.title}
        categoryColor={categoryColor}
        onDismiss={handleCelebrationDismiss}
      />

      {/* Screen-reader live region for calculation state changes */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id={ariaLiveId}
      >
        {ariaStatusMessage}
      </div>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/simulator"
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-accent" />
                  {scenario.title}
                </h1>
                <p className="text-xs text-text-secondary mt-0.5">
                  {scenario.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {displayedResult && (
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    saved
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                  title={saved ? "Scenario saved." : "Save this scenario"}
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface border border-border-light rounded-xl p-4 mb-6">
            <p className="text-xs text-text-secondary leading-relaxed">
              {scenario.description}
            </p>
          </div>

          {/* Inputs + Calculate button */}
          <div className="bg-surface border border-border-light rounded-xl p-5 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
              Your Numbers
            </h3>
            <div className="space-y-4">
              {scenario.inputs.map((input) => (
                <SimInput
                  key={input.id}
                  input={input}
                  value={values[input.id] ?? input.defaultValue}
                  onChange={(val) => handleInputChange(input.id, val)}
                />
              ))}
            </div>

            {/* Calculate button */}
            <motion.button
              onClick={handleCalculate}
              disabled={isComputing}
              whileHover={isComputing ? undefined : { scale: 1.02 }}
              whileTap={isComputing ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: categoryColor }}
            >
              {isComputing
                ? "Calculating..."
                : displayedResult
                  ? "Adjust the numbers"
                  : "Calculate"}
            </motion.button>
          </div>

          {/* Animated result reveal panel */}
          {(isComputing || displayedResult) && (
            <div className="bg-surface border border-border-light rounded-xl p-5 mb-4">
              {/* Verdict, animated detail tables, chart -- only when results are ready */}
              {displayedResult && !isComputing && (
                <ResultDisplay
                  result={displayedResult}
                  accentColor={categoryColor}
                  scenarioSlug={scenario.slug}
                  scenarioCategory={scenario.category}
                />
              )}

              {/* Animated metric grid with computing skeleton */}
              <CalculationResultReveal
                groups={resultGroups}
                calculationKey={String(calculationId)}
                accentColor={categoryColor}
                isComputing={isComputing}
                ariaLiveRef={resultsRef}
              />
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[10px] text-text-secondary text-center mt-8">
            Educational calculator. Simplified model. Not financial advice.
          </p>
        </div>
      </div>
    </>
  );
}
