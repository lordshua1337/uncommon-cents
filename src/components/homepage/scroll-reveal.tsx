"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRING_GENTLE } from "@/lib/animation-constants";

interface ScrollRevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ ...SPRING_GENTLE, delay }}
    >
      {children}
    </motion.div>
  );
}
