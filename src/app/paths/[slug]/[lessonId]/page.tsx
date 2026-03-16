"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { lifeStages } from "@/lib/life-stages/stages";
import {
  loadStageProgress,
  saveStageProgress,
  completeLesson,
  isLessonCompleted,
  isStageGraduated,
} from "@/lib/life-stages/progress";
import type { LifeStage, LifeStageState, StageLesson } from "@/lib/life-stages/types";
import { StageLessonView } from "@/components/life-stages/stage-lesson-view";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { GraduationCelebration } from "@/components/life-stages/graduation-celebration";

// ---------------------------------------------------------------------------
// XP constants
// ---------------------------------------------------------------------------

const XP_PER_LESSON = 10;
const XP_GRADUATION = 200;

// ---------------------------------------------------------------------------
// Shared Mark Complete blocks
// ---------------------------------------------------------------------------

interface MarkCompleteBlockProps {
  isCompleted: boolean;
  onComplete: () => void;
  accentColor: string;
  nextLesson: StageLesson | null;
  stageSlug: string;
}

function MarkCompleteBlock({
  isCompleted,
  onComplete,
  accentColor,
  nextLesson,
  stageSlug,
}: MarkCompleteBlockProps) {
  const [marking, setMarking] = useState(false);
  const [justDone, setJustDone] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleClick = async () => {
    if (isCompleted || marking) return;
    setMarking(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete();
    setMarking(false);
    setJustDone(true);
    setTimeout(() => setShowNext(true), 800);
  };

  return (
    <div className="hidden sm:block mb-6">
      <motion.button
        onClick={handleClick}
        disabled={isCompleted || marking}
        className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-sm font-semibold transition-all"
        style={
          isCompleted || justDone
            ? {
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}35`,
                cursor: "default",
              }
            : {
                background: accentColor,
                color: "#F5EDE0",
                boxShadow: `0 4px 16px rgba(44,95,124,0.3)`,
              }
        }
        whileTap={!isCompleted ? { scale: 0.98 } : {}}
        animate={justDone ? { scale: [1, 1.04, 1] } : {}}
      >
        {marking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Marking...
          </>
        ) : isCompleted || justDone ? (
          <>
            <CheckCircle className="w-4 h-4" /> Completed
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" /> Mark as Complete
          </>
        )}
      </motion.button>
      <AnimatePresence>
        {showNext && nextLesson && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <Link
              href={`/paths/${stageSlug}/${nextLesson.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
              style={{ color: accentColor }}
            >
              Next: {nextLesson.title} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMarkCompleteBar({
  isCompleted,
  onComplete,
  accentColor,
  nextLesson,
  stageSlug,
}: MarkCompleteBlockProps) {
  const [marking, setMarking] = useState(false);
  const [justDone, setJustDone] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleClick = async () => {
    if (isCompleted || marking) return;
    setMarking(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete();
    setMarking(false);
    setJustDone(true);
    setTimeout(() => setShowNext(true), 800);
  };

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3"
      style={{
        background: "rgba(245,237,224,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(196,166,122,0.3)",
      }}
    >
      <AnimatePresence>
        {showNext && nextLesson && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <Link
              href={`/paths/${stageSlug}/${nextLesson.id}`}
              className="flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-xl"
              style={{ color: accentColor, background: `${accentColor}10` }}
            >
              Next: {nextLesson.title} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={handleClick}
        disabled={isCompleted || marking}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold"
        style={
          isCompleted || justDone
            ? {
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}35`,
                cursor: "default",
              }
            : {
                background: accentColor,
                color: "#F5EDE0",
                boxShadow: `0 4px 16px rgba(44,95,124,0.3)`,
              }
        }
        whileTap={!isCompleted ? { scale: 0.98 } : {}}
        animate={justDone ? { scale: [1, 1.04, 1] } : {}}
      >
        {marking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Marking...
          </>
        ) : isCompleted || justDone ? (
          <>
            <CheckCircle className="w-4 h-4" /> Completed
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" /> Mark as Complete
          </>
        )}
      </motion.button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Concept lesson sub-page
// Renders stage context bar + concept summary + Mark Complete
// ---------------------------------------------------------------------------

interface ConceptLessonPageProps {
  stage: LifeStage;
  lesson: StageLesson;
  lessonIndex: number;
  prevLesson: StageLesson | null;
  nextLesson: StageLesson | null;
  isCompleted: boolean;
  onComplete: () => void;
  accentColor: string;
}

function ConceptLessonPage({
  stage,
  lesson,
  lessonIndex,
  prevLesson,
  nextLesson,
  isCompleted,
  onComplete,
  accentColor,
}: ConceptLessonPageProps) {
  const totalLessons = stage.lessons.length;
  const conceptSlug = lesson.conceptSlug;

  return (
    <div className="min-h-screen pb-32 sm:pb-16" style={{ background: "#F5EDE0" }}>
      {/* Stage context bar */}
      <div
        className="sticky top-16 z-30 px-4 py-2.5 border-b"
        style={{
          background: "rgba(245,237,224,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: `${accentColor}25`,
        }}
      >
        <div className="max-w-[960px] mx-auto flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-2 min-w-0 text-[10px]"
            style={{ color: "#555555" }}
          >
            <Link
              href={`/paths/${stage.slug}`}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{ color: accentColor }}
            >
              <ArrowLeft className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {stage.title}
              </span>
            </Link>
            <span>/</span>
            <span className="truncate max-w-[140px]">{lesson.title}</span>
          </div>

          <span
            className="text-[10px] font-medium flex-shrink-0"
            style={{ color: "#555555", fontFamily: "var(--font-jetbrains)" }}
          >
            {lessonIndex + 1} / {totalLessons}
          </span>
        </div>
      </div>

      {/* Stage accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-[3px] w-full"
        style={{ background: accentColor, transformOrigin: "left" }}
      />

      <div className="max-w-[960px] mx-auto px-4 pt-8">
        {/* Lesson context header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 pb-5 border-b"
          style={{ borderColor: "rgba(196,166,122,0.3)" }}
        >
          <p
            className="text-label mb-1"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Lesson {lessonIndex + 1} of {totalLessons} — {stage.title}
          </p>
          <h1
            className="font-heading text-xl font-semibold mb-1"
            style={{ color: "#1A1A1A" }}
          >
            {lesson.title}
          </h1>
          <p className="text-sm" style={{ color: "#555555" }}>
            {lesson.summary}
          </p>
          {conceptSlug && (
            <Link
              href={`/concepts/${conceptSlug}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium hover:opacity-80 transition-opacity"
              style={{ color: accentColor }}
            >
              Open full concept page
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </motion.div>

        {/* Concept content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="uc-card rounded-2xl p-6 mb-8"
          style={{
            border: `1px solid ${accentColor}20`,
          }}
        >
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#1A1A1A" }}
          >
            {lesson.summary}
          </p>
          {conceptSlug && (
            <Link
              href={`/concepts/${conceptSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{
                background: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              Read the full lesson
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>

        {/* Mark Complete — desktop */}
        <MarkCompleteBlock
          isCompleted={isCompleted}
          onComplete={onComplete}
          accentColor={accentColor}
          nextLesson={nextLesson}
          stageSlug={stage.slug}
        />

        {/* Bottom nav */}
        <div className="divider-financial mt-8 mb-5" />
        <div className="flex items-center justify-between pb-8">
          {prevLesson ? (
            <Link
              href={`/paths/${stage.slug}/${prevLesson.id}`}
              className="text-sm inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: "#555555" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </Link>
          ) : (
            <Link
              href={`/paths/${stage.slug}`}
              className="text-sm inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: "#555555" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {stage.title}
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/paths/${stage.slug}/${nextLesson.id}`}
              className="text-sm inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: accentColor }}
            >
              Next lesson
            </Link>
          )}
        </div>
      </div>

      {/* Mobile sticky footer */}
      <MobileMarkCompleteBar
        isCompleted={isCompleted}
        onComplete={onComplete}
        accentColor={accentColor}
        nextLesson={nextLesson}
        stageSlug={stage.slug}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Lesson View Page
// ---------------------------------------------------------------------------

export default function LessonViewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lessonId = params.lessonId as string;

  const stage = useMemo(
    () => lifeStages.find((s) => s.slug === slug) ?? null,
    [slug],
  );

  const lessonIndex = useMemo(
    () => (stage ? stage.lessons.findIndex((l) => l.id === lessonId) : -1),
    [stage, lessonId],
  );

  const lesson = useMemo(
    () => (stage && lessonIndex >= 0 ? stage.lessons[lessonIndex] : null),
    [stage, lessonIndex],
  );

  const prevLesson = useMemo(
    () => (stage && lessonIndex > 0 ? stage.lessons[lessonIndex - 1] : null),
    [stage, lessonIndex],
  );

  const nextLesson = useMemo(
    () =>
      stage && lessonIndex >= 0 && lessonIndex < stage.lessons.length - 1
        ? stage.lessons[lessonIndex + 1]
        : null,
    [stage, lessonIndex],
  );

  const [stageState, setStageState] = useState<LifeStageState | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGraduation, setShowGraduation] = useState(false);

  useEffect(() => {
    setStageState(loadStageProgress());
  }, []);

  const lessonCompleted = useMemo(
    () =>
      stageState && stage && lesson
        ? isLessonCompleted(stageState, stage.id, lesson.id)
        : false,
    [stageState, stage, lesson],
  );

  const handleComplete = useCallback(() => {
    if (!stageState || !stage || !lesson) return;

    const wasGraduatedBefore = isStageGraduated(stageState, stage.id);
    const updated = completeLesson(stageState, stage.id, lesson.id);
    saveStageProgress(updated);
    setStageState(updated);

    // Fire lesson confetti immediately
    setShowConfetti(true);

    // If this completion caused graduation, show graduation after confetti settles
    const isNowGraduated = isStageGraduated(updated, stage.id);
    if (!wasGraduatedBefore && isNowGraduated) {
      setTimeout(() => {
        setShowConfetti(false);
        setShowGraduation(true);
      }, 1800);
    }
  }, [stageState, stage, lesson]);

  if (!stage || !lesson || lessonIndex < 0) {
    notFound();
  }

  const { accentColor } = stage;
  const completedLessons = stageState
    ? (stageState.stages.find((s) => s.stageId === stage.id)?.lessonsCompleted ?? [])
    : [];
  const totalXpEarned = completedLessons.length * XP_PER_LESSON + (showGraduation ? XP_GRADUATION : 0);

  // CONCEPT lesson
  if (lesson.type === "concept") {
    return (
      <>
        <LessonConfetti
          visible={showConfetti}
          accentColor={accentColor}
          onDone={() => setShowConfetti(false)}
        />
        <GraduationCelebration
          visible={showGraduation}
          stage={stage}
          completedLessons={completedLessons}
          totalXpEarned={totalXpEarned}
          onDismiss={() => setShowGraduation(false)}
        />
        <ConceptLessonPage
          stage={stage}
          lesson={lesson}
          lessonIndex={lessonIndex}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={lessonCompleted}
          onComplete={handleComplete}
          accentColor={accentColor}
        />
      </>
    );
  }

  // STAGE-LESSON without content
  if (!lesson.content) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "#F5EDE0" }}>
        <div className="max-w-[960px] mx-auto text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "#E05A1B" }} />
          <p className="text-sm" style={{ color: "#555555" }}>
            Lesson content is not available. Please try again later.
          </p>
          <Link
            href={`/paths/${stage.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm hover:opacity-70"
            style={{ color: accentColor }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {stage.title}
          </Link>
        </div>
      </div>
    );
  }

  // Full STAGE-LESSON view
  return (
    <>
      <LessonConfetti
        visible={showConfetti}
        accentColor={accentColor}
        onDone={() => setShowConfetti(false)}
      />
      <GraduationCelebration
        visible={showGraduation}
        stage={stage}
        completedLessons={completedLessons}
        totalXpEarned={totalXpEarned}
        onDismiss={() => setShowGraduation(false)}
      />
      <div className="min-h-screen pb-32 sm:pb-16" style={{ background: "#F5EDE0" }}>
      {/* Breadcrumb bar */}
      <div
        className="sticky top-16 z-30 px-4 py-2.5 border-b"
        style={{
          background: "rgba(245,237,224,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: `${accentColor}25`,
        }}
      >
        <div
          className="max-w-[960px] mx-auto flex items-center gap-2 text-[10px]"
          style={{ color: "#555555" }}
        >
          <Link
            href="/paths"
            className="hover:opacity-70 transition-opacity hidden sm:inline"
          >
            Paths
          </Link>
          <span className="hidden sm:inline">/</span>
          <Link
            href={`/paths/${stage.slug}`}
            className="hover:opacity-70 transition-opacity flex items-center gap-1"
            style={{ color: accentColor }}
          >
            <ArrowLeft className="w-3 h-3" />
            {stage.title}
          </Link>
          <span>/</span>
          <span
            className="truncate max-w-[180px] font-medium"
            style={{ color: "#1A1A1A" }}
          >
            {lesson.title}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[960px] mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StageLessonView
            lesson={lesson}
            content={lesson.content}
            stage={stage}
            lessonIndex={lessonIndex}
            nextLesson={nextLesson}
            isCompleted={lessonCompleted}
            onComplete={handleComplete}
          />
        </motion.div>

        {/* Bottom nav */}
        <div className="divider-financial mt-10 mb-6" />
        <div className="flex items-center justify-between pb-8">
          <Link
            href={`/paths/${stage.slug}`}
            className="text-sm inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: "#555555" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {stage.title}
          </Link>
          {nextLesson && (
            <Link
              href={`/paths/${stage.slug}/${nextLesson.id}`}
              className="text-sm inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: accentColor }}
            >
              Next lesson
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
