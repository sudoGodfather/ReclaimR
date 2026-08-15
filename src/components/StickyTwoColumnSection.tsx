import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './Reveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PARAGRAPHS = [
  {
    tag: '01 / SILENT AUTOPAY MANDATES',
    title: 'The Invisible Drain of Autopay',
    text: 'Modern subscription flows are designed to be friction-free on entry and impossible to track over time. Debit mandates quietly execute every 30 days, withdrawing ₹499 here and ₹1,750 there without requiring explicit user authentication.',
  },
  {
    tag: '02 / UNUSED CAPACITY',
    title: 'Paying for Ghost Services',
    text: 'Our financial telemetry reveals that 73% of urban subscribers haven’t opened their paid media, gym, or SaaS apps in over 60 days. You are effectively financing corporate margins for services you no longer consume.',
  },
  {
    tag: '03 / ON-DEVICE DECAY ENGINE',
    title: 'Local Privacy-Preserving Detection',
    text: 'ReclaimR runs an on-device machine learning parser directly over local SMS and bank notifications. Zero transaction data ever leaves your device. No cloud uploads, no third-party data broker leaks.',
  },
  {
    tag: '04 / THE DIVERSION COMPOUNDER',
    title: 'Converting Waste into Sovereign Wealth',
    text: 'Revoking an unneeded ₹1,200/month mandate isn’t just saving pocket change — when automatically diverted into Nifty 50 index SIPs, that single canceled charge compounds to over ₹1,48,500 over 5 years.',
  },
];

const HEADLINE_WORDS = 'You are bleeding money in your sleep.'.split(' ');

/**
 * StickyTwoColumnSection Component
 * Left column: sticky at top 20vh with giant Fraunces serif headline
 * "You are bleeding money in your sleep." + SVG rust draw-on underline (#C24A2E).
 * Headline words "bleed" rust left→right, scrubbed against the 4 statements:
 * fill starts as the right column enters and completes when the 4th
 * statement reaches the viewport center.
 * Right column: 4 short paragraphs wrapped in <Reveal>, separated by hairline dividers.
 * Motion gated behind prefers-reduced-motion.
 */
export function StickyTwoColumnSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    const rightCol = rightColRef.current;
    if (!path || !section || !rightCol) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const words = Array.from(section.querySelectorAll<HTMLElement>('.fill-word-over'));

    if (prefersReducedMotion) {
      path.style.strokeDashoffset = '0';
      words.forEach((word) => {
        word.style.backgroundSize = '100% 100%';
      });
      return;
    }

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });

      const bleedTl = gsap.timeline({
        scrollTrigger: {
          trigger: rightCol,
          start: 'top 55%',
          end: 'bottom 45%',
          scrub: 1,
        },
      });

      words.forEach((word, i) => {
        bleedTl.to(
          word,
          {
            backgroundSize: '100% 100%',
            duration: 1,
            ease: 'none',
          },
          i * 0.12
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-canvas text-fg border-b border-fg/14 relative z-10 select-none"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Sticky Column (top 20vh) */}
        <div className="lg:col-span-5 lg:sticky lg:top-[20vh] space-y-6 self-start">
          <div className="flex items-center gap-3">
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#C24A2E]">
              CHAPTER 02 // MONETARY RECOVERY
            </span>
          </div>

          <div className="relative">
            <h2 className="font-display font-[600] text-[clamp(32px,4vw,56px)] leading-[1.08] text-fg tracking-tight">
              {HEADLINE_WORDS.map((word, i) => (
                <React.Fragment key={i}>
                  {i > 0 && ' '}
                  <span className="fill-word">
                    <span className="fill-word-base">{word}</span>
                    <span className="fill-word-over" aria-hidden="true">
                      {word}
                    </span>
                  </span>
                </React.Fragment>
              ))}
            </h2>

            {/* SVG Rust Draw-on Underline (#C24A2E) */}
            <svg
              className="w-full h-6 mt-3 overflow-visible pointer-events-none"
              viewBox="0 0 400 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={pathRef}
                d="M 5 12 Q 100 18 200 10 T 395 14"
                stroke="#C24A2E"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="font-sans-ui text-[14px] text-fg-2 leading-relaxed max-w-[420px]">
            Every recurring debit mandate you ignore compounds against your future financial independence.
          </p>
        </div>

        {/* Right Column: 4 short paragraphs, each <Reveal>, separated by hairlines */}
        <div ref={rightColRef} className="lg:col-span-7 divide-y divide-fg/14">
          {PARAGRAPHS.map((item, idx) => (
            <div key={idx} className="py-10 first:pt-0 last:pb-0 space-y-4">
              <Reveal delay={idx * 0.1}>
                <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.15em] text-[#2E5B3F] block">
                  {item.tag}
                </span>
              </Reveal>

              <Reveal delay={idx * 0.1 + 0.1}>
                <h3 className="font-sans-ui font-[600] text-[20px] sm:text-[24px] text-fg tracking-tight">
                  {item.title}
                </h3>
              </Reveal>

              <Reveal delay={idx * 0.1 + 0.2}>
                <p className="font-sans-ui text-[15px] sm:text-[16px] leading-[1.6] text-fg-2">
                  {item.text}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StickyTwoColumnSection;
