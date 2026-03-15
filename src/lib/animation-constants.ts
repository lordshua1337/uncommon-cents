// Shared animation constants for Layer 3 (Delightful) features
// These match the existing patterns in streak/ and life-stages/ components

// Spring presets
export const SPRING_SNAPPY = { type: "spring" as const, stiffness: 400, damping: 25 }
export const SPRING_BOUNCY = { type: "spring" as const, stiffness: 500, damping: 28 }
export const SPRING_GENTLE = { type: "spring" as const, stiffness: 300, damping: 30 }

// Stagger presets (seconds between items)
export const STAGGER_FAST = 0.04
export const STAGGER_MEDIUM = 0.08
export const STAGGER_SLOW = 0.12

// Common entrance variants
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
}

// Celebration particle counts by significance
export const CONFETTI_COUNTS = {
  minor: 16,
  medium: 32,
  major: 48,
  epic: 64,
  legendary: 80,
} as const
