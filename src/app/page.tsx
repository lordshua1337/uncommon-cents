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
  ArrowUpDown: <ArrowUpDown className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
  Shield: <Shield className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
  KeyRound: <KeyRound className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
  Scissors: <Scissors className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
  Heart: <Heart className="w-5 h-5" style={{ color: '#F5EDE0' }} />,
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
      className="group uc-card overflow-hidden card-hover block"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0 radius-metric"
            style={{ background: '#2C5F7C' }}
          >
            {iconMap[icon]}
          </div>
          <div>
            <h3 className="font-heading text-base font-bold leading-tight">{title}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#C4A67A' }}>{subtitle}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#555555' }}>
          {summary}
        </p>
        <div className="flex items-center gap-1 text-sm font-semibold mt-3 group-hover:gap-2 transition-all" style={{ color: '#E05A1B' }}>
          Read more <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero -- warm cream with linen texture */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden linen-texture"
      >
        <div className="relative z-10 pt-20 pb-16">
          <HeroAnimated />
        </div>
      </section>

      {/* Stats -- green metric blocks */}
      <section className="relative z-10 -mt-10 px-4 pb-12">
        <div
          role="list"
          className="max-w-[960px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4"
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

      {/* Financial Command Center */}
      <ScrollReveal>
        <DashboardProgress />
      </ScrollReveal>

      {/* Life Stage Paths section */}
      <ScrollReveal delay={0.05}>
        <HomepagePathsSection />
      </ScrollReveal>

      {/* Daily Money Minute */}
      <ScrollReveal>
        <section className="py-12 px-4">
          <div className="max-w-xl mx-auto">
            <DailyLessonCard />
          </div>
        </section>
      </ScrollReveal>

      {/* Knowledge Universe -- blue section */}
      <ScrollReveal delay={0.05}>
      <section className="py-16 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="uc-section">
            <div className="text-center mb-10">
              <p className="text-label mb-2" style={{ color: '#C4A67A' }}>
                Knowledge Base
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-[800] tracking-tight" style={{ color: '#F5EDE0' }}>
                {domains.length} Domains. {concepts.length} Concepts. Three Depths.
              </h2>
              <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: 'rgba(245, 237, 224, 0.7)' }}>
                From tax accounts to behavioral finance. Each concept at
                three levels -- from quick overview to full analysis.
              </p>
            </div>

            <AnimatedCardGrid
              accentColor="#2C5F7C"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {domains.slice(0, 8).map((domain) => (
                <Link
                  key={domain.id}
                  href={`/explore/${domain.slug}`}
                  className="group uc-card p-4 card-hover block"
                >
                  <div
                    className="w-9 h-9 radius-metric flex items-center justify-center mb-3 text-sm font-bold"
                    style={{
                      backgroundColor: '#1E3F2E',
                      color: '#F5EDE0',
                    }}
                  >
                    {domain.shortName.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold group-hover:text-vroom transition-colors" style={{ color: '#1A1A1A' }}>
                    {domain.shortName}
                  </p>
                </Link>
              ))}
            </AnimatedCardGrid>

            <div className="text-center mt-8">
              <Link
                href="/explore"
                className="font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                style={{ color: '#E05A1B' }}
              >
                Explore all {domains.length} domains
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Recently added concepts */}
      <ScrollReveal>
      <section className="py-14 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-8">
            <p className="text-label mb-2" style={{ color: '#2C5F7C' }}>
              Newest Entries
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-[800] tracking-tight" style={{ color: '#1A1A1A' }}>
              Recently Added
            </h2>
            <p className="text-sm mt-2" style={{ color: '#555555' }}>
              The latest deep dives added to the knowledge base.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.slice(-6).reverse().map((concept) => {
              const domain = domains.find((d) => d.id === concept.domainId);
              return (
                <Link
                  key={concept.id}
                  href={`/concepts/${concept.slug}`}
                  className="group uc-card p-5 card-hover block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {domain && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5"
                        style={{
                          backgroundColor: 'rgba(44, 95, 124, 0.1)',
                          color: '#2C5F7C',
                          borderRadius: '16px 4px 16px 4px',
                        }}
                      >
                        {domain.shortName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold mb-1 group-hover:text-vroom transition-colors" style={{ color: '#1A1A1A' }}>
                    {concept.name}
                  </h3>
                  <p className="text-xs line-clamp-2" style={{ color: '#555555' }}>
                    {concept.summary}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/explore"
              className="font-semibold text-sm inline-flex items-center gap-1 transition-colors"
              style={{ color: '#E05A1B' }}
            >
              See all {concepts.length} entries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Foundations callout -- green metric style */}
      <section className="py-14 px-4">
        <div className="max-w-[960px] mx-auto">
          <Link
            href="/explore/foundations"
            className="group block uc-metric overflow-hidden card-hover"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 radius-card flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(245, 237, 224, 0.15)" }}
                >
                  <Compass className="w-6 h-6" style={{ color: '#F5EDE0' }} />
                </div>
                <div>
                  <p className="text-label mb-1" style={{ color: '#C4A67A' }}>
                    Start Here
                  </p>
                  <h3 className="font-heading text-xl font-bold mb-2" style={{ color: '#F5EDE0' }}>
                    Foundations for Financial Freedom
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(245, 237, 224, 0.6)' }}>
                    The 10 most important financial truths distilled from IRS data, SEC research,
                    and academic evidence. The bedrock principles that everything else builds on.
                  </p>
                  <span className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#E05A1B' }}>
                    Explore the foundations <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Strategies grid -- inside blue section */}
      <ScrollReveal delay={0.05}>
      <section className="py-16 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="uc-section">
            <div className="text-center mb-10">
              <p className="text-label mb-2" style={{ color: '#C4A67A' }}>
                Strategies
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-[800] tracking-tight" style={{ color: '#F5EDE0' }}>
                The Uncommon Playbook
              </h2>
              <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: 'rgba(245, 237, 224, 0.7)' }}>
                Each of these strategies is legal, well-documented, and used
                by financially literate people every day. Most people just
                don&apos;t know about them.
              </p>
            </div>

            <AnimatedCardGrid
              accentColor="#2C5F7C"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {strategies.map((s) => (
                <StrategyPreview key={s.id} {...s} />
              ))}
            </AnimatedCardGrid>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Features -- the four pillars */}
      <ScrollReveal>
      <section className="py-16 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-label mb-2" style={{ color: '#2C5F7C' }}>
              Tools
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-[800] tracking-tight" style={{ color: '#1A1A1A' }}>
              Four Ways to Get Smarter
            </h2>
          </div>

          <AnimatedCardGrid
            accentColor="#2C5F7C"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { href: "/explore", icon: <Layers className="w-5 h-5" style={{ color: '#F5EDE0' }} />, title: "Explore", desc: `${domains.length} financial domains with concepts at three depth levels. From beginner overview to full advanced analysis.`, bg: '#2C5F7C' },
              { href: "/learn", icon: <TrendingUp className="w-5 h-5" style={{ color: '#F5EDE0' }} />, title: "Learn", desc: "Deep dives into each strategy with real numbers, common mistakes, and the insight most people miss.", bg: '#1E3F2E' },
              { href: "/calculators", icon: <Calculator className="w-5 h-5" style={{ color: '#F5EDE0' }} />, title: "Calculate", desc: "Run the numbers on Roth conversions, tax-loss harvesting, and HSA compound growth with your own inputs.", bg: '#2C5F7C' },
              { href: "/ask", icon: <MessageCircle className="w-5 h-5" style={{ color: '#F5EDE0' }} />, title: "Ask", desc: "Ask specific questions about your situation and get clear answers backed by tax code and financial research.", bg: '#1E3F2E' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group uc-card overflow-hidden card-hover block"
              >
                <div className="p-6">
                  <div
                    className="w-10 h-10 radius-metric flex items-center justify-center mb-4"
                    style={{ background: item.bg }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-base font-bold mb-2" style={{ color: '#1A1A1A' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedCardGrid>
        </div>
      </section>
      </ScrollReveal>

      {/* Bottom CTA -- green section */}
      <ScrollReveal delay={0.05}>
      <section className="py-16 px-4">
        <div className="max-w-[960px] mx-auto">
          <div className="uc-metric py-20 px-8 text-center">
            <h2
              className="font-heading text-3xl sm:text-4xl font-[800] tracking-tight mb-4"
              style={{ color: '#F5EDE0' }}
            >
              Show Me What I Don&apos;t Know
            </h2>
            <p
              className="text-sm mb-10 leading-relaxed max-w-xl mx-auto"
              style={{ color: 'rgba(245, 237, 224, 0.6)' }}
            >
              This is education, not financial advice. Every situation is
              different. But understanding these strategies puts you years
              ahead of people who don&apos;t.
            </p>
            <Link
              href="/learn"
              className="uc-button uc-button-primary px-8 py-3 inline-flex items-center gap-2"
            >
              Start With Strategy #1
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

    </div>
  );
}
