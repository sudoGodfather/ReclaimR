import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MANIFESTO_TEXT = `Every month, thousands of silent e-mandates execute across Indian bank accounts without warning. Forgotten streaming trials, unused gym memberships, neglected SaaS tools, and auto-renewing publications drain urban households of over ₹14,400 each year. This is the invisible rot of financial decay — passive wealth erosion hidden behind automated UPI AutoPay notifications. You earned this capital through focus and discipline, yet it dissolves silently into corporate balance sheets. ReclaimR exists to halt this entropy. Our on-device intelligence audits your debit mandates locally, exposes recurring zombie charges, revokes unneeded mandates with a single tap, and channels every reclaimed rupee directly into high-yielding Nifty 50 SIPs. Stop paying for forgotten subscriptions. Reclaim your monetary sovereignty.`;

/**
 * InvisibleDrainSection Component
 * Features a ~120-word manifesto about zombie subscription decay.
 * Words are split into individual spans with opacity scrubbed from 0.12 to 1
 * tied to scroll progress through the block using GSAP ScrollTrigger.
 * Styled in Fraunces, 28–34px, line-height 1.5.
 * Gated behind prefers-reduced-motion.
 */
export function InvisibleDrainSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const words = MANIFESTO_TEXT.split(' ');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || wordsRef.current.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      wordsRef.current.forEach((word) => {
        if (word) word.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="w-full py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-canvas text-fg border-b border-fg/14 relative z-10 select-none"
    >
      <div className="max-w-[1080px] mx-auto space-y-8">
        {/* Small-caps Section Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="font-mono-tactile text-[11px] sm:text-[12px] font-[600] uppercase tracking-[0.2em] text-[#C24A2E]">
            CHAPTER 01 // THE INVISIBLE DRAIN
          </span>
          <span className="h-[1px] w-12 bg-[#C24A2E]/40" />
        </div>

        {/* Manifesto Word-Scrubbing Paragraph: Fraunces, 28-34px, line-height 1.5 */}
        <p className="font-display font-[500] text-[28px] sm:text-[32px] md:text-[34px] leading-[1.5] text-fg">
          {words.map((word, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) wordsRef.current[index] = el;
              }}
              className="inline-block mr-[0.28em] will-change-opacity"
              style={{ opacity: 0.12 }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Section Metadata Footer */}
        <div className="pt-8 border-t border-fg/14 flex flex-wrap items-center justify-between gap-4 font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2">
          <span>ESTIMATED ANNUAL BLEED: ₹14,400/HH</span>
          <span>ON-DEVICE UPI AUDIT ACTIVE</span>
        </div>
      </div>
    </section>
  );
}

export default InvisibleDrainSection;
