import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { sipFutureValue, formatLakhs, formatINR } from '../utils/finance';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [subCount, setSubCount] = useState<number>(4);
  const [avgCost, setAvgCost] = useState<number>(499);

  const monthlyBleed = subCount * avgCost;
  const yearlyBleed = monthlyBleed * 12;
  // 10 year compound growth at 12% CAGR — single source of truth in finance.ts
  const tenYearWealth = sipFutureValue(monthlyBleed, 10);

  return (
    <div className="space-y-12 pb-12 font-sans bg-bg">
      {/* Hero Section */}
      <section className="bg-brass border-b-4 border-ink pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-ink-dark text-brass font-mono font-black text-xs px-3 py-1 border-2 border-ink rotate-3 shadow-[3px_3px_0px_0px_var(--color-shadow)]">
          #1 WEALTH PROTECTION AGENT IN INDIA
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-ink-dark text-on-dark font-mono font-bold text-xs px-3 py-1 border-2 border-ink">
              <Flame className="w-4 h-4 text-terra fill-terra" />
              <span>STOP THE SUB-ROT • START THE WEALTH-GROWTH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-mono font-black text-ink-static leading-none uppercase tracking-tight">
              Turn Sub-Rot Into <span className="bg-terra text-on-accent px-2 py-0.5 inline-block -rotate-1 border-2 border-ink">Wealth-Growth</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-ink-static max-w-2xl leading-relaxed border-l-4 border-ink pl-4">
              An autonomous AI agent that detects zombie subscriptions in your bank/SMS, calculates decay scores, kills unused debits, and <span className="font-bold underline decoration-terra decoration-4">automatically diverts savings into high-yield micro-SIPs</span> for your dream goals.
            </p>

            {/* Core Required Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="bg-terra text-on-accent font-mono font-black text-base sm:text-lg px-8 py-4 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_var(--color-shadow)] transition-all flex items-center gap-3 cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <span>See My Rot Report</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/how-it-works')}
                className="bg-surface text-ink font-mono font-black text-base sm:text-lg px-6 py-4 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:bg-muted transition-all flex items-center gap-2 cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <span>How It Works</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold pt-4 text-ink-static">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ink-static fill-jade" />
                <span>Zero Bank Password Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ink-static fill-jade" />
                <span>Auto-UPI Cancel Signals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ink-static fill-jade" />
                <span>Nifty 50 / Gold ETF SIPs</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Brutalist Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface border-4 border-ink p-6 shadow-[8px_8px_0px_0px_var(--color-shadow)] space-y-5">
              <div className="bg-ink-dark text-on-dark p-3 font-mono font-black text-sm flex items-center justify-between border-2 border-ink">
                <span>INSTANT SUB-ROT SIMULATOR</span>
                <span className="text-brass">₹ CALC</span>
              </div>

              <div className="space-y-4 font-mono">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-1">
                    <label htmlFor="landing-subcount" className="cursor-pointer">Unused Subscriptions:</label>
                    <span className="text-terra font-bold text-sm">{subCount} Services</span>
                  </div>
                  <input
                    id="landing-subcount"
                    type="range"
                    min="1"
                    max="12"
                    value={subCount}
                    onChange={(e) => setSubCount(Number(e.target.value))}
                    className="w-full accent-terra h-3 bg-muted border-2 border-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-1">
                    <label htmlFor="landing-avgcost" className="cursor-pointer">Average Monthly Cost:</label>
                    <span className="text-ink font-bold text-sm">₹{avgCost}/m</span>
                  </div>
                  <input
                    id="landing-avgcost"
                    type="range"
                    min="199"
                    max="1999"
                    step="50"
                    value={avgCost}
                    onChange={(e) => setAvgCost(Number(e.target.value))}
                    className="w-full accent-ink h-3 bg-muted border-2 border-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                  />
                </div>

                <div className="bg-terra-tint border-2 border-terra p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-text font-bold uppercase">
                    <span>Monthly Bleed Rate:</span>
                    <span className="text-terra font-black text-base">{formatINR(monthlyBleed)}/m</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-text font-bold uppercase">
                    <span>Yearly Silent Rot:</span>
                    <span className="text-ink font-black text-base">{formatINR(yearlyBleed)}/yr</span>
                  </div>
                  <div className="pt-2 border-t border-terra flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-ink">10-Yr Wealth Lost (12% CAGR):</span>
                    <span className="text-2xl font-black font-mono text-ink-static bg-brass px-2 py-0.5 border border-ink">
                      {formatLakhs(tenYearWealth)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/onboarding')}
                  className="w-full bg-blue text-on-accent font-mono font-black text-sm py-3 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-blue-deep cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <span>STOP THIS ROT NOW ↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Brutalist Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="bg-ink-dark text-brass font-mono font-black text-xs px-3 py-1 uppercase border border-ink">
            HOW RECLAIMR RECLAIMS YOUR WEALTH
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-ink">
            The 3-Step Autonomous Loop
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] relative space-y-3">
            <div className="w-10 h-10 bg-terra text-on-accent border-2 border-ink font-mono font-black flex items-center justify-center text-xl">
              01
            </div>
            <h3 className="font-mono font-black text-xl uppercase text-ink">
              1. Scan & Detect Rot
            </h3>
            <p className="text-sm font-medium text-muted-text leading-relaxed">
              Autonomous SMS & Bank Mandate scraper detects recurring debits (Netflix, Hotstar, Gym, Duolingo). Computes usage decay score based on last login or check-in.
            </p>
            <div className="bg-muted border-2 border-ink p-2 font-mono text-xs font-bold text-ink flex justify-between">
              <span>NETFLIX UNUSED:</span>
              <span className="text-terra">47 DAYS ROT</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] relative space-y-3">
            <div className="w-10 h-10 bg-brass text-ink-static border-2 border-ink font-mono font-black flex items-center justify-center text-xl">
              02
            </div>
            <h3 className="font-mono font-black text-xl uppercase text-ink">
              2. One-Click Cancellation
            </h3>
            <p className="text-sm font-medium text-muted-text leading-relaxed">
              When decay hits 80%+, ReclaimR triggers auto-cancel signals to your UPI app or sends a guided 1-tap cancel mandate before the auto-debit strikes.
            </p>
            <div className="bg-muted border-2 border-ink p-2 font-mono text-xs font-bold text-ink flex justify-between">
              <span>UPI AUTOPAY MANDATE:</span>
              <span className="text-blue">CANCEL SIGNAL SENT</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] relative space-y-3">
            <div className="w-10 h-10 bg-jade text-ink-static border-2 border-ink font-mono font-black flex items-center justify-center text-xl">
              03
            </div>
            <h3 className="font-mono font-black text-xl uppercase text-ink">
              3. Micro-SIP Diversion
            </h3>
            <p className="text-sm font-medium text-muted-text leading-relaxed">
              Instead of spending that ₹649 back into impulse buys, ReclaimR automatically diverts it into a Nifty 50 Index Fund or Gold ETF for your specific goals.
            </p>
            <div className="bg-muted border-2 border-ink p-2 font-mono text-xs font-bold text-ink flex justify-between">
              <span>GOAL DIVERTER:</span>
              <span className="text-jade">JAPAN TRIP SIP +₹649/m</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ink-dark text-on-dark border-4 border-ink p-8 sm:p-12 shadow-[8px_8px_0px_0px_var(--color-terra)] space-y-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-mono font-black text-brass uppercase tracking-tight">
            Stop Bleeding Money To Forgotten Apps
          </h2>
          <p className="text-base sm:text-lg text-muted-on-dark max-w-2xl mx-auto font-sans">
            Join thousands of smart investors converting passive subscription leaks into active compound growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="bg-jade text-ink-static font-mono font-black text-lg px-8 py-4 border-2 border-on-dark shadow-[4px_4px_0px_0px_var(--color-on-dark)] hover:bg-jade-deep cursor-pointer uppercase flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <span>See My Rot Report Now</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-surface text-ink font-mono font-black text-lg px-8 py-4 border-2 border-on-dark shadow-[4px_4px_0px_0px_var(--color-on-dark)] hover:bg-muted cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <span>Jump To Live Dashboard</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};