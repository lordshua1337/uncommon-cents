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
      className="uc-card overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-semibold" style={{ color: "#E05A1B" }}>
              #{defense.number}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              {defense.threat.split(" ").slice(0, 3).join(" ")}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: "#1A1A1A" }}>{defense.title}</h3>
          <p className="text-sm" style={{ color: "#555555" }}>{defense.tagline}</p>
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
              Threat
            </p>
            <p className="text-sm" style={{ color: "#555555" }}>{defense.threat}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#555555" }}>
              Action steps
            </p>
            <ul className="space-y-2">
              {defense.action.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-semibold text-xs mt-0.5" style={{ color: "#E05A1B" }}>
                    {i + 1}.
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg p-4" style={{ background: "rgba(44,95,124,0.07)" }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#2C5F7C" }}>
              Why it works
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#1A1A1A" }}>
              {defense.whyItWorks}
            </p>
          </div>

          {defense.regulatoryBasis.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#555555" }}>
                Sources
              </p>
              <div className="space-y-1">
                {defense.regulatoryBasis.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
                    style={{ color: "#2C5F7C" }}
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
    <div className="min-h-screen linen-texture pt-24 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Shield className="w-3.5 h-3.5" />
            AI-Era Fraud Defenses
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "#1A1A1A" }}>
            10 Defenses Against Modern Fraud
          </h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#555555" }}>
            FTC reported consumer fraud losses over $12.5B in 2024. AI tools
            have accelerated impersonation. These defenses follow blast-radius
            reduction: assume breach happens, minimize damage per incident.
          </p>
        </div>

        {/* Design principle */}
        <div
          className="uc-card p-5 mb-8"
          style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(220,38,38,0.1)" }}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1A1A1A" }}>Design Principle</p>
              <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                All defenses follow{" "}
                <span className="font-semibold" style={{ color: "#1A1A1A" }}>blast-radius reduction</span>:
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
            href="/scripts"
            className="text-sm font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#E05A1B" }}
          >
            Money Scripts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
