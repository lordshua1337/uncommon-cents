"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
      className="group bg-surface rounded-xl ring-1 ring-zinc-200/60 dark:ring-zinc-700/60 p-4 block
        transition-[box-shadow,border-color] duration-200
        hover:ring-[var(--domain-accent,#16A34A)]/40
        hover:shadow-[0_4px_20px_var(--domain-accent-shadow,rgba(22,163,74,0.10))]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-[var(--domain-accent,#16A34A)]/60"
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
          <Calculator className="w-3 h-3 text-accent" />
        )}
      </div>
      <h4 className="text-sm font-semibold group-hover:text-accent transition-colors">
        {concept.name}
      </h4>
      <p className="text-xs text-text-secondary mt-1 line-clamp-2">
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

  if (!concept || !domain) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Concept not found</h1>
          <Link
            href="/explore"
            className="text-accent hover:text-accent-light transition-colors inline-flex items-center gap-1"
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
        background: `radial-gradient(ellipse at 60% 0%, ${domain.color}0d 0%, transparent 60%), var(--color-background)`,
      }}
    >
      <div className="max-w-3xl mx-auto">

        {/* ---------------------------------------------------------------- */}
        {/* Breadcrumb -- appears instantly (no stagger, informational only) */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0 }}
          className="flex items-center gap-2 text-sm text-text-muted mb-6"
        >
          <Link
            href="/explore"
            className="hover:text-text-secondary transition-colors"
          >
            Explore
          </Link>
          <span>/</span>
          <Link
            href={`/explore/${domain.slug}`}
            className="hover:text-text-secondary transition-colors"
            style={{ color: domain.color }}
          >
            {domain.shortName}
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate">{concept.name}</span>
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
              <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded bg-accent-bg text-accent inline-flex items-center gap-1">
                <Calculator className="w-3 h-3" /> Calculator Available
              </span>
            )}
            {highestDepth && (
              <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded bg-accent/10 text-accent inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {DEPTH_LABELS[highestDepth]}
              </span>
            )}
          </motion.div>

          {/* Concept title */}
          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.05 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
          >
            {concept.name}
          </motion.h1>

          {/* Summary */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.12 }}
            className="text-text-secondary leading-relaxed"
          >
            {concept.summary}
          </motion.p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Depth Tabs                                                        */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.2 }}
          className="flex gap-1 bg-surface rounded-xl border border-border p-1 mb-6"
        >
          {(Object.keys(depthConfig) as DepthTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent/60
                ${
                  activeTab === tab
                    ? "bg-accent text-white shadow-sm"
                    : "text-text-muted hover:text-text-secondary hover:bg-surface-alt"
                }`}
            >
              {depthConfig[tab].icon}
              <span className="hidden sm:inline">{depthConfig[tab].label}</span>
            </button>
          ))}
        </motion.div>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_GENTLE, delay: 0.22 }}
          className="text-xs text-text-muted mb-4"
        >
          {depthConfig[activeTab].description}
        </motion.p>

        {/* ---------------------------------------------------------------- */}
        {/* Main content body                                                 */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={prefersReduced ? false : sectionVariants.hidden}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.3 }}
          className="bg-surface rounded-xl border border-border p-6 sm:p-8 mb-8"
        >
          {concept.layers[activeTab].split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-text-secondary leading-relaxed mb-4 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Honest Analysis                                                   */}
        {/* ---------------------------------------------------------------- */}
        {concept.honestAnalysis && (
          <motion.div
            initial={prefersReduced ? false : sectionVariants.hidden}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.38 }}
            className="bg-surface-alt rounded-xl border border-border p-5 sm:p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-semibold">Honest Analysis</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
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
              className="text-sm font-medium tracking-widest uppercase mb-3"
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
          className="bg-surface rounded-xl border border-border p-5 text-center"
        >
          <p className="text-sm text-text-secondary mb-3">
            Want to run the numbers for your situation?
          </p>
          <Link
            href={`/ask?topic=${encodeURIComponent(concept.name)}`}
            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg
              hover:bg-accent-light transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/60"
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
          className="mt-8 pt-6 border-t border-border-light flex items-center justify-between"
        >
          <div className="flex flex-col gap-2">
            <Link
              href={`/explore/${domain.slug}`}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to {domain.shortName}
            </Link>
            {prevConcept && (
              <Link
                href={`/concepts/${prevConcept.slug}`}
                className="text-sm text-accent hover:text-accent-light transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {prevConcept.name}
              </Link>
            )}
          </div>
          {nextConcept && (
            <Link
              href={`/concepts/${nextConcept.slug}`}
              className="text-sm text-accent hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              {nextConcept.name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
