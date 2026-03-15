import Link from "next/link";
import { Coins } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer-elevated py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5" style={{ color: '#4ADE80' }} />
              <span className="text-base font-semibold tracking-tight" style={{ color: '#F8F6F1' }}>
                Uncommon Cents
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(248,246,241,0.5)' }}>
              The financial strategies that actually build wealth.
              No products. No affiliates. Just knowledge.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: 'rgba(248,246,241,0.35)' }}>
                Learn
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/explore" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Explore
                </Link>
                <Link href="/learn" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Strategies
                </Link>
                <Link href="/paths" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Life Paths
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: 'rgba(248,246,241,0.35)' }}>
                Tools
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/calculators" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Calculators
                </Link>
                <Link href="/ask" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Ask
                </Link>
                <Link href="/score" className="text-sm transition-colors" style={{ color: 'rgba(248,246,241,0.6)' }}>
                  Health Score
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-[1px] mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(248,246,241,0.1), transparent)' }}
        />

        <p className="text-xs" style={{ color: 'rgba(248,246,241,0.3)' }}>
          Financial education, not financial advice. Consult a professional for your specific situation.
        </p>
      </div>
    </footer>
  );
}
