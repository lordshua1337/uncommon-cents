"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Map,
  ArrowRight,
  KeyRound,
  Briefcase,
  Heart,
  House,
  Star,
  Zap,
  Compass,
  Crown,
  CheckCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Stage pill data -- 8 life stages with their accent colors
// ---------------------------------------------------------------------------

const STAGE_PILLS = [
  { label: "Move Out", color: "#F59E0B" },
  { label: "Career", color: "#3B82F6" },
  { label: "Marriage", color: "#EC4899" },
  { label: "House", color: "#10B981" },
  { label: "Kid", color: "#8B5CF6" },
  { label: "Business", color: "#F97316" },
  { label: "Retirement", color: "#06B6D4" },
  { label: "Legacy", color: "#CA8A04" },
] as const;

// ---------------------------------------------------------------------------
// 4-node journey preview data
// ---------------------------------------------------------------------------

const JOURNEY_NODES = [
  { icon: KeyRound, color: "#F59E0B", label: "Move Out", lessons: "4 lessons", isFirst: true },
  { icon: Briefcase, color: "#3B82F6", label: "Career Start", lessons: "3 lessons", isFirst: false },
  { icon: Heart, color: "#EC4899", label: "Get Married", lessons: "4 lessons", isFirst: false },
  { icon: House, color: "#10B981", label: "Buy a House", lessons: "3 lessons", isFirst: false },
] as const;

// ---------------------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 350 },
  },
};

const leftColVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const rightColVariants = {
  hidden: { opacity: 0, x: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, delay: 0.1, ease: "easeOut" as const },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StagePill({ label, color }: { label: string; color: string }) {
  return (
    <motion.span
      variants={pillVariants}
      className="inline-flex items-center text-[10px] font-medium px-3 py-1.5 rounded-full border cursor-default select-none"
      style={{
        backgroundColor: `${color}10`,
        color,
        borderColor: `${color}33`,
      }}
      whileHover={{
        backgroundColor: `${color}20`,
        scale: 1.02,
        transition: { duration: 0.12 },
      }}
    >
      {label}
    </motion.span>
  );
}

function JourneyNode({
  icon: Icon,
  color,
  label,
  lessons,
  isFirst,
  index,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  lessons: string;
  isFirst: boolean;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={nodeVariants}
      className="flex items-center gap-3"
    >
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
        style={{
          backgroundColor: `${color}18`,
          borderColor: `${color}40`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
        {isFirst && (
          <span
            className="absolute -top-1.5 -right-1.5 text-[8px] uppercase bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium leading-none"
          >
            Start
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium text-[#1A1A1A] leading-none">{label}</p>
        <p className="text-[10px] text-[#888888] mt-0.5">{lessons}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function HomepagePathsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 md:gap-12 items-center">

          {/* LEFT COLUMN: text + pills + CTA */}
          <motion.div
            variants={leftColVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-[10px] uppercase tracking-widest text-accent font-medium mb-2">
              New
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
              Learn finance at every stage of life.
            </h2>
            <p className="text-sm text-[#555555] leading-relaxed max-w-sm mt-3">
              Eight curated learning paths mapped to real life events -- moving out, getting married, buying a house, starting a business. Learn exactly what matters, exactly when it matters.
            </p>

            {/* Stage pills */}
            <motion.div
              className="flex flex-wrap gap-2 mt-6 overflow-x-auto scrollbar-none"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {STAGE_PILLS.map((pill) => (
                <StagePill key={pill.label} label={pill.label} color={pill.color} />
              ))}
            </motion.div>

            {/* CTA */}
            <Link
              href="/paths"
              className="mt-6 inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-accent-dark transition-colors group"
            >
              Explore Life Paths
              <Map className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* RIGHT COLUMN: miniaturized journey map (hidden on mobile) */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="hidden md:block w-[220px] shrink-0"
          >
            <div
              className="relative rounded-2xl p-5 overflow-hidden border border-[#E5E5E0]"
              style={{ backgroundColor: "#F5F5F0" }}
            >
              {/* Decorative radial glow */}
              <div
                className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Vertical connector line */}
              <div className="relative flex flex-col gap-5">
                {/* SVG gradient line */}
                <svg
                  className="absolute left-[17px] top-[18px]"
                  width="4"
                  height="152"
                  viewBox="0 0 4 152"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="journeyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="33%" stopColor="#3B82F6" />
                      <stop offset="66%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <rect width="4" height="152" rx="2" fill="url(#journeyGrad)" opacity="0.4" />
                </svg>

                {JOURNEY_NODES.map((node, i) => (
                  <JourneyNode
                    key={node.label}
                    icon={node.icon}
                    color={node.color}
                    label={node.label}
                    lessons={node.lessons}
                    isFirst={node.isFirst}
                    index={i}
                  />
                ))}
              </div>

              {/* "See all 8 paths" hint */}
              <div className="mt-4 flex items-center gap-1 text-[10px] text-[#888888]">
                <CheckCircle className="w-3 h-3 text-accent" />
                <span>8 stages total</span>
                <ArrowRight className="w-3 h-3 ml-auto text-accent" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
