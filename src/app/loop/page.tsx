"use client";

import { useState } from "react";
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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-xs font-medium mb-4">
            <RotateCcw className="w-3.5 h-3.5" />
            The System
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            The Uncommon Cents Operating Loop
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
            {operatingLoop.principle}
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">
              {completedSteps.size} of {operatingLoop.steps.length} steps
              reviewed
            </p>
            {completedSteps.size > 0 && (
              <button
                onClick={resetAll}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
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
                className={`bg-surface rounded-xl border transition-colors ${
                  isCompleted ? "border-accent/30" : "border-border"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStep(step.order)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-accent text-white"
                          : "bg-accent-bg text-accent hover:bg-accent/20"
                      }`}
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
                        <span className="text-xs font-mono text-accent font-semibold">
                          Step {step.order}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-semibold leading-relaxed mb-2 ${
                          isCompleted ? "text-text-muted line-through" : ""
                        }`}
                      >
                        {step.action}
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">
                        {step.description}
                      </p>

                      {/* Related links */}
                      {links.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-xs text-accent hover:text-accent-light transition-colors inline-flex items-center gap-1 bg-accent-bg px-2.5 py-1 rounded-md"
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
        <div className="bg-surface-alt rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold mb-3">Guardrails</h2>
          <ul className="space-y-2">
            <li className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-accent mt-0.5">--</span>
              Tax moves depend on facts and documentation. The IRS expects
              recordkeeping systems that clearly show income and deductions.
            </li>
            <li className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-accent mt-0.5">--</span>
              Many strategies have eligibility gates (plan features, age rules,
              holding periods). The power comes from respecting the gates.
            </li>
            <li className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-accent mt-0.5">--</span>
              Fraud protection is layered defenses, not one trick.
            </li>
            <li className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-accent mt-0.5">--</span>
              This is education, not personalized financial/tax/legal advice.
              Consult qualified professionals for your specific situation.
            </li>
            <li className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-accent mt-0.5">--</span>
              All legal references are to US federal rules. State-level
              variations exist for many of these strategies.
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/scripts"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Money Scripts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/defenses"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Fraud Defenses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/explore"
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Explore All Domains <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
