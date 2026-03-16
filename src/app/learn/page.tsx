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
  ArrowUpDown: <ArrowUpDown className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" style={{ color: '#C4A67A' }} />,
  Shield: <Shield className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  KeyRound: <KeyRound className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  Scissors: <Scissors className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  Heart: <Heart className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  Clock: <Clock className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  Landmark: <Landmark className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  BarChart3: <BarChart3 className="w-6 h-6" style={{ color: '#E05A1B' }} />,
  GraduationCap: <GraduationCap className="w-6 h-6" style={{ color: '#E05A1B' }} />,
};

export default function LearnPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="max-w-[960px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-colors hover:opacity-80"
          style={{ color: '#555555' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-12">
          <p className="text-label mb-2" style={{ color: '#E05A1B' }}>
            Learn
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
            The Uncommon Playbook
          </h1>
          <p className="leading-relaxed" style={{ color: '#555555' }}>
            {strategies.length} strategies that financially literate people use every
            day. Each one is legal, well-documented, and available to you
            right now. Most financial advisors won&apos;t bring these up
            because they don&apos;t generate commissions.
          </p>
        </div>

        {/* Table of contents */}
        <div
          className="uc-card p-5 mb-12"
        >
          <p className="text-label mb-3" style={{ color: '#2C5F7C' }}>
            Jump to Strategy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {strategies.map((strategy, index) => (
              <a
                key={strategy.id}
                href={`#${strategy.id}`}
                className="flex items-center gap-3 text-sm transition-colors py-1 hover:opacity-80"
                style={{ color: '#555555' }}
              >
                <span className="text-xs font-mono w-5" style={{ color: '#C4A67A' }}>
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
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(224,90,27,0.1)' }}
                >
                  {iconMap[strategy.icon]}
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#555555' }}>
                    Strategy {index + 1} of {strategies.length}
                  </p>
                  <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#1A1A1A' }}>
                    {strategy.title}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#555555' }}>
                    {strategy.subtitle}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="leading-relaxed mb-6 text-base" style={{ color: '#555555' }}>
                {strategy.summary}
              </p>

              {/* Key numbers */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {strategy.keyNumbers.map((kn) => (
                  <div
                    key={kn.label}
                    className="uc-metric p-3"
                  >
                    <p className="text-lg font-semibold" style={{ color: '#F5EDE0' }}>
                      {kn.value}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(245,237,224,0.7)' }}>{kn.label}</p>
                  </div>
                ))}
              </div>

              {/* Sections */}
              <div className="space-y-5">
                {strategy.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-base font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      {section.heading}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Common mistake */}
              <div
                className="mt-6 rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(224,90,27,0.06)',
                  border: '1px solid rgba(224,90,27,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" style={{ color: '#E05A1B' }} />
                  <p className="text-sm font-semibold" style={{ color: '#E05A1B' }}>
                    Common Mistake
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                  {strategy.commonMistake}
                </p>
              </div>

              {/* Uncommon insight */}
              <div
                className="mt-4 rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(44,95,124,0.07)',
                  border: '1px solid rgba(44,95,124,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" style={{ color: '#2C5F7C' }} />
                  <p className="text-sm font-semibold" style={{ color: '#2C5F7C' }}>
                    Uncommon Insight
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                  {strategy.uncommonInsight}
                </p>
              </div>

              {/* Divider */}
              {index < strategies.length - 1 && (
                <div
                  className="mt-12"
                  style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}
                />
              )}
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center uc-section p-8">
          <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: '#F5EDE0' }}>
            Ready to Run the Numbers?
          </h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(245,237,224,0.8)' }}>
            Use our calculators to see how these strategies apply to your
            specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calculators"
              className="uc-button uc-button-primary"
            >
              Open Calculators
            </Link>
            <Link
              href="/ask"
              className="uc-button uc-button-secondary"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
