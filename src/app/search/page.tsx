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
  concept: { icon: BookOpen, color: "text-[#2C5F7C]", label: "Concept" },
  simulator: { icon: Calculator, color: "text-[#C4A67A]", label: "Simulator" },
  strategy: { icon: Layers, color: "text-[#1E3F2E]", label: "Strategy" },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchAll(query), [query]);

  return (
    <div className="min-h-screen linen-texture pt-20 pb-16 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="p-2 rounded-lg transition-colors hover:bg-white/60"
            style={{ color: "#555555" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-semibold flex items-center gap-2" style={{ color: "#1A1A1A" }}>
              <Search className="w-5 h-5" style={{ color: "#E05A1B" }} />
              Search
            </h1>
            <p className="text-xs" style={{ color: "#555555" }}>
              Find concepts, simulators, and strategies
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#555555" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything..."
            className="w-full bg-white border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors"
            style={{
              borderColor: "rgba(196,166,122,0.3)",
              color: "#1A1A1A",
              boxShadow: "0 2px 12px rgba(44,95,124,0.06)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(224,90,27,0.4)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,166,122,0.3)";
            }}
            autoFocus
          />
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="space-y-2">
            <p className="text-xs mb-3" style={{ color: "#555555" }}>
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((result) => {
              const config = TYPE_CONFIG[result.type];
              const Icon = config.icon;
              return (
                <Link
                  key={`${result.type}_${result.href}`}
                  href={result.href}
                  className="block uc-card p-4 transition-all hover:shadow-md"
                  style={{
                    border: "1px solid rgba(196,166,122,0.2)",
                    boxShadow: "0 2px 8px rgba(44,95,124,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(224,90,27,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,166,122,0.2)";
                  }}
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
                      <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{result.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#555555" }}>
                        {result.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {results.length === 0 && (
              <div
                className="uc-card p-8 text-center"
                style={{ border: "1px solid rgba(196,166,122,0.2)" }}
              >
                <p className="text-sm" style={{ color: "#555555" }}>
                  No results found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div
            className="uc-card p-8 text-center"
            style={{
              border: "1px solid rgba(196,166,122,0.2)",
              boxShadow: "0 2px 12px rgba(44,95,124,0.06)",
            }}
          >
            <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "#555555" }} />
            <p className="text-sm" style={{ color: "#555555" }}>
              Type at least 2 characters to search across all content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
