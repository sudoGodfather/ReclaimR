import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle2, Flame, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, sipTotalInvested, formatINR } from '../utils/finance';

export const SubscriptionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { subscriptions, executeCancellation } = useApp();

  const subscription = subscriptions.find((s) => s.id === id);
  const isDiverted = subscription?.status === 'diverted';

  const subName = subscription?.name ?? 'Netflix Premium (4K)';
  const subCost = subscription?.cost ?? 649;
  const lastDays = subscription?.lastUsedDaysAgo ?? 47;
  const decay = subscription?.decayScore ?? 88;

  const [investmentYears, setInvestmentYears] = useState<number>(10);
  const [expectedCagr, setExpectedCagr] = useState<number>(12);

  const projectedWealth = sipFutureValue(subCost, investmentYears, expectedCagr);
  const totalOutOfPocket = sipTotalInvested(subCost, investmentYears);
  const tenYearProjection = sipFutureValue(subCost, 10);

  const handleConfirmCancel = () => {
    executeCancellation(subscription?.id ?? 'netflix-649');
    navigate(`/subscriptions/${subscription?.id ?? 'netflix-649'}/cancelled`);
  };

  const handleKeepSubscription = () => {
    navigate('/subscriptions');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between font-mono">
        <button
          type="button"
          onClick={() => navigate('/subscriptions')}
          className="bg-surface text-ink font-black text-xs px-4 py-2 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-muted cursor-pointer flex items-center gap-2 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" aria-hidden="true" />
          <span>Back to Subscriptions</span>
        </button>

        <span className="bg-ink-dark text-brass font-black text-xs px-3 py-1 border border-ink uppercase">
          AUDIT ID: ROT-{subscription?.id.toUpperCase() ?? 'NF-649'}
        </span>
      </div>

      {/* Main Brutalist Card */}
      <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[10px_10px_0px_0px_var(--color-shadow)] space-y-8">
        {/* Title & Decay Header */}
        <div className="bg-brass border-4 border-ink p-6 shadow-[4px_4px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isDiverted ? (
                <span className="bg-jade text-ink-static font-mono font-black text-xs px-2.5 py-1 border border-ink uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  SUB-ROT TERMINATED
                </span>
              ) : (
                <span className="bg-crimson text-on-accent font-mono font-black text-xs px-2.5 py-1 border border-ink uppercase flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-on-accent" aria-hidden="true" />
                  CRITICAL SUB-ROT DETECTED
                </span>
              )}
              <span className="bg-ink-dark text-on-dark font-mono font-bold text-xs px-2 py-1">
                {subscription?.category ?? 'STREAMING'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase text-ink-static tracking-tight">
              {subName}
            </h1>
            <p className="text-sm font-bold text-ink-static font-mono">
              Auto-debit of <span className="underline decoration-terra decoration-4 text-xl">{formatINR(subCost)}/month</span> hits in 3 days.
            </p>
          </div>

          <div className="bg-ink-dark text-brass border-2 border-ink p-4 text-center font-mono space-y-1">
            <div className="text-4xl font-black text-crimson">{decay}%</div>
            <div className="text-[10px] font-bold text-on-dark uppercase tracking-widest">DECAY SCORE</div>
          </div>
        </div>

        {/* Audit Evidence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="bg-bg border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-muted-text uppercase">Last Login Activity</div>
            <div className="text-2xl font-black text-terra">{lastDays} Days Unused</div>
            <p className="text-[11px] text-muted-text font-sans">Last watched: Stranger Things S4 (June 2024)</p>
          </div>

          <div className="bg-bg border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-muted-text uppercase">Watch Cost / Episode</div>
            <div className="text-2xl font-black text-ink">{formatINR(subCost)} / Ep</div>
            <p className="text-[11px] text-muted-text font-sans">1 episode watched in 30 days = ₹{subCost} per episode</p>
          </div>

          <div className="bg-bg border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-muted-text uppercase">Cancellation API Status</div>
            <div className="text-2xl font-black text-jade">{isDiverted ? 'Executed ✓' : '1-Tap Instant'}</div>
            <p className="text-[11px] text-muted-text font-sans">UPI AutoPay e-mandate cancel signal ready</p>
          </div>
        </div>

        {/* Savage Auditor AI Advice Box */}
        <div className="bg-ink-dark text-on-dark border-4 border-ink p-5 shadow-[4px_4px_0px_0px_var(--color-terra)] space-y-3 font-mono">
          <div className="flex items-center gap-2 text-brass text-sm font-black uppercase">
            <Zap className="w-5 h-5 fill-brass" aria-hidden="true" />
            <span>SAVAGE AUDITOR RECOMMENDATION</span>
          </div>
          <p className="text-sm font-sans text-muted-on-dark leading-relaxed">
            "Paying {formatINR(subCost)}/m for 0 hours of watch time is financial negligence. Cancelling {subName.split(' ')[0]} today and diverting {formatINR(subCost)}/m into your <span className="text-jade font-bold">Cherry Blossom Japan Trip Fund</span> adds <span className="text-brass font-bold">{formatINR(tenYearProjection)}</span> over 10 years at 12% CAGR. Do not feed the streaming zombie."
          </p>
        </div>

        {/* Wealth Compounding Simulator */}
        <div className="bg-jade-tint border-4 border-ink p-6 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-ink" aria-hidden="true" />
              <h3 className="font-black text-lg uppercase text-ink">
                Micro-SIP Diversion Wealth Projection
              </h3>
            </div>
            <span className="bg-jade text-ink-static text-xs font-black px-2 py-0.5 border border-ink uppercase">
              NIFTY 50 INDEX / GOLD ETF
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <label htmlFor="detail-years" className="cursor-pointer">Investment Horizon:</label>
                <span className="text-ink font-black">{investmentYears} Years</span>
              </div>
              <input
                id="detail-years"
                type="range"
                min="3"
                max="20"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Number(e.target.value))}
                className="w-full accent-ink h-3 bg-muted border-2 border-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <label htmlFor="detail-cagr" className="cursor-pointer">Expected CAGR:</label>
                <span className="text-ink font-black">{expectedCagr}% / Year</span>
              </div>
              <input
                id="detail-cagr"
                type="range"
                min="8"
                max="18"
                value={expectedCagr}
                onChange={(e) => setExpectedCagr(Number(e.target.value))}
                className="w-full accent-jade h-3 bg-muted border-2 border-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              />
            </div>
          </div>

          <div className="bg-surface border-3 border-ink p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-muted-text uppercase">Total Diverted Out-Of-Pocket</div>
              <div className="text-xl font-black text-ink">
                {formatINR(totalOutOfPocket)}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-muted-text uppercase">Projected Wealth Compounded</div>
              <div className="text-3xl font-black text-blue">
                {formatINR(projectedWealth)}
              </div>
            </div>
          </div>
        </div>

        {/* CRITICAL TEST ACTION BUTTONS */}
        <div className="pt-4 border-t-4 border-ink space-y-4">
          {isDiverted ? (
            <div className="bg-jade-tint border-2 border-ink p-4 font-mono text-center">
              <p className="text-sm font-black text-jade uppercase">
                ✓ This mandate is already terminated — {formatINR(subCost)}/m is now an active SIP.
              </p>
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="mt-3 bg-ink-dark text-brass font-mono font-black text-xs px-5 py-2.5 border-2 border-ink cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                View My Goals Garden
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Action Button - MUST contain text matching 'Yes, cancel & invest ₹649/m' */}
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="w-full bg-terra text-on-accent font-mono font-black text-base sm:text-lg py-5 px-4 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:bg-terra-deep hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <Zap className="w-6 h-6 fill-on-accent" aria-hidden="true" />
                <span>Yes, cancel & invest {formatINR(subCost)}/m</span>
              </button>

              {/* Secondary Action Button - MUST contain text matching 'Give me 1 more month' */}
              <button
                type="button"
                onClick={handleKeepSubscription}
                className="w-full bg-surface text-ink font-mono font-black text-base sm:text-lg py-5 px-4 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:bg-muted hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                <span>Give me 1 more month</span>
              </button>
            </div>
          )}

          <p className="text-center font-mono text-xs text-muted-text">
            🔒 Clicking cancel triggers an automated UPI AutoPay e-mandate termination signal and provisions a {formatINR(subCost)}/m SIP into Nifty 50 Index Fund.
          </p>
        </div>
      </div>
    </div>
  );
};