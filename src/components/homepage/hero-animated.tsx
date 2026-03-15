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
      '0 0 24px rgba(13, 107, 61, 0.45)',
      '0 0 0px transparent',
    ],
  },
}

const ruleVariants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
}

function HeroContent() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        aria-label="Financial strategies they don't teach you"
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-8"
        style={{
          background: 'rgba(13, 107, 61, 0.12)',
          border: '1px solid rgba(13, 107, 61, 0.25)',
          color: '#4ADE80',
        }}
      >
        Financial strategies they don&apos;t teach you
      </div>

      <h1
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
        style={{ color: '#F8F6F1' }}
      >
        The Money Moves That{' '}
        <span style={{ color: '#4ADE80' }}>
          Actually Matter
        </span>
      </h1>

      <div
        className="w-16 h-[2px] mx-auto mb-6"
        style={{ background: 'linear-gradient(90deg, #0D6B3D, #B8860B)' }}
      />

      <p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: 'rgba(248, 246, 241, 0.72)' }}
      >
        Your financial advisor probably hasn&apos;t mentioned half of these.
        The strategies that separate the wealthy from everyone else.
      </p>

      <p
        className="text-sm max-w-lg mx-auto mb-10"
        style={{ color: 'rgba(248, 246, 241, 0.45)' }}
      >
        No products to sell. No affiliate links. Just the financial
        knowledge that costs six figures to learn the hard way.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/learn"
          className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: '#0D6B3D',
            color: '#F8F6F1',
            boxShadow: '0 2px 12px rgba(13, 107, 61, 0.3)',
          }}
        >
          Start Learning
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          href="/calculators"
          className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'transparent',
            color: 'rgba(248, 246, 241, 0.85)',
            border: '1px solid rgba(248, 246, 241, 0.2)',
          }}
        >
          Calculators
          <Calculator className="w-4 h-4" aria-hidden="true" />
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
        aria-label="Financial strategies they don't teach you"
        style={{
          background: 'rgba(13, 107, 61, 0.12)',
          border: '1px solid rgba(13, 107, 61, 0.25)',
          color: '#4ADE80',
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
        style={{ color: '#F8F6F1' }}
        variants={titleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.15 }}
      >
        The Money Moves That{' '}
        <motion.span
          aria-label="Actually Matter -- emphasis"
          style={{ color: '#4ADE80' }}
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

      <motion.div
        className="w-16 h-[2px] mx-auto mb-6 origin-center"
        style={{ background: 'linear-gradient(90deg, #0D6B3D, #B8860B)' }}
        variants={ruleVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />

      <motion.p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: 'rgba(248, 246, 241, 0.72)' }}
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
        style={{ color: 'rgba(248, 246, 241, 0.45)' }}
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
            boxShadow: '0 6px 24px rgba(13, 107, 61, 0.4)',
          }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING_SNAPPY}
          className="inline-flex"
        >
          <Link
            href="/learn"
            className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: '#0D6B3D',
              color: '#F8F6F1',
              boxShadow: '0 2px 12px rgba(13, 107, 61, 0.3)',
            }}
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
            className="px-7 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-[rgba(248,246,241,0.06)]"
            style={{
              background: 'transparent',
              color: 'rgba(248, 246, 241, 0.85)',
              border: '1px solid rgba(248, 246, 241, 0.2)',
            }}
          >
            Calculators
            <Calculator className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
