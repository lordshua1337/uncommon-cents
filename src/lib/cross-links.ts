// Cross-Links Engine -- connects concepts to simulators, defenses, scripts, expansion cards

import { concepts, type FinancialConcept } from "@/lib/concepts";
import { ALL_SCENARIOS } from "@/lib/simulator/scenarios";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LinkTarget =
  | { type: "concept"; slug: string; name: string }
  | { type: "simulator"; slug: string; name: string }
  | { type: "calculator"; slug: string; name: string }
  | { type: "defense"; slug: string; name: string };

export interface CrossLink {
  readonly from: { type: string; id: string };
  readonly to: LinkTarget;
  readonly reason: string;
}

// ---------------------------------------------------------------------------
// Static link map (concept -> related resources)
// ---------------------------------------------------------------------------

const CONCEPT_SIMULATOR_MAP: Record<string, string[]> = {
  "roth-conversion-ladder": ["roth-conversion"],
  "roth-ira": ["roth-conversion"],
  "traditional-ira": ["roth-conversion"],
  "rent-vs-buy": ["rent-vs-buy"],
  "mortgage-strategies": ["rent-vs-buy"],
  "debt-avalanche": ["debt-payoff"],
  "debt-snowball": ["debt-payoff"],
  "hsa-triple-advantage": ["hsa-vs-traditional"],
  "hsa": ["hsa-vs-traditional"],
  "fire-movement": ["early-retirement"],
  "early-retirement": ["early-retirement"],
  "4-percent-rule": ["early-retirement"],
  "tax-loss-harvesting": ["tax-loss-harvest"],
};

// ---------------------------------------------------------------------------
// Get cross-links for a concept
// ---------------------------------------------------------------------------

export function getConceptCrossLinks(conceptSlug: string): readonly CrossLink[] {
  const concept = concepts.find((c) => c.slug === conceptSlug);
  if (!concept) return [];

  const links: CrossLink[] = [];

  // Related concepts
  for (const relatedSlug of concept.relatedConceptSlugs ?? []) {
    const related = concepts.find((c) => c.slug === relatedSlug);
    if (related) {
      links.push({
        from: { type: "concept", id: concept.id },
        to: { type: "concept", slug: related.slug, name: related.name },
        reason: "Related concept",
      });
    }
  }

  // Related simulators
  const simSlugs = CONCEPT_SIMULATOR_MAP[conceptSlug] ?? [];
  for (const simSlug of simSlugs) {
    const scenario = ALL_SCENARIOS.find((s) => s.slug === simSlug);
    if (scenario) {
      links.push({
        from: { type: "concept", id: concept.id },
        to: { type: "simulator", slug: scenario.slug, name: scenario.title },
        reason: "Run the numbers",
      });
    }
  }

  return links;
}

// ---------------------------------------------------------------------------
// Search engine -- unified search across all content types
// ---------------------------------------------------------------------------

export interface SearchResult {
  readonly type: "concept" | "simulator" | "strategy";
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly score: number;
}

export function searchAll(query: string): readonly SearchResult[] {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search concepts
  for (const concept of concepts) {
    let score = 0;
    if (concept.name.toLowerCase().includes(q)) score += 10;
    if (concept.slug.includes(q)) score += 5;
    if (concept.summary.toLowerCase().includes(q)) score += 3;
    if (score > 0) {
      results.push({
        type: "concept",
        title: concept.name,
        description: concept.summary.slice(0, 120),
        href: `/concepts/${concept.slug}`,
        score,
      });
    }
  }

  // Search simulators
  for (const scenario of ALL_SCENARIOS) {
    let score = 0;
    if (scenario.title.toLowerCase().includes(q)) score += 10;
    if (scenario.slug.includes(q)) score += 5;
    if (scenario.description.toLowerCase().includes(q)) score += 3;
    if (score > 0) {
      results.push({
        type: "simulator",
        title: scenario.title,
        description: scenario.description.slice(0, 120),
        href: `/simulator/${scenario.slug}`,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 20);
}
