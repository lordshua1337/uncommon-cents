"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { fraudDefenses, type FraudDefense } from "@/lib/fraud-defenses-data";

function DefenseCard({ defense }: { defense: FraudDefense }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-accent font-semibold">
              #{defense.number}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full bg-red/10 text-red">
              {defense.threat.split(" ").slice(0, 3).join(" ")}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1">{defense.title}</h3>
          <p className="text-sm text-text-muted">{defense.tagline}</p>
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
              Threat
            </p>
            <p className="text-sm text-text-secondary">{defense.threat}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Action steps
            </p>
            <ul className="space-y-2">
              {defense.action.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent font-semibold text-xs mt-0.5">
                    {i + 1}.
                  </span>
                  <span className="text-sm text-text-secondary leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-accent-bg rounded-lg p-4">
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
              Why it works
            </p>
            <p className="text-sm text-text-primary leading-relaxed">
              {defense.whyItWorks}
            </p>
          </div>

          {defense.regulatoryBasis.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Sources
              </p>
              <div className="space-y-1">
                {defense.regulatoryBasis.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-accent hover:text-accent-light transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span>
                      {ref.authority}: {ref.reference}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DefensesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red/10 text-red px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Shield className="w-3.5 h-3.5" />
            AI-Era Fraud Defenses
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            10 Defenses Against Modern Fraud
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
            FTC reported consumer fraud losses over $12.5B in 2024. AI tools
            have accelerated impersonation. These defenses follow blast-radius
            reduction: assume breach happens, minimize damage per incident.
          </p>
        </div>

        {/* Design principle */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-red" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Design Principle</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                All defenses follow{" "}
                <span className="font-semibold">blast-radius reduction</span>:
                assume breach happens, minimize damage per incident. This is
                enterprise security thinking applied to personal life.
              </p>
            </div>
          </div>
        </div>

        {/* Defense cards */}
        <div className="space-y-3 mb-10">
          {fraudDefenses.map((defense) => (
            <DefenseCard key={defense.id} defense={defense} />
          ))}
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
            href="/scripts"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Money Scripts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
