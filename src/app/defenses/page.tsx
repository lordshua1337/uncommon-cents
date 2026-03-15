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
    <div
      style={{
        background: "#FFFDF8",
        border: "1px solid #D4CFC4",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="defense-card-trigger w-full text-left p-5 flex items-start justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: "#0F172A" } as React.CSSProperties}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Sequence number */}
            <div
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "0.25rem",
                background: "#EEF1F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {defense.number}
              </span>
            </div>
            {/* Threat badge */}
            <span
              style={{
                background: "#FEE2E2",
                color: "#DC2626",
                borderRadius: "999px",
                fontSize: "0.6875rem",
                fontWeight: 500,
                padding: "3px 8px",
              }}
            >
              {defense.threat.split(" ").slice(0, 3).join(" ")}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1">{defense.title}</h3>
          <p className="text-sm text-text-muted">{defense.tagline}</p>
        </div>
        <div className="text-text-muted flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
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

          {/* Why it works -- brass-tinted insight panel */}
          <div
            style={{
              background: "#FAF3E6",
              borderRadius: "0.5rem",
              padding: "0.875rem",
            }}
          >
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
                    <ExternalLink className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
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
    <div className="min-h-screen pt-24 pb-32 md:pb-32 px-4" style={{ background: '#FAF8F4' }}>
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 py-8 rounded-2xl" style={{ background: '#F5F1E8', border: '1px solid #D4CFC4' }}>
          <div className="inline-flex items-center gap-2 bg-red/10 text-red px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
              <AlertTriangle className="w-4 h-4 text-red" strokeWidth={1.5} />
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
        <div className="space-y-4 md:space-y-5 mb-10">
          {fraudDefenses.map((defense) => (
            <DefenseCard key={defense.id} defense={defense} />
          ))}
        </div>

        <div className="divider-financial my-8" />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/loop"
            className="px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(90deg, #CA8A04 0%, #A57203 100%)', color: '#0F172A', boxShadow: '0 4px 16px rgba(202,138,4,0.30)' }}
          >
            See the Operating Loop
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/scripts"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Money Scripts <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
