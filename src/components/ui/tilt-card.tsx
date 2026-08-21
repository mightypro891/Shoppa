'use client';

import { useRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Keep small — this should feel like a physical object catching light, not a spinning card. */
  maxTilt?: number;
  /** How much the card lifts toward the cursor, in pixels. */
  lift?: number;
  glare?: boolean;
}

/**
 * Wraps children in a card that tilts toward the cursor in 3D and casts a
 * matching directional shadow, like picking something up off a shelf and
 * turning it in the light. Applies transforms directly to the DOM node
 * (not React state) so mousemove never triggers a re-render.
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 10,
  lift = 6,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px) scale3d(1.02, 1.02, 1.02)`;

      const shadowX = (px - 0.5) * -20;
      const shadowY = (py - 0.5) * -20 + 14;
      el.style.boxShadow = `${shadowX}px ${shadowY}px 30px -8px hsl(var(--foreground) / 0.25)`;

      if (glare && glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, hsl(var(--primary-foreground) / 0.35), transparent 60%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
    el.style.boxShadow = '';
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const wrapperStyle: CSSProperties = {
    transformStyle: 'preserve-3d',
    transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={wrapperStyle}
      className={cn('relative', className)}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500"
        />
      )}
    </div>
  );
}
