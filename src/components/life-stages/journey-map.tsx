"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import StageNode, { type StageNodeData } from "./stage-node";
import { loadStageProgress, isStageGraduated, isStageStarted } from "@/lib/life-stages/progress";
import type { LifeStageState } from "@/lib/life-stages/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JourneyMapProps {
  readonly stages: readonly StageNodeData[];
}

interface EnrichedStage extends StageNodeData {
  readonly isUnlocked: boolean;
  readonly isCurrent: boolean;
  readonly isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// Enrich stages with unlock / current / completed flags
// ---------------------------------------------------------------------------

function enrichStages(
  stages: readonly StageNodeData[],
  state: LifeStageState,
): readonly EnrichedStage[] {
  return stages.map((stage, idx) => {
    const isCompleted = isStageGraduated(state, stage.id);
    const started = isStageStarted(state, stage.id);

    // First stage always unlocked; subsequent unlock only when previous is graduated
    const isUnlocked =
      idx === 0 ||
      isStageGraduated(state, stages[idx - 1].id);

    // "Current" = unlocked, started, not yet completed
    const isCurrent = isUnlocked && started && !isCompleted;

    return {
      ...stage,
      isUnlocked,
      isCurrent,
      isCompleted,
    };
  });
}

// ---------------------------------------------------------------------------
// Animated SVG flowing line
// ---------------------------------------------------------------------------

function FlowingLine({ containerRef }: { readonly containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="absolute inset-y-0 hidden md:block"
      style={{ left: "calc(50% - 1px)", width: "2px", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg
        width="2"
        height="100%"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "2px", height: "100%" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3F2E" />
            <stop offset="50%" stopColor="#2C5F7C" />
            <stop offset="100%" stopColor="#C4A67A" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="#EDE9E4"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Animated progress line */}
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
          initial={{ pathLength: 0 }}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile line (left-aligned)
// ---------------------------------------------------------------------------

function MobileFlowingLine() {
  return (
    <div
      className="absolute inset-y-0 md:hidden"
      style={{ left: "28px", width: "2px", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <div
        style={{
          width: "2px",
          height: "100%",
          background: "linear-gradient(to bottom, #1E3F2E 0%, #2C5F7C 50%, #C4A67A 100%)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton shimmer
// ---------------------------------------------------------------------------

function JourneyMapSkeleton() {
  return (
    <div>
      <div
        style={{
          height: "28px",
          width: "240px",
          borderRadius: "6px",
          marginBottom: "8px",
          background: "linear-gradient(90deg, #EDE9E4 25%, #F5F3EF 50%, #EDE9E4 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          height: "16px",
          width: "300px",
          borderRadius: "4px",
          marginBottom: "32px",
          background: "linear-gradient(90deg, #EDE9E4 25%, #F5F3EF 50%, #EDE9E4 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "180px",
              borderRadius: "16px",
              background: "linear-gradient(90deg, #EDE9E4 25%, #F5F3EF 50%, #EDE9E4 75%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.4s infinite ${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JourneyMap component
// ---------------------------------------------------------------------------

export default function JourneyMap({ stages }: JourneyMapProps) {
  const [stageState, setStageState] = useState<LifeStageState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStageState(loadStageProgress());
  }, []);

  if (!stageState) {
    return <JourneyMapSkeleton />;
  }

  const enriched = enrichStages(stages, stageState);

  const totalLessonsCompleted = enriched.reduce(
    (sum, s) => sum + s.completedCount,
    0,
  );
  const totalLessons = enriched.reduce((sum, s) => sum + s.lessonCount, 0);
  const graduatedCount = enriched.filter((s) => s.isCompleted).length;
  const currentStage = enriched.find((s) => s.isCurrent);

  return (
    <div>
      {/* Header section with staggered entrance */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
          }}
        >
          Your Financial Journey
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
            marginTop: "6px",
          }}
        >
          Complete each stage to unlock the next
        </div>

        {/* Progress summary strip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            background: "var(--color-surface)",
            borderRadius: "40px",
            padding: "12px 20px",
            border: "1px solid var(--color-border)",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: graduatedCount, label: "stages complete" },
            { value: totalLessonsCompleted, label: "lessons done" },
            { value: `${totalLessons - totalLessonsCompleted}`, label: "left to go" },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <div
                  style={{
                    width: "1px",
                    height: "16px",
                    background: "var(--color-border)",
                    margin: "0 16px",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  marginLeft: "5px",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* You are here pill */}
        {currentStage && (
          <div style={{ marginTop: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "var(--color-accent)",
                color: "white",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                letterSpacing: "0.01em",
              }}
            >
              <MapPin style={{ width: "11px", height: "11px" }} />
              You are here: {currentStage.title}
            </span>
          </div>
        )}
      </motion.div>

      {/* Stage grid with flowing line */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          marginTop: "32px",
          paddingBottom: "48px",
        }}
        role="list"
        aria-label="Life stage learning paths -- choose your milestone"
      >
        <FlowingLine containerRef={containerRef} />
        <MobileFlowingLine />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {enriched.map((stage, idx) => (
            <div key={stage.id} role="listitem">
              <StageNode
                stage={stage}
                index={idx}
                isUnlocked={stage.isUnlocked}
                isCurrent={stage.isCurrent}
                isCompleted={stage.isCompleted}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
