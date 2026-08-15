import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldAlert, Sparkles, TrendingUp, CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, formatINR, formatLakhs } from '../utils/finance';
import { ScrollReveal, NumberCounter } from '../motion/ScrollPrimitives';
import { ZombieSubscriptionCard } from '../components/ZombieSubscriptionCard';
import { EditorialTrajectoryChart } from '../components/charts/EditorialTrajectoryChart';
import { EditorialState } from '../components/ui/EditorialState';
import { SEO } from '../components/SEO';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    subscriptions,
    goals,
    activeAlerts,
    totalRotMonthly,
    totalDivertedMonthly,
    totalSaved,
    executeCancellation,
  } = useApp();

  const rottingSubs = useMemo(
    () => subscriptions.filter((s) => s.status === 'rotting' || s.decayScore > 60),
    [subscriptions],
  );

  const divertedSubs = useMemo(
    () => subscriptions.filter((s) => s.status === 'diverted'),
    [subscriptions],
  );

  const tenYearCompound = sipFutureValue(totalDivertedMonthly > 0 ? totalDivertedMonthly : 1448, 10);
  const primaryZombie = rottingSubs[0];

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10 space-y-12 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Monetary Control Deck"
        description="Monitor your total reclaimed wealth, monthly subscription leakage, rot scores, and active micro-SIP wealth diversion in your ReclaimR Monetary Control Deck."
        canonicalPath="/dashboard"
      />
      
      {/* ------------------------------------------------------------------ */}
      {/* EDITORIAL WORKSPACE HEADER & MARGINAL METADATA                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ FINANCIAL CONTROL WORKSPACE • EDITION 2026 ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[54px] font-[600] tracking-tight leading-[0.95]">
            Monetary Control Deck
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Autonomous financial telemetry monitoring subscription decay, active e-mandates, and micro-SIP wealth diversion.
          </p>
        </div>

        <div className="font-mono-tactile text-[11px] text-[var(--color-ink-tertiary)] uppercase tracking-wider space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#1B4D3E] pl-4 md:pl-0 md:pr-4 shrink-0">
          <span className="block font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">№ RC-2026-COCKPIT</span>
          <span className="block">BOMBAY // 19.0760° N</span>
          <span className="block">SECURITY: ON-DEVICE LOG PARSER</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HIERARCHY LEVEL 1: YOUR MONEY (VISUALLY DOMINANT MAJOR METRIC)     */}
      {/* ------------------------------------------------------------------ */}
      <ScrollReveal direction="up" className="p-8 md:p-10 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between font-mono-tactile border-b border-[var(--color-paper-border)] pb-4">
          <span className="eyebrow text-[#10B981] flex items-center gap-2 text-[12px]">
            <Sparkles className="w-4 h-4" />
            YOUR MONEY — TOTAL RECLAIMED WEALTH
          </span>
          <span className="text-[11px] font-[600] px-3 py-1 rounded-none bg-[#10B981]/15 text-[#10B981] uppercase">
            ACTIVE PORTFOLIO
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-tactile text-[var(--color-ink-tertiary)] uppercase tracking-wider block">CUMULATIVE RESCUED PRINCIPAL</span>
            <div className="font-serif-editorial text-[52px] sm:text-[76px] font-[600] tracking-tight leading-none text-[var(--color-ink-primary)]">
              <NumberCounter targetValue={totalSaved > 0 ? totalSaved : 52400} prefix="₹" size="xl" variant="ink" />
            </div>
            <p className="body-md text-[var(--color-ink-secondary)] pt-1">
              Rescued from idle streaming rot & redirected into high-yield index funds.
            </p>
          </div>

          <div className="p-6 rounded-none bg-[#1A1A18] text-white font-mono-tactile space-y-1.5 shrink-0 border border-white/10 shadow-xl">
            <span className="text-[10px] text-[#10B981] font-[600] uppercase tracking-widest block">10-YEAR COMPOUNDED POTENTIAL</span>
            <div className="font-serif-editorial text-[36px] font-[600] text-[#10B981] leading-none">
              {formatLakhs(tenYearCompound)}
            </div>
            <span className="text-[11px] text-white/50 block font-sans-clean">
              Calculated at 12% projected CAGR index returns.
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* ------------------------------------------------------------------ */}
      {/* HIERARCHY LEVEL 2: THIS MONTH (LEAKAGE, RECLAIM, OPPORTUNITY)       */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3 font-mono-tactile">
        <span className="eyebrow text-[var(--color-ink-secondary)] block">THIS MONTH — CASH-FLOW TELEMETRY</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Subscription Leakage */}
          <div className="p-6 rounded-none bg-[var(--color-paper-card)] border border-[#C93B2B]/30 space-y-2">
            <span className="text-[10px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] uppercase tracking-widest block">SUBSCRIPTION LEAKAGE</span>
            <div className="font-serif-editorial text-[32px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] leading-none">
              {formatINR(totalRotMonthly > 0 ? totalRotMonthly : 0)}
              <span className="font-sans-clean text-[13px] font-[400] text-[var(--color-ink-secondary)]">/mo</span>
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] pt-1">
              {rottingSubs.length} Unused services currently rotting.
            </p>
          </div>

          {/* 2. Potential Reclaim */}
          <div className="p-6 rounded-none bg-[var(--color-paper-card)] border border-[#10B981]/30 space-y-2">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">POTENTIAL RECLAIM</span>
            <div className="font-serif-editorial text-[32px] font-[600] text-[#10B981] leading-none">
              +{formatINR(totalDivertedMonthly > 0 ? totalDivertedMonthly : 0)}
              <span className="font-sans-clean text-[13px] font-[400] text-[var(--color-ink-secondary)]">/mo</span>
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)] pt-1">
              Ready for 1-tap AutoPay e-mandate revocation.
            </p>
          </div>

          {/* 3. Investment Opportunity */}
          <div className="p-6 rounded-none bg-[#1A1A18] text-white border border-white/10 space-y-2 shadow-md">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">INVESTMENT OPPORTUNITY</span>
            <div className="font-serif-editorial text-[22px] font-[600] text-white leading-tight">
              Nifty 50 Index Fund
            </div>
            <p className="text-[11px] text-white/60 pt-1 font-sans-clean">
              0% expense ratio direct equity allocation.
            </p>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HIERARCHY LEVEL 3: DETAILED DATA & ASYMMETRICAL WORKSPACE STAGE    */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Stage (7 Columns): Trajectory Chart & Priority Sub-Rot Review */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Editorial Trajectory Data Visualization */}
          <EditorialTrajectoryChart />

          {/* Structured Rows Table: Priority Sub-Rot Review */}
          <div className="space-y-4 font-mono-tactile">
            <div className="flex items-center justify-between border-b border-[var(--color-paper-border)] pb-3">
              <h2 className="font-serif-editorial text-[22px] font-[600] flex items-center gap-2 text-[var(--color-ink-primary)]">
                <Flame className="w-5 h-5 text-[#C93B2B] fill-[#C93B2B]" />
                <span>Priority Sub-Rot Review</span>
              </h2>
              
              <button
                type="button"
                onClick={() => navigate('/subscriptions')}
                className="text-[11px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F] uppercase tracking-wider cursor-pointer"
              >
                View Ledger ({subscriptions.length}) ↗
              </button>
            </div>

            <div className="space-y-0 divide-y divide-[var(--color-paper-border)] border-t border-b border-[var(--color-paper-border)]">
              {rottingSubs.length === 0 ? (
                <div className="py-4">
                  <EditorialState
                    type="no-zombie-subscriptions"
                    onPrimaryAction={() => navigate('/goals')}
                    primaryActionLabel="Plant Wealth Goal"
                  />
                </div>
              ) : (
                rottingSubs.slice(0, 4).map((sub, idx) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/subscriptions/${sub.id}`)}
                  data-cursor-label="INSPECT"
                  className="py-4 px-3 hover:bg-[var(--color-paper-hover)] transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-editorial font-[600] text-[18px]">
                          {sub.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] text-[9px] font-[600]">
                          {sub.decayScore}% ROT
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-ink-tertiary)]">
                        {sub.category} • Unused {sub.lastUsedDaysAgo} days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-serif-editorial font-[600] text-[18px] text-[#C93B2B]">
                        {formatINR(sub.cost)}
                      </span>
                      <span className="block text-[9px] text-[var(--color-ink-tertiary)] uppercase">/mo</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        executeCancellation(sub.id);
                      }}
                      className="h-[34px] px-4 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[11px] font-[600] hover:bg-black transition-colors cursor-pointer"
                    >
                      Kill Mandate
                    </button>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>

        </div>

        {/* Right Stage (5 Columns): Zombie Subscription Feature Card & Goals Feed */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Distinctive Zombie Subscription Hero Card */}
          {primaryZombie && (
            <ZombieSubscriptionCard
              subscription={primaryZombie}
              onExecuteCancel={(id) => executeCancellation(id)}
            />
          )}

          {/* Goals Garden Active Diversion Feed */}
          <div className="space-y-4 font-mono-tactile">
            <div className="flex items-center justify-between border-b border-[var(--color-paper-border)] pb-3">
              <h2 className="font-serif-editorial text-[22px] font-[600] flex items-center gap-2 text-[var(--color-ink-primary)]">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
                <span>Goals Garden Feed</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="text-[11px] font-[600] text-[#10B981] uppercase tracking-wider cursor-pointer"
              >
                Garden ↗
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div
                    key={goal.id}
                    onClick={() => navigate('/goals')}
                    className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-sm space-y-2.5 cursor-pointer hover:border-[#10B981]/40 transition-all font-mono-tactile"
                  >
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-[600] text-[var(--color-ink-primary)]">{goal.title}</span>
                      <span className="text-[#10B981] font-[600]">{percent}% Achieved</span>
                    </div>

                    <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-none overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-none transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] text-[var(--color-ink-tertiary)]">
                      <span>Target: {formatINR(goal.targetAmount)}</span>
                      <span className="text-[#10B981] font-[600]">+{formatINR(goal.monthlyContribution)}/mo SIP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
