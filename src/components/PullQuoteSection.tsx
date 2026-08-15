import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PullQuoteSection Component
 * Full-bleed section featuring the core brand quote:
 * "Every unused subscription is a vote for the person you were, not the person you're becoming."
 * Set in giant Fraunces italic with oversized rust quotation marks (#C24A2E).
 * Animates scale from 0.92 to 1 and opacity on enter via ScrollTrigger.
 * Motion gated behind prefers-reduced-motion.
 */
export function PullQuoteSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      container.style.opacity = '1';
      container.style.transform = 'scale(1)';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        {
          scale: 0.92,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-28 sm:py-36 md:py-48 px-6 sm:px-12 md:px-20 bg-canvas text-fg border-b border-fg/14 relative z-10 overflow-hidden select-none"
    >
      <div
        ref={containerRef}
        className="max-w-[1200px] mx-auto relative flex flex-col items-center text-center will-change-transform"
      >
        {/* Oversized Rust Opening Quotation Mark (#C24A2E) */}
        <span
          aria-hidden="true"
          className="font-display text-[#C24A2E] text-[120px] sm:text-[180px] md:text-[240px] leading-none absolute -top-16 sm:-top-28 md:-top-36 left-0 sm:left-4 md:left-8 opacity-40 select-none pointer-events-none"
        >
          “
        </span>

        <blockquote className="relative z-10 space-y-6">
          <p className="font-display italic font-[600] text-[clamp(28px,4.8vw,68px)] leading-[1.12] text-fg tracking-tight max-w-[1080px]">
            “Every unused subscription is a vote for the person you were, not the person you’re becoming.”
          </p>

          <footer className="pt-6 font-mono-tactile text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#2E5B3F] font-[600]">
            — RECLAIMR MONETARY MANIFESTO // PRINCIPLE 04
          </footer>
        </blockquote>

        {/* Oversized Rust Closing Quotation Mark (#C24A2E) */}
        <span
          aria-hidden="true"
          className="font-display text-[#C24A2E] text-[120px] sm:text-[180px] md:text-[240px] leading-none absolute -bottom-24 sm:-bottom-36 md:-bottom-44 right-0 sm:right-4 md:right-8 opacity-40 select-none pointer-events-none"
        >
          ”
        </span>
      </div>
    </section>
  );
}

export default PullQuoteSection;
