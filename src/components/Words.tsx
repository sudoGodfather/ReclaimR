import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WordsProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  as?: React.ElementType;
  delay?: number;
  once?: boolean;
  duration?: number;
  stagger?: number;
  className?: string;
}

/**
 * Words Component
 * Splits text into lines and words using SplitType.
 * Animates per-word from y:'110%' inside overflow-hidden line masks.
 * Gates motion behind prefers-reduced-motion.
 */
export function Words({
  children,
  as: Component = 'h2',
  delay = 0,
  once = true,
  duration = 0.9,
  stagger = 0.02,
  className = '',
  ...rest
}: WordsProps) {
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let splitInstance: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    try {
      splitInstance = new SplitType(el, {
        types: 'lines,words',
        lineClass: 'split-line-mask',
        wordClass: 'split-word-item',
      });

      // Style line masks to hide overflow and words for baseline alignment
      if (splitInstance.lines) {
        splitInstance.lines.forEach((line) => {
          line.style.overflow = 'hidden';
          line.style.display = 'block';
          line.style.verticalAlign = 'bottom';
        });
      }

      if (splitInstance.words) {
        splitInstance.words.forEach((word) => {
          word.style.display = 'inline-block';
          word.style.willChange = 'transform, opacity';
        });

        ctx = gsap.context(() => {
          gsap.fromTo(
            splitInstance.words,
            {
              y: '110%',
              opacity: 0,
            },
            {
              y: '0%',
              opacity: 1,
              duration: duration,
              delay: delay,
              stagger: stagger,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: once ? 'play none none none' : 'play reverse play reverse',
              },
            }
          );
        }, el);
      }
    } catch {
      // Fallback gracefully if split-type fails
    }

    return () => {
      if (ctx) ctx.revert();
      if (splitInstance) splitInstance.revert();
    };
  }, [children, delay, duration, once, stagger]);

  const ElementType = Component as React.ElementType;

  return (
    <ElementType
      ref={textRef}
      className={className}
      {...rest}
    >
      {children}
    </ElementType>
  );
}

export default Words;
