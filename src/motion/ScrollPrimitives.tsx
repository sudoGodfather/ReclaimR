import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNumberCounter, useParallax, usePrefersReducedMotion } from './useScrollAnimation';
import { FinancialFigure } from '../components/ui';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/* 1. ScrollReveal Component                                          */
/* ------------------------------------------------------------------ */

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  scale?: number;
  stagger?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  distance = 36,
  duration = 1,
  delay = 0,
  scale = 0.96,
  stagger = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    let x = 0;
    let y = 0;

    if (direction === 'up') y = distance;
    if (direction === 'down') y = -distance;
    if (direction === 'left') x = distance;
    if (direction === 'right') x = -distance;

    const targetElements = stagger > 0 && containerRef.current.children.length > 0
      ? Array.from(containerRef.current.children)
      : [containerRef.current];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targetElements,
        {
          opacity: 0,
          x,
          y,
          scale: scale !== 1 ? scale : 1,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction, distance, duration, delay, scale, stagger, isReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. TextReveal Component (Word / Character Stagger)                 */
/* ------------------------------------------------------------------ */

interface TextRevealProps {
  text: string;
  type?: 'words' | 'chars';
  staggerDuration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  type = 'words',
  staggerDuration = 0.04,
  className = '',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  const tokens = type === 'words' ? text.split(' ') : text.split('');

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.reveal-token');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 20,
            rotateX: -20,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: staggerDuration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [staggerDuration, isReducedMotion]);

  const Tag = (Component || 'div') as React.ElementType;

  if (isReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={containerRef} className={`perspective-1000 ${className}`}>
      {tokens.map((token, idx) => (
        <span
          key={`${token}-${idx}`}
          className="reveal-token inline-block transform-gpu"
          style={{ marginRight: type === 'words' ? '0.25em' : '0.02em' }}
        >
          {token === ' ' ? '\u00A0' : token}
        </span>
      ))}
    </Tag>
  );
};

/* ------------------------------------------------------------------ */
/* 3. ClipImageReveal Component (Clip-Path Reveal)                    */
/* ------------------------------------------------------------------ */

interface ClipImageRevealProps {
  children: React.ReactNode;
  direction?: 'left-to-right' | 'bottom-to-top' | 'center-out';
  duration?: number;
  className?: string;
}

export const ClipImageReveal: React.FC<ClipImageRevealProps> = ({
  children,
  direction = 'bottom-to-top',
  duration = 1.2,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion || !ref.current) return;

    let initialClip = 'inset(100% 0% 0% 0%)';
    if (direction === 'left-to-right') initialClip = 'inset(0% 100% 0% 0%)';
    if (direction === 'center-out') initialClip = 'inset(50% 50% 50% 50%)';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: initialClip },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [direction, duration, isReducedMotion]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 4. NumberCounter Component (Animated Financial Figures)             */
/* ------------------------------------------------------------------ */

interface NumberCounterProps {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'ink' | 'forest' | 'crimson' | 'gold';
  className?: string;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  targetValue,
  prefix = '₹',
  suffix,
  durationMs = 1500,
  size = 'md',
  variant = 'ink',
  className = '',
}) => {
  const { value, ref } = useNumberCounter(targetValue, durationMs, true);

  return (
    <div ref={ref} className="inline-block">
      <FinancialFigure
        value={value}
        prefix={prefix}
        suffix={suffix}
        size={size}
        variant={variant}
        className={className}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 5. ParallaxBox Component                                           */
/* ------------------------------------------------------------------ */

interface ParallaxBoxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxBox: React.FC<ParallaxBoxProps> = ({
  children,
  speed = 0.15,
  className = '',
}) => {
  const parallaxRef = useParallax(speed);

  return (
    <div ref={parallaxRef as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 6. PinnedStorySection Component                                    */
/* ------------------------------------------------------------------ */

interface PinnedStorySectionProps {
  children: React.ReactNode;
  pinnedContent: React.ReactNode;
  className?: string;
}

export const PinnedStorySection: React.FC<PinnedStorySectionProps> = ({
  children,
  pinnedContent,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: pinRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div ref={containerRef} className={`relative flex flex-col md:flex-row ${className}`}>
      <div ref={pinRef} className="md:w-1/2 h-screen sticky top-0 flex items-center justify-center p-6">
        {pinnedContent}
      </div>
      <div className="md:w-1/2 space-y-24 py-24 px-6">{children}</div>
    </div>
  );
};
