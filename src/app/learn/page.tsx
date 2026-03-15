"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  AlertTriangle,
  Shield,
  KeyRound,
  Scissors,
  Heart,
  Lightbulb,
  AlertCircle,
  Clock,
  Landmark,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { strategies } from "@/lib/strategies-data";

const iconMap: Record<string, React.ReactNode> = {
  ArrowUpDown: <ArrowUpDown className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  AlertTriangle: <AlertTriangle className="w-6 h-6 text-warning" strokeWidth={1.5} />,
  Shield: <Shield className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  KeyRound: <KeyRound className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  Scissors: <Scissors className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  Heart: <Heart className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  Clock: <Clock className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  Landmark: <Landmark className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  BarChart3: <BarChart3 className="w-6 h-6 text-accent" strokeWidth={1.5} />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-accent" strokeWidth={1.5} />,
};

export default function LearnPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#FAF8F4' }}>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Home
        </Link>

        <div className="mb-12">
          <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
            Learn
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            The Uncommon Playbook
          </h1>
          <p className="text-text-secondary leading-relaxed">
            {strategies.length} strategies that financially literate people use every
            day. Each one is legal, well-documented, and available to you
            right now. Most financial advisors won&apos;t bring these up
            because they don&apos;t generate commissions.
          </p>
        </div>

        {/* Table of contents */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-12">
          <p className="text-xs text-accent uppercase tracking-widest font-medium mb-3">
            Jump to Strategy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {strategies.map((strategy, index) => (
              <a
                key={strategy.id}
                href={`#${strategy.id}`}
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors py-1"
              >
                <span className="text-xs text-text-muted font-mono w-5">
                  {index + 1}.
                </span>
                {strategy.title}
              </a>
            ))}
          </div>
        </div>

        {/* Strategy articles */}
        <div className="space-y-12">
          {strategies.map((strategy, index) => (
            <article
              key={strategy.id}
              id={strategy.id}
              className="scroll-mt-24"
            >
              {/* Strategy header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent-bg flex items-center justify-center flex-shrink-0">
                  {iconMap[strategy.icon]}
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Strategy {index + 1} of {strategies.length}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    {strategy.title}
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    {strategy.subtitle}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-text-secondary leading-relaxed mb-6 text-base">
                {strategy.summary}
              </p>

              {/* Key numbers */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {strategy.keyNumbers.map((kn) => (
                  <div
                    key={kn.label}
                    className="bg-surface border border-border-light rounded-lg p-3"
                  >
                    <p className="text-lg font-semibold text-accent">
                      {kn.value}
                    </p>
                    <p className="text-xs text-text-muted">{kn.label}</p>
                  </div>
                ))}
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {strategy.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-base font-semibold mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Common mistake */}
              <div className="mt-6 bg-red/5 border border-red/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-red">
                    Common Mistake
                  </p>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {strategy.commonMistake}
                </p>
              </div>

              {/* Uncommon insight */}
              <div className="mt-4 bg-accent-bg border border-accent/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-accent">
                    Uncommon Insight
                  </p>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {strategy.uncommonInsight}
                </p>
              </div>

              {/* Divider */}
              {index < strategies.length - 1 && (
                <div className="divider-financial mt-12" />
              )}
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center rounded-xl p-8" style={{ background: '#F5F1E8', border: '1px solid #D4CFC4' }}>
          <h3 className="text-xl font-semibold mb-3">
            Ready to Run the Numbers?
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Use our calculators to see how these strategies apply to your
            specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calculators"
              className="px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(90deg, #CA8A04 0%, #A57203 100%)', color: '#0F172A', boxShadow: '0 4px 16px rgba(202,138,4,0.30)' }}
            >
              Open Calculators
            </Link>
            <Link
              href="/ask"
              className="px-6 py-2.5 rounded-lg font-medium transition-colors"
              style={{ border: '1px solid #D4CFC4', color: '#0F172A', background: 'transparent' }}
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
