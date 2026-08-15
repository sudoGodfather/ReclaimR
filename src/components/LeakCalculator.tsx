import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sliders, ArrowRight, AlertTriangle } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { GlassRangeSlider } from './ui/GlassRangeSlider';
import { scrollTo } from '../lib/motion';
import { trackEvent } from '../lib/analytics';

/**
 * Monthly SIP Future Value Formula
 * P * (((1 + i)^n - 1) / i) * (1 + i)
 * i = annualRate / 12, n = years * 12
 */
export function calculateSipFutureValue(monthlyAmount: number, years: number = 10, annualRate: number = 0.12): number {
  if (monthlyAmount <= 0) return 0;
  const i = annualRate / 12;
  const n = years * 12;
  const fv = monthlyAmount * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  return Math.round(fv);
}

/**
 * LeakCalculator Component
 * Editorial Ledger Style:
 * - Bone section background (#F2EFE6) with dark ink text (#0C0E0B)
 * - Hairline rows (border-b border-fg/15)
 * - Small-caps labels (font-mono-tactile text-[11px] uppercase)
 * - Fraunces 40px numerals (font-display font-[600] text-[40px])
 * - Losses in Rust (#C24A2E), Growth in Moss (#2E5B3F)
 * - Magnetic CTA "Reclaim mine →" with Lenis scroll to #waitlist
 * - Gated behind prefers-reduced-motion
 */
export function LeakCalculator() {
  const [subsCount, setSubsCount] = useState<number>(7);
  const [avgPrice, setAvgPrice] = useState<number>(499);

  // Animated counter states
  const [displayMonthly, setDisplayMonthly] = useState<number>(7 * 499);
  const [displayYearly, setDisplayYearly] = useState<number>(7 * 499 * 12);
  const [displaySipFv, setDisplaySipFv] = useState<number>(calculateSipFutureValue(7 * 499, 10, 0.12));

  const animObjRef = useRef({
    monthly: 7 * 499,
    yearly: 7 * 499 * 12,
    sipFv: calculateSipFutureValue(7 * 499, 10, 0.12),
  });

  const targetMonthly = subsCount * avgPrice;
  const targetYearly = targetMonthly * 12;
  const targetSipFv = calculateSipFutureValue(targetMonthly, 10, 0.12);
  const target10YrWaste = targetYearly * 10;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayMonthly(targetMonthly);
      setDisplayYearly(targetYearly);
      setDisplaySipFv(targetSipFv);
      return;
    }

    gsap.to(animObjRef.current, {
      monthly: targetMonthly,
      yearly: targetYearly,
      sipFv: targetSipFv,
      duration: 0.5,
      ease: 'power2.out',
      snap: { monthly: 1, yearly: 1, sipFv: 1 },
      onUpdate: () => {
        setDisplayMonthly(animObjRef.current.monthly);
        setDisplayYearly(animObjRef.current.yearly);
        setDisplaySipFv(animObjRef.current.sipFv);
      },
    });
  }, [targetMonthly, targetYearly, targetSipFv]);

  // Width ratio for comparison bars
  const maxBarVal = Math.max(targetSipFv, target10YrWaste, 1);
  const wasteBarPct = Math.min(100, Math.max(12, (target10YrWaste / maxBarVal) * 100));
  const wealthBarPct = Math.min(100, Math.max(20, (targetSipFv / maxBarVal) * 100));

  return (
    <section
      id="calculator"
      className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-surface text-fg border-y border-fg/15 relative z-10 select-none"
    >
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-fg/15 pb-6 gap-4">
          <div>
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#C24A2E]">
              CHAPTER 04 // EDITORIAL LEDGER SIMULATOR
            </span>
            <h2 className="font-display font-[600] text-[clamp(32px,4.5vw,64px)] text-fg tracking-tight mt-1">
              Calculate Your Bleed
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2">
            <Sliders className="w-4 h-4 text-[#C24A2E]" />
            <span>FINANCIAL DRAIN SIMULATOR</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sliders Controls Panel */}
          <div className="lg:col-span-5 p-8 rounded-none bg-canvas border border-fg/15 space-y-8 shadow-sm">
            <h3 className="font-sans-ui font-[600] text-[20px] text-fg tracking-tight border-b border-fg/15 pb-4">
              Subscription Parameters
            </h3>

            {/* Slider 1: Subscriptions Count (1–25, default 7) */}
            <div className="space-y-3 border-b border-fg/15 pb-6">
              <div className="flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em]">
                <span className="text-fg-2">Unused Subscriptions</span>
                <span className="text-fg font-[600] text-[16px]">{subsCount} subs</span>
              </div>
              <GlassRangeSlider
                value={subsCount}
                min={1}
                max={25}
                step={1}
                trackHeight={4}
                ariaLabel="Unused Subscriptions Count"
                onChange={(val) => {
                  setSubsCount(val);
                  trackEvent('calculator_change', { subsCount: val, avgPrice, monthlyBleed: val * avgPrice });
                }}
              />
              <div className="flex justify-between font-mono-tactile text-[10px] text-fg-3">
                <span>1 sub</span>
                <span>25 subs</span>
              </div>
            </div>

            {/* Slider 2: Average Monthly Price (100–2000, default 499) */}
            <div className="space-y-3 border-b border-fg/15 pb-6">
              <div className="flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em]">
                <span className="text-fg-2">Avg Price per Sub</span>
                <span className="text-fg font-[600] text-[16px]">₹{avgPrice}/mo</span>
              </div>
              <GlassRangeSlider
                value={avgPrice}
                min={100}
                max={2000}
                step={25}
                trackHeight={4}
                ariaLabel="Average Monthly Price per Subscription"
                onChange={(val) => {
                  setAvgPrice(val);
                  trackEvent('calculator_change', { subsCount, avgPrice: val, monthlyBleed: subsCount * val });
                }}
              />
              <div className="flex justify-between font-mono-tactile text-[10px] text-fg-3">
                <span>₹100/mo</span>
                <span>₹2,000/mo</span>
              </div>
            </div>

            <div className="p-4 rounded-none bg-surface border border-fg/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#C24A2E] shrink-0 mt-0.5" />
              <p className="font-sans-ui text-[12px] leading-relaxed text-fg-2">
                Models automatic 12% Nifty 50 compounding CAGR on all reclaimed monthly AutoPay mandates over 10 years.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Ledger Output Rows */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-none bg-canvas border border-fg/15 divide-y divide-fg/15 shadow-sm">
              {/* Row 1: Monthly Loss (Rust) */}
              <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2">
                  MONTHLY BLEED // LOSS
                </span>
                <div className="font-display font-[600] text-[36px] sm:text-[40px] leading-none text-[#C24A2E] tracking-tight font-numeric-tabular">
                  −₹{displayMonthly.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Row 2: Yearly Loss (Rust) */}
              <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2">
                  ANNUAL ROT // LOSS
                </span>
                <div className="font-display font-[600] text-[36px] sm:text-[40px] leading-none text-[#C24A2E] tracking-tight font-numeric-tabular">
                  −₹{displayYearly.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Row 3: 10-Yr SIP Growth (Moss) */}
              <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 bg-[#2E5B3F]/10">
                <div>
                  <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F] block">
                    10-YR RECLAIMED WEALTH // GROWTH
                  </span>
                  <span className="font-mono-tactile text-[10px] text-[#2E5B3F]/80">Nifty 50 @ 12% CAGR</span>
                </div>
                <div className="font-display font-[600] text-[36px] sm:text-[40px] leading-none text-[#2E5B3F] tracking-tight font-numeric-tabular">
                  +₹{displaySipFv.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Waste vs Wealth Comparison Bars */}
            <div className="p-6 sm:p-8 rounded-none bg-canvas border border-fg/15 space-y-6">
              <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2 block">
                10-YEAR COMPOUNDING MULTIPLIER
              </span>

              {/* Bar 1: Cumulative Waste (Rust) */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono-tactile text-[11px] uppercase tracking-[0.1em]">
                  <span className="text-[#C24A2E] font-[600]">Cumulative 10-Yr Waste</span>
                  <span className="text-[#C24A2E] font-[600]">₹{target10YrWaste.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 bg-fg/10 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#C24A2E] rounded-none transition-all duration-500 ease-out"
                    style={{ width: `${wasteBarPct}%` }}
                  />
                </div>
              </div>

              {/* Bar 2: Wealth (Moss) */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono-tactile text-[11px] uppercase tracking-[0.1em]">
                  <span className="text-[#2E5B3F] font-[600]">Reclaimed SIP Wealth</span>
                  <span className="text-[#2E5B3F] font-[600]">₹{targetSipFv.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 bg-fg/10 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#2E5B3F] rounded-none transition-all duration-500 ease-out"
                    style={{ width: `${wealthBarPct}%` }}
                  />
                </div>
              </div>

              {/* Footer CTA: "Reclaim mine →" with Lenis scroll to #waitlist */}
              <div className="pt-4 border-t border-fg/15 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono-tactile text-[11px] text-fg-2">
                  COMPOUNDING MULTIPLIER: <strong className="text-[#2E5B3F]">{(targetSipFv / Math.max(target10YrWaste, 1)).toFixed(2)}x</strong>
                </span>

                <Magnetic>
                  <button
                    type="button"
                    onClick={() => scrollTo('#waitlist')}
                    data-cursor-label="GO"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-prominent text-prominent-fg font-sans-ui text-[14px] font-[600] tracking-tight hover:bg-[var(--color-prominent-hover)] transition-all duration-250 ease-[var(--ease-premium)] shadow-md hover:-translate-y-[1px] hover:shadow-xl active:scale-[0.97] cursor-pointer"
                  >
                    <span>Reclaim mine →</span>
                    <ArrowRight className="w-4 h-4 text-prominent-fg" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeakCalculator;
