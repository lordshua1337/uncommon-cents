"use client";

import { useState, useCallback, useMemo } from "react";
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
  type SimulatorInput,
  type SimulatorResult,
} from "@/lib/simulator/types";

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
// ---------------------------------------------------------------------------

function ResultDisplay({ result }: { result: SimulatorResult }) {
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
      <div className="bg-surface border border-accent/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <WinnerIcon className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {result.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option A */}
        <div
          className={`bg-surface border rounded-xl p-4 ${
            result.winner === "A"
              ? "border-accent/30"
              : "border-border-light"
          }`}
        >
          {result.winner === "A" && (
            <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded mb-2 inline-block">
              WINNER
            </span>
          )}
          <h4 className="text-sm font-semibold mb-1">{result.optionA.label}</h4>
          <p className="text-xs text-text-secondary mb-3">
            {result.optionA.description}
          </p>
          <div className="space-y-1.5">
            {result.optionA.details.map((detail, i) => (
              <p
                key={i}
                className="text-xs text-text-secondary flex items-start gap-2"
              >
                <span className="text-accent mt-0.5 shrink-0">--</span>
                {detail}
              </p>
            ))}
          </div>
        </div>

        {/* Option B */}
        <div
          className={`bg-surface border rounded-xl p-4 ${
            result.winner === "B"
              ? "border-accent/30"
              : "border-border-light"
          }`}
        >
          {result.winner === "B" && (
            <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded mb-2 inline-block">
              WINNER
            </span>
          )}
          <h4 className="text-sm font-semibold mb-1">{result.optionB.label}</h4>
          <p className="text-xs text-text-secondary mb-3">
            {result.optionB.description}
          </p>
          <div className="space-y-1.5">
            {result.optionB.details.map((detail, i) => (
              <p
                key={i}
                className="text-xs text-text-secondary flex items-start gap-2"
              >
                <span className="text-accent mt-0.5 shrink-0">--</span>
                {detail}
              </p>
            ))}
          </div>
        </div>
      </div>

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

  const result = useMemo(() => {
    if (!scenario) return null;
    return scenario.compute(values);
  }, [scenario, values]);

  const handleInputChange = useCallback((id: string, val: number) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  }, []);

  const handleReset = useCallback(() => {
    if (!scenario) return;
    const defaults: Record<string, number> = {};
    for (const input of scenario.inputs) {
      defaults[input.id] = input.defaultValue;
    }
    setValues(defaults);
    setSaved(false);
  }, [scenario]);

  const handleSave = useCallback(() => {
    if (!scenario || !result) return;
    saveSimulation({
      scenarioSlug: scenario.slug,
      inputs: { ...values },
      result,
      label: scenario.title,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [scenario, values, result]);

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

  return (
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
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                saved
                  ? "text-accent bg-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
              title="Save this run"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-surface border border-border-light rounded-xl p-4 mb-6">
          <p className="text-xs text-text-secondary leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-surface border border-border-light rounded-xl p-5 mb-6">
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
        </div>

        {/* Results (live-updating) */}
        {result && <ResultDisplay result={result} />}

        {/* Disclaimer */}
        <p className="text-[10px] text-text-secondary text-center mt-8">
          Educational calculator. Simplified model. Not financial advice.
        </p>
      </div>
    </div>
  );
}
