import Link from "next/link";
import { Coins } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer-elevated py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5" style={{ color: '#22C55E' }} />
              <span className="text-base font-semibold tracking-tight" style={{ color: '#F5F5F3' }}>
                Uncommon Cents
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(200, 220, 200, 0.4)' }}>
              The financial strategies that actually build wealth.
              No products. No affiliates. Just knowledge.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: 'rgba(34, 197, 94, 0.4)' }}>
                Learn
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/explore" className="text-sm transition-colors hover:text-accent-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Explore
                </Link>
                <Link href="/learn" className="text-sm transition-colors hover:text-accent-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Strategies
                </Link>
                <Link href="/paths" className="text-sm transition-colors hover:text-accent-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Life Paths
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: 'rgba(26, 107, 138, 0.5)' }}>
                Tools
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/calculators" className="text-sm transition-colors hover:text-ocean-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Calculators
                </Link>
                <Link href="/ask" className="text-sm transition-colors hover:text-ocean-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Ask
                </Link>
                <Link href="/score" className="text-sm transition-colors hover:text-ocean-light" style={{ color: 'rgba(200, 220, 200, 0.5)' }}>
                  Health Score
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-[1px] mb-6"
          style={{ background: 'rgba(34, 197, 94, 0.1)' }}
        />

        <p className="text-xs" style={{ color: 'rgba(200, 220, 200, 0.25)' }}>
          Financial education, not financial advice. Consult a professional for your specific situation.
        </p>
      </div>
    </footer>
  );
}
