"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Microscope,
  AlertCircle,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { getConceptBySlug, getConceptsByDomain } from "@/lib/concepts";
import { getDomainById } from "@/lib/domains";
import {
  loadMastery,
  saveMastery,
  recordConceptVisit,
  getHighestDepth,
  type MasteryState,
  type DepthLevel,
} from "@/lib/mastery";
import { SPRING_GENTLE, SPRING_SNAPPY, STAGGER_FAST } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type DepthTab = "accessible" | "intermediate" | "advanced";

const depthConfig: Record<
  DepthTab,
  { label: string; icon: React.ReactNode; description: string }
> = {
  accessible: {
    label: "Beginner",
    icon: <BookOpen className="w-4 h-4" />,
    description: "Start here -- plain language, no jargon",
  },
  intermediate: {
    label: "Intermediate",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Deeper details, specific numbers, edge cases",
  },
  advanced: {
    label: "Advanced",
    icon: <Microscope className="w-4 h-4" />,
    description: "Full analysis with optimization strategies",
  },
};

const DEPTH_LABELS: Record<DepthLevel, string> = {
  accessible: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// ---------------------------------------------------------------------------
// Animation variants
// These are intentionally defined outside the component so they are stable
// references and do not cause unnecessary re-renders.
// ---------------------------------------------------------------------------

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { ...SPRING_GENTLE } },
}

// Each content section gets this variant plus a custom delay via transition override
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

// Related concept cards use a tighter y-offset
const relatedCardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// Depth order for directional slide calculation
const DEPTH_ORDER: Record<DepthTab, number> = {
  accessible: 0,
  intermediate: 1,
  advanced: 2,
}

// Tab content variants -- direction (+1 = going deeper, -1 = going shallower)
// custom(direction) receives the direction value passed via AnimatePresence
const tabContentVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 32 : -32,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: SPRING_SNAPPY,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -32 : 32,
    transition: { duration: 0.15, ease: "easeIn" as const },
  }),
}

// Reduced-motion tab content variants -- opacity only, no slide
const tabContentVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
}

// Stagger container for related concept cards
const relatedContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_FAST,
      delayChildren: 0.3,
    },
  },
}

// ---------------------------------------------------------------------------
// RelatedConceptCard
// ---------------------------------------------------------------------------

interface RelatedConceptCardProps {
  slug: string
  index: number
  prefersReduced: boolean
  domainColor: string
}

function RelatedConceptCard({ slug, index, prefersReduced, domainColor }: RelatedConceptCardProps) {
  const concept = getConceptBySlug(slug);
  if (!concept) return null;
  const domain = getDomainById(concept.domainId);

  const cardContent = (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group uc-card p-4 block
        transition-[box-shadow,border-color] duration-200
        hover:ring-[var(--domain-accent,#2C5F7C)]/40
        hover:shadow-[0_4px_20px_var(--domain-accent-shadow,rgba(44,95,124,0.12))]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-[var(--domain-accent,#2C5F7C)]/60"
      style={{
        '--domain-accent': domainColor,
        '--domain-accent-shadow': `${domainColor}1a`,
      } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {domain && (
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${domain.color}15`,
              color: domain.color,
            }}
          >
            {domain.shortName}
          </span>
        )}
        {concept.hasCalculator && (
          <Calculator className="w-3 h-3" style={{ color: '#E05A1B' }} />
        )}
      </div>
      <h4 className="text-sm font-semibold transition-colors group-hover:text-[#E05A1B]">
        {concept.name}
      </h4>
      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#555555' }}>
        {concept.summary}
      </p>
    </Link>
  )

  if (prefersReduced) {
    return cardContent
  }

  return (
    <motion.div
      variants={relatedCardVariants}
      transition={{ ...SPRING_GENTLE, delay: 0.3 + index * STAGGER_FAST }}
      whileHover={{ scale: 1.015, y: -2, transition: { ...SPRING_SNAPPY } }}
      whileTap={{ scale: 0.98, transition: { ...SPRING_SNAPPY } }}
    >
      {cardContent}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function ConceptDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<DepthTab>("accessible");
  const [mastery, setMastery] = useState<MasteryState | null>(null);
  // Direction of last tab switch: positive = going deeper, negative = going shallower
  const [tabDirection, setTabDirection] = useState<number>(1);
  // Track whether a first-visit pulse should play for current tab
  const [pulseKey, setPulseKey] = useState<number>(0);
  const shouldPulseRef = useRef<boolean>(false);
  // Per-session set of already-visited deeper tabs (keyed by slug+level)
  const visitedDepthsRef = useRef<Set<string>>(new Set());

  const prefersReduced = useReducedMotion();

  const concept = useMemo(() => getConceptBySlug(slug), [slug]);
  const domain = useMemo(
    () => (concept ? getDomainById(concept.domainId) : undefined),
    [concept]
  );

  // Load mastery state
  useEffect(() => {
    setMastery(loadMastery());
  }, []);

  // Record visit when tab changes or page loads
  const recordVisit = useCallback(
    (layer: DepthLevel) => {
      if (!concept) return;
      setMastery((prev) => {
        const current = prev ?? { concepts: [] };
        const updated = recordConceptVisit(current, concept.id, layer);
        saveMastery(updated);
        return updated;
      });
    },
    [concept],
  );

  // Record visit on initial load and tab change
  useEffect(() => {
    if (!concept) return;
    recordVisit(activeTab as DepthLevel);
  }, [concept, activeTab, recordVisit]);

  const highestDepth = mastery && concept ? getHighestDepth(mastery, concept.id) : null;

  const { prevConcept, nextConcept } = useMemo(() => {
    if (!concept) return { prevConcept: null, nextConcept: null };
    const domainConcepts = getConceptsByDomain(concept.domainId);
    const idx = domainConcepts.findIndex((c) => c.id === concept.id);
    return {
      prevConcept: idx > 0 ? domainConcepts[idx - 1] : null,
      nextConcept: idx < domainConcepts.length - 1 ? domainConcepts[idx + 1] : null,
    };
  }, [concept]);

  // Handle tab change: track direction and first-visit pulse
  const handleTabChange = useCallback(
    (tab: DepthTab) => {
      if (tab === activeTab) return;
      const direction = DEPTH_ORDER[tab] - DEPTH_ORDER[activeTab];
      setTabDirection(direction);

      // First-visit pulse for deeper tabs (Intermediate or Advanced)
      if (tab === "intermediate" || tab === "advanced") {
        const visitKey = `${slug}-${tab}`;
        let isFirstVisit = false;
        // Check session-level memory first
        if (!visitedDepthsRef.current.has(visitKey)) {
          isFirstVisit = true;
          visitedDepthsRef.current.add(visitKey);
        }
        // Check localStorage for cross-session memory
        if (isFirstVisit) {
          try {
            const stored = localStorage.getItem(`depth_visited_${visitKey}`);
            if (stored) {
              isFirstVisit = false;
            } else {
              localStorage.setItem(`depth_visited_${visitKey}`, "1");
            }
          } catch {
            // Private browsing or quota exceeded -- treat as first visit
          }
        }
        shouldPulseRef.current = isFirstVisit && !prefersReduced;
        if (isFirstVisit && !prefersReduced) {
          setPulseKey((k) => k + 1);
        }
      } else {
        shouldPulseRef.current = false;
      }

      setActiveTab(tab);
    },
    [activeTab, slug, prefersReduced],
  );

  if (!concept || !domain) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-[960px] mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Concept not found</h1>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 transition-colors"
            style={{ color: '#E05A1B' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4"
      // Domain hue wash: very subtle radial gradient anchored top-right
      style={{
        background: `radial-gradient(ellipse at 60% 0%, ${domain.color}0d 0%, transparent 60%), #F5EDE0`,
      }}
    >
      <div className="max-w-[960px] mx-auto">

        {/* ---------------------------------------------------------------- */}
        {/* Breadcrumb -- appears instantly (no stagger, informational only) */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0 }}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: '#555555' }}
        >
          <Link
            href="/explore"
            className="transition-colors hover:opacity-80"
            style={{ color: '#555555' }}
          >
            Explore
          </Link>
          <span>/</span>
          <Link
            href={`/explore/${domain.slug}`}
            className="transition-colors hover:opacity-80"
            style={{ color: domain.color }}
          >
            {domain.shortName}
          </Link>
          <span>/</span>
          <span style={{ color: '#1A1A1A' }} className="truncate">{concept.name}</span>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Hero -- domain badge, title, summary                             */}
        {/* Badge-then-title sequence within the hero block                  */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : heroVariants.hidden}
          animate={heroVariants.visible}
          className="mb-8"
          aria-label={`Concept: ${concept.name}. Domain: ${domain.name}. Depth: ${highestDepth ? DEPTH_LABELS[highestDepth] : 'not started'}.`}
        >
          {/* Domain badge row */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <span
              className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${domain.color}15`,
                color: domain.color,
              }}
            >
              {domain.shortName}
            </span>
            {concept.hasCalculator && (
              <span
                className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded inline-flex items-center gap-1"
                style={{ backgroundColor: 'rgba(224,90,27,0.1)', color: '#E05A1B' }}
              >
                <Calculator className="w-3 h-3" /> Calculator Available
              </span>
            )}
            {highestDepth && (
              <span
                className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded inline-flex items-center gap-1"
                style={{ backgroundColor: 'rgba(224,90,27,0.1)', color: '#E05A1B' }}
              >
                <CheckCircle2 className="w-3 h-3" /> {DEPTH_LABELS[highestDepth]}
              </span>
            )}
          </motion.div>

          {/* Concept title */}
          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.05 }}
            className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3"
            style={{ color: '#1A1A1A' }}
          >
            {concept.name}
          </motion.h1>

          {/* Summary */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.12 }}
            className="leading-relaxed"
            style={{ color: '#555555' }}
          >
            {concept.summary}
          </motion.p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Depth Tabs                                                        */}
        {/* ---------------------------------------------------------------- */}
        <motion.nav
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.2 }}
          aria-label="Concept depth tabs"
          className="mb-2"
        >
          {/* Tab bar with shared-layout pill indicator */}
          <div
            className="flex gap-1 rounded-xl p-1 overflow-x-auto"
            style={{
              backgroundColor: 'rgba(196,166,122,0.15)',
              borderBottom: '1px solid rgba(196,166,122,0.3)',
            }}
            role="tablist"
            aria-label="Depth level"
          >
            {(Object.keys(depthConfig) as DepthTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <motion.button
                  key={tab}
                  role="tab"
                  id={`tab-${tab}`}
                  aria-selected={isActive}
                  aria-controls={`depth-panel-${tab}`}
                  onClick={() => handleTabChange(tab)}
                  whileHover={prefersReduced ? {} : { y: -1, transition: { ...SPRING_SNAPPY } }}
                  whileTap={prefersReduced ? {} : { scale: 0.96, transition: { ...SPRING_SNAPPY } }}
                  className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium
                    min-h-[44px] min-w-[80px]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--domain-accent,#2C5F7C)]/50
                    transition-colors duration-100"
                  style={{
                    color: isActive
                      ? (domain?.color ?? '#2C5F7C')
                      : undefined,
                    '--domain-accent': domain?.color,
                  } as React.CSSProperties}
                >
                  {/* Shared-layout background pill (active indicator) */}
                  {isActive && !prefersReduced && (
                    <motion.span
                      layoutId={`tab-indicator-${slug}`}
                      className="absolute inset-0 rounded-lg"
                      style={{
                        zIndex: 0,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0_1px_4px_rgba(44,95,124,0.14)',
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      aria-label={`Currently viewing ${depthConfig[tab].label} level`}
                    />
                  )}
                  {/* Non-animated indicator for reduced motion */}
                  {isActive && prefersReduced && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        zIndex: 0,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 1px 4px rgba(44,95,124,0.14)',
                      }}
                    />
                  )}
                  {/* Tab icon and label sit above the indicator */}
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0.65 }}
                    transition={{ duration: 0.12 }}
                    className="relative z-10 flex items-center gap-2"
                  >
                    {depthConfig[tab].icon}
                    <span
                      className={`hidden sm:inline ${isActive ? "font-semibold" : "font-medium"}`}
                      style={{ color: isActive ? (domain?.color ?? '#2C5F7C') : '#555555' }}
                    >
                      {depthConfig[tab].label}
                    </span>
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        </motion.nav>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_GENTLE, delay: 0.22 }}
          className="text-xs mb-4"
          style={{ color: '#555555' }}
        >
          {depthConfig[activeTab].description}
        </motion.p>

        {/* Live region for screen reader announcements on tab change */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          Showing {depthConfig[activeTab].label} depth for {concept.name}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main content body                                                 */}
        {/* ---------------------------------------------------------------- */}
        <motion.div layout className="mb-8">
          <AnimatePresence
            mode="wait"
            custom={tabDirection}
          >
            <motion.div
              key={activeTab}
              custom={tabDirection}
              variants={prefersReduced ? tabContentVariantsReduced : tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              role="tabpanel"
              id={`depth-panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="uc-card p-6 sm:p-8 border-l-2"
              style={{
                borderLeftColor: `${domain.color}4d`,
              }}
            >
              {/* First-visit pulse wrapper: re-keyed on pulseKey to replay */}
              <motion.div
                key={pulseKey}
                animate={
                  shouldPulseRef.current && !prefersReduced
                    ? { scale: [1, 1.015, 1] }
                    : {}
                }
                transition={
                  shouldPulseRef.current && !prefersReduced
                    ? { duration: 0.35, delay: 0.15, ease: "easeOut" }
                    : {}
                }
                onAnimationComplete={() => {
                  shouldPulseRef.current = false;
                }}
              >
                {/* Heading inside tab content */}
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING_GENTLE, delay: 0.05 }}
                >
                  {concept.layers[activeTab].split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-relaxed mb-4 last:mb-0"
                      style={{ color: '#555555' }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Honest Analysis                                                   */}
        {/* ---------------------------------------------------------------- */}
        {concept.honestAnalysis && (
          <motion.div
            initial={prefersReduced ? false : sectionVariants.hidden}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.38 }}
            className="uc-section p-5 sm:p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4" style={{ color: '#C4A67A' }} />
              <h3 className="text-sm font-semibold" style={{ color: '#F5EDE0' }}>Honest Analysis</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#F5EDE0', opacity: 0.85 }}>
              {concept.honestAnalysis}
            </p>
          </motion.div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Related Concepts -- cascade last                                  */}
        {/* ---------------------------------------------------------------- */}
        {concept.relatedConceptSlugs.length > 0 && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.46 }}
            className="mb-8"
          >
            <h3
              className="text-label mb-3"
              style={{ color: domain.color }}
            >
              Related Concepts
            </h3>
            <motion.div
              variants={prefersReduced ? undefined : relatedContainerVariants}
              initial={prefersReduced ? false : "hidden"}
              animate={prefersReduced ? undefined : "visible"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {concept.relatedConceptSlugs.map((relSlug, index) => (
                <RelatedConceptCard
                  key={relSlug}
                  slug={relSlug}
                  index={index}
                  prefersReduced={prefersReduced ?? false}
                  domainColor={domain.color}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Ask CTA                                                           */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.54 }}
          className="uc-card p-5 text-center"
        >
          <p className="text-sm mb-3" style={{ color: '#555555' }}>
            Want to run the numbers for your situation?
          </p>
          <Link
            href={`/ask?topic=${encodeURIComponent(concept.name)}`}
            className="uc-button uc-button-primary inline-flex items-center gap-2"
          >
            Ask Uncommon Cents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom nav                                                        */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_GENTLE, delay: 0.6 }}
          className="mt-8 pt-6 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(196,166,122,0.3)' }}
        >
          <div className="flex flex-col gap-2">
            <Link
              href={`/explore/${domain.slug}`}
              className="text-sm inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: '#555555' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {domain.shortName}
            </Link>
            {prevConcept && (
              <Link
                href={`/concepts/${prevConcept.slug}`}
                className="text-sm inline-flex items-center gap-1 transition-colors"
                style={{ color: '#E05A1B' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {prevConcept.name}
              </Link>
            )}
          </div>
          {nextConcept && (
            <Link
              href={`/concepts/${nextConcept.slug}`}
              className="text-sm inline-flex items-center gap-1 transition-colors"
              style={{ color: '#E05A1B' }}
            >
              {nextConcept.name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
