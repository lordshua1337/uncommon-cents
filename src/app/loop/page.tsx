"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  RotateCcw,
  Brain,
  CreditCard,
  PiggyBank,
  BarChart3,
  Umbrella,
  Shield,
} from "lucide-react";
import { operatingLoop } from "@/lib/operating-loop-data";

const LOOP_STORAGE_KEY = "uc_loop_progress";

function loadLoopProgress(): Set<number> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(LOOP_STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveLoopProgress(steps: Set<number>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOOP_STORAGE_KEY, JSON.stringify([...steps]));
}

const stepIcons = [
  <Brain key="brain" className="w-5 h-5" />,
  <CreditCard key="credit" className="w-5 h-5" />,
  <PiggyBank key="piggy" className="w-5 h-5" />,
  <BarChart3 key="bar" className="w-5 h-5" />,
  <Umbrella key="umbrella" className="w-5 h-5" />,
  <Shield key="shield" className="w-5 h-5" />,
];

const stepLinks: Record<number, { href: string; label: string }[]> = {
  1: [{ href: "/scripts", label: "Take the Money Scripts Assessment" }],
  2: [{ href: "/explore/debt-strategy", label: "Explore Debt Strategy" }],
  3: [
    { href: "/explore/tax-advantaged-accounts", label: "Tax Accounts" },
    { href: "/explore/business-finance", label: "Business Plans" },
    { href: "/explore/estate-planning", label: "Estate Planning" },
  ],
  4: [
    { href: "/explore/investing", label: "Investing Concepts" },
    { href: "/explore/tax-optimization", label: "Tax Strategy" },
  ],
  5: [{ href: "/explore/insurance", label: "Insurance Concepts" }],
  6: [{ href: "/defenses", label: "View All 10 Fraud Defenses" }],
};

export default function LoopPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    setCompletedSteps(loadLoopProgress());
    setLoaded(true);
  }, []);

  // Save whenever steps change (skip initial empty render)
  useEffect(() => {
    if (!loaded) return;
    saveLoopProgress(completedSteps);
  }, [completedSteps, loaded]);

  function toggleStep(order: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  }

  function resetAll() {
    setCompletedSteps(new Set());
  }

  const progress = completedSteps.size / operatingLoop.steps.length;

  return (
    <div className="min-h-screen linen-texture pt-24 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: "#E05A1B10", color: "#E05A1B" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            The System
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "#1A1A1A" }}>
            The Uncommon Cents Operating Loop
          </h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#555555" }}>
            {operatingLoop.principle}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="uc-card p-5 mb-8"
          style={{ boxShadow: "0 2px 12px rgba(44,95,124,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
              {completedSteps.size} of {operatingLoop.steps.length} steps
              reviewed
            </p>
            {completedSteps.size > 0 && (
              <button
                onClick={resetAll}
                className="text-xs transition-colors hover:opacity-70"
                style={{ color: "#555555" }}
              >
                Reset
              </button>
            )}
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(196,166,122,0.25)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%`, background: "#E05A1B" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {operatingLoop.steps.map((step) => {
            const isCompleted = completedSteps.has(step.order);
            const links = stepLinks[step.order] || [];

            return (
              <div
                key={step.order}
                className="uc-card transition-colors"
                style={{
                  border: isCompleted
                    ? "1px solid rgba(224,90,27,0.3)"
                    : "1px solid rgba(196,166,122,0.3)",
                  boxShadow: "0 2px 12px rgba(44,95,124,0.06)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStep(step.order)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      style={
                        isCompleted
                          ? { background: "#E05A1B", color: "#FFFFFF" }
                          : {
                              background: "rgba(224,90,27,0.1)",
                              color: "#E05A1B",
                            }
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        stepIcons[step.order - 1] || (
                          <Circle className="w-4 h-4" />
                        )
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold" style={{ color: "#E05A1B" }}>
                          Step {step.order}
                        </span>
                      </div>
                      <p
                        className="text-sm font-semibold leading-relaxed mb-2"
                        style={{
                          color: isCompleted ? "#555555" : "#1A1A1A",
                          textDecoration: isCompleted ? "line-through" : "none",
                        }}
                      >
                        {step.action}
                      </p>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: "#555555" }}>
                        {step.description}
                      </p>

                      {/* Related links */}
                      {links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-xs font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-opacity hover:opacity-70"
                              style={{
                                color: "#E05A1B",
                                background: "rgba(224,90,27,0.08)",
                              }}
                            >
                              {link.label}
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guardrails */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "rgba(44,95,124,0.06)" }}
        >
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>Guardrails</h2>
          <ul className="space-y-2">
            <li className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "#555555" }}>
              <span className="mt-0.5" style={{ color: "#C4A67A" }}>--</span>
              Tax moves depend on facts and documentation. The IRS expects
              recordkeeping systems that clearly show income and deductions.
            </li>
            <li className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "#555555" }}>
              <span className="mt-0.5" style={{ color: "#C4A67A" }}>--</span>
              Many strategies have eligibility gates (plan features, age rules,
              holding periods). The power comes from respecting the gates.
            </li>
            <li className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "#555555" }}>
              <span className="mt-0.5" style={{ color: "#C4A67A" }}>--</span>
              Fraud protection is layered defenses, not one trick.
            </li>
            <li className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "#555555" }}>
              <span className="mt-0.5" style={{ color: "#C4A67A" }}>--</span>
              This is education, not personalized financial/tax/legal advice.
              Consult qualified professionals for your specific situation.
            </li>
            <li className="text-xs leading-relaxed flex items-start gap-2" style={{ color: "#555555" }}>
              <span className="mt-0.5" style={{ color: "#C4A67A" }}>--</span>
              All legal references are to US federal rules. State-level
              variations exist for many of these strategies.
            </li>
          </ul>
        </div>

        <div className="divider-financial my-8" />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/scripts"
            className="text-sm font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#E05A1B" }}
          >
            Money Scripts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/defenses"
            className="text-sm font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#E05A1B" }}
          >
            Fraud Defenses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#E05A1B" }}
          >
            Explore All Domains <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
