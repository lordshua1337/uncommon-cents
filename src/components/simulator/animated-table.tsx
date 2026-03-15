"use client";

import { useReducedMotion, motion } from "framer-motion";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import { SPRING_GENTLE, STAGGER_FAST } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// AnimatedTable
//
// Renders a list of detail rows with staggered cascade entrance animation.
// Numeric cells use AnimatedCounter. Rows slide in from the left at STAGGER_FAST
// intervals (40ms). Row hover adds an accent-tinted left border + background.
// ---------------------------------------------------------------------------

interface AnimatedTableProps {
  readonly rows: readonly string[];
  readonly accentColor?: string;
  readonly animate?: boolean;
  readonly label?: string;
}

// Extracts a numeric value from a detail string like "Tax cost today: $12,000"
// Returns null if no parseable number found.
function extractNumericValue(text: string): number | null {
  // Match currency: $1,234,567 or $1234
  const currencyMatch = text.match(/\$([\d,]+(?:\.\d+)?)/);
  if (currencyMatch) {
    const num = parseFloat(currencyMatch[1].replace(/,/g, ""));
    if (!isNaN(num)) return num;
  }
  // Match plain number at end: "12 months"
  const trailingNumber = text.match(/(\d[\d,.]*)\s*(?:months?|years?|%|yr)?\.?\s*$/);
  if (trailingNumber) {
    const num = parseFloat(trailingNumber[1].replace(/,/g, ""));
    if (!isNaN(num)) return num;
  }
  return null;
}

// Splits a detail string into label and value segments so we can wrap the
// numeric part in an AnimatedCounter while keeping surrounding text static.
function renderDetailContent(
  text: string,
  animate: boolean,
  prefersReduced: boolean
): React.ReactNode {
  if (!animate || prefersReduced) return text;

  // Try to find the last occurrence of a currency or number we can animate.
  // Pattern: "Label text: $12,345" or "Label text (note): $12,345"
  const currencyPattern = /^(.*?)(\$([\d,]+(?:\.\d+)?))(.*)$/;
  const match = text.match(currencyPattern);

  if (match) {
    const [, prefix, , numStr, suffix] = match;
    const num = parseFloat(numStr.replace(/,/g, ""));
    if (!isNaN(num) && num >= 0) {
      return (
        <>
          {prefix}
          <span className="inline-flex items-baseline gap-0">
            <span>$</span>
            <AnimatedCounter value={num} format="currency" className="text-sm" />
          </span>
          {suffix}
        </>
      );
    }
  }

  return text;
}

export function AnimatedTable({
  rows,
  accentColor = "#16A34A",
  animate = true,
  label,
}: AnimatedTableProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;

  if (rows.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-2">No details available.</p>
    );
  }

  return (
    <div
      className="space-y-0"
      role="table"
      aria-label={label ?? "Result details"}
      style={{ tableLayout: "fixed" } as React.CSSProperties}
    >
      {/* Aria live for loading state */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {shouldAnimate ? "Loading breakdown..." : ""}
      </div>

      {rows.map((row, index) => {
        const isEven = index % 2 === 0;

        return (
          <motion.div
            key={index}
            role="row"
            initial={shouldAnimate ? { opacity: 0, x: -8 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              ...SPRING_GENTLE,
              delay: shouldAnimate ? index * STAGGER_FAST + 0.65 : 0,
            }}
            className="group flex items-start gap-2 py-2.5 px-2 rounded-md cursor-default transition-colors duration-150"
            style={{
              backgroundColor: isEven ? `${accentColor}05` : "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = `${accentColor}0a`;
              (e.currentTarget as HTMLDivElement).style.borderLeft = `2px solid ${accentColor}50`;
              (e.currentTarget as HTMLDivElement).style.paddingLeft = "6px";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = isEven ? `${accentColor}05` : "transparent";
              (e.currentTarget as HTMLDivElement).style.borderLeft = "";
              (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px";
            }}
            aria-label={row}
            tabIndex={0}
          >
            <span
              className="mt-0.5 shrink-0 text-[8px] leading-none"
              style={{ color: accentColor }}
            >
              --
            </span>
            <span className="text-xs text-text-secondary leading-relaxed flex-1 font-mono tabular-nums">
              {renderDetailContent(row, shouldAnimate, !!prefersReduced)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
