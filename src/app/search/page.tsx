"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Calculator,
  Layers,
} from "lucide-react";
import { searchAll, type SearchResult } from "@/lib/cross-links";

// ---------------------------------------------------------------------------
// Result type icons
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  SearchResult["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  concept: { icon: BookOpen, color: "text-blue-400", label: "Concept" },
  simulator: { icon: Calculator, color: "text-amber-400", label: "Simulator" },
  strategy: { icon: Layers, color: "text-green-400", label: "Strategy" },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchAll(query), [query]);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-accent" />
              Search
            </h1>
            <p className="text-xs text-text-secondary">
              Find concepts, simulators, and strategies
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything..."
            className="w-full bg-surface border border-border-light rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            autoFocus
          />
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="space-y-2">
            <p className="text-xs text-text-secondary mb-3">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((result) => {
              const config = TYPE_CONFIG[result.type];
              const Icon = config.icon;
              return (
                <Link
                  key={`${result.type}_${result.href}`}
                  href={result.href}
                  className="block bg-surface border border-border-light rounded-xl p-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-medium ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {results.length === 0 && (
              <div className="bg-surface border border-border-light rounded-xl p-8 text-center">
                <p className="text-sm text-text-secondary">
                  No results found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="bg-surface border border-border-light rounded-xl p-8 text-center">
            <Search className="w-8 h-8 text-text-secondary mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              Type at least 2 characters to search across all content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
