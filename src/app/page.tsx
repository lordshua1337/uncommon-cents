import Link from "next/link";
import {
  ArrowRight,
  Coins,
  ArrowUpDown,
  AlertTriangle,
  Shield,
  KeyRound,
  Scissors,
  Heart,
  TrendingUp,
  Calculator,
  MessageCircle,
  Layers,
  Compass,
} from "lucide-react";
import { HeroAnimated } from "@/components/homepage/hero-animated";
import { AnimatedStatCard } from "@/components/homepage/animated-stat-card";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { AnimatedCardGrid } from "@/components/homepage/animated-card-grid";
import { strategies } from "@/lib/strategies-data";
import { domains } from "@/lib/domains";
import { concepts } from "@/lib/concepts";
import DailyLessonCard from "@/components/daily-lesson";
import { DashboardProgress } from "@/components/dashboard-progress";
import { HomepagePathsSection } from "@/components/life-stages/homepage-paths-section";

const iconMap: Record<string, React.ReactNode> = {
  ArrowUpDown: <ArrowUpDown className="w-5 h-5 text-accent" strokeWidth={1.5} />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-warning" strokeWidth={1.5} />,
  Shield: <Shield className="w-5 h-5 text-accent" strokeWidth={1.5} />,
  KeyRound: <KeyRound className="w-5 h-5 text-accent" strokeWidth={1.5} />,
  Scissors: <Scissors className="w-5 h-5 text-accent" strokeWidth={1.5} />,
  Heart: <Heart className="w-5 h-5 text-accent" strokeWidth={1.5} />,
};

// Icon map for the Four Ways alternating blocks
const fourWaysIconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-6 h-6 text-[#CA8A04]" strokeWidth={1.5} />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-[#CA8A04]" strokeWidth={1.5} />,
  Calculator: <Calculator className="w-6 h-6 text-[#CA8A04]" strokeWidth={1.5} />,
  MessageCircle: <MessageCircle className="w-6 h-6 text-[#CA8A04]" strokeWidth={1.5} />,
};

function StrategyPreview({
  id,
  title,
  subtitle,
  icon,
  summary,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
}) {
  return (
    <Link
      href={`/learn#${id}`}
      className="group bg-surface rounded-xl border border-border p-5 card-hover block"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#EDE8DC] flex items-center justify-center flex-shrink-0">
          {iconMap[icon]}
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
        {summary}
      </p>
      <div className="flex items-center gap-1 text-accent text-sm font-medium mt-3 group-hover:gap-2 transition-all">
        Read more <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </div>
    </Link>
  );
}

// Four Ways alternating block item
const fourWaysItems = [
  {
    icon: 'Layers',
    href: '/explore',
    title: 'Explore',
    description: (domainCount: number) =>
      `${domainCount} financial domains with concepts at three depth levels. From beginner overview to full advanced analysis.`,
  },
  {
    icon: 'TrendingUp',
    href: '/learn',
    title: 'Learn',
    description: () =>
      'Deep dives into each strategy with real numbers, common mistakes, and the insight most people miss.',
  },
  {
    icon: 'Calculator',
    href: '/calculators',
    title: 'Calculate',
    description: () =>
      'Run the numbers on Roth conversions, tax-loss harvesting, and HSA compound growth with your own inputs.',
  },
  {
    icon: 'MessageCircle',
    href: '/ask',
    title: 'Ask',
    description: () =>
      'Ask specific questions about your situation and get clear answers backed by tax code and financial research.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      {/* HeroAnimated is a 'use client' island. page.tsx remains a server component. */}
      {/* All hero content is server-rendered via SSR (SEO preserved). */}
      {/* The client island hydrates and plays the stagger entrance sequence. */}
      <section
        className="min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-24 md:pt-36 md:pb-28 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #162C52 45%, #1E3A6E 100%)' }}
      >
        <HeroAnimated />
      </section>
      {/* Fade from navy to cream */}
      <div style={{ background: 'linear-gradient(to bottom, transparent 80%, #FAF8F4 100%)', height: '80px', marginTop: '-80px', pointerEvents: 'none' }} />

      <div className="divider-financial" />

      {/* Stats */}
      <section className="py-16 md:py-20 px-5 md:px-8 lg:px-12" style={{ background: '#FAF8F4' }}>
        <div
          role="list"
          className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <AnimatedStatCard
            value={domains.length}
            label="Financial domains"
            index={0}
          />
          <AnimatedStatCard
            value={concepts.length}
            label="Concepts"
            index={1}
          />
          <AnimatedStatCard
            value={10}
            label="Calculators"
            index={2}
          />
          <AnimatedStatCard
            value={0}
            label="Cost to use"
            prefix="$"
            index={3}
          />
        </div>
      </section>

      <div className="divider-financial" />

      {/* Financial Command Center */}
      <ScrollReveal>
        <DashboardProgress />
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Life Stage Paths section */}
      <ScrollReveal delay={0.05}>
        <HomepagePathsSection />
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Daily Money Minute */}
      <ScrollReveal>
        <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12" style={{ background: '#F5F1E8' }}>
          <div className="max-w-xl mx-auto">
            <DailyLessonCard />
          </div>
        </section>
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Knowledge Universe */}
      <ScrollReveal delay={0.05}>
      <section className="py-24 md:py-32 px-5 md:px-8 lg:px-12" style={{ background: '#FAF8F4' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Knowledge Base
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {domains.length} Domains. {concepts.length} Concepts. Three Depths.
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              From tax accounts to behavioral finance. Each concept at
              three levels -- from quick overview to full analysis.
            </p>
          </div>

          <AnimatedCardGrid
            accentColor="#16A34A"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {domains.slice(0, 8).map((domain) => (
              <Link
                key={domain.id}
                href={`/explore/${domain.slug}`}
                className="group bg-surface rounded-lg border border-border p-3 card-hover block"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{
                    backgroundColor: `${domain.color}15`,
                    color: domain.color,
                  }}
                >
                  <span className="text-sm">
                    {domain.shortName.charAt(0)}
                  </span>
                </div>
                <p className="text-xs font-semibold group-hover:text-accent transition-colors">
                  {domain.shortName}
                </p>
              </Link>
            ))}
          </AnimatedCardGrid>

          <div className="text-center mt-6">
            <Link
              href="/explore"
              className="text-accent font-medium text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              Explore all {domains.length} domains
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Recently added concepts */}
      <ScrollReveal>
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12" style={{ background: '#F5F1E8' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Newest Entries
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Recently Added
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              The latest deep dives added to the knowledge base.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {concepts.slice(-6).reverse().map((concept) => {
              const domain = domains.find((d) => d.id === concept.domainId);
              return (
                <Link
                  key={concept.id}
                  href={`/concepts/${concept.slug}`}
                  className="group bg-surface rounded-lg border border-border p-4 card-hover block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {domain && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${domain.color}15`,
                          color: domain.color,
                        }}
                      >
                        {domain.shortName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold group-hover:text-accent transition-colors mb-1">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {concept.summary}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/explore"
              className="text-accent font-medium text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              See all {concepts.length} entries
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Foundations callout */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12" style={{ background: '#FAF8F4' }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/explore/foundations"
            className="group block bg-surface rounded-xl border border-border overflow-hidden card-hover"
          >
            <div
              className="h-1 w-full"
              style={{ backgroundColor: "#D97706" }}
            />
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#D9760615", color: "#D97706" }}
                >
                  <Compass className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: "#D97706" }}>
                    Start Here
                  </p>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    Foundations for Financial Freedom
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    The 10 most important financial truths distilled from IRS data, SEC research,
                    and academic evidence. The bedrock principles that everything else builds on.
                  </p>
                  <span className="text-accent text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore the foundations <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <div className="divider-financial" />

      {/* Strategies grid */}
      <ScrollReveal delay={0.05}>
      <section className="py-24 md:py-32 px-5 md:px-8 lg:px-12" style={{ background: '#F5F1E8' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Strategies
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              The Uncommon Playbook
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
              Each of these strategies is legal, well-documented, and used
              by financially literate people every day. Most people just
              don&apos;t know about them.
            </p>
          </div>

          <AnimatedCardGrid
            accentColor="#7C3AED"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {strategies.map((s) => (
              <StrategyPreview key={s.id} {...s} />
            ))}
          </AnimatedCardGrid>
        </div>
      </section>
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Four Ways to Get Smarter -- alternating left/right blocks */}
      <ScrollReveal>
      <section className="py-24 md:py-32 px-5 md:px-8 lg:px-12" style={{ background: '#FAF8F4' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Tools
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Four Ways to Get Smarter
            </h2>
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {fourWaysItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const descText = item.icon === 'Layers'
                ? item.description(domains.length)
                : item.description(0);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                  {/* Text block */}
                  <div className={isEven ? '' : 'lg:order-last'}>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: '#FAF3E6', border: '1px solid rgba(202,138,4,0.20)' }}
                    >
                      {fourWaysIconMap[item.icon]}
                    </div>
                    <h3
                      className="font-heading font-medium text-[#0F172A] mb-3"
                      style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)', letterSpacing: '-0.015em' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {descText}
                    </p>
                    <span className="text-accent text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </span>
                  </div>

                  {/* Decorative visual */}
                  <div
                    className={`rounded-2xl overflow-hidden ${isEven ? '' : 'lg:order-first'}`}
                    style={{
                      background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF8F4 100%)',
                      border: '1px solid #D4CFC4',
                      padding: '2rem',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: '#FAF3E6', border: '1px solid rgba(202,138,4,0.20)' }}
                    >
                      {fourWaysIconMap[item.icon]}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* CTA Section -- navy dark break */}
      <ScrollReveal delay={0.05}>
      <section style={{ background: '#0F172A' }}>
        <div className="py-24 md:py-32 px-6 text-center">
          <div className="max-w-[680px] mx-auto">
            <Coins className="w-10 h-10 text-[#CA8A04] mx-auto mb-6" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.06em] uppercase text-[#CA8A04] mb-4">
              Start Here
            </p>
            <h2
              className="font-heading font-semibold text-[#FAF8F4] mb-4"
              style={{ fontSize: 'clamp(1.75rem, 1.5rem + 1.5vw, 2.25rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Knowledge Is the Best Investment
            </h2>
            <p className="font-sans font-normal mb-8 leading-[1.65]" style={{ color: 'rgba(250,248,244,0.70)' }}>
              This is education, not financial advice. Every situation is
              different. But understanding these strategies puts you years
              ahead of people who don&apos;t.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/learn"
                className="px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(90deg, #CA8A04 0%, #A57203 100%)', color: '#0F172A', fontWeight: 500, boxShadow: '0 4px 16px rgba(202,138,4,0.30)' }}
              >
                Start With Strategy #1
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/explore"
                className="px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                style={{ background: 'transparent', border: '1px solid rgba(250,248,244,0.25)', color: '#FAF8F4' }}
              >
                Explore Domains
              </Link>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

    </div>
  );
}
