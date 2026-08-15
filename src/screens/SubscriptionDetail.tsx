import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, Flame, Calculator, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, sipTotalInvested, formatINR } from '../utils/finance';
import { ScrollReveal, NumberCounter } from '../motion/ScrollPrimitives';
import { GlassRangeSlider } from '../components/ui/GlassRangeSlider';
import { SEO } from '../components/SEO';
import { NotFoundScreen } from './NotFoundScreen';

export const SubscriptionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { subscriptions, executeCancellation } = useApp();

  const subscription = subscriptions.find((s) => s.id === id);

  const [investmentYears, setInvestmentYears] = useState<number>(10);
  const [expectedCagr, setExpectedCagr] = useState<number>(12);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [execStep, setExecStep] = useState<number>(0);

  if (!subscription) {
    return <NotFoundScreen />;
  }

  const isDiverted = subscription.status === 'diverted';
  const subName = subscription.name;
  const subCost = subscription.cost;
  const lastDays = subscription.lastUsedDaysAgo;
  const decay = subscription.decayScore;
  const revokeToken = `#AUTOPAY-${subscription.id.split('-')[0].slice(0, 2).toUpperCase()}-${subscription.cost}`;

  const projectedWealth = sipFutureValue(subCost, investmentYears, expectedCagr);
  const totalOutOfPocket = sipTotalInvested(subCost, investmentYears);

  // Stepped Execution Logic (Connected to AppContext executeCancellation)
  const handleStartReclaim = () => {
    setIsExecuting(true);
    setExecStep(1);

    setTimeout(() => setExecStep(2), 600);
    setTimeout(() => setExecStep(3), 1200);
    setTimeout(() => {
      executeCancellation(subscription.id);
      navigate(`/subscriptions/${subscription.id}/cancelled`);
    }, 1800);
  };

  return (
    <div className="max-w-[980px] mx-auto px-6 py-10 font-sans-clean space-y-8 text-[var(--color-ink-primary)]">
      <SEO
        title={`${subName} Subscription Audit`}
        description={`Audit rot score (${decay}%), cost (${formatINR(subCost)}/mo), and trigger 1-tap AutoPay cancellation for ${subName} in ReclaimR.`}
        canonicalPath={`/subscriptions/${subscription.id}`}
      />
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between font-mono-tactile">
        <button
          type="button"
          onClick={() => navigate('/subscriptions')}
          className="h-[38px] px-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] text-[13px] font-[600] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subscriptions Ledger</span>
        </button>

        <span className="text-[11px] font-[600] tracking-[0.08em] uppercase px-3 py-1 rounded-none bg-[var(--color-paper-card)] text-[var(--color-ink-secondary)]">
          AUDIT ID: ROT-{subscription.id.toUpperCase()}
        </span>
      </div>

      {/* Main Execution Card */}
      <div className="rounded-none bg-[var(--color-paper-surface)] p-6 md:p-10 shadow-[var(--shadow-lg)] border border-[var(--color-paper-border)] space-y-8 relative overflow-hidden">
        
        {/* Step 1 & 2: Before State & Decay Header */}
        <div className="rounded-none bg-[var(--color-paper-card)] p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 border border-[var(--color-paper-border)]">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 font-mono-tactile">
              {isDiverted ? (
                <span className="bg-[#10B981]/15 text-[#10B981] font-[600] text-[11px] px-3 py-1 rounded-none uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MANDATE TERMINATED & RECLAIMED
                </span>
              ) : (
                <span className="bg-[#C93B2B]/15 text-[#C93B2B] dark:text-[#E54D3C] font-[600] text-[11px] px-3 py-1 rounded-none uppercase flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-[#C93B2B]" />
                  BEFORE: {formatINR(subCost)}/MO LEAKING
                </span>
              )}
              <span className="text-[11px] font-[600] px-2.5 py-1 rounded-none bg-black/5 dark:bg-white/10 text-[var(--color-ink-secondary)] uppercase">
                {subscription.category}
              </span>
            </div>

            <h1 className="font-serif-editorial text-[32px] md:text-[48px] font-[600] tracking-tight leading-[0.95] pt-1">
              {subName}
            </h1>
            <p className="text-[15px] text-[var(--color-ink-secondary)] font-[500]">
              Automated debit of <span className="text-[#C93B2B] dark:text-[#E54D3C] font-[600]">{formatINR(subCost)}/month</span> hits in 3 days. Zero login activity recorded in {lastDays} days.
            </p>
          </div>

          <div className="rounded-none bg-[var(--color-paper-surface)] p-5 text-center min-w-[140px] shadow-sm border border-[var(--color-paper-border)] font-mono-tactile">
            <div className="font-serif-editorial text-[40px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] leading-none">{decay}%</div>
            <div className="text-[10px] font-[600] text-[var(--color-ink-tertiary)] uppercase tracking-[0.08em] mt-1">Decay Score</div>
          </div>
        </div>

        {/* Financial Impact Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before: Leaking */}
          <div className="p-6 rounded-none bg-[#C93B2B]/10 border border-[#C93B2B]/30 space-y-2 font-mono-tactile">
            <span className="text-[10px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] uppercase tracking-wider block">STATE BEFORE RECLAIM</span>
            <div className="font-serif-editorial text-[32px] font-[600] text-[#C93B2B] dark:text-[#E54D3C]">
              {formatINR(subCost)} / month
            </div>
            <span className="text-[11px] text-[var(--color-ink-secondary)] block font-sans-clean">
              💸 Bleeding into streaming server rot. Annual loss: {formatINR(subCost * 12)}.
            </span>
          </div>

          {/* After: Reclaimed */}
          <div className="p-6 rounded-none bg-[#10B981]/10 border border-[#10B981]/30 space-y-2 font-mono-tactile">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider block">STATE AFTER RECLAIM</span>
            <div className="font-serif-editorial text-[32px] font-[600] text-[#10B981]">
              {formatINR(projectedWealth)}
            </div>
            <span className="text-[11px] text-[var(--color-ink-secondary)] block font-sans-clean">
              📈 Diverted into Nifty 50 SIP at 12% CAGR over {investmentYears} years.
            </span>
          </div>
        </div>

        {/* Wealth Compounding Simulator */}
        <div className="rounded-none bg-[var(--color-paper-card)] p-6 md:p-8 space-y-6 border border-[var(--color-paper-border)] font-mono-tactile">
          <div className="flex justify-between items-center border-b border-[var(--color-paper-border)] pb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#1B4D3E] dark:text-[#2D6A4F]" />
              <h3 className="font-serif-editorial font-[600] text-[18px] tracking-tight">
                Micro-SIP Diversion Wealth Projection
              </h3>
            </div>
            <span className="bg-[#10B981]/15 text-[#10B981] text-[11px] font-[600] px-3 py-1 rounded-none uppercase">
              Nifty 50 Index Fund
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-[600]">
                <span className="text-[var(--color-ink-secondary)]">Investment Horizon:</span>
                <span className="font-[600]">{investmentYears} Years</span>
              </div>
              <GlassRangeSlider
                value={investmentYears}
                min={3}
                max={20}
                step={1}
                trackHeight={6}
                ariaLabel="Investment Horizon"
                onChange={setInvestmentYears}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-[600]">
                <span className="text-[var(--color-ink-secondary)]">Expected CAGR:</span>
                <span className="font-[600] text-[#10B981]">{expectedCagr}% / Year</span>
              </div>
              <GlassRangeSlider
                value={expectedCagr}
                min={8}
                max={18}
                step={1}
                trackHeight={6}
                ariaLabel="Expected CAGR"
                onChange={setExpectedCagr}
              />
            </div>
          </div>
        </div>

        {/* Step 3, 4 & 5: Deliberate Action Confirmation & Terminal Stepper */}
        <div className="pt-4 border-t border-[var(--color-paper-border)] space-y-4">
          {isDiverted ? (
            <div className="p-6 rounded-none bg-[#10B981]/15 text-center space-y-3 font-mono-tactile">
              <p className="text-[15px] font-[600] text-[#10B981]">
                ✓ Mandate Terminated — {formatINR(subCost)}/m is now an active micro-SIP.
              </p>
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="h-[42px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[13px] font-[600] cursor-pointer"
              >
                View Goals Garden ↗
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleStartReclaim}
                disabled={isExecuting}
                data-cursor-label="RECLAIM"
                className="w-full h-[56px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[16px] font-[600] hover:bg-black dark:hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xl disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 text-[#10B981]" />
                <span>{isExecuting ? 'Executing Reclaim Sequence...' : `Yes, Cancel Mandate & Invest ${formatINR(subCost)}/m`}</span>
              </button>
            </div>
          )}

          <p className="text-center text-[12px] text-[var(--color-ink-tertiary)] font-mono-tactile">
            🔒 Triggers automated UPI AutoPay e-mandate revocation token and provisions {formatINR(subCost)}/m into Nifty 50 Index Fund.
          </p>
        </div>

      </div>

      {/* Execution Stepper Terminal Overlay Modal */}
      {isExecuting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[var(--z-overlay)] flex items-center justify-center p-6">
          <div className="bg-[#1A1A18] text-white rounded-none p-8 max-w-md w-full border border-white/10 shadow-2xl space-y-6 font-mono-tactile">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Terminal className="w-5 h-5 text-[#10B981]" />
              <h3 className="font-serif-editorial text-[20px] font-[600]">Reclaim Execution Handshake</h3>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className={`flex items-center gap-3 ${execStep >= 1 ? 'text-[#10B981]' : 'text-white/40'}`}>
                <span>{execStep >= 1 ? '✓' : '○'}</span>
                <span>[0.2s] Transmitting REVOKE token {revokeToken}...</span>
              </div>

              <div className={`flex items-center gap-3 ${execStep >= 2 ? 'text-[#10B981]' : 'text-white/40'}`}>
                <span>{execStep >= 2 ? '✓' : '○'}</span>
                <span>[0.8s] Handshaking HDFC E-Mandate Gateway...</span>
              </div>

              <div className={`flex items-center gap-3 ${execStep >= 3 ? 'text-[#10B981]' : 'text-white/40'}`}>
                <span>{execStep >= 3 ? '✓' : '○'}</span>
                <span>[1.4s] Provisioning Nifty 50 Micro-SIP (+{formatINR(subCost)}/mo)...</span>
              </div>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-none overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-none transition-all duration-500"
                style={{ width: `${(execStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
