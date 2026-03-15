'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ALL_SCENARIOS } from '@/lib/simulator/scenarios'
import { ScenarioGrid } from '@/components/simulator/scenario-grid'
import { SPRING_GENTLE } from '@/lib/animation-constants'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SimulatorIndexPage() {
  const prefersReduced = useReducedMotion() ?? false

  const headerVariants = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      }

  const headerTransition = prefersReduced ? {} : { ...SPRING_GENTLE, delay: 0 }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          {...(prefersReduced ? {} : { initial: headerVariants.initial, animate: headerVariants.animate })}
          transition={headerTransition}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">
            Run the numbers.
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            Six financial scenarios. Real math, no guesswork. Model your actual situation and see what happens.
          </p>
        </motion.div>

        {/* Animated scenario grid */}
        <ScenarioGrid scenarios={ALL_SCENARIOS} />

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-400 text-center mt-10">
          These calculators use simplified models for educational purposes. Real financial decisions should account
          for your full picture. Not financial advice.
        </p>
      </div>
    </div>
  )
}
