"use client";

import { useRef, useState, useEffect, Children } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRING_SNAPPY, SPRING_GENTLE, STAGGER_FAST } from "@/lib/animation-constants";

interface AnimatedCardGridProps {
  readonly children: React.ReactNode[];
  readonly accentColor?: string;
  readonly className?: string;
}

export function AnimatedCardGrid({
  children,
  accentColor,
  className,
}: AnimatedCardGridProps) {
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
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const color = accentColor ?? "#16A34A";
  const hoverBoxShadow = `0 8px 24px ${color}28, 0 2px 8px ${color}14`;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ ...SPRING_GENTLE, delay: index * STAGGER_FAST }}
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: hoverBoxShadow,
            transition: SPRING_SNAPPY,
          }}
          whileTap={{
            scale: 0.98,
            transition: SPRING_SNAPPY,
          }}
          style={{ willChange: "transform" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
