"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import type { LifeStage, StageLesson } from "@/lib/life-stages/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConceptLessonWrapperProps {
  stage: LifeStage;
  lesson: StageLesson;
  lessonIndex: number;
  prevLesson: StageLesson | null;
  nextLesson: StageLesson | null;
  isCompleted: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConceptLessonWrapper({
  stage,
  lesson,
  lessonIndex,
  prevLesson,
  nextLesson,
  isCompleted,
  onComplete,
  children,
}: ConceptLessonWrapperProps) {
  const { accentColor } = stage;
  const [markingComplete, setMarkingComplete] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showNextLesson, setShowNextLesson] = useState(false);

  const totalLessons = stage.lessons.length;

  const handleMarkComplete = useCallback(async () => {
    if (isCompleted || markingComplete) return;
    setMarkingComplete(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete();
    setMarkingComplete(false);
    setJustCompleted(true);
    setTimeout(() => setShowNextLesson(true), 800);
  }, [isCompleted, markingComplete, onComplete]);

  return (
    <div className="min-h-screen pb-32 sm:pb-16">
      {/* Stage context bar */}
      <div
        className="sticky top-16 z-30 px-4 py-2.5 border-b"
        style={{
          background: "rgba(250,250,248,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: `${accentColor}25`,
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Stage breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/paths/${stage.slug}`}
              className="flex items-center gap-1.5 text-[10px] font-medium transition-opacity hover:opacity-70"
              style={{ color: accentColor }}
            >
              <ArrowLeft className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">{stage.title}</span>
            </Link>
            <span style={{ color: "#E5E5E0" }}>/</span>
            <span className="text-[10px] text-[#888888] truncate max-w-[140px]">{lesson.title}</span>
          </div>

          {/* Lesson position */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-[10px] font-medium"
              style={{ color: "#888888", fontFamily: "var(--font-jetbrains)" }}
            >
              {lessonIndex + 1} / {totalLessons}
            </span>

            {/* Prev / Next nav */}
            <div className="flex items-center gap-1">
              {prevLesson ? (
                <Link
                  href={`/paths/${stage.slug}/${prevLesson.id}`}
                  className="flex items-center justify-center w-6 h-6 rounded-lg transition-colors hover:opacity-70"
                  style={{ background: `${accentColor}12`, color: accentColor }}
                  aria-label="Previous lesson"
                >
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              ) : (
                <div className="w-6 h-6" />
              )}
              {nextLesson ? (
                <Link
                  href={`/paths/${stage.slug}/${nextLesson.id}`}
                  className="flex items-center justify-center w-6 h-6 rounded-lg transition-colors hover:opacity-70"
                  style={{ background: `${accentColor}12`, color: accentColor }}
                  aria-label="Next lesson"
                >
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>
          </div>
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

      {/* Concept content */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Lesson number label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[10px] uppercase tracking-widest font-medium mb-1"
          style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
        >
          Lesson {lessonIndex + 1} of {totalLessons} — {stage.title}
        </motion.p>

        {/* Concept page rendered here */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          {children}
        </motion.div>

        {/* Mark Complete — desktop */}
        <div className="hidden sm:block mt-8 mb-8">
          <motion.button
            onClick={handleMarkComplete}
            disabled={isCompleted || markingComplete}
            className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2"
            style={
              isCompleted || justCompleted
                ? {
                    background: `${accentColor}18`,
                    color: accentColor,
                    border: `1px solid ${accentColor}35`,
                    cursor: "default",
                  }
                : {
                    background: accentColor,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 16px ${accentColor}44`,
                  }
            }
            whileTap={!isCompleted ? { scale: 0.98 } : {}}
            animate={justCompleted ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {markingComplete ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Marking...
              </>
            ) : isCompleted || justCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Mark as Complete
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {showNextLesson && nextLesson && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-4"
              >
                <Link
                  href={`/paths/${stage.slug}/${nextLesson.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: accentColor }}
                >
                  Next: {nextLesson.title}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mark Complete — mobile sticky footer */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3"
        style={{
          background: "rgba(250,250,248,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #E5E5E0",
        }}
      >
        <AnimatePresence>
          {showNextLesson && nextLesson && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2"
            >
              <Link
                href={`/paths/${stage.slug}/${nextLesson.id}`}
                className="flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-xl"
                style={{ color: accentColor, background: `${accentColor}10` }}
              >
                Next: {nextLesson.title}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleMarkComplete}
          disabled={isCompleted || markingComplete}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2"
          style={
            isCompleted || justCompleted
              ? {
                  background: `${accentColor}18`,
                  color: accentColor,
                  border: `1px solid ${accentColor}35`,
                  cursor: "default",
                }
              : {
                  background: accentColor,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 16px ${accentColor}44`,
                }
          }
          whileTap={!isCompleted ? { scale: 0.98 } : {}}
          animate={justCompleted ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {markingComplete ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Marking...
            </>
          ) : isCompleted || justCompleted ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Completed
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Mark as Complete
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
