"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StageNodeData {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly accentColor: string;
  readonly accentColorLight: string;
  readonly icon: string;
  readonly lessonCount: number;
  readonly completedCount: number;
  readonly estimatedMinutes: number;
}

interface StageNodeProps {
  readonly stage: StageNodeData;
  readonly index: number;
  readonly isUnlocked: boolean;
  readonly isCurrent: boolean;
  readonly isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// Icon map -- emoji representations per stage (matches spec step 4)
// ---------------------------------------------------------------------------

const STAGE_ICONS: Record<string, string> = {
  KeyRound: "🗝",
  Briefcase: "💼",
  Heart: "💍",
  Home: "🏡",
  Baby: "🍼",
  Building2: "📊",
  Umbrella: "☂",
  Landmark: "🏛",
};

// ---------------------------------------------------------------------------
// Progress ring (SVG)
// ---------------------------------------------------------------------------

function ProgressRing({
  percent,
  accentColor,
  size,
}: {
  readonly percent: number;
  readonly accentColor: string;
  readonly size: number;
}) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${Math.round(percent)}% complete`}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#EDE9E4"
        strokeWidth={3}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={accentColor}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// StageNode component
// ---------------------------------------------------------------------------

export default function StageNode({
  stage,
  index,
  isUnlocked,
  isCurrent,
  isCompleted,
}: StageNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const progressPct =
    stage.lessonCount > 0
      ? (stage.completedCount / stage.lessonCount) * 100
      : 0;

  const iconEmoji = STAGE_ICONS[stage.icon] ?? "📌";

  // Status text
  const statusText = isCompleted
    ? "Nailed it"
    : stage.completedCount > 0
      ? `${stage.completedCount} of ${stage.lessonCount} lessons done`
      : "Start here";

  const ctaText = isCompleted
    ? "Review"
    : stage.completedCount > 0
      ? "Keep going"
      : "Let's go";

  const shadowColor = `${stage.accentColor}30`;
  const hoverShadow = `0 8px 28px ${stage.accentColor}28, 0 2px 8px ${stage.accentColor}18`;
  const restShadow = isCompleted
    ? `0 4px 16px ${stage.accentColor}20`
    : "0 2px 8px rgba(0,0,0,0.06)";

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    background: isCompleted ? `${stage.accentColor}08` : "var(--color-surface)",
    borderRadius: "16px",
    border: isCurrent
      ? `2px solid ${stage.accentColor}`
      : isCompleted
        ? `1px solid ${stage.accentColor}40`
        : "1px solid var(--color-border)",
    boxShadow: isHovered ? hoverShadow : restShadow,
    padding: "24px",
    opacity: isUnlocked ? 1 : 0.45,
    pointerEvents: isUnlocked ? "auto" : "none",
    cursor: isUnlocked ? "pointer" : "default",
    transition:
      "box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease",
    transform: isHovered && isUnlocked ? "translateY(-2px)" : "translateY(0)",
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={isUnlocked ? { scale: 1.015 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isUnlocked ? "article" : "presentation"}
      aria-disabled={!isUnlocked}
      aria-label={`${stage.title} -- ${stage.lessonCount} lessons, ${stage.estimatedMinutes} minutes. ${statusText}`}
    >
      {/* Accent bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: isUnlocked ? stage.accentColor : "#EDE9E4",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Pulsing current indicator */}
      {isCurrent && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: stage.accentColor,
            boxShadow: `0 0 0 0 ${stage.accentColor}40`,
            animation: "stagePulse 2s infinite",
          }}
        />
      )}

      {/* Lock icon for locked stages */}
      {!isUnlocked && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
          }}
        >
          <Lock
            style={{ width: "16px", height: "16px", color: "#888888", opacity: 0.5 }}
          />
        </div>
      )}

      {/* Header row: icon + progress ring */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        {/* Stage icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: `${stage.accentColor}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}
        >
          {iconEmoji}
        </div>

        {/* Progress ring or graduation badge */}
        {isCompleted ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: `${stage.accentColor}15`,
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: stage.accentColor,
            }}
          >
            <CheckCircle2 style={{ width: "12px", height: "12px" }} />
            Graduated
          </div>
        ) : (
          <ProgressRing
            percent={progressPct}
            accentColor={isUnlocked ? stage.accentColor : "#EDE9E4"}
            size={44}
          />
        )}
      </div>

      {/* Stage number + title */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: stage.accentColor,
          opacity: isUnlocked ? 0.8 : 0.5,
          marginBottom: "4px",
        }}
      >
        Stage {index + 1}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
          lineHeight: 1.3,
        }}
      >
        {stage.title}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "var(--color-text-muted)",
          letterSpacing: "-0.01em",
          marginTop: "4px",
          lineHeight: 1.4,
        }}
      >
        {stage.tagline}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            height: "5px",
            borderRadius: "3px",
            background: "#EDE9E4",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 + 0.2 }}
            style={{
              height: "100%",
              borderRadius: "3px",
              background: stage.accentColor,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {stage.completedCount}/{stage.lessonCount} lessons
          </span>
          {isUnlocked && (
            <span
              style={{
                fontSize: "11px",
                color: isCompleted ? stage.accentColor : "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {stage.estimatedMinutes}m
            </span>
          )}
        </div>
      </div>

      {/* CTA row */}
      {isUnlocked && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontWeight: 600,
            color: stage.accentColor,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {ctaText}
          <ArrowRight style={{ width: "12px", height: "12px" }} />
        </div>
      )}
    </motion.div>
  );

  if (!isUnlocked) {
    return content;
  }

  return (
    <Link href={`/paths/${stage.slug}`} style={{ textDecoration: "none", display: "block" }}>
      {content}
    </Link>
  );
}
