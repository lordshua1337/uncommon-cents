import Link from "next/link";
import { Coins } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #FAF8F4 0%, #EDE8DC 40%, #E0DBCF 100%)',
        borderTop: '1px solid #D4CFC4',
      }}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-16 pb-8">
        {/* 4-column grid: brand + 3 link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-10 sm:gap-16 mb-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-4 h-4 text-[#CA8A04]" strokeWidth={1.5} />
              <span
                className="font-heading font-semibold"
                style={{ fontSize: '1.125rem', letterSpacing: '-0.01em', color: '#0F172A' }}
              >
                Uncommon Cents
              </span>
            </div>
            <p className="font-sans text-sm max-w-[200px] leading-relaxed" style={{ color: '#5C6A7A' }}>
              Financial education for people who want to understand money, not just earn it.
            </p>
          </div>

          {/* Learn column */}
          <div>
            <p className="font-sans text-xs font-medium text-[#0F172A] tracking-[0.06em] uppercase mb-4">
              Learn
            </p>
            <ul className="space-y-2.5">
              {[
                { href: '/learn', label: 'Strategies' },
                { href: '/explore', label: 'Explore Domains' },
                { href: '/concepts', label: 'All Concepts' },
                { href: '/defenses', label: 'Fraud Defenses' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#334155] hover:text-[#0F172A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools column */}
          <div>
            <p className="font-sans text-xs font-medium text-[#0F172A] tracking-[0.06em] uppercase mb-4">
              Tools
            </p>
            <ul className="space-y-2.5">
              {[
                { href: '/calculators', label: 'Calculators' },
                { href: '/ask', label: 'Ask a Question' },
                { href: '/quiz', label: 'Quiz' },
                { href: '/score', label: 'Health Score' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#334155] hover:text-[#0F172A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More column */}
          <div>
            <p className="font-sans text-xs font-medium text-[#0F172A] tracking-[0.06em] uppercase mb-4">
              More
            </p>
            <ul className="space-y-2.5">
              {[
                { href: '/paths', label: 'Life Paths' },
                { href: '/scripts', label: 'Money Scripts' },
                { href: '/simulator', label: 'Simulator' },
                { href: '/achievements', label: 'Achievements' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#334155] hover:text-[#0F172A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal area */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid #D4CFC4' }}
        >
          <p className="text-xs text-[#5C6A7A] text-center sm:text-left max-w-md leading-relaxed">
            Financial education only &mdash; not financial advice. Every situation is different. Consult a qualified professional before making financial decisions.
          </p>
          <p className="text-xs text-[#5C6A7A] flex-shrink-0">
            &copy; {new Date().getFullYear()} Uncommon Cents
          </p>
        </div>
      </div>
    </footer>
  );
}
