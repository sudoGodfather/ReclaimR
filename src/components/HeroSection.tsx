import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Words } from './Words';
import { Reveal } from './Reveal';
import { Magnetic } from './Magnetic';
import { scrollTo } from '../lib/motion';
import { ArrowDownRight, ShieldCheck } from 'lucide-react';

export interface HeroSectionProps {
  onExploreClick?: () => void;
}

const TARGET_TEXT = 'ReclaimR';
const SCRAMBLE_CHARSET = ['₹', '#', '0', '1', '/', '•', '$', '%', '&', '*'];

/**
 * Custom hook for one-time scramble-decode text effect
 * Scrambles target text using charset ₹#01/• over 900ms duration.
 * Gated behind prefers-reduced-motion.
 */
function useScrambleText(target: string, durationMs: number = 900): string {
  const [displayText, setDisplayText] = useState<string>(target);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(target);
      return;
    }

    const startTime = performance.now();
    let animId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Calculate how many characters have been resolved
      const revealedCount = Math.floor(progress * target.length);

      let current = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealedCount) {
          current += target[i];
        } else {
          const randomGlyph = SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
          current += randomGlyph;
        }
      }

      setDisplayText(current);

      if (progress < 1) {
        animId = requestAnimationFrame(update);
      } else {
        setDisplayText(target);
      }
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [target, durationMs]);

  return displayText;
}

/**
 * HeroSection Component (100svh)
 * Micro-interactions:
 * - One-time scramble-decode on H1 (charset ₹#01/•, 900ms)
 * - Mouse parallax on hero layers via gsap.quickTo (max 12px)
 * - Gated behind prefers-reduced-motion
 */
export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const [liveDate, setLiveDate] = useState<string>('');
  const scrambledHeadline = useScrambleText(TARGET_TEXT, 900);
  const heroLayerRef = useRef<HTMLDivElement | null>(null);

  // Live date formatting
  useEffect(() => {
    const now = new Date();
    const formatted = now
      .toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase();
    setLiveDate(formatted);
  }, []);

  // Mouse parallax on hero layers via gsap.quickTo (max 12px displacement)
  useEffect(() => {
    const layer = heroLayerRef.current;
    if (!layer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarse) return;

    const xTo = gsap.quickTo(layer, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(layer, 'y', { duration: 0.5, ease: 'power3.out' });

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      xTo(normX * 12);
      yTo(normY * 12);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      gsap.killTweensOf(layer);
    };
  }, []);

  return (
    <section className="h-[100svh] min-h-[640px] w-full flex flex-col justify-between pt-24 pb-8 px-6 sm:px-10 md:px-16 relative overflow-hidden bg-canvas text-fg select-none border-b border-fg/14">
      {/* Signature depth layer: moss glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(70vw,720px)] aspect-square rounded-none bg-[radial-gradient(circle,rgba(46,91,63,0.14)_0%,rgba(46,91,63,0)_65%)] blur-[6px]" />
      </div>
      {/* Parallax Content Container */}
      <div
        ref={heroLayerRef}
        className="my-auto max-w-[1280px] mx-auto w-full space-y-6 md:space-y-8 z-10 will-change-transform"
      >
        {/* Small-caps eyebrow line */}
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-none bg-[#2E5B3F] animate-pulse" />
            <span className="font-mono-tactile text-[11px] sm:text-[12px] font-[600] uppercase tracking-[0.2em] text-fg-2">
              A PERSONAL-FINANCE INTERVENTION
            </span>
          </div>
        </Reveal>

        {/* H1 "ReclaimR" with scramble-decode & line-mask reveal */}
        <div className="overflow-hidden py-1">
          <Words
            as="h1"
            delay={0.2}
            className="font-display font-[600] tracking-tighter text-fg leading-[1.02] text-[clamp(3.5rem,12vw,11rem)]"
          >
            {scrambledHeadline}
          </Words>
        </div>

        {/* Italic subheadline — "rot" rendered in rust as the decay signal */}
        <Reveal delay={0.4} blur>
          <p className="font-display italic text-[24px] sm:text-[36px] md:text-[46px] font-[500] text-fg-2 leading-[1.1] max-w-[800px]">
            Stop the <span className="text-[#E06A45]">rot</span>. Start the growth.
          </p>
        </Reveal>

        {/* Action CTAs */}
        <Reveal delay={0.5} blur>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollTo('#manifesto')}
                data-cursor-label="EXPLORE"
                className="btn-premium inline-flex items-center gap-2 h-[48px] px-6 text-prominent-fg font-sans-ui font-[600] text-[14px] tracking-tight hover:bg-[var(--color-prominent-hover)] cursor-pointer"
              >
                <span>Audit Your Leaks</span>
                <ArrowDownRight className="w-4 h-4 text-prominent-fg" />
              </button>
            </Magnetic>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-none border border-fg/14 bg-surface/60 backdrop-blur-sm text-fg-2 font-mono-tactile text-[11px] uppercase tracking-[0.12em]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E5B3F]" />
              <span>ON-DEVICE MANDATE DECAY SCAN</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom Metadata & Scroll Indicator Bar */}
      <div className="w-full max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-fg/14 z-10">
        {/* Meta Line: LIVE date + City in small-caps */}
        <div className="flex items-center gap-4 font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.15em] text-fg-2">
          <span>{liveDate || 'AUGUST 2026'}</span>
          <span className="text-[#C24A2E]">•</span>
          <span>MUMBAI / BENGALURU, IN</span>
          <span className="hidden md:inline text-[#C24A2E]">•</span>
          <span className="hidden md:inline">SYSTEM VER 4.2.0</span>
        </div>

        {/* Bottom SCROLL indicator: 1px line growing in loop + letter-spaced label */}
        <button
          type="button"
          onClick={() => scrollTo('#manifesto')}
          aria-label="Scroll down to explore"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <span className="font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.25em] text-fg-2 group-hover:text-fg transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-[1px] h-8 bg-prominent/20 relative overflow-hidden rounded-none">
            <div className="w-full h-1/2 bg-prominent animate-scroll-line" />
          </div>
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
