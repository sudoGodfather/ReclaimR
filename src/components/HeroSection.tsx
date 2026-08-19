import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Reveal } from './Reveal';
import { Magnetic } from './Magnetic';
import { scrollTo } from '../lib/motion';
import { Plus } from 'lucide-react';
import { InteractiveBoxesBackground } from './InteractiveBoxesBackground';

export interface HeroSectionProps {
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const heroLayerRef = useRef<HTMLDivElement | null>(null);

  // Subtle mouse parallax on hero text
  useEffect(() => {
    const layer = heroLayerRef.current;
    if (!layer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarse) return;

    const xTo = gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power3.out' });

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      xTo(normX * 8);
      yTo(normY * 8);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      gsap.killTweensOf(layer);
    };
  }, []);

  return (
    <section className="min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 md:px-16 relative overflow-hidden bg-[#000000] text-white select-none border-b border-white/10">
      {/* 3D Interactive Diamond Cube Cluster & Neon Underglow Background */}
      <div className="absolute inset-0 z-0">
        <InteractiveBoxesBackground boxSize={74} maxElevation={64} interactiveRadius={240} />
      </div>

      {/* Top spacer to let the 3D diamond cube cluster shine in the center-top */}
      <div className="w-full h-16 md:h-28 pointer-events-none" />

      {/* Hero Foreground Content */}
      <div
        ref={heroLayerRef}
        className="max-w-[1360px] mx-auto w-full z-10 will-change-transform pointer-events-none mt-auto pb-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column: Headline & Category Tags */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={0.1}>
              <div className="flex items-center gap-2 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#38bdf8]">
                <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse shadow-[0_0_8px_#00d2ff]" />
                <span>AUTONOMOUS WEALTH RECLAMATION</span>
              </div>
            </Reveal>

            {/* Main Headline */}
            <div className="overflow-hidden py-1">
              <h1 className="font-sans font-[700] tracking-[-0.03em] text-white leading-[1.04] text-[clamp(2.75rem,6.5vw,5.5rem)] text-balance">
                We're Building <br />
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Cool Experiences
                </span>
              </h1>
            </div>

            {/* Category / Pillar Tags (matching AI \ WEB3 \ UI \ 3D \ MOTION style) */}
            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] font-mono tracking-[0.2em] text-white/50 uppercase pt-2">
                <span className="text-white/80 hover:text-[#00d2ff] transition-colors">AI</span>
                <span className="text-white/25">\</span>
                <span className="text-white/80 hover:text-[#38bdf8] transition-colors">WEB3</span>
                <span className="text-white/25">\</span>
                <span className="text-white/80 hover:text-[#a855f7] transition-colors">UI</span>
                <span className="text-white/25">\</span>
                <span className="text-white/80 hover:text-[#ec4899] transition-colors">3D</span>
                <span className="text-white/25">\</span>
                <span className="text-white/80 hover:text-[#00d2ff] transition-colors">MOTION</span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Subtitle & Action Buttons */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6 pointer-events-auto">
            <Reveal delay={0.4} blur>
              <p className="font-sans text-[15px] sm:text-[17px] text-white/70 leading-[1.5] max-w-[460px]">
                Crafting Awesome Stories and Killer Designs to Make Brand Stand Out. Detect forgotten subscriptions and divert leakages into wealth.
              </p>
            </Reveal>

            {/* Action Buttons */}
            <Reveal delay={0.5} blur>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Contact Us Pill */}
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => scrollTo('#manifesto')}
                    data-cursor-label="CONTACT"
                    className="inline-flex items-center justify-center h-[50px] px-7 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-sans font-[500] text-[14px] tracking-tight transition-all duration-200 backdrop-blur-md cursor-pointer hover:border-white/40"
                  >
                    Contact Us
                  </button>
                </Magnetic>

                {/* Get Started Pill with Glowing Cyan Plus Circle */}
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => {
                      if (onExploreClick) onExploreClick();
                      else scrollTo('#manifesto');
                    }}
                    data-cursor-label="START"
                    className="inline-flex items-center gap-3 h-[50px] pl-7 pr-2 rounded-full bg-[#08080c] hover:bg-[#12131c] text-white border border-white/15 font-sans font-[600] text-[14px] tracking-tight transition-all duration-200 backdrop-blur-md cursor-pointer group shadow-[0_0_20px_rgba(0,210,255,0.15)] hover:shadow-[0_0_30px_rgba(0,210,255,0.3)] hover:border-[#00d2ff]/50"
                  >
                    <span>Get Started</span>
                    <span className="w-9 h-9 rounded-full bg-[#00d2ff] group-hover:bg-[#38bdf8] flex items-center justify-center text-black transition-transform duration-200 group-hover:rotate-90 shadow-[0_0_12px_#00d2ff]">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </span>
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
