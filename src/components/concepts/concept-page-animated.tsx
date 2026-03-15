'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { STAGGER_FAST } from '@/lib/animation-constants'

// ---------------------------------------------------------------------------
// ConceptPageAnimated
// Stagger container for concept page entrance sequences.
// Wraps children in a motion.div that staggers child variants.
// Falls back to a plain fragment if user prefers reduced motion.
// ---------------------------------------------------------------------------

interface ConceptPageAnimatedProps {
  readonly children: React.ReactNode
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_FAST,
    },
  },
}

export function ConceptPageAnimated({ children }: ConceptPageAnimatedProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
