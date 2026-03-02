"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  Calculator,
  PiggyBank,
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
} from "lucide-react";
import { getDomainBySlug, type Domain } from "@/lib/domains";
import { getConceptsByDomain, type FinancialConcept } from "@/lib/concepts";

const iconMap: Record<string, React.ReactNode> = {
  PiggyBank: <PiggyBank className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Sunset: <Sunset className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Umbrella: <Umbrella className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
};

const complexityLabels = ["", "Beginner", "Intermediate", "Advanced"];

function ConceptCard({ concept }: { concept: FinancialConcept }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-alt text-text-muted">
              {complexityLabels[concept.complexityMin]}
            </span>
            {concept.hasCalculator && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-bg text-accent">
                Calculator
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold mb-1">{concept.name}</h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
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
        <div className="px-5 pb-5 border-t border-border-light pt-4 animate-fade-in">
          <p className="text-sm text-text-secondary leading-relaxed">
            {concept.layers.accessible}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link
              href={`/concepts/${concept.slug}`}
              className="text-accent text-sm font-medium hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              Read full entry <ArrowRight className="w-3.5 h-3.5" />
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

export default function DomainDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [searchQuery, setSearchQuery] = useState("");

  const domain = useMemo(() => getDomainBySlug(slug), [slug]);
  const concepts = useMemo(
    () => (domain ? getConceptsByDomain(domain.id) : []),
    [domain]
  );

  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return concepts;
    const q = searchQuery.toLowerCase();
    return concepts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
    );
  }, [concepts, searchQuery]);

  if (!domain) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Domain not found</h1>
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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/explore"
          className="text-sm text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Domains
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${domain.color}15`,
                color: domain.color,
              }}
            >
              {iconMap[domain.icon]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {domain.shortName}
              </h1>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            {domain.description}
          </p>
          <p className="text-xs text-text-muted mt-2">
            {concepts.length} {concepts.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {concepts.length > 3 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search within ${domain.shortName}...`}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        )}

        {filteredConcepts.length > 0 ? (
          <div className="space-y-3">
            {filteredConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p className="text-sm">
              {searchQuery
                ? "No matching concepts found."
                : "No concepts in this domain yet. Check back soon."}
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border-light flex items-center justify-between">
          <Link
            href="/explore"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Domains
          </Link>
          <Link
            href="/ask"
            className="text-sm text-accent hover:text-accent-light transition-colors inline-flex items-center gap-1"
          >
            Ask Uncommon Cents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
