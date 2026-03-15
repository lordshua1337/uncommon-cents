"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { LessonConfetti } from "@/components/life-stages/lesson-confetti";
import { SPRING_BOUNCY } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DomainMasteryCelebrationProps {
  readonly visible: boolean;
  readonly domainName: string;
  readonly conceptCount: number;
  readonly accentColor: string;
  readonly onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// localStorage helpers (module-scoped, not exported)
// ---------------------------------------------------------------------------

const CELEBRATION_STORAGE_KEY = "uc-domain-mastery-seen";

function hasDomainCelebrationSeen(domainName: string): boolean {
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    if (!raw) return false;
    const seen = JSON.parse(raw) as string[];
    return seen.includes(domainName);
  } catch {
    return false;
  }
}

function markDomainCelebrationSeen(domainName: string): void {
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    const seen: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!seen.includes(domainName)) {
      localStorage.setItem(
        CELEBRATION_STORAGE_KEY,
        JSON.stringify([...seen, domainName]),
      );
    }
  } catch {
    // localStorage write failure is acceptable -- celebration still shows
  }
}

// Export helpers so the parent page can use them for threshold detection
export { hasDomainCelebrationSeen, markDomainCelebrationSeen };

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.85, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_BOUNCY, delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.92, y: -12, transition: { duration: 0.2 } },
};

const iconVariants = {
  animate: {
    rotate: [0, -10, 10, -6, 6, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, delay: 0.4, ease: "easeInOut" as const },
  },
};

const badgeVariants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ...SPRING_BOUNCY, delay: 0.6 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DomainMasteryCelebration({
  visible,
  domainName,
  conceptCount,
  accentColor,
  onDismiss,
}: DomainMasteryCelebrationProps) {
  const prefersReduced = useReducedMotion();
  const [dismissable, setDismissable] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guard: fallback accent color if none provided
  const color = accentColor || "#16A34A";

  // Auto-dismiss timer + dismissable unlock
  useEffect(() => {
    if (!visible) {
      setDismissable(false);
      return;
    }

    unlockTimer.current = setTimeout(() => setDismissable(true), 2000);
    dismissTimer.current = setTimeout(() => onDismiss(), 4000);

    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [visible, onDismiss]);

  // ESC key dismiss (only once dismissable)
  useEffect(() => {
    if (!visible || !dismissable) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        markDomainCelebrationSeen(domainName);
        onDismiss();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, dismissable, domainName, onDismiss]);

  function handleBackdropClick() {
    if (!dismissable) return;
    markDomainCelebrationSeen(domainName);
    onDismiss();
  }

  function handleDismissButton() {
    markDomainCelebrationSeen(domainName);
    onDismiss();
  }

  return (
    <>
      {/* Confetti -- aria-hidden, purely decorative */}
      {!prefersReduced && (
        <LessonConfetti
          visible={visible}
          accentColor={color}
          count={32}
          onDone={onDismiss}
        />
      )}

      {/* Overlay */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="domain-mastery-backdrop"
            className="fixed inset-0 z-[500] flex items-center justify-center px-4"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}22 0%, rgba(0,0,0,0.78) 100%)`,
            }}
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebration-title"
          >
            {/* Accessible announcement */}
            <div
              role="status"
              aria-live="assertive"
              className="sr-only"
            >
              {`Congratulations -- ${domainName} domain fully mastered!`}
            </div>

            {/* Card wrapper -- stops backdrop click from propagating */}
            <motion.div
              className="relative z-10 max-w-md w-full"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: "24px",
                padding: "2px",
                background: `linear-gradient(135deg, ${color}, ${color}40)`,
                boxShadow: `0 24px 64px ${color}40, 0 8px 24px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Card inner */}
              <div
                className="relative rounded-[22px] p-8 overflow-hidden text-center"
                style={{ backgroundColor: "#FAFAF8" }}
              >
                {/* Inner accent border */}
                <div
                  className="absolute inset-[6px] rounded-2xl pointer-events-none"
                  style={{
                    border: `1px solid ${color}40`,
                  }}
                />

                {/* Corner ornaments */}
                <div
                  className="absolute top-4 left-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: `${color}30` }}
                />
                <div
                  className="absolute top-4 right-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: `${color}30` }}
                />
                <div
                  className="absolute bottom-4 left-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: `${color}30` }}
                />
                <div
                  className="absolute bottom-4 right-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: `${color}30` }}
                />

                {/* Dismiss X button -- appears after 2s */}
                <AnimatePresence>
                  {dismissable && (
                    <motion.button
                      key="dismiss-x"
                      className="absolute top-4 right-4 p-1 rounded-full text-[#64748b] hover:text-[#0f172a] transition-colors z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={handleDismissButton}
                      aria-label="Dismiss celebration"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Trophy icon with wiggle */}
                <motion.div
                  className="flex justify-center mb-4"
                  variants={prefersReduced ? {} : iconVariants}
                  animate="animate"
                >
                  <Trophy
                    size={48}
                    style={{
                      color,
                      filter: `drop-shadow(0 0 12px ${color}80)`,
                    }}
                  />
                </motion.div>

                {/* Overline */}
                <p
                  className="text-[10px] uppercase tracking-widest font-mono mb-1"
                  style={{ color }}
                >
                  Domain Mastered
                </p>

                {/* Domain name */}
                <h2
                  id="celebration-title"
                  className="text-2xl font-bold tracking-tight mb-2"
                  style={{ color: "#0f172a" }}
                >
                  {domainName}
                </h2>

                {/* Body copy */}
                <p className="text-sm text-[#64748b] leading-relaxed mb-1">
                  {"You've explored every concept in this domain."}
                </p>
                <p
                  className="text-sm font-mono tabular-nums text-[#64748b] mb-4"
                >
                  {conceptCount} concepts in your long-term toolkit.
                </p>

                {/* Badge */}
                <motion.div
                  className="flex justify-center mb-4"
                  variants={prefersReduced ? {} : badgeVariants}
                  initial="initial"
                  animate="animate"
                >
                  <span
                    className="inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-white"
                    style={{ backgroundColor: color }}
                  >
                    Domain Complete
                  </span>
                </motion.div>

                {/* Dismiss hint */}
                <p className="text-xs text-[#94a3b8] text-center">
                  {dismissable ? "Tap anywhere to continue" : "Continues in 4s..."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
