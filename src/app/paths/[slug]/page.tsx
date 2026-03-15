"use client";

import { useState, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Trophy,
  ArrowRight,
  KeyRound,
  Briefcase,
  Heart,
  House,
  Star,
  Zap,
  Compass,
  Crown,
} from "lucide-react";
import { lifeStages } from "@/lib/life-stages/stages";
import {
  loadStageProgress,
  saveStageProgress,
  startStage,
  isLessonCompleted,
  getStageCompletionPercent,
  getNextUncompletedLesson,
} from "@/lib/life-stages/progress";
import type { LifeStageState } from "@/lib/life-stages/types";
import { LessonCard } from "@/components/life-stages/lesson-card";

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ReactNode> = {
  KeyRound: <KeyRound className="w-3 h-3" />,
  Briefcase: <Briefcase className="w-3 h-3" />,
  Heart: <Heart className="w-3 h-3" />,
  House: <House className="w-3 h-3" />,
  Star: <Star className="w-3 h-3" />,
  Zap: <Zap className="w-3 h-3" />,
  Compass: <Compass className="w-3 h-3" />,
  Crown: <Crown className="w-3 h-3" />,
};

const XP_PER_LESSON = 45;

// ---------------------------------------------------------------------------
// Stage Detail Page
// ---------------------------------------------------------------------------

export default function StageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const stage = useMemo(
    () => lifeStages.find((s) => s.slug === slug) ?? null,
    [slug],
  );

  const [stageState, setStageState] = useState<LifeStageState | null>(null);

  useEffect(() => {
    const loaded = loadStageProgress();
    setStageState(loaded);
  }, []);

  // Start the stage on first visit (idempotent)
  useEffect(() => {
    if (!stageState || !stage) return;
    const alreadyStarted = stageState.stages.some(
      (s) => s.stageId === stage.id,
    );
    if (!alreadyStarted) {
      const updated = startStage(stageState, stage.id);
      saveStageProgress(updated);
      setStageState(updated);
    }
  }, [stageState, stage]);

  if (!stage) {
    notFound();
  }

  const { accentColor, accentColorLight } = stage;

  const completionPercent =
    stageState ? getStageCompletionPercent(stageState, stage.id) : 0;

  const completedCount = stageState
    ? stageState.stages.find((s) => s.stageId === stage.id)?.lessonsCompleted
        .length ?? 0
    : 0;

  const nextLessonId = stageState
    ? getNextUncompletedLesson(stageState, stage.id)
    : stage.lessons[0]?.id ?? null;

  const nextStageIndex = lifeStages.findIndex((s) => s.id === stage.id) + 1;
  const nextStage =
    nextStageIndex < lifeStages.length ? lifeStages[nextStageIndex] : null;

  const allComplete = completionPercent === 100;

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <div
        className="relative h-[200px] sm:h-[260px] md:h-[300px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 50%, #FAFAF8 100%)`,
        }}
      >
        {/* Radial glow blob */}
        <div
          className="absolute w-[400px] h-[400px] pointer-events-none"
          style={{
            top: -100,
            right: -80,
            background: `radial-gradient(${accentColor}20, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        {/* Watermark stage number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-4 right-6 select-none pointer-events-none leading-none font-black"
          style={{
            fontSize: "clamp(100px, 14vw, 160px)",
            color: "#1A1A1A",
            fontFamily: "var(--font-jetbrains)",
          }}
          aria-hidden
        >
          {String(stage.number).padStart(2, "0")}
        </motion.div>

        {/* Hero content */}
        <div className="relative max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-6 sm:pb-8">
          {/* Breadcrumb — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 mb-3 text-[10px]" style={{ color: "#888888" }}>
            <Link
              href="/paths"
              className="hover:opacity-70 transition-opacity"
              style={{ color: accentColor }}
            >
              Learning Paths
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: accentColor }}>{stage.title}</span>
          </div>

          {/* Mobile back link */}
          <div className="sm:hidden mb-3">
            <Link
              href="/paths"
              className="inline-flex items-center gap-1 text-[10px] hover:opacity-70 transition-opacity"
              style={{ color: accentColor }}
            >
              <ArrowLeft className="w-3 h-3" /> Learning Paths
            </Link>
          </div>

          {/* Stage badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium w-fit mb-2"
            style={{
              background: `${accentColor}18`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {iconMap[stage.icon]}
            Life Stage {stage.number}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: "#1A1A1A" }}
          >
            {stage.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-sm mt-1.5 max-w-lg"
            style={{ color: "#555555" }}
          >
            {stage.tagline}
          </motion.p>

          {/* Progress row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex items-center gap-3 mt-4"
          >
            <span className="text-[10px]" style={{ color: "#888888" }}>
              {completedCount} of {stage.lessons.length} lessons completed
            </span>
            <div
              className="flex-1 max-w-[200px] h-1.5 rounded-full overflow-hidden"
              style={{ background: "#EFEFEA" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="h-1.5 rounded-full"
                style={{ background: accentColor }}
              />
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
            >
              {completionPercent}%
            </span>
          </motion.div>
        </div>

        {/* Accent bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[4px]"
          style={{ background: accentColor }}
        />
      </div>

      {/* DIVIDER */}
      <div className="divider-financial" />

      {/* LESSON STACK */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
        {/* Continue CTA (returning user) */}
        {completedCount > 0 && !allComplete && nextLessonId && (
          <div className="mb-6">
            <Link
              href={`/paths/${stage.slug}/${nextLessonId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: accentColor,
                color: "#FFFFFF",
                boxShadow: `0 4px 16px ${accentColor}44`,
              }}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Lessons header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>
            Lessons
          </p>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{ color: "#888888", fontFamily: "var(--font-jetbrains)" }}
            >
              <Clock className="w-3 h-3" />
              {stage.estimatedMinutes} min total
            </span>
            {completedCount === 0 && (
              <span className="text-[10px]" style={{ color: "#888888" }}>
                Tap a lesson to begin
              </span>
            )}
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {stage.lessons.map((lesson, index) => {
            const isCompleted = stageState
              ? isLessonCompleted(stageState, stage.id, lesson.id)
              : false;
            const isNext = lesson.id === nextLessonId && !allComplete;
            const isLocked = false; // No hard locks -- show advisory only

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                stageSlug={stage.slug}
                accentColor={accentColor}
                isCompleted={isCompleted}
                isNext={isNext}
                isLocked={isLocked}
                xpReward={XP_PER_LESSON}
              />
            );
          })}
        </div>

        {/* Stage Complete banner */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-6 rounded-2xl text-center"
            style={{
              border: `1px solid ${accentColor}30`,
              background: `${accentColor}06`,
            }}
          >
            <Trophy
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: accentColor }}
            />
            <h3 className="text-lg font-semibold mb-1" style={{ color: "#1A1A1A" }}>
              Stage Complete!
            </h3>
            <p className="text-sm mb-5" style={{ color: "#555555" }}>
              Ready for the next chapter?
            </p>
            {nextStage && (
              <Link
                href={`/paths/${nextStage.slug}`}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: accentColor,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 16px ${accentColor}44`,
                }}
              >
                Continue to {nextStage.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Bottom nav */}
        <div className="divider-financial mt-10 mb-6" />
        <div className="flex items-center justify-between">
          <Link
            href="/paths"
            className="text-sm inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: "#888888" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Paths
          </Link>
          {nextStage && !allComplete && (
            <Link
              href={`/paths/${nextStage.slug}`}
              className="text-sm inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: accentColor }}
            >
              {nextStage.title} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
