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

function HeroContent() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-8"
        style={{
          background: 'rgba(44, 95, 124, 0.1)',
          border: '1px solid rgba(44, 95, 124, 0.2)',
          color: '#2C5F7C',
          borderRadius: '16px 4px 16px 4px',
        }}
      >
        All the things about money that no one ever taught you
      </div>

      <h1
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-[800] tracking-tight leading-[1.05] mb-6"
        style={{ color: '#1A1A1A' }}
      >
        The Money Moves That{' '}
        <span style={{ color: '#E05A1B' }}>
          Actually Matter
        </span>
      </h1>

      <p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: '#555555' }}
      >
        Your financial advisor probably hasn&apos;t mentioned half of these.
        The strategies that separate the wealthy from everyone else.
      </p>

      <p
        className="text-sm max-w-lg mx-auto mb-10"
        style={{ color: '#C4A67A' }}
      >
        No products to sell. No affiliate links. Just the financial
        knowledge that costs six figures to learn the hard way.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/learn"
          className="uc-button uc-button-primary px-7 py-3 inline-flex items-center justify-center gap-2"
        >
          Start Learning — Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/calculators"
          className="uc-button uc-button-secondary px-7 py-3 inline-flex items-center justify-center gap-2"
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
        className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-8"
        style={{
          background: 'rgba(44, 95, 124, 0.1)',
          border: '1px solid rgba(44, 95, 124, 0.2)',
          color: '#2C5F7C',
          borderRadius: '16px 4px 16px 4px',
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
          All the things about money that no one ever taught you
        </motion.span>
      </motion.div>

      <motion.h1
        className="font-heading text-5xl sm:text-6xl lg:text-7xl font-[800] tracking-tight leading-[1.05] mb-6"
        style={{ color: '#1A1A1A' }}
        variants={titleVariants}
        initial="initial"
        animate="animate"
        transition={{ ...SPRING_GENTLE, delay: 0.15 }}
      >
        The Money Moves That{' '}
        <motion.span
          style={{ color: '#E05A1B' }}
        >
          Actually Matter
        </motion.span>
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
        style={{ color: '#555555' }}
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
        style={{ color: '#C4A67A' }}
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
            boxShadow: '0 6px 30px rgba(224, 90, 27, 0.3)',
          }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING_SNAPPY}
          className="inline-flex"
        >
          <Link
            href="/learn"
            className="uc-button uc-button-primary px-7 py-3 inline-flex items-center justify-center gap-2 w-full"
          >
            Start Learning — Free
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
            className="uc-button uc-button-secondary px-7 py-3 inline-flex items-center justify-center gap-2 w-full"
          >
            Calculators
            <Calculator className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
