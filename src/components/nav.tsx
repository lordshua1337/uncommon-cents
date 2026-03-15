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

const moreDropdownExtras = [
  { href: "/calculators", label: "Calculators" },
];

const allMoreLinks = [...secondaryLinks, ...moreDropdownExtras];

const allLinks = [...primaryLinks, ...secondaryLinks, { href: "/ask", label: "Ask" }];


export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // On homepage before scroll: transparent over dark hero
  // After scroll or on other pages: solid background
  const navTransparent = isHome && !scrolled && !isOpen;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navTransparent
            ? 'transparent'
            : 'rgba(248, 246, 241, 0.92)',
          backdropFilter: navTransparent ? 'none' : 'blur(12px)',
          borderBottom: navTransparent
            ? '1px solid transparent'
            : '1px solid rgba(221, 217, 208, 0.6)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Coins
              className="w-5 h-5 transition-colors"
              style={{ color: navTransparent ? '#4ADE80' : '#0D6B3D' }}
            />
            <span
              className="text-base font-semibold tracking-tight transition-colors"
              style={{ color: navTransparent ? '#F8F6F1' : '#2C2C2A' }}
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
                  className="text-sm transition-colors"
                  style={{
                    color: isActive
                      ? (navTransparent ? '#4ADE80' : '#0D6B3D')
                      : (navTransparent ? 'rgba(248,246,241,0.7)' : '#5A5A55'),
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="text-sm transition-colors"
                style={{
                  color: isSecondaryActive
                    ? (navTransparent ? '#4ADE80' : '#0D6B3D')
                    : (navTransparent ? 'rgba(248,246,241,0.7)' : '#5A5A55'),
                  fontWeight: isSecondaryActive ? 500 : 400,
                }}
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
                            ? "text-accent bg-accent-bg"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-alt"
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
              className="text-sm px-4 py-1.5 rounded-lg transition-all duration-200"
              style={{
                background: navTransparent ? 'rgba(13,107,61,0.8)' : '#0D6B3D',
                color: '#F8F6F1',
              }}
            >
              Ask a Question
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors"
            aria-label="Toggle menu"
            style={{ color: navTransparent ? '#F8F6F1' : '#5A5A55' }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile hamburger dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-border-light bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 flex flex-col gap-3">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base py-2 transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href)
                      ? "text-accent font-medium"
                      : "text-text-secondary hover:text-text-primary"
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border-light pb-[env(safe-area-inset-bottom)]" aria-label="Mobile navigation">
        <div className="flex items-center justify-around h-14">
          {[
            { href: "/explore", label: "Explore", icon: <Compass className="w-5 h-5" /> },
            { href: "/learn", label: "Learn", icon: <BookOpen className="w-5 h-5" /> },
            { href: "/paths", label: "Paths", icon: <Map className="w-5 h-5" /> },
            { href: "/ask", label: "Ask", icon: <MessageCircle className="w-5 h-5" /> },
            { href: "#more", label: "More", icon: <MoreHorizontal className="w-5 h-5" />, action: true },
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
                  isActive ? "text-accent" : "text-text-muted"
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
