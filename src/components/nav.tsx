"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Coins, Compass, BookOpen, Calculator, MessageCircle, MoreHorizontal, Map } from "lucide-react";

const primaryLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/paths", label: "Paths" },
  { href: "/calculators", label: "Calculators" },
];

// secondaryLinks appear in the "More" dropdown on desktop.
// Calculators moved here since it's now in the primary nav -- it stays in More as well
// so users coming from deep links still have a path, but is not the source of isSecondaryActive.
const secondaryLinks = [
  { href: "/scripts", label: "Scripts" },
  { href: "/quiz", label: "Quiz" },
  { href: "/defenses", label: "Defenses" },
  { href: "/simulator", label: "Simulator" },
  { href: "/review", label: "Review" },
  { href: "/action-plan", label: "Action Plan" },
  { href: "/achievements", label: "Achievements" },
  { href: "/score", label: "Health Score" },
];

// Additional links that appear in the More dropdown but are NOT used for isSecondaryActive
// (they are already surfaced in primary nav or elsewhere)
const moreDropdownExtras = [
  { href: "/calculators", label: "Calculators" },
];

const allMoreLinks = [...secondaryLinks, ...moreDropdownExtras];

const allLinks = [...primaryLinks, ...secondaryLinks, { href: "/ask", label: "Ask" }];


export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [moreOpen]);

  const isSecondaryActive = secondaryLinks.some(
    (l) => pathname === l.href || pathname.startsWith(l.href)
  );

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(250,248,244,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4DB' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Coins className="w-5 h-5 text-[#CA8A04] group-hover:opacity-80 transition-opacity" strokeWidth={1.5} />
            <span
              className="font-heading font-semibold"
              style={{ letterSpacing: '-0.01em', color: '#0F172A', fontSize: '1.125rem' }}
            >
              Uncommon Cents
            </span>
          </Link>

          {/* Desktop: primary links + More dropdown + Ask CTA */}
          <div className="hidden md:flex items-center gap-6">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-sm transition-colors ${
                    isActive
                      ? "font-medium text-[#0F172A] border-b-2 border-[#CA8A04] pb-0.5"
                      : "text-[#334155] hover:text-[#0F172A]"
                  }`}
                  style={{ letterSpacing: '0.02em' }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`font-sans text-sm transition-colors ${
                  isSecondaryActive
                    ? "font-medium text-[#0F172A] border-b-2 border-[#CA8A04] pb-0.5"
                    : "text-[#334155] hover:text-[#0F172A]"
                }`}
                style={{ letterSpacing: '0.02em' }}
              >
                More
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-surface border border-border rounded-xl shadow-lg py-2 z-50">
                  {allMoreLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "text-[#CA8A04] bg-accent-bg font-medium"
                            : "text-[#334155] hover:text-[#0F172A] hover:bg-surface-alt"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/ask"
              className="text-sm bg-[#0F172A] text-[#FAF8F4] px-4 py-1.5 rounded-lg hover:bg-[#334155] transition-colors"
            >
              Ask a Question
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#334155] hover:text-[#0F172A]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile hamburger dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-[#E8E4DB]" style={{ background: 'rgba(250,248,244,0.97)', backdropFilter: 'blur(16px)' }}>
            <div className="px-4 py-4 flex flex-col gap-3">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base py-2 transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href)
                      ? "text-[#CA8A04] font-medium"
                      : "text-[#334155] hover:text-[#0F172A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom tabs */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]"
        style={{ background: 'rgba(250,248,244,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid #E8E4DB' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14">
          {[
            { href: "/explore", label: "Explore", icon: <Compass className="w-5 h-5" strokeWidth={1.5} /> },
            { href: "/learn", label: "Learn", icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} /> },
            { href: "/paths", label: "Paths", icon: <Map className="w-5 h-5" strokeWidth={1.5} /> },
            { href: "/ask", label: "Ask", icon: <MessageCircle className="w-5 h-5" strokeWidth={1.5} /> },
            { href: "#more", label: "More", icon: <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />, action: true },
          ].map((tab) => {
            const isActive = tab.href !== "#more" && (
              pathname === tab.href || pathname.startsWith(tab.href)
            );
            if (tab.action) {
              return (
                <button
                  key="more"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex flex-col items-center gap-0.5 text-text-muted"
                >
                  <span>{tab.icon}</span>
                  <span className="text-[10px]">{tab.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 transition-colors ${
                  isActive ? "text-[#CA8A04]" : "text-text-muted"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-[10px]">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
