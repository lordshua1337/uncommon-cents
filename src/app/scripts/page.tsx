"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
} from "lucide-react";
import {
  moneyScriptAssessment,
  moneyScripts,
  counterMoves,
  trackingChallenge,
  type MoneyScript,
} from "@/lib/money-scripts-data";

function ScriptCard({ script }: { script: MoneyScript }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const counterMove = counterMoves.find((c) => c.scriptId === script.id);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full ${
                script.association === "destructive"
                  ? "bg-red/10 text-red"
                  : "bg-accent-bg text-accent"
              }`}
            >
              {script.association}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1">{script.name}</h3>
          <p className="text-sm text-text-muted italic">
            {script.triggerPhrase}
          </p>
        </div>
        <div className="text-text-muted flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-border-light pt-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              What it looks like
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {script.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              Risk pattern
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {script.riskPattern}
            </p>
          </div>

          {counterMove && (
            <div className="bg-accent-bg rounded-lg p-4">
              <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
                Counter-move
              </p>
              <p className="text-sm font-semibold text-text-primary mb-1">
                {counterMove.intervention}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {counterMove.mechanism}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScriptsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Brain className="w-3.5 h-3.5" />
            Behavioral Foundation
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {moneyScriptAssessment.title}
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
            {moneyScriptAssessment.subtitle}
          </p>
        </div>

        {/* Research Context */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Research Context</p>
              <p className="text-sm text-text-secondary leading-relaxed mb-2">
                {moneyScriptAssessment.researchContext.keyFinding}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mb-2">
                {moneyScriptAssessment.researchContext.earlyFormation}
              </p>
              <p className="text-xs text-text-muted">
                Source: {moneyScriptAssessment.researchContext.source}
              </p>
            </div>
          </div>
        </div>

        {/* Scripts */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">The Four Money Scripts</h2>
          <p className="text-sm text-text-secondary mb-6">
            Most people carry one dominant script with elements of others. Tap
            each to explore the pattern, risk, and counter-move.
          </p>

          <div className="space-y-3">
            {moneyScripts.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        </div>

        {/* 30-Day Challenge */}
        <div className="bg-surface border-2 border-accent/20 rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                30-Day Tracking Challenge
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                The most powerful exercise in this entire app
              </p>
            </div>
          </div>

          <div className="bg-accent-bg rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-text-primary leading-relaxed">
              {trackingChallenge.instruction}
            </p>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {trackingChallenge.purpose}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-surface-alt rounded-lg p-4 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              Money scripts are patterns, not diagnoses. This is a
              self-awareness tool to help you recognize behavioral tendencies.
              For deeper behavioral finance work, consider working with a
              financial therapist or CFP with behavioral training.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/loop"
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-light transition-colors inline-flex items-center gap-2"
          >
            See the Operating Loop
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/defenses"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Fraud Defenses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
