import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface MagneticProps {
  children: React.ReactElement;
  maxDistance?: number;
  duration?: number;
  className?: string;
}

/**
 * Magnetic Component
 * Wraps child elements (e.g. CTA buttons) and smoothly pulls them toward
 * the cursor up to maxDistance (default 6px), springing back with GSAP elastic ease on leave.
 * Motion is gated behind prefers-reduced-motion.
 */
export function Magnetic({
  children,
  maxDistance = 6,
  duration = 0.8,
  className = '',
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarse) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxRadius = Math.max(rect.width, rect.height) / 2;
      const distance = Math.hypot(deltaX, deltaY);
      const pullRatio = Math.min(distance / maxRadius, 1);

      const targetX = (deltaX / (rect.width / 2)) * maxDistance * pullRatio;
      const targetY = (deltaY / (rect.height / 2)) * maxDistance * pullRatio;

      gsap.to(el, {
        x: Math.max(-maxDistance, Math.min(maxDistance, targetX)),
        y: Math.max(-maxDistance, Math.min(maxDistance, targetY)),
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handlePointerLeave = () => {
      // Spring back with GSAP elastic ease on leave
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: duration,
        ease: 'elastic.out(1.2, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      gsap.killTweensOf(el);
    };
  }, [maxDistance, duration]);

  return (
    <div
      ref={containerRef}
      className={`inline-block will-change-transform ${className}`}
      data-hover="true"
    >
      {children}
    </div>
  );
}

export default Magnetic;
