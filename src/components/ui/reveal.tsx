'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal animation starts, for staggering groups of elements. */
  delay?: number;
  /** How much of the element must be visible before it triggers, 0-1. */
  threshold?: number;
}

/**
 * Fades and rises children into place the first time they scroll into view.
 * Falls back to showing content immediately when JS hasn't hydrated yet or
 * the user prefers reduced motion, so nothing is ever hidden from crawlers
 * or accessibility tools.
 */
export default function Reveal({ children, className, delay = 0, threshold = 0.15 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ animationDelay: isVisible ? `${delay}ms` : undefined }}
      className={cn(
        isVisible ? 'animate-rise-in' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
