'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_GENTLE, SPRING_SNAPPY } from '@/lib/animation-constants'
import { ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'

const badgeVariants = {
  initial: { opacity: 0, y: -8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

const badgePulseVariants = {
  initial: { scale: 1 },
  pulse: { scale: [1, 1.02, 1] },
}

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

const accentGlowVariants = {
  initial: { textShadow: '0 0 0px transparent' },
  animate: {
    textShadow: [
      '0 0 0px transparent',
      '0 0 40px rgba(34, 197, 94, 0.5)',
      '0 0 0px transparent',
    ],
  },
}

function HeroContent() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-8"
        style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'rgba(34, 197, 94, 0.8)',
        }}
      >
        Financial strategies they don&apos;t teach you
      </div>

      <h1
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
        style={{ color: '#F5F5F3' }}
      >
        The Money Moves That{' '}
        <span style={{ color: '#22C55E' }}>
          Actually Matter
        </span>
      </h1>

      <p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: 'rgba(200, 220, 200, 0.7)' }}
      >
        Your financial advisor probably hasn&apos;t mentioned half of these.
        The strategies that separate the wealthy from everyone else.
      </p>

      <p
        className="text-sm max-w-lg mx-auto mb-10"
        style={{ color: 'rgba(200, 220, 200, 0.4)' }}
      >
        No products to sell. No affiliate links. Just the financial
        knowledge that costs six figures to learn the hard way.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/learn"
          className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: '#22C55E',
            color: '#0B1D13',
          }}
        >
          Start Learning
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/calculators"
          className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: 'rgba(34, 197, 94, 0.08)',
            color: 'rgba(200, 220, 200, 0.8)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          Calculators
          <Calculator className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export function HeroAnimated() {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <HeroContent />
  }

  return (
    <div className="max-w-3xl mx-auto text-center">

      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-8"
        style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'rgba(34, 197, 94, 0.8)',
        }}
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0 }}
      >
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
          Financial strategies they don&apos;t teach you
        </motion.span>
      </motion.div>

      <motion.h1
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
        style={{ color: '#F5F5F3' }}
        variants={titleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.15 }}
      >
        The Money Moves That{' '}
        <motion.span
          style={{ color: '#22C55E' }}
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

      <motion.p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: 'rgba(200, 220, 200, 0.7)' }}
        variants={subtitleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.3 }}
      >
        Your financial advisor probably hasn&apos;t mentioned half of these.
        The strategies that separate the wealthy from everyone else.
      </motion.p>

      <motion.p
        className="text-sm max-w-lg mx-auto mb-10"
        style={{ color: 'rgba(200, 220, 200, 0.4)' }}
        variants={footnoteVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.4 }}
      >
        No products to sell. No affiliate links. Just the financial
        knowledge that costs six figures to learn the hard way.
      </motion.p>

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
            boxShadow: '0 6px 30px rgba(34, 197, 94, 0.3)',
          }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING_SNAPPY}
          className="inline-flex"
        >
          <Link
            href="/learn"
            className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-colors w-full"
            style={{
              background: '#22C55E',
              color: '#0B1D13',
            }}
          >
            Start Learning
            <ArrowRight className="w-4 h-4" />
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
            className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 w-full"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              color: 'rgba(200, 220, 200, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            Calculators
            <Calculator className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
