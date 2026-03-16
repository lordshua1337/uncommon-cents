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
          background: "rgba(44,95,124,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <BookOpen style={{ width: "24px", height: "24px", color: "#2C5F7C" }} />
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: "8px",
        }}
      >
        No stages yet
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#555555",
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
      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "#F5EDE0" }}>
        <div className="max-w-[960px] mx-auto">
          <div
            className="uc-card"
            style={{
              padding: "32px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#555555", fontSize: "14px" }}>
              Unable to load your learning paths. Please refresh.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "#F5EDE0" }}>
        <div className="max-w-[960px] mx-auto">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen linen-texture"
      style={{ background: "#F5EDE0" }}
    >
      {/* Hero banner */}
      <div
        style={{
          width: "100%",
          minHeight: "200px",
          paddingTop: "112px",
          paddingBottom: "48px",
          paddingLeft: "16px",
          paddingRight: "16px",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(44,95,124,0.08) 0%, transparent 70%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Overline */}
        <p
          className="text-label"
          style={{
            color: "#2C5F7C",
            marginBottom: "12px",
          }}
        >
          Life Stage Learning Paths
        </p>

        {/* H1 */}
        <h1
          className="font-heading"
          style={{
            fontSize: "clamp(24px, 5vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#1A1A1A",
            lineHeight: 1.1,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Everything you need to know
          <br />
          <span style={{ color: "#2C5F7C" }}>before life gets expensive</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "15px",
            color: "#555555",
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
              color: "#555555",
              background: "#FFFFFF",
              border: "1px solid rgba(196,166,122,0.3)",
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
              color: "#555555",
              background: "#FFFFFF",
              border: "1px solid rgba(196,166,122,0.3)",
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
          maxWidth: "960px",
          margin: "0 auto",
          padding: "40px 16px 80px",
        }}
      >
        <JourneyMap stages={stages} />
      </div>

      {/* Bottom CTA band */}
      <div
        style={{
          borderTop: "1px solid rgba(196,166,122,0.3)",
          padding: "40px 16px",
          textAlign: "center",
          background: "#FFFFFF",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#555555",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#1A1A1A" }}>Pick your stage. Get the real playbook.</strong>
          {" "}Not a lecture. Not 40 generic tips.
          The exact things you need to know, in the order you need to know them.
        </p>
      </div>
    </div>
  );
}
