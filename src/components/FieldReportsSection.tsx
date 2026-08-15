import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FIELD_REPORTS = [
  {
    quote: "ReclaimR flagged a ₹1,750 gym mandate I hadn't stepped into since November. Canceled in 30 seconds flat.",
    author: 'ROHAN K.',
    city: 'BOMBAY',
    reclaimed: '₹21,600/YR RECLAIMED',
    rotation: '-2.2deg',
  },
  {
    quote: 'I was paying for 4 separate OTT bundles without realizing. Now that money goes straight into my Nifty 50 SIP.',
    author: 'ANANYA M.',
    city: 'BANGALORE',
    reclaimed: '₹15,400/YR RECLAIMED',
    rotation: '1.8deg',
  },
  {
    quote: 'The on-device SMS parser is genius. Zero transaction data left my phone, yet it found 6 ghost mandates instantly.',
    author: 'DEV V.',
    city: 'DELHI NCR',
    reclaimed: '₹18,200/YR RECLAIMED',
    rotation: '-1.5deg',
  },
  {
    quote: 'Silent AutoPay charges are a real plague. ReclaimR gave me complete monetary sovereignty over my debit accounts.',
    author: 'PRIYA S.',
    city: 'HYDERABAD',
    reclaimed: '₹12,600/YR RECLAIMED',
    rotation: '2.4deg',
  },
  {
    quote: 'Seeing my canceled zombie subscriptions compound into real index equity on the dashboard is insanely empowering.',
    author: 'VIKRAM T.',
    city: 'PUNE',
    reclaimed: '₹24,000/YR RECLAIMED',
    rotation: '-1.8deg',
  },
];

/**
 * FieldReportsSection Component
 * 5 Postcard Cards scattered with rotate(-3..3deg), Fraunces serif quote + name/city small caps.
 * Hover: rotate 0, y -6, soft shadow.
 * Staggered scroll reveal on desktop.
 * Converts to horizontal snap-scroll on mobile (< 768px).
 * Gated behind prefers-reduced-motion.
 */
export function FieldReportsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      cards.forEach((card) => {
        if (card) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 36,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
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
      id="field-reports"
      className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-canvas text-fg relative z-10 border-b border-fg/14 select-none"
    >
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Chapter Header */}
        <div className="flex items-center justify-between border-b border-fg/14 pb-6">
          <div>
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F]">
              CHAPTER 06 // USER TELEMETRY
            </span>
            <h2 className="font-display font-[600] text-[clamp(32px,4.5vw,64px)] text-fg tracking-tight mt-1">
              Field Reports
            </h2>
          </div>
          <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2 hidden sm:inline">
            VERIFIED CITIZEN RECOVERIES
          </span>
        </div>

        {/* 5 Postcard Cards Grid (Horizontal snap-scroll on mobile < 768px, grid on desktop) */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-none">
          {FIELD_REPORTS.map((report, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              style={{ transform: `rotate(${report.rotation})` }}
              className="shrink-0 w-[300px] sm:w-[340px] md:w-auto snap-center p-7 rounded-none bg-surface border border-fg/14 hover:border-[#2E5B3F] hover:!rotate-0 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-between space-y-6 group will-change-transform"
            >
              {/* Card Header: Reclaimed Badge */}
              <div className="flex items-center justify-between border-b border-fg/14 pb-3">
                <span className="font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.15em] text-[#2E5B3F]">
                  {report.reclaimed}
                </span>
                <Quote className="w-4 h-4 text-[#C24A2E]/60 group-hover:text-[#C24A2E] transition-colors" />
              </div>

              {/* Card Body: Serif Quote */}
              <blockquote className="font-display italic text-[16px] sm:text-[17px] leading-[1.6] text-fg">
                “{report.quote}”
              </blockquote>

              {/* Card Footer: Name / City Small-Caps */}
              <div className="pt-4 border-t border-fg/14 flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2">
                <span className="font-[600] text-fg">{report.author}</span>
                <span>{report.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldReportsSection;
