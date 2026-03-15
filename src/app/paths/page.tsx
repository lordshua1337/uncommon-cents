import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import JourneyMap from "@/components/life-stages/journey-map";
import { lifeStages } from "@/lib/life-stages/stages";
import type { StageNodeData } from "@/components/life-stages/stage-node";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Your Money Journey | Uncommon Cents",
  description:
    "Eight life stages. Each one teaches you what you need, exactly when you need it. Pick your stage and get the real financial playbook.",
};

// ---------------------------------------------------------------------------
// Data helpers (server-side, no async needed -- static data)
// ---------------------------------------------------------------------------

function buildStageNodeData(): readonly StageNodeData[] {
  return lifeStages.map((stage) => ({
    id: stage.id,
    slug: stage.slug,
    title: stage.title,
    tagline: stage.tagline,
    accentColor: stage.accentColor,
    accentColorLight: stage.accentColorLight,
    icon: stage.icon,
    lessonCount: stage.lessons.length,
    // completedCount starts at 0 here -- JourneyMap hydrates from localStorage
    completedCount: 0,
    estimatedMinutes: stage.estimatedMinutes,
  }));
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "var(--color-accent-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <BookOpen style={{ width: "24px", height: "24px", color: "var(--color-accent)" }} />
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "8px",
        }}
      >
        No stages yet
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted)",
          maxWidth: "320px",
        }}
      >
        Check back soon -- stages are being added.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PathsPage() {
  let stages: readonly StageNodeData[];

  try {
    stages = buildStageNodeData();
  } catch {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
              Unable to load your learning paths. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen paper-texture"
      style={{ background: "var(--color-background)" }}
    >
      {/* Hero banner */}
      <div
        style={{
          width: "100%",
          minHeight: "200px",
          paddingTop: "112px",
          paddingBottom: "64px",
          paddingLeft: "16px",
          paddingRight: "16px",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,163,74,0.06) 0%, transparent 70%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Overline */}
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "12px",
          }}
        >
          Life Stage Learning Paths
        </p>

        {/* H1 */}
        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            lineHeight: 1.1,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Everything you need to know
          <br />
          <span style={{ color: "var(--color-accent)" }}>before life gets expensive</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "15px",
            color: "var(--color-text-secondary)",
            maxWidth: "420px",
            marginTop: "16px",
            lineHeight: 1.6,
          }}
        >
          Most people figure out money by making expensive mistakes.
          This is the shortcut.
        </p>

        {/* Stage count badges */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--color-text-muted)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "20px",
              padding: "5px 14px",
            }}
          >
            {stages.length} life stages
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--color-text-muted)",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "20px",
              padding: "5px 14px",
            }}
          >
            {stages.reduce((sum, s) => sum + s.lessonCount, 0)} lessons total
          </span>
        </div>
      </div>

      {/* Stage divider */}
      <div className="divider-financial" style={{ marginBottom: "0" }} />

      {/* Main content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 16px 96px",
        }}
      >
        <JourneyMap stages={stages} />
      </div>

      {/* Bottom CTA band */}
      <div
        style={{
          borderTop: "1px solid var(--color-border-light)",
          padding: "40px 16px",
          textAlign: "center",
          background: "var(--color-surface-alt)",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--color-text-secondary)" }}>Pick your stage. Get the real playbook.</strong>
          {" "}Not a lecture. Not 40 generic tips.
          The exact things you need to know, in the order you need to know them.
        </p>
      </div>
    </div>
  );
}
