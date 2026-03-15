'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import type { LucideProps } from 'lucide-react'
import {
  TrendingUp,
  Home,
  MinusCircle,
  Sun,
  Shield,
  Percent,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { SPRING_GENTLE, SPRING_BOUNCY, STAGGER_FAST } from '@/lib/animation-constants'
import { loadSavedSimulations } from '@/lib/simulator/types'
import type { ScenarioDefinition } from '@/lib/simulator/types'

// ---------------------------------------------------------------------------
// Per-slug accent color + icon config (spec: VISUAL DESIGN)
// ---------------------------------------------------------------------------

const SCENARIO_CONFIG: Record<string, {
  accent: string
  accentHex: string
  Icon: React.ComponentType<LucideProps>
}> = {
  'roth-conversion': {
    accent: 'blue-500',
    accentHex: '#3B82F6',
    Icon: TrendingUp,
  },
  'rent-vs-buy': {
    accent: 'violet-500',
    accentHex: '#8B5CF6',
    Icon: Home,
  },
  'debt-payoff': {
    accent: 'red-500',
    accentHex: '#EF4444',
    Icon: MinusCircle,
  },
  'early-retirement': {
    accent: 'amber-400',
    accentHex: '#F59E0B',
    Icon: Sun,
  },
  'hsa-vs-traditional': {
    accent: 'emerald-500',
    accentHex: '#10B981',
    Icon: Shield,
  },
  'tax-loss-harvest': {
    accent: 'slate-500',
    accentHex: '#64748B',
    Icon: Percent,
  },
}

// Fallback for unknown slugs
const FALLBACK_CONFIG: {
  accent: string
  accentHex: string
  Icon: React.ComponentType<LucideProps>
} = {
  accent: 'slate-400',
  accentHex: '#94A3B8',
  Icon: TrendingUp,
}

// ---------------------------------------------------------------------------
// Scenario Card
// ---------------------------------------------------------------------------

interface ScenarioCardProps {
  scenario: ScenarioDefinition
  index: number
  isCompleted: boolean
  prefersReduced: boolean
}

function ScenarioCard({ scenario, index, isCompleted, prefersReduced }: ScenarioCardProps) {
  const config = SCENARIO_CONFIG[scenario.slug] ?? FALLBACK_CONFIG
  const { Icon, accentHex } = config

  const cardDelay = prefersReduced ? 0 : 0.2 + index * STAGGER_FAST
  const badgeDelay = cardDelay + 0.15
  const completedDelay = cardDelay + 0.2

  // Card entrance animation
  const cardVariants = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
      }

  const cardTransition = prefersReduced
    ? {}
    : { ...SPRING_GENTLE, delay: cardDelay }

  // Hover state inline styles use accentHex for brand-tinted shadow
  const hoverStyle = prefersReduced
    ? {}
    : {
        scale: 1.02,
        y: -3,
        boxShadow: `0 12px 32px ${accentHex}33`,
      }

  return (
    <motion.div
      {...(prefersReduced ? {} : { initial: cardVariants.initial, animate: cardVariants.animate })}
      transition={cardTransition}
      whileHover={prefersReduced ? undefined : hoverStyle}
      whileTap={prefersReduced ? undefined : { scale: 0.98 }}
      style={{
        // Resting tinted shadow at 8% opacity so cards have subtle depth
        boxShadow: `0 2px 8px ${accentHex}14`,
      }}
      className="group relative rounded-xl border border-slate-200 cursor-pointer focus-visible:outline-none"
      role="listitem"
    >
      {/* Top accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{ background: `${accentHex}99` }}
        aria-hidden="true"
      />

      <Link
        href={`/simulator/${scenario.slug}`}
        className="flex flex-col gap-3 p-5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
        aria-label={`${scenario.title}. Category: ${scenario.category}. ${isCompleted ? 'Already completed.' : 'Not started.'}`}
      >
        {/* Card header: icon bubble + category badge + completed badge */}
        <div className="flex items-start justify-between gap-2">
          {/* Icon bubble */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
            style={{
              background: `${accentHex}1a`,
              color: `${accentHex}cc`,
            }}
            aria-hidden="true"
          >
            <Icon size={18} strokeWidth={1.5} />
          </div>

          {/* Badge row */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Category badge with entrance pulse */}
            <motion.span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-widest"
              style={{
                background: `${accentHex}26`,
                color: accentHex,
              }}
              animate={
                prefersReduced
                  ? {}
                  : { opacity: [1, 0.5, 1] }
              }
              transition={
                prefersReduced
                  ? {}
                  : { duration: 0.3, delay: badgeDelay }
              }
              aria-label={`Category: ${scenario.category}`}
            >
              {scenario.category}
            </motion.span>

            {/* Completed badge springs in after card settles */}
            <AnimatePresence>
              {isCompleted && (
                <motion.span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-600 text-[10px] font-medium"
                  initial={prefersReduced ? {} : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={
                    prefersReduced
                      ? {}
                      : { ...SPRING_BOUNCY, delay: completedDelay }
                  }
                  aria-label={`${scenario.title} -- already completed`}
                >
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Completed
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-800 tracking-tight leading-tight">
          {scenario.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {scenario.subtitle}
        </p>

        {/* Footer: arrow indicator on hover */}
        <div className="flex items-center justify-end">
          <motion.span
            className="flex items-center gap-1 text-[10px] font-medium"
            style={{ color: `${accentHex}cc` }}
            initial={{ opacity: 0, x: -4 }}
            whileHover={prefersReduced ? {} : { opacity: 1, x: 0 }}
            aria-hidden="true"
          >
            Open simulator
            <ArrowRight size={12} />
          </motion.span>
        </div>
      </Link>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Scenario Grid
// ---------------------------------------------------------------------------

interface ScenarioGridProps {
  scenarios: readonly ScenarioDefinition[]
}

export function ScenarioGrid({ scenarios }: ScenarioGridProps) {
  const prefersReduced = useReducedMotion() ?? false
  const [completedSlugs, setCompletedSlugs] = useState<ReadonlySet<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  // Load completion state from localStorage after mount (client-only)
  useEffect(() => {
    setMounted(true)
    try {
      const saved = loadSavedSimulations()
      const slugSet = new Set(saved.map((s) => s.scenarioSlug))
      setCompletedSlugs(slugSet)
    } catch {
      // localStorage unavailable -- badges simply do not show
      setCompletedSlugs(new Set())
    }
  }, [])

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">
          Simulators didn&apos;t load. Refresh and they&apos;ll come right back.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label="Financial simulators"
    >
      {scenarios.map((scenario, index) => (
        <ScenarioCard
          key={scenario.slug}
          scenario={scenario}
          index={index}
          isCompleted={mounted && completedSlugs.has(scenario.slug)}
          prefersReduced={prefersReduced}
        />
      ))}
    </div>
  )
}
