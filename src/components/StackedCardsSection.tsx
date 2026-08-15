import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { Link } from 'react-router-dom';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MOCK_SUBS = [
  { name: 'Netflix Premium', price: '₹649/mo', color: '#E50914', isZombie: false, subtext: 'Active • 2 days ago' },
  { name: 'Cult.fit Elite Gym', price: '₹1,750/mo', color: '#C24A2E', isZombie: true, subtext: 'last used 64 days ago' },
  { name: 'Spotify Family', price: '₹179/mo', color: '#1DB954', isZombie: false, subtext: 'Active • 1 day ago' },
  { name: 'Adobe Creative Cloud', price: '₹2,000/mo', color: '#C24A2E', isZombie: true, subtext: 'last used 114 days ago' },
  { name: 'Medium Publication', price: '₹199/mo', color: '#A3A096', isZombie: false, subtext: 'Active • 5 days ago' },
];

/**
 * Card 01 Illustration: Mock list of 5 subscription rows.
 * Rows 2 and 4 feature pulsing rust "ZOMBIE" badges.
 */
function Card01Illustration() {
  return (
    <div className="surface-card p-5 sm:p-6 space-y-3 font-sans-ui">
      <div className="flex items-center justify-between border-b border-fg/14 pb-3 font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-2">
        <span>DETECTED DEBIT MANDATES</span>
        <span className="text-[#C24A2E]">2 ZOMBIES FLAGGED</span>
      </div>

      <div className="space-y-2.5">
        {MOCK_SUBS.map((sub, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-none border transition-all duration-250 ease-[var(--ease-premium)] ${
              sub.isZombie
                ? 'bg-[#C24A2E]/10 border-[#C24A2E]/40'
                : 'bg-surface border-fg/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-none shrink-0 shadow-sm"
                style={{ backgroundColor: sub.color }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[600] text-fg">{sub.name}</span>
                  {sub.isZombie && (
                    <span className="px-2 py-0.5 rounded-none bg-[#C24A2E]/20 text-[#C24A2E] border border-[#C24A2E]/40 font-mono-tactile text-[9px] font-[600] uppercase tracking-wider animate-pulse">
                      ZOMBIE
                    </span>
                  )}
                </div>
                <span className="font-mono-tactile text-[10px] text-fg-2 block">
                  {sub.subtext}
                </span>
              </div>
            </div>

            <span
              className={`font-mono-tactile text-[12px] font-[600] ${
                sub.isZombie ? 'text-[#C24A2E]' : 'text-fg'
              }`}
            >
              {sub.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Card 02 Illustration: Revocation & Strikethrough Slam.
 * Animated strikethrough draws across zombie names (SVG scaleX),
 * rotated "CANCELLED" stamp slams in (scale 1.6 -> 1, back.out),
 * and savings ticker counts to +₹3,800/mo.
 */
function Card02Illustration() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stamp1Ref = useRef<HTMLDivElement | null>(null);
  const stamp2Ref = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const [savings, setSavings] = useState<number>(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSavings(3800);
      if (line1Ref.current) line1Ref.current.style.transform = 'scaleX(1)';
      if (line2Ref.current) line2Ref.current.style.transform = 'scaleX(1)';
      if (stamp1Ref.current) {
        stamp1Ref.current.style.opacity = '1';
        stamp1Ref.current.style.transform = 'rotate(-12deg) scale(1)';
      }
      if (stamp2Ref.current) {
        stamp2Ref.current.style.opacity = '1';
        stamp2Ref.current.style.transform = 'rotate(-12deg) scale(1)';
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Draw strikethrough lines across zombie names
      tl.to([line1Ref.current, line2Ref.current], {
        scaleX: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // 2. Rotated CANCELLED stamps slam in (scale 1.6 -> 1, back.out)
      tl.fromTo(
        [stamp1Ref.current, stamp2Ref.current],
        { scale: 1.6, opacity: 0, rotation: -22 },
        {
          scale: 1,
          opacity: 1,
          rotation: -12,
          duration: 0.6,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

      // 3. Ticker counts up to +₹3,800/mo
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 3800,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => setSavings(Math.floor(counter.val)),
        },
        '-=0.4'
      );
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="surface-card p-5 sm:p-6 space-y-3 font-sans-ui relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-fg/14 pb-3 font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-2">
        <span>REVOCATION & CANCELLATION</span>
        <span className="text-[#2E5B3F] font-[600]">RECLAIMED: +₹{savings.toLocaleString('en-IN')}/MO</span>
      </div>

      <div className="space-y-2.5 relative">
        {MOCK_SUBS.map((sub, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-none border relative ${
              sub.isZombie
                ? 'bg-[#C24A2E]/10 border-[#C24A2E]/30'
                : 'bg-surface border-fg/10'
            }`}
          >
            <div className="flex items-center gap-3 relative">
              <span
                className="w-3 h-3 rounded-none shrink-0 shadow-sm"
                style={{ backgroundColor: sub.color }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 relative">
                  <span className="text-[13px] font-[600] text-fg relative">
                    {sub.name}

                    {/* Strikethrough Line for Zombies */}
                    {sub.isZombie && (
                      <div
                        ref={i === 1 ? line1Ref : line2Ref}
                        className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#C24A2E] origin-left scale-x-0 will-change-transform"
                      />
                    )}
                  </span>
                </div>
                <span className="font-mono-tactile text-[10px] text-fg-2 block">
                  {sub.subtext}
                </span>
              </div>
            </div>

            <span
              className={`font-mono-tactile text-[12px] font-[600] ${
                sub.isZombie ? 'line-through text-[#C24A2E]' : 'text-fg'
              }`}
            >
              {sub.price}
            </span>

            {/* Rotated CANCELLED Stamp Slam */}
            {sub.isZombie && (
              <div
                ref={i === 1 ? stamp1Ref : stamp2Ref}
                className="absolute right-10 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-none border-2 border-[#C24A2E] bg-canvas/95 text-[#C24A2E] font-mono-tactile text-[10px] sm:text-[11px] font-[600] tracking-widest uppercase shadow-2xl opacity-0 origin-center pointer-events-none"
              >
                CANCELLED
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Card 03 Illustration: SVG Compound Growth Curve.
 * SVG compound curve draws on enter (stroke-dashoffset),
 * moss area fill 12% opacity, pulsing endpoint dot + label
 * "₹2,448/mo → ₹57.4L in 15 yrs @ 12%".
 */
function Card03Illustration() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const areaRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const path = pathRef.current;
    const area = areaRef.current;
    if (!card || !path) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      path.style.strokeDashoffset = '0';
      if (area) area.style.opacity = '1';
      return;
    }

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Draw SVG compound curve
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out',
      });

      // 2. Fade in moss area fill (12% opacity)
      if (area) {
        tl.to(
          area,
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.out',
          },
          '-=0.6'
        );
      }

      // 3. Pulse endpoint dot
      if (dotRef.current) {
        tl.fromTo(
          dotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
          '-=0.2'
        );
      }
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="surface-card p-5 sm:p-6 space-y-4 font-sans-ui relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-fg/14 pb-3 font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-2">
        <span>COMPOUNDING PROJECTION</span>
        <span className="text-[#2E5B3F]">NIFTY 50 INDEX @ 12% IRR</span>
      </div>

      {/* SVG Compound Curve Chart */}
      <div className="relative w-full h-[180px]">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 380 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mossAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E5B3F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2E5B3F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Moss Area Fill 12% Opacity */}
          <path
            ref={areaRef}
            d="M 10 170 C 100 160, 200 120, 360 20 L 360 170 Z"
            fill="url(#mossAreaGrad)"
            opacity="0"
            className="transition-opacity duration-500"
          />

          {/* Compound Curve Line */}
          <path
            ref={pathRef}
            d="M 10 170 C 100 160, 200 120, 360 20"
            stroke="#2E5B3F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Pulsing Endpoint Dot */}
          <circle
            ref={dotRef}
            cx="360"
            cy="20"
            r="6"
            fill="#44805A"
            className="animate-ping origin-center"
            style={{ transformOrigin: '360px 20px' }}
          />
          <circle cx="360" cy="20" r="5" fill="#2E5B3F" stroke="var(--color-ink-primary)" strokeWidth="2" />
        </svg>
      </div>

      {/* Label: "₹2,448/mo → ₹57.4L in 15 yrs @ 12%" */}
      <div className="p-3.5 rounded-none bg-[#2E5B3F]/15 border border-[#2E5B3F]/30 text-center font-mono-tactile">
        <span className="text-[12px] sm:text-[13px] font-[600] tracking-wider text-[#44805A]">
          ₹2,448/mo → ₹57.4L in 15 yrs @ 12%
        </span>
      </div>
    </div>
  );
}

const CARDS_DATA = [
  {
    step: '01',
    title: 'DETECT',
    subtitle: 'On-Device Mandate Telemetry',
    description:
      'ReclaimR scans local SMS logs and bank AutoPay e-mandates locally on your device. Our parser flags recurring debits that haven’t been actively used in 30+ days.',
    accent: '#C24A2E', // Rust
    icon: ShieldCheck,
    tag: 'PRIVACY FIRST • ZERO CLOUD UPLOAD',
    features: [
      'On-device machine learning parser',
      'Detects hidden AutoPay debit mandates',
      'Flags idle services past 30/60/90 days',
    ],
  },
  {
    step: '02',
    title: 'CANCEL',
    subtitle: '1-Tap AutoPay Revocation',
    description:
      'Revoke e-mandates with a single tap. ReclaimR generates NPCI-compliant revocation requests directly through your registered UPI PSP without manual phone calls.',
    accent: '#C24A2E', // Rust
    icon: Zap,
    tag: 'NPCI COMPLIANT • 1-TAP REVOCATION',
    features: [
      'Instant e-mandate revocation dispatch',
      'Eliminates dark pattern cancellation traps',
      'Saves average user ₹1,530 every month',
    ],
  },
  {
    step: '03',
    title: 'GROW',
    subtitle: 'Automated Micro-SIP Diversion',
    description:
      'Every rupee reclaimed from zombie subscriptions is automatically redirected into high-yielding Nifty 50 Index SIPs, compounding your financial freedom.',
    accent: '#2E5B3F', // Moss
    icon: TrendingUp,
    tag: 'AUTOMATED WEALTH COMPOUNDING',
    features: [
      'Direct diversion to Nifty 50 index funds',
      'Compounds saved cash at 12%+ historical IRR',
      'Turns ₹1,500/mo waste into ₹1.48L in 5 years',
    ],
  },
];

/**
 * StackedCardsSection Component ("The Method")
 * Three full-viewport cards (01 Detect, 02 Cancel, 03 Grow) stacked & pinned.
 * Card 01: Subscription list with pulsing rust "ZOMBIE" badges.
 * Card 02: Revocation strikethroughs & rotated "CANCELLED" stamp slams.
 * Card 03: SVG compound growth curve with 12% moss area fill and pulsing endpoint.
 * Each card is sticky top 10vh.
 * As the next card arrives, the previous card scales down to 0.96 and dims via ScrollTrigger.
 * Gated behind prefers-reduced-motion.
 */
export function StackedCardsSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!container || cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;

        const nextCard = cards[index + 1];

        gsap.to(card, {
          scale: 0.96,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="method"
      className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-canvas text-fg relative z-10 border-b border-fg/14 select-none"
    >
      <div className="max-w-[1280px] mx-auto space-y-12 mb-12">
        {/* Chapter Header */}
        <div className="flex items-center justify-between border-b border-fg/14 pb-6">
          <div>
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F]">
              CHAPTER 03 // THE METHODOLOGY
            </span>
            <h2 className="font-display font-[600] text-[clamp(32px,4.5vw,64px)] text-fg tracking-tight mt-1">
              The Method
            </h2>
          </div>
          <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2 hidden sm:inline">
            3-STEP AUTOMATED PIPELINE
          </span>
        </div>
      </div>

      {/* Stacked Cards Container */}
      <div className="max-w-[1280px] mx-auto space-y-8 relative">
        {CARDS_DATA.map((card, idx) => {
          const IconComp = card.icon;

          return (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardRefs.current[idx] = el;
              }}
              className="relative md:sticky md:top-[10vh] h-auto md:h-[78vh] min-h-0 md:min-h-[520px] max-h-none md:max-h-[760px] w-full rounded-none bg-surface border border-fg/14 p-6 sm:p-10 md:p-16 flex flex-col justify-between shadow-2xl overflow-hidden will-change-transform"
            >
              {/* Card Header Bar */}
              <div className="flex items-center justify-between border-b border-fg/14 pb-6">
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono-tactile text-[14px] font-[600] px-3 py-1 rounded-none border"
                    style={{
                      borderColor: `${card.accent}40`,
                      color: card.accent,
                      backgroundColor: `${card.accent}15`,
                    }}
                  >
                    STEP {card.step}
                  </span>
                  <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2 hidden sm:inline">
                    {card.tag}
                  </span>
                </div>

                <IconComp className="w-6 h-6" style={{ color: card.accent }} />
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="font-display font-[600] text-[clamp(40px,6vw,92px)] leading-none text-fg tracking-tight">
                    {card.title}
                  </h3>
                  <p className="font-sans-ui text-[18px] sm:text-[22px] font-[600] text-fg-2">
                    {card.subtitle}
                  </p>
                  <p className="font-sans-ui text-[15px] sm:text-[16px] leading-[1.6] text-fg-2/90 max-w-[620px]">
                    {card.description}
                  </p>
                </div>

                {/* Right Illustration Column */}
                <div className="lg:col-span-5">
                  {idx === 0 ? (
                    <Card01Illustration />
                  ) : idx === 1 ? (
                    <Card02Illustration />
                  ) : (
                    <Card03Illustration />
                  )}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="flex items-center justify-between border-t border-fg/14 pt-6">
                <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2">
                  RECLAIMR PROTOCOL // PHASE 0{idx + 1}
                </span>

                <Magnetic>
                  <Link
                    to="/onboarding"
                    data-cursor-label="START"
                    className="btn-premium inline-flex items-center gap-2 px-5 py-2.5 text-prominent-fg font-sans-ui text-[13px] font-[600] tracking-tight focus-visible:ring-2 ring-rust ring-offset-2 outline-none"
                  >
                    <span>Execute {card.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-prominent-fg" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StackedCardsSection;
