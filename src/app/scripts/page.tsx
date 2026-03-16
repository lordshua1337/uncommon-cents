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
    <div
      className="uc-card overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full ${
                script.association === "destructive"
                  ? "bg-red-100 text-red-600"
                  : "bg-[#E05A1B]/10 text-[#E05A1B]"
              }`}
            >
              {script.association}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: "#1A1A1A" }}>{script.name}</h3>
          <p className="text-sm italic" style={{ color: "#555555" }}>
            {script.triggerPhrase}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1" style={{ color: "#555555" }}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className="px-5 pb-5 pt-4 space-y-4 animate-fade-in"
          style={{ borderTop: "1px solid rgba(196,166,122,0.3)" }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#555555" }}>
              What it looks like
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
              {script.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#555555" }}>
              Risk pattern
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
              {script.riskPattern}
            </p>
          </div>

          {counterMove && (
            <div className="rounded-lg p-4" style={{ background: "#E05A1B10" }}>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#E05A1B" }}>
                Counter-move
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1A1A1A" }}>
                {counterMove.intervention}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
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
    <div className="min-h-screen linen-texture pt-24 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: "#E05A1B10", color: "#E05A1B" }}
          >
            <Brain className="w-3.5 h-3.5" />
            Behavioral Foundation
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "#1A1A1A" }}>
            {moneyScriptAssessment.title}
          </h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#555555" }}>
            {moneyScriptAssessment.subtitle}
          </p>
        </div>

        {/* Research Context */}
        <div
          className="uc-card p-5 mb-8"
          style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(44,95,124,0.1)" }}
            >
              <Zap className="w-4 h-4" style={{ color: "#2C5F7C" }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "#1A1A1A" }}>Research Context</p>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#555555" }}>
                {moneyScriptAssessment.researchContext.keyFinding}
              </p>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#555555" }}>
                {moneyScriptAssessment.researchContext.earlyFormation}
              </p>
              <p className="text-xs" style={{ color: "#555555" }}>
                Source: {moneyScriptAssessment.researchContext.source}
              </p>
            </div>
          </div>
        </div>

        {/* Scripts */}
        <div className="mb-10">
          <h2 className="font-heading text-lg font-semibold mb-4" style={{ color: "#1A1A1A" }}>The Four Money Scripts</h2>
          <p className="text-sm mb-6" style={{ color: "#555555" }}>
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
        <div
          className="uc-card p-6 mb-10"
          style={{
            border: "2px solid rgba(224,90,27,0.2)",
            boxShadow: "0 2px 12px rgba(44,95,124,0.08)",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#E05A1B10" }}
            >
              <Clock className="w-5 h-5" style={{ color: "#E05A1B" }} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold" style={{ color: "#1A1A1A" }}>
                30-Day Tracking Challenge
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
                The most powerful exercise in this entire app
              </p>
            </div>
          </div>

          <div className="rounded-lg p-4 mb-4" style={{ background: "#E05A1B08" }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: "#1A1A1A" }}>
              {trackingChallenge.instruction}
            </p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
            {trackingChallenge.purpose}
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-lg p-4 mb-8"
          style={{ background: "rgba(44,95,124,0.06)" }}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C4A67A" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#555555" }}>
              Money scripts are patterns, not diagnoses. This is a
              self-awareness tool to help you recognize behavioral tendencies.
              For deeper behavioral finance work, consider working with a
              financial therapist or CFP with behavioral training.
            </p>
          </div>
        </div>

        <div className="divider-financial my-8" />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/loop"
            className="uc-button uc-button-primary inline-flex items-center gap-2"
          >
            See the Operating Loop
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/defenses"
            className="text-sm font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#E05A1B" }}
          >
            Fraud Defenses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
