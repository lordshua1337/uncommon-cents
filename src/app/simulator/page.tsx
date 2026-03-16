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
    <div className="min-h-screen linen-texture pt-20 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <motion.div
          {...(prefersReduced ? {} : { initial: headerVariants.initial, animate: headerVariants.animate })}
          transition={headerTransition}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 rounded-lg transition-colors hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-[#2C5F7C]/30 focus-visible:outline-none"
              style={{ color: "#555555" }}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <h1 className="font-heading text-3xl font-semibold tracking-tight mb-3" style={{ color: "#1A1A1A" }}>
            Run the numbers.
          </h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#555555" }}>
            Six financial scenarios. Real math, no guesswork. Model your actual situation and see what happens.
          </p>
        </motion.div>

        {/* Animated scenario grid */}
        <ScenarioGrid scenarios={ALL_SCENARIOS} />

        {/* Disclaimer */}
        <p className="text-[10px] text-center mt-10" style={{ color: "#555555" }}>
          These calculators use simplified models for educational purposes. Real financial decisions should account
          for your full picture. Not financial advice.
        </p>
      </div>
    </div>
  )
}
