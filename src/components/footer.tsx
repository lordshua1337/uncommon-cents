import Link from "next/link";
import { Coins } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer-elevated py-12 px-4">
      <div className="max-w-[960px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5" style={{ color: '#E05A1B' }} />
              <span className="font-heading text-base font-bold tracking-tight" style={{ color: '#F5EDE0' }}>
                Uncommon Cents
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
              All the things about money that no one ever taught you.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-label mb-3" style={{ color: '#C4A67A' }}>
                Learn
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/explore" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Explore
                </Link>
                <Link href="/learn" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Strategies
                </Link>
                <Link href="/paths" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Life Paths
                </Link>
              </div>
            </div>
            <div>
              <p className="text-label mb-3" style={{ color: '#C4A67A' }}>
                Tools
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/calculators" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Calculators
                </Link>
                <Link href="/ask" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Ask
                </Link>
                <Link href="/score" className="text-sm transition-colors" style={{ color: 'rgba(245, 237, 224, 0.5)' }}>
                  Health Score
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="h-[1px] mb-6"
          style={{ background: 'rgba(245, 237, 224, 0.15)' }}
        />

        <p className="text-xs" style={{ color: 'rgba(245, 237, 224, 0.3)' }}>
          Financial education, not financial advice. Consult a professional for your specific situation.
        </p>
      </div>
    </footer>
  );
}
