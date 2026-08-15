import React, { useState } from 'react';
import { ArrowDown, TrendingUp, Sparkles, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, sipTotalInvested, formatINR, formatLakhs } from '../utils/finance';
import { ScrollReveal, NumberCounter } from '../motion/ScrollPrimitives';
import { GlassRangeSlider } from './ui/GlassRangeSlider';

export const WealthDiversionFlowSection: React.FC = () => {
  const { totalDivertedMonthly, subscriptions, goals } = useApp();

  const [horizonYears, setHorizonYears] = useState<number>(10);
  const [expectedCagr, setExpectedCagr] = useState<number>(12);

  // Use real calculation from src/utils/finance.ts
  const monthlyAmount = totalDivertedMonthly > 0 ? totalDivertedMonthly : 649;
  const projectedWealth = sipFutureValue(monthlyAmount, horizonYears, expectedCagr);
  const totalOutOfPocket = sipTotalInvested(monthlyAmount, horizonYears);
  const netInterestGained = projectedWealth - totalOutOfPocket;

  const primaryGoal = goals[0];

  return (
    <section
      id="wealth-diversion-flow"
      className="py-24 px-6 border-t border-[var(--color-paper-border)] bg-[var(--color-paper-bg)] relative overflow-hidden font-sans-clean"
    >
      <div className="max-w-[1120px] mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] text-[#10B981] uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>04 / WEALTH DIVERSION FLOW — FROM ROT TO SIP</span>
            </div>

            <h2 className="font-serif-editorial text-[36px] sm:text-[54px] font-[600] tracking-tight leading-[0.95]">
              Subscription waste becomes compounding equity.
            </h2>

            <p className="body-lg text-[var(--color-ink-secondary)]">
              Watch how money rescued from idle streaming & gym passes flows through 5 automated stages directly into your long-term wealth goals.
            </p>
          </div>

          <div className="font-mono-tactile text-[11px] text-[var(--color-ink-tertiary)] uppercase tracking-wider space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#10B981] pl-4 md:pl-0 md:pr-4">
            <span className="block font-[600] text-[#10B981]">№ RC-2026-SIP-ENGINE</span>
            <span className="block">ALLOCATION: NIFTY 50 INDEX FUND</span>
            <span className="block">STATUS: REAL-TIME DIVERSION ACTIVE</span>
          </div>
        </div>

        {/* 5-NODE DIVERSION FLOW PIPELINE */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {/* Node 1: SUBSCRIPTION */}
          <ScrollReveal direction="up" delay={0.1} className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-3 shadow-sm relative">
            <div className="font-mono-tactile text-[10px] font-[600] text-[#C93B2B] uppercase tracking-widest">
              01 / SUBSCRIPTION
            </div>
            <h3 className="font-serif-editorial text-[20px] font-[600]">Netflix Premium</h3>
            <div className="font-serif-editorial text-[22px] font-[600] text-[#C93B2B] font-mono-tactile">
              {formatINR(monthlyAmount)}/mo
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
              Idle rot detected (47d inactive)
            </p>
          </ScrollReveal>

          {/* Node 2: RECLAIM */}
          <ScrollReveal direction="up" delay={0.2} className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-3 shadow-sm relative">
            <div className="font-mono-tactile text-[10px] font-[600] text-[var(--color-ink-primary)] uppercase tracking-widest">
              02 / RECLAIM
            </div>
            <h3 className="font-serif-editorial text-[20px] font-[600]">1-Tap Revoke</h3>
            <div className="font-mono-tactile text-[12px] font-[600] text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-none uppercase inline-block">
              REVOKED ✓
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
              E-mandate token terminated
            </p>
          </ScrollReveal>

          {/* Node 3: MONTHLY SAVING */}
          <ScrollReveal direction="up" delay={0.3} className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-3 shadow-sm relative">
            <div className="font-mono-tactile text-[10px] font-[600] text-[#10B981] uppercase tracking-widest">
              03 / MONTHLY SAVING
            </div>
            <h3 className="font-serif-editorial text-[20px] font-[600]">Rescued Cash</h3>
            <div className="font-serif-editorial text-[22px] font-[600] text-[#10B981] font-mono-tactile">
              +{formatINR(monthlyAmount)}/mo
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
              Ready for SIP routing
            </p>
          </ScrollReveal>

          {/* Node 4: SIP / GOAL */}
          <ScrollReveal direction="up" delay={0.4} className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-3 shadow-sm relative">
            <div className="font-mono-tactile text-[10px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F] uppercase tracking-widest">
              04 / SIP TARGET
            </div>
            <h3 className="font-serif-editorial text-[20px] font-[600]">{primaryGoal?.title ?? 'Japan Trip Fund'}</h3>
            <div className="text-[12px] font-mono-tactile font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
              Nifty 50 Direct Index
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
              Automated 14th auto-debit
            </p>
          </ScrollReveal>

          {/* Node 5: LONG-TERM GROWTH */}
          <ScrollReveal direction="up" delay={0.5} className="p-5 rounded-none bg-[#1A1A18] text-white space-y-3 shadow-xl relative border border-white/10">
            <div className="font-mono-tactile text-[10px] font-[600] text-[#10B981] uppercase tracking-widest">
              05 / COMPOUNDED WEALTH
            </div>
            <h3 className="font-serif-editorial text-[20px] font-[600]">10-Yr Equity</h3>
            <div className="font-serif-editorial text-[24px] font-[600] text-[#10B981] font-mono-tactile">
              {formatINR(projectedWealth)}
            </div>
            <p className="text-[11px] text-white/50 font-mono-tactile">
              @{expectedCagr}% Projected CAGR
            </p>
          </ScrollReveal>

        </div>

        {/* DYNAMIC INTERACTIVE COMPOUNDING CONTROLS */}
        <div className="p-8 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-8 font-mono-tactile">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-4">
            <div>
              <h3 className="font-serif-editorial text-[22px] font-[600] text-[var(--color-ink-primary)]">
                Live Portfolio SIP Compounding Simulator
              </h3>
              <p className="text-[12px] text-[var(--color-ink-secondary)] mt-0.5">
                Calculated dynamically from your actual active diverted monthly subscription total: <strong className="text-[#10B981]">{formatINR(monthlyAmount)}/mo</strong>.
              </p>
            </div>
            
            <div className="px-3 py-1 rounded-none bg-[#10B981]/15 text-[#10B981] text-[11px] font-[600] uppercase self-start sm:self-auto">
              REAL APPLICATION DATA ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[13px] font-[600]">
                <span className="text-[var(--color-ink-secondary)]">Time Horizon:</span>
                <span className="font-[600] text-[var(--color-ink-primary)]">{horizonYears} Years</span>
              </div>
              <GlassRangeSlider
                value={horizonYears}
                min={3}
                max={25}
                step={1}
                trackHeight={8}
                ariaLabel="Time Horizon"
                onChange={setHorizonYears}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[13px] font-[600]">
                <span className="text-[var(--color-ink-secondary)]">Expected CAGR:</span>
                <span className="font-[600] text-[#10B981]">{expectedCagr}% / Year</span>
              </div>
              <GlassRangeSlider
                value={expectedCagr}
                min={8}
                max={18}
                step={1}
                trackHeight={8}
                ariaLabel="Expected CAGR"
                onChange={setExpectedCagr}
              />
            </div>
          </div>

          {/* Results Coordinate Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--color-paper-border)]">
            <div className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-1">
              <span className="text-[10px] font-[600] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">OUT-OF-POCKET PRINCIPAL</span>
              <span className="font-serif-editorial text-[22px] font-[600] text-[var(--color-ink-primary)]">
                {formatINR(totalOutOfPocket)}
              </span>
            </div>

            <div className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-1">
              <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider block">COMPOUND INTEREST GAINED</span>
              <span className="font-serif-editorial text-[22px] font-[600] text-[#10B981]">
                +{formatINR(netInterestGained)}
              </span>
            </div>

            <div className="p-4 rounded-none bg-[#1A1A18] text-white space-y-1 shadow-md">
              <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider block">TOTAL PROJECTED WEALTH</span>
              <span className="font-serif-editorial text-[22px] font-[600] text-[#10B981]">
                {formatINR(projectedWealth)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
