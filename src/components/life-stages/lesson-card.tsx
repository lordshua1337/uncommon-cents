"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Zap, Lock, Trophy } from "lucide-react";
import type { StageLesson } from "@/lib/life-stages/types";

interface LessonCardProps {
  lesson: StageLesson;
  index: number;
  stageSlug: string;
  accentColor: string;
  isCompleted: boolean;
  isNext: boolean;
  isLocked: boolean;
  xpReward: number;
}

export function LessonCard({
  lesson,
  index,
  stageSlug,
  accentColor,
  isCompleted,
  isNext,
  isLocked,
  xpReward,
}: LessonCardProps) {
  const lessonNumber = index + 1;

  // Number badge states per DF.CARD.2 spec
  const numberBg = isCompleted
    ? "#CA8A04"
    : isNext
      ? "rgba(202,138,4,0.22)"
      : "#EDE8DC";

  const numberColor = isCompleted
    ? "#FFFFFF"
    : isNext
      ? "#CA8A04"
      : "#5C6A7A";

  const numberOpacity = isLocked && !isCompleted && !isNext ? 0.6 : 1;

  // Card surface states per DF.CARD.2 spec
  const cardBg = isCompleted
    ? "rgba(202,138,4,0.06)"
    : isNext
      ? "rgba(202,138,4,0.04)"
      : "#FFFFFF";

  const borderColor = isCompleted
    ? `${accentColor}35`
    : isNext
      ? `${accentColor}50`
      : "#E8E4DB";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="group relative flex items-center gap-4 cursor-pointer"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "0.75rem",
        padding: "1rem",
        opacity: isLocked ? 0.45 : 1,
        cursor: isLocked ? "not-allowed" : "pointer",
      }}
      whileHover={
        !isLocked
          ? {
              y: -2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderColor: `${accentColor}55`,
              transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
            }
          : {}
      }
      whileTap={!isLocked ? { scale: 0.99 } : {}}
    >
      {/* Left: number badge */}
      <div
        className="flex-shrink-0 flex items-center justify-center text-sm font-bold transition-colors"
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "0.75rem",
          background: numberBg,
          color: numberColor,
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          fontWeight: 700,
          opacity: numberOpacity,
        }}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" style={{ color: "#FFFFFF" }} />
        ) : isLocked ? (
          <Lock className="w-4 h-4" style={{ color: "#5C6A7A" }} />
        ) : (
          <span>{lessonNumber}</span>
        )}
      </div>

      {/* Middle: title + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          {lesson.isQuickWin && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{ background: `${accentColor}18`, color: accentColor }}
            >
              Start Here — {lesson.estimatedMinutes} min
            </span>
          )}
          {lesson.isBossLesson && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{
                background: `${accentColor}12`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              Capstone
            </span>
          )}
        </div>
        <p
          className="text-sm font-semibold truncate"
          style={{
            color: isCompleted ? "#888888" : "#1A1A1A",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {lesson.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "#888888", fontFamily: "var(--font-jetbrains)" }}>
            <Clock className="w-3 h-3" />
            {lesson.estimatedMinutes} min read
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: accentColor, fontFamily: "var(--font-jetbrains)", opacity: 0.8 }}>
            <Zap className="w-3 h-3" />
            +{xpReward} XP
          </span>
          {lesson.type === "concept" && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: `${accentColor}10`, color: accentColor }}
            >
              Concept
            </span>
          )}
        </div>
      </div>

      {/* Right: chevron or trophy */}
      {isCompleted ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" style={{ color: accentColor }} />
      ) : lesson.isBossLesson ? (
        <Trophy className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: accentColor }} />
      ) : (
        <ChevronRight
          className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
          style={{ color: "#888888" }}
        />
      )}

      {/* Glow border for "next" lesson */}
      {isNext && !isCompleted && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 1.5px ${accentColor}55, 0 4px 24px ${accentColor}22`,
          }}
        />
      )}
    </motion.div>
  );

  if (isLocked) return inner;

  const href =
    lesson.type === "concept" && lesson.conceptSlug
      ? `/paths/${stageSlug}/${lesson.id}`
      : `/paths/${stageSlug}/${lesson.id}`;

  return <Link href={href}>{inner}</Link>;
}
