import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  delay?: number;
  once?: boolean;
  duration?: number;
  distance?: number;
  blur?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reveal Component
 * Animates child elements with opacity fade and y-axis translation on scroll.
 * Uses GSAP ScrollTrigger with power3.out easing.
 * Optional blur-in for hero-grade reveals. Gates all motion behind prefers-reduced-motion.
 */
export function Reveal({
  as: Component = 'div',
  delay = 0,
  once = true,
  duration = 0.8,
  distance = 20,
  blur = false,
  className = '',
  children,
  ...rest
}: RevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Ensure element is fully visible without motion
      gsap.set(el, { opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: distance,
          ...(blur ? { filter: 'blur(4px)' } : {}),
        },
        {
          opacity: 1,
          y: 0,
          ...(blur ? { filter: 'blur(0px)' } : {}),
          duration: duration,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, distance, duration, once, blur]);

  const ElementType = Component as React.ElementType;

  return (
    <ElementType
      ref={containerRef}
      className={className}
      {...rest}
    >
      {children}
    </ElementType>
  );
}

export default Reveal;
