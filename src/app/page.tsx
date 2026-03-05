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
import { strategies } from "@/lib/strategies-data";
import { domains } from "@/lib/domains";
import { concepts } from "@/lib/concepts";
import DailyLessonCard from "@/components/daily-lesson";
import { DashboardProgress } from "@/components/dashboard-progress";

const iconMap: Record<string, React.ReactNode> = {
  ArrowUpDown: <ArrowUpDown className="w-5 h-5 text-accent" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-gold" />,
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

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-semibold text-accent">{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-xs font-medium mb-6">
            <Coins className="w-3.5 h-3.5" />
            Financial strategies they don&apos;t teach you
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
            The Money Moves That{" "}
            <span className="text-accent">Actually Matter</span>
          </h1>

          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-4 leading-relaxed">
            Your financial advisor probably hasn&apos;t mentioned half of
            these. Roth conversion ladders, 401k overfunding traps, creditor
            protection through cash value, and the strategies that separate
            the wealthy from everyone else.
          </p>

          <p className="text-text-muted text-sm max-w-lg mx-auto mb-8">
            No products to sell. No affiliate links. Just the financial
            knowledge that costs six figures to learn the hard way.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/learn"
              className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/calculators"
              className="bg-surface border border-border text-text-primary px-6 py-2.5 rounded-lg font-medium hover:border-accent/30 transition-colors inline-flex items-center justify-center gap-2"
            >
              Calculators
              <Calculator className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="divider-financial" />

      {/* Stats */}
      <section className="py-10 px-4 section-warm">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatCard value={`${domains.length}`} label="Financial domains" />
          <StatCard value={`${concepts.length}`} label="Concepts" />
          <StatCard value="10" label="Calculators" />
          <StatCard value="$0" label="Cost to use" />
        </div>
      </section>

      <div className="divider-financial" />

      {/* Financial Command Center */}
      <DashboardProgress />

      <div className="divider-financial" />

      {/* Daily Money Minute */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <DailyLessonCard />
        </div>
      </section>

      <div className="divider-financial" />

      {/* Knowledge Universe */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
          </div>

          <div className="text-center mt-6">
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

      {/* Recently added concepts */}
      <section className="py-12 px-4 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
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
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Foundations callout */}
      <section className="py-12 px-4">
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
                  <Compass className="w-6 h-6" />
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((s) => (
              <StrategyPreview key={s.id} {...s} />
            ))}
          </div>
        </div>
      </section>

      <div className="divider-financial" />

      {/* Features */}
      <section className="py-16 px-4 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-accent uppercase tracking-widest font-medium mb-2">
              Tools
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Four Ways to Get Smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>
      </section>

      {/* Disclaimer / CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <Coins className="w-8 h-8 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Knowledge Is the Best Investment
          </h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            This is education, not financial advice. Every situation is
            different. But understanding these strategies puts you years
            ahead of people who don&apos;t.
          </p>
          <Link
            href="/learn"
            className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-light transition-colors inline-flex items-center gap-2"
          >
            Start With Strategy #1
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
