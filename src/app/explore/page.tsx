"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Calculator,
  TrendingUp,
  Home,
  Briefcase,
  Sunset,
  BarChart3,
  Shield,
  Umbrella,
  CreditCard,
  Brain,
  GraduationCap,
  Globe,
  Compass,
} from "lucide-react";
import { domains, type Domain } from "@/lib/domains";
import { concepts, searchConcepts, getConceptsByDomain } from "@/lib/concepts";
import {
  loadMastery,
  getDomainMastery,
  getOverallMastery,
  type MasteryState,
  type DomainMastery,
} from "@/lib/mastery";
import { DomainCardAnimated } from "@/components/domain-card-animated";
import { SPRING_GENTLE } from "@/lib/animation-constants";

// ---------------------------------------------------------------------------
// Icon map (unchanged from original)
// ---------------------------------------------------------------------------

const iconMap: Record<string, React.ReactNode> = {
  PiggyBank: <PiggyBank className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Sunset: <Sunset className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Umbrella: <Umbrella className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
};

// ---------------------------------------------------------------------------
// ConceptResult (unchanged from original)
// ---------------------------------------------------------------------------

function ConceptResult({
  concept,
}: {
  concept: (typeof concepts)[0];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const domain = domains.find((d) => d.id === concept.domainId);

  return (
    <div
      className="uc-card overflow-hidden"
      style={{ boxShadow: "0 2px 8px rgba(44,95,124,0.08)" }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {domain && (
              <span
                className="text-label px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${domain.color}15`,
                  color: domain.color,
                }}
              >
                {domain.shortName}
              </span>
            )}
            {concept.hasCalculator && (
              <span
                className="text-label px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "rgba(44,95,124,0.10)",
                  color: "#2C5F7C",
                }}
              >
                Calculator
              </span>
            )}
          </div>
          <h4 className="text-sm font-heading font-bold">{concept.name}</h4>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "#555555" }}>
            {concept.summary}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1" style={{ color: "#C4A67A" }}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className="px-4 pb-4 pt-3 animate-fade-in"
          style={{ borderTop: "1px solid rgba(196,166,122,0.3)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
            {concept.layers.accessible}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href={`/concepts/${concept.slug}`}
              className="text-xs font-medium transition-colors inline-flex items-center gap-1"
              style={{ color: "#E05A1B" }}
            >
              Read full entry <ArrowRight className="w-3 h-3" />
            </Link>
            {concept.relatedConceptSlugs.length > 0 && (
              <span className="text-xs" style={{ color: "#C4A67A" }}>
                {concept.relatedConceptSlugs.length} related
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DomainGrid -- isolated so Framer staggerChildren fires fresh on each mount
// ---------------------------------------------------------------------------

interface DomainGridProps {
  readonly domains: Domain[];
  readonly domainConceptCounts: Record<string, number>;
  readonly domainMasteries: Record<string, DomainMastery>;
}

// Container variants: stagger children with 0.04s gap, 0.1s lead delay
const gridContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

function DomainGrid({
  domains: domainList,
  domainConceptCounts,
  domainMasteries,
}: DomainGridProps) {
  return (
    <motion.div
      variants={gridContainerVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      role="list"
      aria-label="Financial domains"
    >
      {domainList.map((domain, i) => {
        const mastery = domainMasteries[domain.id] ?? null;
        const conceptCount = domainConceptCounts[domain.id] ?? 0;
        const completedCount = mastery?.visitedConcepts ?? 0;

        return (
          <div key={domain.id} role="listitem">
            <DomainCardAnimated
              name={domain.shortName}
              description={domain.description}
              conceptCount={conceptCount}
              completedCount={completedCount}
              accentColor={domain.color}
              href={`/explore/${domain.slug}`}
              index={i}
              icon={iconMap[domain.icon]}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ExplorePage
// ---------------------------------------------------------------------------

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [masteryState, setMasteryState] = useState<MasteryState | null>(null);

  useEffect(() => {
    setMasteryState(loadMastery());
  }, []);

  const domainConceptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const domain of domains) {
      counts[domain.id] = getConceptsByDomain(domain.id).length;
    }
    return counts;
  }, []);

  const domainMasteries = useMemo(() => {
    if (!masteryState) return {} as Record<string, DomainMastery>;
    const result: Record<string, DomainMastery> = {};
    for (const domain of domains) {
      result[domain.id] = getDomainMastery(masteryState, domain.id);
    }
    return result;
  }, [masteryState]);

  const overall = useMemo(() => {
    if (!masteryState) return null;
    return getOverallMastery(masteryState);
  }, [masteryState]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchConcepts(searchQuery.trim());
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length >= 2;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">

        {/* Page header: fades in first, before the card cascade */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_GENTLE}
          className="text-center mb-8"
        >
          <p
            className="text-label uppercase tracking-widest font-medium mb-2"
            style={{ color: "#E05A1B" }}
          >
            Financial Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-[800] mb-3" style={{ color: "#1A1A1A" }}>
            Every money concept you need to know.
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "#555555" }}>
            132 concepts across 14 domains. Start anywhere.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.08 }}
          className="relative max-w-md mx-auto mb-10"
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#C4A67A" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, strategies, accounts..."
            className="w-full bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              color: "#1A1A1A",
              border: "1px solid rgba(196,166,122,0.3)",
              boxShadow: "0 2px 8px rgba(44,95,124,0.06)",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
              style={{ color: "#C4A67A" }}
            >
              Clear
            </button>
          )}
        </motion.div>

        {/* Search results OR domain grid */}
        {isSearching ? (
          <div>
            <p className="text-xs mb-4" style={{ color: "#C4A67A" }}>
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} for &ldquo;
              {searchQuery}&rdquo;
            </p>
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((concept) => (
                  <ConceptResult key={concept.id} concept={concept} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12" style={{ color: "#C4A67A" }}>
                <p className="text-sm">
                  No concepts found. Try a different search term.
                </p>
              </div>
            )}
          </div>
        ) : (
          <DomainGrid
            domains={domains}
            domainConceptCounts={domainConceptCounts}
            domainMasteries={domainMasteries}
          />
        )}

        {/* Stats bar */}
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_GENTLE, delay: 0.8 }}
            className="mt-8 uc-card p-6 card-hover"
            style={{ boxShadow: "0 4px 16px rgba(44,95,124,0.10)" }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-heading font-[800]" style={{ color: "#E05A1B" }}>
                  {domains.length}
                </p>
                <p className="text-xs mt-1" style={{ color: "#C4A67A" }}>Domains</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-[800]" style={{ color: "#E05A1B" }}>
                  {concepts.length}
                </p>
                <p className="text-xs mt-1" style={{ color: "#C4A67A" }}>Concepts</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-[800]" style={{ color: "#E05A1B" }}>
                  {overall ? overall.visitedConcepts : 0}
                </p>
                <p className="text-xs mt-1" style={{ color: "#C4A67A" }}>Explored</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-[800]" style={{ color: "#E05A1B" }}>
                  {overall ? `${overall.overallPercent}%` : "0%"}
                </p>
                <p className="text-xs mt-1" style={{ color: "#C4A67A" }}>Mastery</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom links */}
        {!isSearching && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/calculators"
              className="text-sm font-medium transition-colors inline-flex items-center gap-1"
              style={{ color: "#E05A1B" }}
            >
              Run the numbers with calculators
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/learn"
              className="text-sm font-medium transition-colors inline-flex items-center gap-1"
              style={{ color: "#E05A1B" }}
            >
              Deep dive strategies
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
