"use client";

import { useReducedMotion, motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import {
  SPRING_SNAPPY,
  SPRING_GENTLE,
  SPRING_BOUNCY,
  STAGGER_FAST,
} from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DomainCardAnimatedProps {
  readonly name: string;
  readonly description: string;
  readonly conceptCount: number;
  readonly completedCount: number;
  readonly accentColor: string;
  readonly href: string;
  readonly index: number;
  readonly icon?: React.ReactNode;
  readonly featured?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Card entrance: staggered per-index, spring up from below
const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING_GENTLE,
  },
};

// ---------------------------------------------------------------------------
// Helper: resolve shadow color from accentColor hex, with fallback
// ---------------------------------------------------------------------------
function buildHoverShadow(accentColor: string): string {
  // Append 28 (alpha ~16%) and 14 (alpha ~8%) to create a brand-tinted glow
  const base = accentColor.startsWith("#") ? accentColor : "#CA8A04";
  return `0 8px 24px ${base}28, 0 2px 8px ${base}14`;
}

// ---------------------------------------------------------------------------
// DomainCardAnimated
// ---------------------------------------------------------------------------

export function DomainCardAnimated({
  name,
  description,
  conceptCount,
  completedCount,
  accentColor,
  href,
  index,
  icon,
  featured = false,
}: DomainCardAnimatedProps) {
  const prefersReduced = useReducedMotion();

  const completionPercent =
    conceptCount > 0 ? Math.round((completedCount / conceptCount) * 100) : 0;

  const isComplete = completionPercent === 100;
  const hasProgress = completionPercent > 0;

  // Per-card entrance delay based on grid position
  const cardDelay = index * STAGGER_FAST;

  // Progress bar fill delay: bar starts AFTER card arrives
  const barDelay = cardDelay + 0.2;

  // Resolved shadow string (brand-tinted, never black)
  const hoverShadow = buildHoverShadow(accentColor);

  // ---------------------------------------------------------------------------
  // Reduced Motion: render static version, no spring physics
  // ---------------------------------------------------------------------------
  if (prefersReduced) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: featured
            ? "#FFFFFF"
            : "linear-gradient(180deg, #FFFDF8 0%, #FAF8F4 100%)",
          border: "1px solid #D4CFC4",
          borderRadius: "1rem",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
          padding: featured ? "2rem" : "1.25rem",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label={`${name}. ${conceptCount} concepts. ${completionPercent} percent complete.`}
      >
        {/* Left-edge accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: "12px",
            bottom: "12px",
            width: "3px",
            borderRadius: "0 2px 2px 0",
            background: accentColor,
          }}
        />
        <StaticCardBody
          name={name}
          description={description}
          conceptCount={conceptCount}
          completionPercent={completionPercent}
          accentColor={accentColor}
          isComplete={isComplete}
          icon={icon}
          featured={featured}
        />
      </Link>
    );
  }

  // ---------------------------------------------------------------------------
  // Animated version
  // ---------------------------------------------------------------------------
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ ...SPRING_GENTLE, delay: cardDelay }}
      whileHover={{ scale: 1.02, y: -2, transition: SPRING_SNAPPY }}
      whileTap={{ scale: 0.98, transition: SPRING_SNAPPY }}
      // Framer handles scale via whileHover; CSS handles shadow for performance
      style={
        {
          borderRadius: "1rem",
          "--hover-shadow": hoverShadow,
        } as React.CSSProperties
      }
      className="domain-card-motion-wrapper"
    >
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-full domain-card-link"
        style={{
          background: featured
            ? "#FFFFFF"
            : "linear-gradient(180deg, #FFFDF8 0%, #FAF8F4 100%)",
          border: "1px solid #D4CFC4",
          borderRadius: "1rem",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
          padding: featured ? "2rem" : "1.25rem",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label={`${name}. ${conceptCount} concepts. ${completionPercent} percent complete.`}
      >
        {/* Left-edge accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: "12px",
            bottom: "12px",
            width: "3px",
            borderRadius: "0 2px 2px 0",
            background: accentColor,
          }}
        />

        {/* Domain icon + name row */}
        <div className="flex items-start gap-3 mb-3">
          {icon && (
            <div
              className={`${featured ? "w-12 h-12" : "w-9 h-9"} rounded-lg flex items-center justify-center flex-shrink-0`}
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3
              className="text-base font-semibold leading-tight"
              style={{ color: "#0f172a" }}
            >
              {name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              {conceptCount} concepts
            </p>
          </div>

          {/* Completion badge: appears when 100% reached */}
          {isComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...SPRING_BOUNCY, delay: cardDelay + 0.4 }}
              aria-label="Complete"
            >
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0"
                style={{ color: accentColor }}
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed mb-3 ${featured ? "" : "line-clamp-3"} hidden sm:block`}
          style={{ color: "#64748b" }}
        >
          {description}
        </p>

        {/* Progress bar + counter row */}
        <div>
          {/* Label row: counter left, aria live region */}
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs font-bold font-mono tabular-nums"
              style={{ color: accentColor }}
              aria-live="off"
            >
              <AnimatedCounter
                value={completionPercent}
                className="text-xs font-bold"
              />
              <span>% complete</span>
            </span>
          </div>

          {/* Progress track */}
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: `${accentColor}18`,
              overflow: "hidden",
            }}
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name} completion`}
          >
            {/* Animated fill */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ ...SPRING_GENTLE, delay: barDelay }}
              style={{
                height: "100%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
              }}
            />
          </div>
        </div>

        {/* Explore CTA row -- shown on hover via CSS */}
        <div className="flex items-center gap-1 mt-3 text-xs font-medium domain-card-cta" style={{ color: accentColor }}>
          {isComplete ? "Complete" : completionPercent > 0 ? "Keep exploring" : "Explore"}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6h7M6.5 3.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// StaticCardBody -- used in reduced-motion path
// ---------------------------------------------------------------------------

interface StaticCardBodyProps {
  readonly name: string;
  readonly description: string;
  readonly conceptCount: number;
  readonly completionPercent: number;
  readonly accentColor: string;
  readonly isComplete: boolean;
  readonly icon?: React.ReactNode;
  readonly featured?: boolean;
}

function StaticCardBody({
  name,
  description,
  conceptCount,
  completionPercent,
  accentColor,
  isComplete,
  icon,
  featured = false,
}: StaticCardBodyProps) {
  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <div
            className={`${featured ? "w-12 h-12" : "w-9 h-9"} rounded-lg flex items-center justify-center flex-shrink-0`}
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight" style={{ color: "#0f172a" }}>
            {name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            {conceptCount} concepts
          </p>
        </div>
        {isComplete && (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} strokeWidth={1.5} aria-label="Complete" />
        )}
      </div>

      <p className={`text-xs leading-relaxed mb-3 ${featured ? "" : "line-clamp-3"} hidden sm:block`} style={{ color: "#64748b" }}>
        {description}
      </p>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold font-mono tabular-nums" style={{ color: accentColor }}>
            {completionPercent}% complete
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: `${accentColor}18`,
            overflow: "hidden",
          }}
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} completion`}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              width: `${completionPercent}%`,
              background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: accentColor }}>
        {isComplete ? "Complete" : completionPercent > 0 ? "Keep exploring" : "Explore"}
      </div>
    </>
  );
}
