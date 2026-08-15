import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ghost, IndianRupee, TrendingDown } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

/**
 * StatCard component with 3D perspective hover tilt (rotateX/Y max 4deg)
 * and border shift to moss (#2E5B3F).
 */
function StatCard({ icon, value, label }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarse) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotate max 4deg
      const rotateX = -((y - centerY) / centerY) * 4;
      const rotateY = ((x - centerX) / centerX) * 4;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handlePointerLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div style={{ perspective: 800 }} className="w-full">
      <div
        ref={cardRef}
        className="group relative p-8 rounded-none bg-canvas border border-fg/15 hover:border-[#2E5B3F] hover:shadow-glow-moss transition-all duration-300 shadow-sm will-change-transform flex flex-col justify-between space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-none bg-surface border border-fg/10 text-[#C24A2E]">
            {icon}
          </div>
          <span className="font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-3 group-hover:text-[#2E5B3F] transition-colors">
            METRIC // DECAY
          </span>
        </div>

        <div className="space-y-2">
          <div className="font-display font-[600] text-[clamp(40px,5.5vw,76px)] leading-none text-fg tracking-tight font-numeric-tabular bg-[linear-gradient(180deg,var(--color-ink-primary)_0%,#B8860B_130%)] bg-clip-text text-transparent">
            {value}
          </div>
          <p className="font-mono-tactile text-[11px] sm:text-[12px] font-[600] uppercase tracking-[0.15em] text-fg-2">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * InvertedStatsBand Component
 * Theme-adaptive paper band (light parchment in light mode, dark parchment in dark mode).
 * Three hairline cards with 3D perspective tilt (rotateX/Y max 4deg) and border shift to moss (#2E5B3F).
 * Icons: Ghost, IndianRupee, TrendingDown.
 * Triggers count-up over 1.4s exponential easing when section is 60% visible.
 * Formatted with Fraunces tabular numerals.
 * Gated behind prefers-reduced-motion.
 */
export function InvertedStatsBand() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [val1, setVal1] = useState<number>(0);
  const [val2, setVal2] = useState<number>(0);
  const [val3, setVal3] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVal1(9);
      setVal2(18400);
      setVal3(4.6);
      return;
    }

    const targets = { v1: 0, v2: 0, v3: 0 };

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        v1: 9,
        v2: 18400,
        v3: 4.6,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          setVal1(Math.floor(targets.v1));
          setVal2(Math.floor(targets.v2));
          setVal3(Number(targets.v3.toFixed(1)));
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-24 px-6 sm:px-12 md:px-16 bg-surface text-fg border-y border-fg/15 relative z-10 select-none"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Stat 1 Card with Ghost icon */}
        <StatCard
          icon={<Ghost className="w-5 h-5 text-[#C24A2E]" />}
          value={val1.toString()}
          label="unused subscriptions (avg user)"
        />

        {/* Stat 2 Card with IndianRupee icon */}
        <StatCard
          icon={<IndianRupee className="w-5 h-5 text-[#C24A2E]" />}
          value={`₹${val2.toLocaleString('en-IN')}`}
          label="wasted / year"
        />

        {/* Stat 3 Card with TrendingDown icon */}
        <StatCard
          icon={<TrendingDown className="w-5 h-5 text-[#C24A2E]" />}
          value={`₹${val3.toFixed(1)}L`}
          label="opportunity lost in 10 yrs"
        />
      </div>
    </section>
  );
}

export default InvertedStatsBand;
