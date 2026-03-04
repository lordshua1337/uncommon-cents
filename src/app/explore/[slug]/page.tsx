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
  Compass,
} from "lucide-react";
import { getDomainBySlug, type Domain } from "@/lib/domains";
import { getConceptsByDomain, type FinancialConcept } from "@/lib/concepts";
import {
  getExpansionCardByDomain,
  type ExpansionCard,
} from "@/lib/expansion-cards-data";

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
  Compass: <Compass className="w-6 h-6" />,
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

function ExpansionCardBlock({ card }: { card: ExpansionCard }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface rounded-xl border-2 border-accent/20 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-bg text-accent font-medium">
              Expansion Pack
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">
              Advanced Play
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1">{card.title}</h3>
          <p className="text-sm text-text-muted italic">{card.tagline}</p>
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
        <div className="px-5 pb-5 border-t border-border-light pt-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              Core mechanic
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {card.coreMechanic}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              Why this is uncommon
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {card.whyUncommon}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Execution notes
            </p>
            <ul className="space-y-1.5">
              {card.executionNotes.map((note, i) => (
                <li
                  key={i}
                  className="text-sm text-text-secondary leading-relaxed flex items-start gap-2"
                >
                  <span className="text-accent font-semibold text-xs mt-0.5">
                    {i + 1}.
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red/5 rounded-lg p-3">
            <p className="text-xs font-medium text-red uppercase tracking-wider mb-1">
              Failure mode
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {card.failureMode}
            </p>
          </div>

          {card.behavioralLink && (
            <div className="bg-accent-bg rounded-lg p-3">
              <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
                Behavioral link
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {card.behavioralLink}
              </p>
            </div>
          )}

          {card.legalBasis.length > 0 && (
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                Sources
              </p>
              <div className="space-y-1">
                {card.legalBasis.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-accent hover:text-accent-light transition-colors"
                  >
                    {ref.authority}: {ref.reference}
                  </a>
                ))}
              </div>
            </div>
          )}
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
  const expansionCard = useMemo(
    () => (domain ? getExpansionCardByDomain(domain.id) : undefined),
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

        {expansionCard && (
          <div className="mt-8">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-3">
              Advanced Play
            </p>
            <ExpansionCardBlock card={expansionCard} />
          </div>
        )}

        <div className="divider-financial mt-10 mb-6" />
        <div className="flex items-center justify-between">
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
