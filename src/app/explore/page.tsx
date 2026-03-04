"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
import { loadMastery, getDomainMastery, getOverallMastery, type MasteryState, type DomainMastery } from "@/lib/mastery";

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

function DomainCard({
  domain,
  conceptCount,
  mastery,
}: {
  domain: Domain;
  conceptCount: number;
  mastery: DomainMastery | null;
}) {
  const visited = mastery?.visitedConcepts ?? 0;
  const percent = mastery?.masteryPercent ?? 0;

  return (
    <Link
      href={`/explore/${domain.slug}`}
      className="group bg-surface rounded-xl border border-border p-5 card-hover block relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: domain.color }}
      />

      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${domain.color}15`, color: domain.color }}
        >
          {iconMap[domain.icon]}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-tight group-hover:text-accent transition-colors">
            {domain.shortName}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {visited}/{conceptCount} explored
          </p>
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
        {domain.description}
      </p>

      {/* Mastery progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-muted font-medium">
            {percent}% mastery
          </span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: domain.color,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-accent text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

function ConceptResult({
  concept,
}: {
  concept: (typeof concepts)[0];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const domain = domains.find((d) => d.id === concept.domainId);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {domain && (
              <span
                className="text-[10px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${domain.color}15`,
                  color: domain.color,
                }}
              >
                {domain.shortName}
              </span>
            )}
            {concept.hasCalculator && (
              <span className="text-[10px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded bg-accent-bg text-accent">
                Calculator
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold">{concept.name}</h4>
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {concept.summary}
          </p>
        </div>
        <div className="text-text-muted flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border-light pt-3 animate-fade-in">
          <p className="text-sm text-text-secondary leading-relaxed">
            {concept.layers.accessible}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href={`/concepts/${concept.slug}`}
              className="text-accent text-xs font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              Read full entry <ArrowRight className="w-3 h-3" />
            </Link>
            {concept.relatedConceptSlugs.length > 0 && (
              <span className="text-xs text-text-muted">
                {concept.relatedConceptSlugs.length} related
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    if (!masteryState) return {};
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
            Financial Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Explore</h1>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            {domains.length} domains covering taxes, investing, retirement, real estate, and
            more. Every concept at three depth levels with honest analysis.
          </p>
        </div>

        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, strategies, accounts..."
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {isSearching ? (
          <div>
            <p className="text-xs text-text-muted mb-4">
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
              <div className="text-center py-12 text-text-muted">
                <p className="text-sm">
                  No concepts found. Try a different search term.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                conceptCount={domainConceptCounts[domain.id] || 0}
                mastery={domainMasteries[domain.id] ?? null}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {!isSearching && (
          <div className="mt-8 bg-surface border border-border rounded-xl p-6 card-hover">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-accent">{domains.length}</p>
                <p className="text-xs text-text-muted mt-1">Domains</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-accent">{concepts.length}</p>
                <p className="text-xs text-text-muted mt-1">Concepts</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-accent">
                  {overall ? overall.visitedConcepts : 0}
                </p>
                <p className="text-xs text-text-muted mt-1">Explored</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-accent">
                  {overall ? `${overall.overallPercent}%` : "0%"}
                </p>
                <p className="text-xs text-text-muted mt-1">Mastery</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom links */}
        {!isSearching && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/calculators"
              className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              Run the numbers with calculators
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/learn"
              className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
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
