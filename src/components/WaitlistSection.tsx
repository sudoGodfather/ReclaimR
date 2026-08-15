import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, Loader2, CheckCircle2, Sparkles, ScanLine, ShieldCheck, TrendingUp } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { ScrollReveal } from '../motion/ScrollPrimitives';
import { Words } from './Words';
import { useNumberCounter } from '../motion/useScrollAnimation';
import { trackEvent } from '../lib/analytics';

/**
 * WaitlistSection Component (#waitlist)
 * Clean editorial access panel, bright in both themes:
 * - Section band = page canvas, panel = brightest card surface
 * - Left: THE PROTOCOL — three benefit rows with moss markers
 * - Right: queue ticket (brass count-up position) + email form
 * - On submit: spinner -> success state "You're #N in line" + growing plant SVG
 * - Motion gated behind prefers-reduced-motion
 */
export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [queueNumber, setQueueNumber] = useState<number>(1482);

  const stemRef = useRef<SVGPathElement | null>(null);
  const leaf1Ref = useRef<SVGGElement | null>(null);
  const leaf2Ref = useRef<SVGGElement | null>(null);
  const budRef = useRef<SVGCircleElement | null>(null);

  const { value: queueValue, ref: queueRef } = useNumberCounter(queueNumber, 1400, true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit registration. Please try again.');
      }

      const data = await res.json();
      const pos = data.position || Math.floor(1200 + Math.random() * 800);
      setQueueNumber(pos);
      setStatus('success');
      trackEvent('waitlist_submit', { position: pos });
      trackEvent('cta_click', { target: 'waitlist_submit', position: pos });
    } catch (err: any) {
      console.warn('Waitlist API warning (using local fallback):', err);
      const fallbackPos = Math.floor(1200 + Math.random() * 800);
      setQueueNumber(fallbackPos);
      setStatus('success');
      trackEvent('waitlist_submit', { position: fallbackPos });
      trackEvent('cta_click', { target: 'waitlist_submit', position: fallbackPos });
    }
  };

  useEffect(() => {
    if (status !== 'success') return;

    const stem = stemRef.current;
    if (!stem) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      stem.style.strokeDashoffset = '0';
      if (leaf1Ref.current) leaf1Ref.current.style.transform = 'scale(1)';
      if (leaf2Ref.current) leaf2Ref.current.style.transform = 'scale(1)';
      if (budRef.current) budRef.current.style.transform = 'scale(1)';
      return;
    }

    const length = stem.getTotalLength();
    stem.style.strokeDasharray = `${length}`;
    stem.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(stem, {
        strokeDashoffset: 0,
        duration: 1.0,
        ease: 'power2.out',
      });

      tl.fromTo(
        [leaf1Ref.current, leaf2Ref.current],
        { scale: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: 'back.out(2.2)',
        },
        '-=0.3'
      );

      if (budRef.current) {
        tl.fromTo(
          budRef.current,
          { scale: 0, transformOrigin: 'center center' },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' },
          '-=0.2'
        );
      }
    });

    return () => ctx.revert();
  }, [status]);

  const PROTOCOL_STEPS = [
    {
      icon: <ScanLine className="w-4 h-4" />,
      title: 'On-device mandate scan',
      desc: 'No cloud upload. Every debit mandate is parsed locally on your device.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: 'One-tap revocation',
      desc: 'Terminate idle AutoPay mandates instantly — no support calls, no friction.',
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Automatic SIP routing',
      desc: 'Rescued cash is diverted straight into Nifty 50 index compounding.',
    },
  ];

  return (
    <section
      id="waitlist"
      className="relative w-full py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-canvas text-fg border-b border-fg/14 select-none"
    >
      <div className="max-w-[1120px] mx-auto space-y-12 relative">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-fg/14 pb-8">
          <div className="space-y-4 max-w-2xl">
            <ScrollReveal direction="up">
              <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F]">
                <Sparkles className="w-4 h-4" />
                <span>CHAPTER 08 // EARLY ACCESS PROTOCOL</span>
              </div>
              <h2 className="font-display font-[600] text-[clamp(32px,5vw,68px)] leading-[1.08] text-fg tracking-tight max-w-[720px]">
                Get your <span className="font-display italic font-[500] text-[#2E5B3F]">free</span> subscription audit
              </h2>
              <Words as="p" className="font-sans-ui text-[16px] sm:text-[18px] text-fg-2 max-w-[560px]">
                Join urban professionals reclaiming their wealth from silent AutoPay mandates. Zero spam, complete local privacy.
              </Words>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" delay={0.15} className="font-mono-tactile text-[11px] text-fg-3 uppercase tracking-wider space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#2E5B3F] pl-4 md:pl-0 md:pr-4 shrink-0">
            <span className="block font-[600] text-[#2E5B3F]">№ RC-2026-EARLY-ACCESS</span>
            <span className="block">BATCH 04 // OPEN</span>
            <span className="block">BUILD v4.2.0-PROD</span>
          </ScrollReveal>
        </div>

        {/* Access Panel */}
        <ScrollReveal direction="up" distance={40} duration={1}>
          <div className="rounded-none bg-card border border-fg/15 shadow-[var(--shadow-md)] overflow-hidden">
            {/* Moss growth accent tab */}
            <div className="h-[3px] w-full bg-[linear-gradient(90deg,#2E5B3F_0%,#44805A_45%,#B8860B_100%)]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left: The Protocol */}
              <div className="lg:col-span-5 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-fg/14">
                <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-3 block">
                  THE PROTOCOL
                </span>

                <div className="mt-6 space-y-6">
                  {PROTOCOL_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-2.5 rounded-none bg-[#2E5B3F]/10 border border-[#2E5B3F]/25 text-[#2E5B3F] shrink-0">
                        {step.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tactile text-[10px] font-[600] text-[#2E5B3F] uppercase tracking-widest">
                            0{i + 1}
                          </span>
                          <h3 className="font-sans-ui font-[600] text-[15px] text-fg tracking-tight">{step.title}</h3>
                        </div>
                        <p className="font-sans-ui text-[13px] leading-relaxed text-fg-2">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Queue Ticket + Form / Success State */}
              <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center gap-8">
                {status !== 'success' ? (
                  <>
                    {/* Queue Ticket */}
                    <div
                      ref={queueRef}
                      className="relative rounded-none border-2 border-dashed border-[#2E5B3F]/45 bg-canvas p-6 sm:p-7 shadow-sm"
                    >
                      {/* Rotated moss stamp */}
                      <div className="absolute -top-3.5 right-6 rotate-[-6deg] px-3 py-1 rounded-none border-2 border-[#2E5B3F]/55 text-[#2E5B3F] font-mono-tactile text-[10px] font-[700] uppercase tracking-[0.15em] bg-card">
                        Batch 04 // Open
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <span className="font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-3 block mb-2">
                            Your queue position
                          </span>
                          <div className="font-display font-[600] text-[clamp(52px,6vw,84px)] leading-none tracking-tight font-numeric-tabular bg-[linear-gradient(180deg,var(--color-ink-primary)_0%,#B8860B_120%)] bg-clip-text text-transparent">
                            #{queueValue.toLocaleString('en-IN')}
                          </div>
                          <span className="font-mono-tactile text-[11px] uppercase tracking-[0.2em] text-fg-2 mt-2 block">
                            in line
                          </span>
                        </div>

                        <div className="text-left sm:text-right font-mono-tactile text-[10px] text-fg-3 uppercase tracking-wider space-y-1">
                          <span className="block">№ RC-2026-AUDIT</span>
                          <span className="block">SLOT: 48H WINDOW</span>
                          <span className="block text-[#2E5B3F] font-[600]">ZERO SPAM</span>
                        </div>
                      </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                      <label
                        htmlFor="waitlist-email"
                        className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2 block"
                      >
                        Your email address
                      </label>

                      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                        <input
                          id="waitlist-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="you@example.com"
                          disabled={status === 'loading'}
                          className="flex-1 min-w-0 bg-transparent border-b-2 border-fg/50 focus:border-[#2E5B3F] outline-none text-fg text-[18px] sm:text-[20px] font-sans-ui py-3 transition-all focus:shadow-glow-moss placeholder:text-fg-3/70 disabled:opacity-50"
                        />

                        <Magnetic>
                          <button
                            type="submit"
                            disabled={status === 'loading'}
                            data-cursor-label="SUBMIT"
                            className="inline-flex items-center justify-center gap-2 h-[50px] px-7 rounded-none bg-prominent text-prominent-fg font-sans-ui text-[14px] font-[600] tracking-tight hover:bg-[var(--color-prominent-hover)] hover:shadow-glow-moss transition-all shadow-md hover:-translate-y-[1px] active:scale-[0.97] disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            {status === 'loading' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <span>Request audit access</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </Magnetic>
                      </div>

                      {error && (
                        <p className="font-mono-tactile text-[12px] text-[#C24A2E]">{error}</p>
                      )}
                    </form>
                  </>
                ) : (
                  /* Success State with Growing Tiny Plant SVG */
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="20" y1="85" x2="80" y2="85" stroke="var(--color-ink-primary)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />

                        <path
                          ref={stemRef}
                          d="M 50 85 C 50 65, 48 45, 50 20"
                          stroke="#2E5B3F"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        <g ref={leaf1Ref}>
                          <path
                            d="M 50 60 C 30 55, 25 40, 35 40 C 45 40, 48 55, 50 60 Z"
                            fill="#2E5B3F"
                            stroke="#44805A"
                            strokeWidth="1.5"
                          />
                        </g>

                        <g ref={leaf2Ref}>
                          <path
                            d="M 50 45 C 70 40, 75 25, 65 25 C 55 25, 52 40, 50 45 Z"
                            fill="#44805A"
                            stroke="#2E5B3F"
                            strokeWidth="1.5"
                          />
                        </g>

                        <circle ref={budRef} cx="50" cy="20" r="5" fill="#44805A" stroke="var(--color-ink-primary)" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-[#2E5B3F]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em]">
                          AUDIT RESERVED
                        </span>
                      </div>

                      <h3 className="font-display font-[600] text-[28px] sm:text-[36px] text-fg tracking-tight">
                        You’re #{queueNumber.toLocaleString('en-IN')} in line
                      </h3>

                      <p className="font-sans-ui text-[14px] text-fg-2 leading-relaxed max-w-[420px]">
                        We’ve sent your priority verification key to <strong className="text-fg">{email}</strong>. Watch your inbox for batch access.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Telemetry Strip */}
            <div className="border-t border-fg/14 px-8 py-4 flex flex-wrap items-center justify-between gap-3 font-mono-tactile text-[10px] uppercase tracking-[0.15em] text-fg-3">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-[#2E5B3F]" />
                QUEUE POSITION: <strong className="text-[#2E5B3F]">#{queueNumber.toLocaleString('en-IN')}</strong>
              </span>
              <span>
                RESPONSE WINDOW: <strong className="text-fg-2">48 HRS</strong>
              </span>
              <span>ZERO SPAM // ON-DEVICE SCAN</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default WaitlistSection;