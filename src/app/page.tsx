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
  ArrowUpDown: <ArrowUpDown className="w-5 h-5 text-accent" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-warm" />,
  Shield: <Shield className="w-5 h-5 text-accent" />,
  KeyRound: <KeyRound className="w-5 h-5 text-accent" />,
  Scissors: <Scissors className="w-5 h-5 text-accent" />,
  Heart: <Heart className="w-5 h-5 text-accent" />,
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
        <div className="w-9 h-9 rounded-lg bg-accent-bg flex items-center justify-center flex-shrink-0">
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
        Read more <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero -- dark editorial */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #1B1B18 0%, #1F2A1F 40%, #1B1B18 100%)',
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(13,107,61,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Fine grid overlay for texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(248,246,241,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(248,246,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 pt-20 pb-16">
          <HeroAnimated />
        </div>
        {/* Bottom fade to page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F8F6F1)' }}
        />
      </section>

      {/* Stats */}
      <section className="py-12 px-4 section-warm">
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
        <section className="py-12 px-4">
          <div className="max-w-xl mx-auto">
            <DailyLessonCard />
          </div>
        </section>
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Knowledge Universe */}
      <ScrollReveal delay={0.05}>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Knowledge Base
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
              {domains.length} Domains. {concepts.length} Concepts. Three Depths.
            </h2>
            <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto">
              From tax accounts to behavioral finance. Each concept at
              three levels -- from quick overview to full analysis.
            </p>
          </div>

          <AnimatedCardGrid
            accentColor="#0D6B3D"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {domains.slice(0, 8).map((domain) => (
              <Link
                key={domain.id}
                href={`/explore/${domain.slug}`}
                className="group bg-surface rounded-xl border border-border p-4 card-hover block"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-sm font-semibold"
                  style={{
                    backgroundColor: `${domain.color}12`,
                    color: domain.color,
                  }}
                >
                  {domain.shortName.charAt(0)}
                </div>
                <p className="text-sm font-semibold group-hover:text-accent transition-colors">
                  {domain.shortName}
                </p>
              </Link>
            ))}
          </AnimatedCardGrid>

          <div className="text-center mt-8">
            <Link
              href="/explore"
              className="text-accent font-medium text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              Explore all {domains.length} domains
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Recently added concepts */}
      <ScrollReveal>
      <section className="py-14 px-4 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs text-warm uppercase tracking-widest font-medium mb-2">
              Newest Entries
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight">
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
                  className="group bg-surface rounded-xl border border-border p-5 card-hover block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {domain && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${domain.color}12`,
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
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Foundations callout */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/explore/foundations"
            className="group block bg-surface rounded-xl border border-border overflow-hidden card-hover"
          >
            <div
              className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, #B8860B, #D4A017)' }}
            />
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(184,134,11,0.08)", color: "#B8860B" }}
                >
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: "#B8860B" }}>
                    Start Here
                  </p>
                  <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    Foundations for Financial Freedom
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    The 10 most important financial truths distilled from IRS data, SEC research,
                    and academic evidence. The bedrock principles that everything else builds on.
                  </p>
                  <span className="text-accent text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore the foundations <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Strategies
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
              The Uncommon Playbook
            </h2>
            <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto">
              Each of these strategies is legal, well-documented, and used
              by financially literate people every day. Most people just
              don&apos;t know about them.
            </p>
          </div>

          <AnimatedCardGrid
            accentColor="#0D6B3D"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {strategies.map((s) => (
              <StrategyPreview key={s.id} {...s} />
            ))}
          </AnimatedCardGrid>
        </div>
      </section>
      </ScrollReveal>

      <div className="divider-financial" />

      {/* Features */}
      <ScrollReveal>
      <section className="py-16 px-4 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Tools
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
              Four Ways to Get Smarter
            </h2>
          </div>

          <AnimatedCardGrid
            accentColor="#0D6B3D"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link
              href="/explore"
              className="group bg-surface rounded-xl border border-border p-6 card-hover block"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold mb-2">Explore</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {domains.length} financial domains with concepts at three depth levels.
                From beginner overview to full advanced analysis.
              </p>
            </Link>

            <Link
              href="/learn"
              className="group bg-surface rounded-xl border border-border p-6 card-hover block"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold mb-2">Learn</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Deep dives into each strategy with real numbers, common
                mistakes, and the insight most people miss.
              </p>
            </Link>

            <Link
              href="/calculators"
              className="group bg-surface rounded-xl border border-border p-6 card-hover block"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold mb-2">Calculate</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Run the numbers on Roth conversions, tax-loss harvesting, and
                HSA compound growth with your own inputs.
              </p>
            </Link>

            <Link
              href="/ask"
              className="group bg-surface rounded-xl border border-border p-6 card-hover block"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold mb-2">Ask</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Ask specific questions about your situation and get clear
                answers backed by tax code and financial research.
              </p>
            </Link>
          </AnimatedCardGrid>
        </div>
      </section>
      </ScrollReveal>

      {/* Disclaimer / CTA -- dark editorial */}
      <ScrollReveal delay={0.05}>
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #1B1B18 0%, #1F2A1F 50%, #1B1B18 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(13,107,61,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-xl mx-auto text-center relative z-10">
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(13,107,61,0.12)' }}
          >
            <Coins className="w-6 h-6" style={{ color: '#4ADE80' }} />
          </div>
          <h2
            className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
            style={{ color: '#F8F6F1' }}
          >
            Knowledge Is the Best Investment
          </h2>
          <p
            className="text-sm mb-10 leading-relaxed"
            style={{ color: 'rgba(248,246,241,0.55)' }}
          >
            This is education, not financial advice. Every situation is
            different. But understanding these strategies puts you years
            ahead of people who don&apos;t.
          </p>
          <Link
            href="/learn"
            className="px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200"
            style={{
              background: '#0D6B3D',
              color: '#F8F6F1',
              boxShadow: '0 2px 12px rgba(13,107,61,0.3)',
            }}
          >
            Start With Strategy #1
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      </ScrollReveal>

    </div>
  );
}
