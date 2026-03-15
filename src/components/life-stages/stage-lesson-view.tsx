"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StageLesson, StageLessonContent, LifeStage } from "@/lib/life-stages/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StageLessonViewProps {
  lesson: StageLesson;
  content: StageLessonContent;
  stage: LifeStage;
  lessonIndex: number;
  nextLesson: StageLesson | null;
  isCompleted: boolean;
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const XP_PER_LESSON = 45;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseBody(body: string): string[] {
  return body.split("\n\n").filter((p) => p.trim().length > 0);
}

function renderParagraph(text: string, accentColor: string) {
  // Bold text wrapped in **...**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: accentColor, fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ---------------------------------------------------------------------------
// Action Item Checkbox
// ---------------------------------------------------------------------------

interface ActionItemProps {
  text: string;
  checked: boolean;
  onToggle: () => void;
  accentColor: string;
  index: number;
}

function ActionItem({ text, checked, onToggle, accentColor, index }: ActionItemProps) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.07, duration: 0.35 }}
    >
      <motion.button
        onClick={onToggle}
        className="flex-shrink-0 mt-0.5 focus-visible:outline-none focus-visible:ring-2 rounded-md"
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          border: `2px solid ${checked ? accentColor : accentColor + "55"}`,
          background: checked ? accentColor : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          minWidth: 44,
          minHeight: 44,
          padding: 12,
          boxSizing: "content-box",
          margin: "-12px",
          marginRight: 0,
        }}
        whileTap={{ scale: 1.2 }}
        animate={checked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        aria-label={checked ? "Mark incomplete" : "Mark complete"}
      >
        {checked && (
          <CheckCircle2
            style={{ width: 12, height: 12, color: "#FFFFFF", minWidth: 12 }}
          />
        )}
      </motion.button>
      <p
        className="text-sm leading-relaxed"
        style={{
          color: checked ? "#888888" : "#FAFAF8",
          textDecoration: checked ? "line-through" : "none",
          transition: "color 0.2s, text-decoration 0.2s",
          fontFamily: "var(--font-jetbrains)",
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function StageLessonView({
  lesson,
  content,
  stage,
  lessonIndex,
  nextLesson,
  isCompleted,
  onComplete,
}: StageLessonViewProps) {
  const { accentColor } = stage;
  const storageKey = `uc_lesson_${lesson.id}_actions`;
  const scrollKey = `uc_scroll_${lesson.id}`;

  // Action checkboxes state
  const [actionsDone, setActionsDone] = useState<boolean[]>([]);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showNextLesson, setShowNextLesson] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load action state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setActionsDone(JSON.parse(raw) as boolean[]);
      } else {
        setActionsDone([false]);
      }
    } catch {
      setActionsDone([false]);
    }
  }, [storageKey]);

  // Restore scroll position
  useEffect(() => {
    try {
      const saved = localStorage.getItem(scrollKey);
      if (saved) {
        const y = parseInt(saved, 10);
        if (!isNaN(y) && y > 100) {
          setTimeout(() => window.scrollTo({ top: y, behavior: "smooth" }), 300);
        }
      }
    } catch {
      // ignore
    }
  }, [scrollKey]);

  // Save scroll position (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(scrollKey, String(window.scrollY));
        } catch {
          // ignore
        }
      }, 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [scrollKey]);

  const toggleAction = useCallback(
    (i: number) => {
      setActionsDone((prev) => {
        const next = prev.map((v, idx) => (idx === i ? !v : v));
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey],
  );

  const handleMarkComplete = useCallback(async () => {
    if (isCompleted || markingComplete) return;
    setMarkingComplete(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete();
    setMarkingComplete(false);
    setJustCompleted(true);
    setTimeout(() => setShowNextLesson(true), 800);
  }, [isCompleted, markingComplete, onComplete]);

  const paragraphs = parseBody(content.body);
  const totalLessons = stage.lessons.length;

  return (
    <div ref={contentRef}>
      {/* Header */}
      <div className="mb-8">
        {/* Stage accent top bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-[3px] w-full rounded-full mb-6"
          style={{ background: accentColor, transformOrigin: "left" }}
        />

        {/* Lesson number label */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[10px] uppercase tracking-widest font-medium mb-1"
          style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
        >
          Lesson {lessonIndex + 1} of {totalLessons}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
          style={{ color: "#1A1A1A" }}
        >
          {lesson.title}
        </motion.h1>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <span
            className="flex items-center gap-1 text-[10px]"
            style={{ color: "#888888", fontFamily: "var(--font-jetbrains)" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {lesson.estimatedMinutes} min read
          </span>
          <span
            className="flex items-center gap-1 text-[10px]"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)", opacity: 0.85 }}
          >
            <Zap className="w-3 h-3" />
            +{XP_PER_LESSON} XP
          </span>
          {isCompleted && (
            <span
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${accentColor}18`, color: accentColor }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </motion.div>
      </div>

      {/* Body text */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="space-y-5 mb-10"
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-[1.75]" style={{ color: "#374151" }}>
            {renderParagraph(p, accentColor)}
          </p>
        ))}
      </motion.div>

      {/* Key Takeaways */}
      {content.keyTakeaways.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          className="rounded-2xl p-5 sm:p-6 mb-8"
          style={{
            background: `${accentColor}0C`,
            borderLeft: `4px solid ${accentColor}`,
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            Key Takeaways
          </p>
          <ul className="space-y-2.5">
            {content.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <span
                  className="flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
                >
                  {i + 1}.
                </span>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Pro Tip */}
      {content.proTip && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="rounded-2xl p-4 mb-8"
          style={{
            background: `${accentColor}0A`,
            border: `1px solid ${accentColor}33`,
          }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Pro Tip
          </p>
          <p className="text-sm leading-relaxed italic" style={{ color: "#4B5563" }}>
            {content.proTip}
          </p>
        </motion.div>
      )}

      {/* DO THIS TODAY card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="relative rounded-2xl p-5 sm:p-6 mb-8 overflow-hidden"
        style={{
          background: "#1A1A1A",
          border: `2px solid ${accentColor}`,
          boxShadow: `0 8px 32px ${accentColor}33`,
        }}
      >
        {/* Background radial blob */}
        <div
          className="absolute top-0 right-0 w-[200px] h-[200px] pointer-events-none hidden sm:block"
          style={{
            background: `radial-gradient(${accentColor}18, transparent 70%)`,
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 relative">
          <Zap className="w-5 h-5" style={{ color: accentColor }} />
          <p
            className="text-sm font-bold tracking-widest uppercase"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Do This Today
          </p>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            Action
          </span>
        </div>

        {/* Action item with checkbox */}
        <div className="space-y-4 relative">
          <ActionItem
            text={content.actionItem}
            checked={actionsDone[0] ?? false}
            onToggle={() => toggleAction(0)}
            accentColor={accentColor}
            index={0}
          />
        </div>
      </motion.div>

      {/* Mark Complete — desktop (inline) */}
      <div className="hidden sm:block mb-8">
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

        {/* Next lesson link */}
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
                className="flex items-center justify-center gap-2 h-10 text-sm font-medium rounded-xl transition-colors"
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
