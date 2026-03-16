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

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(245, 237, 224, 0.92)'
            : 'rgba(245, 237, 224, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid rgba(196, 166, 122, 0.3)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-[960px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Coins
              className="w-5 h-5 transition-colors"
              style={{ color: '#E05A1B' }}
            />
            <span
              className="font-heading text-base font-bold tracking-tight"
              style={{ color: '#1A1A1A' }}
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
                    color: isActive ? '#2C5F7C' : '#555555',
                    fontWeight: isActive ? 600 : 500,
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
                  color: isSecondaryActive ? '#2C5F7C' : '#555555',
                  fontWeight: isSecondaryActive ? 600 : 500,
                }}
              >
                More
              </button>
              {moreOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-44 py-2 z-50 radius-card shadow-l3"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(196, 166, 122, 0.3)',
                  }}
                >
                  {allMoreLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{
                          color: isActive ? '#2C5F7C' : '#555555',
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? 'rgba(44, 95, 124, 0.08)' : 'transparent',
                        }}
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
              className="uc-button uc-button-primary text-sm"
              style={{ padding: '8px 20px' }}
            >
              Ask a Question
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors"
            aria-label="Toggle menu"
            style={{ color: '#1A1A1A' }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile hamburger dropdown */}
        {isOpen && (
          <div
            className="md:hidden linen-texture"
            style={{
              borderTop: '1px solid rgba(196, 166, 122, 0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {allLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base py-2 transition-colors"
                    style={{
                      color: isActive ? '#2C5F7C' : '#555555',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom tabs */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation"
        style={{
          background: 'rgba(245, 237, 224, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(196, 166, 122, 0.2)',
        }}
      >
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
                  className="flex flex-col items-center gap-0.5"
                  style={{ color: '#C4A67A' }}
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
                className="flex flex-col items-center gap-0.5 transition-colors"
                style={{ color: isActive ? '#E05A1B' : '#C4A67A' }}
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
