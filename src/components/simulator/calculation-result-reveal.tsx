"use client";

import { useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/streak/animated-counter";
import {
  SPRING_BOUNCY,
  SPRING_GENTLE,
  STAGGER_MEDIUM,
} from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResultMetric {
  readonly label: string;
  readonly value: number;
  readonly format: "currency" | "percent" | "decimal" | "integer";
  readonly decimals?: number;
  readonly direction?: "positive" | "negative" | "neutral";
  readonly isPrimary?: boolean;
}

export interface ResultGroup {
  readonly heading: string;
  readonly metrics: readonly ResultMetric[];
  readonly accentColor: string;
}

interface CalculationResultRevealProps {
  readonly groups: readonly ResultGroup[];
  readonly calculationKey: string;
  readonly accentColor: string;
  readonly isComputing: boolean;
  readonly ariaLiveRef?: React.RefObject<HTMLDivElement | null>;
}

// ---------------------------------------------------------------------------
// Direction icon
// ---------------------------------------------------------------------------

function DirectionIcon({
  direction,
}: {
  direction: ResultMetric["direction"];
}) {
  if (direction === "positive") {
    return <TrendingUp className="w-3 h-3 text-[#1E3F2E]" aria-hidden="true" />;
  }
  if (direction === "negative") {
    return <TrendingDown className="w-3 h-3 text-[#DC2626]" aria-hidden="true" />;
  }
  return <Minus className="w-3 h-3 text-[#888888]" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Computing skeleton
// ---------------------------------------------------------------------------

function ComputingSkeleton({ accentColor }: { accentColor: string }) {
  const skeletonRows = [
    { wLabel: "w-28", wValue: "w-20" },
    { wLabel: "w-20", wValue: "w-24" },
    { wLabel: "w-24", wValue: "w-16" },
    { wLabel: "w-16", wValue: "w-20" },
  ];

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Running your numbers..."
      className="space-y-1"
    >
      {/* Computing label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="text-xs text-[#888888] mb-3"
        style={{
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        Calculating...
      </motion.p>

      {/* Skeleton rows */}
      {skeletonRows.map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-[#EFEFEA] last:border-0"
        >
          <div
            className={`h-3 ${row.wLabel} rounded`}
            style={{
              backgroundColor: `${accentColor}22`,
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
          <div
            className={`h-5 ${row.wValue} rounded`}
            style={{
              backgroundColor: `${accentColor}22`,
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1 + 0.05}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single metric row
// ---------------------------------------------------------------------------

function MetricRow({
  metric,
  index,
  accentColor,
  prefersReduced,
}: {
  metric: ResultMetric;
  index: number;
  accentColor: string;
  prefersReduced: boolean | null;
}) {
  const delay = prefersReduced ? 0 : 0.1 + index * STAGGER_MEDIUM;

  const valueColor =
    metric.direction === "positive"
      ? "#1E3F2E"
      : metric.direction === "negative"
        ? "#DC2626"
        : "#1A1A1A";

  const formattedStaticValue = (() => {
    const v = isFinite(metric.value) ? metric.value : 0;
    switch (metric.format) {
      case "currency":
        return Math.round(v).toLocaleString();
      case "percent":
        return v.toFixed(metric.decimals ?? 1);
      case "decimal":
        return v.toFixed(metric.decimals ?? 2);
      default:
        return Math.round(v).toString();
    }
  })();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={prefersReduced ? undefined : { ...SPRING_GENTLE, delay }}
      className={
        metric.isPrimary
          ? "flex items-center justify-between px-4 py-4 rounded-xl mb-2 border"
          : "flex items-center justify-between py-3 border-b border-[#EFEFEA] last:border-0 hover:bg-[#F5F5F0] transition-colors rounded-lg px-1 -mx-1"
      }
      style={
        metric.isPrimary
          ? {
              backgroundColor: `${accentColor}08`,
              borderColor: `${accentColor}30`,
            }
          : undefined
      }
    >
      {/* Label + direction icon */}
      <div className="flex items-center gap-1.5">
        {metric.direction !== undefined && (
          <DirectionIcon direction={metric.direction} />
        )}
        <span className="text-xs uppercase tracking-wider text-[#555555] font-medium">
          {metric.label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        {metric.format === "currency" && (
          <span
            className={`text-sm font-bold font-mono tabular-nums ${metric.isPrimary ? "text-base" : ""}`}
            style={{ color: valueColor }}
            aria-hidden="true"
          >
            $
          </span>
        )}
        <span
          className={`font-bold font-mono tabular-nums ${metric.isPrimary ? "text-2xl" : "text-sm"}`}
          style={{ color: valueColor }}
          aria-label={`${metric.label}: ${metric.format === "currency" ? "$" : ""}${formattedStaticValue}${metric.format === "percent" ? "%" : ""}`}
        >
          <AnimatedCounter
            value={isFinite(metric.value) ? metric.value : 0}
            format={metric.format}
            decimals={metric.decimals ?? (metric.format === "percent" ? 1 : 0)}
            aria-hidden={true}
          />
        </span>
        {metric.format === "percent" && (
          <span
            className="text-sm font-bold font-mono tabular-nums"
            style={{ color: valueColor }}
            aria-hidden="true"
          >
            %
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Result group
// ---------------------------------------------------------------------------

function ResultGroup({
  group,
  groupIndex,
  calculationKey,
  prefersReduced,
}: {
  group: ResultGroup;
  groupIndex: number;
  calculationKey: string;
  prefersReduced: boolean | null;
}) {
  return (
    <div className="space-y-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#888888] mb-2 px-1">
        {group.heading}
      </p>
      {group.metrics.map((metric, i) => (
        <MetricRow
          key={`${calculationKey}-${groupIndex}-${i}`}
          metric={metric}
          index={i + groupIndex * 4}
          accentColor={group.accentColor}
          prefersReduced={prefersReduced}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CalculationResultReveal (main export)
// ---------------------------------------------------------------------------

export function CalculationResultReveal({
  groups,
  calculationKey,
  accentColor,
  isComputing,
  ariaLiveRef,
}: CalculationResultRevealProps) {
  const prefersReduced = useReducedMotion();
  const regionId = useId();

  const hasResults = groups.length > 0 && groups.some((g) => g.metrics.length > 0);

  return (
    <div
      ref={ariaLiveRef}
      id={regionId}
      role="region"
      aria-label="Calculation results"
      aria-busy={isComputing}
      className="mt-6 pt-6 border-t border-[#EFEFEA]"
    >
      {/* Section heading */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#1A1A1A]">Your results</h2>
          <p className="text-[10px] text-[#888888] mt-0.5">
            Based on the numbers you entered.
          </p>
        </div>
        {/* Accent rule */}
        <div
          className="h-0.5 w-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isComputing ? (
          /* Computing skeleton */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ComputingSkeleton accentColor={accentColor} />
          </motion.div>
        ) : hasResults ? (
          /* Results */
          <motion.div
            key={`results-${calculationKey}`}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={prefersReduced ? { duration: 0 } : { ...SPRING_BOUNCY }}
            className="space-y-5"
          >
            {groups.map((group, gi) => (
              <ResultGroup
                key={`${calculationKey}-group-${gi}`}
                group={group}
                groupIndex={gi}
                calculationKey={calculationKey}
                prefersReduced={prefersReduced}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
