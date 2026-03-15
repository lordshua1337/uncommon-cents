'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_GENTLE, SPRING_SNAPPY } from '@/lib/animation-constants'
import { Coins, ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// HeroAnimated
// Client component island for the homepage hero entrance sequence.
// Wraps all hero elements in precisely-timed stagger animations.
//
// Sequence:
//   Badge:    delay 0s    (slides in from above, scale pulse after landing)
//   Title:    delay 0.15s (fades up)
//   Subtitle: delay 0.30s (fades up)
//   Footnote: delay 0.40s (fades up)
//   CTAs:     delay 0.45s (fades up, hover/tap spring interactions)
//
// prefers-reduced-motion: all elements render at final state immediately.
// SSR: parent page.tsx remains a server component; this is a client island.
// ---------------------------------------------------------------------------

// Badge entrance: slides in from y: -8 (above), scale eases in from 0.96
const badgeVariants = {
  initial: { opacity: 0, y: -8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

// Badge post-landing scale pulse: 1.0 -> 1.02 -> 1.0
// Applied as a second animate pass after the entrance settles
const badgePulseVariants = {
  initial: { scale: 1 },
  pulse: { scale: [1, 1.02, 1] },
}

// Title, subtitle, footnote: fade up from below
const titleVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

const subtitleVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

const footnoteVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

const ctaVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
}

// Accent span: brief text-shadow glow pulse on the emphasized phrase
// Fires after the title has settled (delay 0.5s from title start = 0.65s total)
const accentGlowVariants = {
  initial: { textShadow: '0 0 0px transparent' },
  animate: {
    textShadow: [
      '0 0 0px transparent',
      '0 0 20px rgba(22, 163, 74, 0.55)',
      '0 0 0px transparent',
    ],
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroAnimated() {
  const prefersReduced = useReducedMotion()

  // When reduced motion is preferred, render all hero elements at their final
  // state immediately. No stagger, no pulses, no glow -- just the content.
  if (prefersReduced) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div
          aria-label="Financial strategies they don't teach you"
          className="inline-flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-xs font-medium mb-6"
        >
          <Coins className="w-3.5 h-3.5" aria-hidden="true" />
          Financial strategies they don&apos;t teach you
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
          The Money Moves That{' '}
          <span
            aria-label="Actually Matter -- emphasis"
            className="text-accent"
          >
            Actually Matter
          </span>
        </h1>

        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-4 leading-relaxed">
          Your financial advisor probably hasn&apos;t mentioned half of
          these. Roth conversion ladders, 401k overfunding traps, creditor
          protection through cash value, and the strategies that separate
          the wealthy from everyone else.
        </p>

        <p className="text-text-muted text-sm max-w-lg mx-auto mb-8">
          No products to sell. No affiliate links. Just the financial
          knowledge that costs six figures to learn the hard way.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/learn"
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-light transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Start Learning
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/calculators"
            className="bg-surface border border-border text-text-primary px-6 py-2.5 rounded-lg font-medium hover:border-accent/30 transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2"
          >
            Calculators
            <Calculator className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    )
  }

  // Animated path: staggered entrance sequence (700ms total)
  return (
    <div className="max-w-3xl mx-auto text-center">

      {/* Badge: slides in from above, scale pulse after landing */}
      <motion.div
        className="inline-flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-xs font-medium mb-6"
        aria-label="Financial strategies they don't teach you"
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0 }}
      >
        {/* Inner wrapper handles the post-landing scale pulse separately */}
        <motion.span
          className="inline-flex items-center gap-2"
          variants={badgePulseVariants}
          initial="initial"
          animate="pulse"
          transition={{
            delay: 0.4,
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <Coins className="w-3.5 h-3.5" aria-hidden="true" />
          Financial strategies they don&apos;t teach you
        </motion.span>
      </motion.div>

      {/* Title: fades up at 0.15s delay */}
      <motion.h1
        className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5"
        variants={titleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.15 }}
      >
        The Money Moves That{' '}
        {/* Accent phrase: brief glow pulse after title settles (delay 0.5s from title = 0.65s total) */}
        <motion.span
          aria-label="Actually Matter -- emphasis"
          className="text-accent"
          variants={accentGlowVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: 0.65,
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          Actually Matter
        </motion.span>
      </motion.h1>

      {/* Subtitle: fades up at 0.30s delay */}
      <motion.p
        className="text-text-secondary text-lg max-w-xl mx-auto mb-4 leading-relaxed"
        variants={subtitleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.3 }}
      >
        Your financial advisor probably hasn&apos;t mentioned half of
        these. Roth conversion ladders, 401k overfunding traps, creditor
        protection through cash value, and the strategies that separate
        the wealthy from everyone else.
      </motion.p>

      {/* Footnote text: fades up at 0.40s delay */}
      <motion.p
        className="text-text-muted text-sm max-w-lg mx-auto mb-8"
        variants={footnoteVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.4 }}
      >
        No products to sell. No affiliate links. Just the financial
        knowledge that costs six figures to learn the hard way.
      </motion.p>

      {/* CTA group: fades up at 0.45s delay; both buttons enter together */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center"
        variants={ctaVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.45 }}
      >
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
          }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING_SNAPPY}
          className="inline-flex"
        >
          <Link
            href="/learn"
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-light transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 w-full"
          >
            Start Learning
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING_SNAPPY}
          className="inline-flex"
        >
          <Link
            href="/calculators"
            className="bg-surface border border-border text-text-primary px-6 py-2.5 rounded-lg font-medium hover:border-accent/30 transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 w-full"
          >
            Calculators
            <Calculator className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
