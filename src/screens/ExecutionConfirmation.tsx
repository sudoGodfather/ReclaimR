import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, formatINR } from '../utils/finance';
import { NumberCounter, ScrollReveal } from '../motion/ScrollPrimitives';
import { SEO } from '../components/SEO';
import { NotFoundScreen } from './NotFoundScreen';

export const ExecutionConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { subscriptions, goals, totalDivertedMonthly, totalSaved } = useApp();

  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return <NotFoundScreen />;
  }

  const subCost = sub.cost;
  const subName = sub.name;
  const primaryGoal = goals[0];

  const tenYearImpact = sipFutureValue(subCost, 10);
  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 font-sans-clean space-y-8 text-[var(--color-ink-primary)]">
      <SEO
        title="Mandate Terminated — Wealth Certificate"
        description={`Certified e-mandate termination receipt for ${subName} (${formatINR(subCost)}/mo) diverted into micro-SIP growth in ReclaimR.`}
        canonicalPath={`/subscriptions/${sub.id}/cancelled`}
      />
      
      {/* Step 5: Official Execution Certificate Receipt */}
      <ScrollReveal direction="up" className="rounded-none bg-[var(--color-paper-surface)] p-6 sm:p-10 shadow-[var(--shadow-xl)] border border-[var(--color-paper-border)] space-y-8 relative overflow-hidden font-sans-clean">
        
        {/* Background Security Seal Engraving */}
        <div className="absolute top-0 right-0 w-48 h-48 guillotine-pattern opacity-30 pointer-events-none rounded-bl-none" />

        {/* Top Success Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-6 font-mono-tactile">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-[#10B981]/15 text-[#10B981] flex items-center justify-center text-xl font-[600]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-[600] tracking-[0.08em] uppercase text-[#10B981]">
                AUTONOMOUS EXECUTION SUCCESS
              </span>
              <h1 className="font-serif-editorial text-[28px] sm:text-[36px] font-[600] tracking-tight leading-tight mt-0.5">
                Sub-Rot Terminated!
              </h1>
            </div>
          </div>

          <div className="rounded-none bg-[var(--color-paper-card)] p-3 text-right text-[11px] font-[600] text-[var(--color-ink-secondary)] space-y-0.5 border border-[var(--color-paper-border)]">
            <div>REF: #CANCEL-{subName.split(' ')[0].replace(/[^A-Z]/gi, '').toUpperCase()}-{subCost}</div>
            <div className="text-[#10B981] font-[600]">STATUS: EXECUTED ✓</div>
          </div>
        </div>

        {/* Step 6: Visual Value Transition Display (BEFORE vs AFTER) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tactile">
          
          {/* Before: Leaking */}
          <div className="p-4 rounded-none bg-[#C93B2B]/10 border border-[#C93B2B]/30 space-y-1">
            <span className="text-[10px] font-[600] text-[#C93B2B] uppercase tracking-wider">PREVIOUS STATE</span>
            <div className="font-serif-editorial text-[22px] font-[600] text-[#C93B2B] line-through">
              {formatINR(subCost)} / month
            </div>
            <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase block">STATUS: LEAKING</span>
          </div>

          {/* After: Reclaimed */}
          <div className="p-4 rounded-none bg-[#10B981]/15 border border-[#10B981]/30 space-y-1">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider">CURRENT STATE</span>
            <div className="font-serif-editorial text-[22px] font-[600] text-[#10B981]">
              +{formatINR(subCost)} / month
            </div>
            <span className="text-[10px] text-[#10B981] font-[600] uppercase block">STATUS: RECLAIMED INTO SIP ✓</span>
          </div>

        </div>

        {/* Official Receipt Ledger */}
        <div className="rounded-none bg-[var(--color-paper-card)] p-6 space-y-4 border border-[var(--color-paper-border)] font-mono-tactile">
          <h2 className="font-[600] text-[14px] uppercase tracking-wider border-b border-[var(--color-paper-border)] pb-3 flex items-center justify-between">
            <span>Official ReclaimR Security Certificate</span>
            <span className="text-[#1B4D3E] dark:text-[#2D6A4F] text-[12px] font-[600]">{monthLabel}</span>
          </h2>

          <div className="space-y-2.5 text-[13px]">
            <div className="flex justify-between items-center rounded-none bg-[var(--color-paper-surface)] p-3.5 border border-[var(--color-paper-border)]">
              <span className="text-[var(--color-ink-secondary)] font-[500]">Terminated Mandate:</span>
              <span className="font-[600]">{subName}</span>
            </div>

            <div className="flex justify-between items-center rounded-none bg-[var(--color-paper-surface)] p-3.5 border border-[var(--color-paper-border)]">
              <span className="text-[var(--color-ink-secondary)] font-[500]">Monthly Cash Recovered:</span>
              <span className="font-[600] text-[#10B981]">+{formatINR(subCost)} / month</span>
            </div>

            <div className="flex justify-between items-center rounded-none bg-[var(--color-paper-surface)] p-3.5 border border-[var(--color-paper-border)]">
              <span className="text-[var(--color-ink-secondary)] font-[500]">Micro-SIP Destination:</span>
              <span className="font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">{primaryGoal?.title ?? 'Japan Trip Fund'}</span>
            </div>

            <div className="flex justify-between items-center rounded-none bg-[var(--color-paper-surface)] p-3.5 border border-[var(--color-paper-border)]">
              <span className="text-[var(--color-ink-secondary)] font-[500]">Total Monthly Portfolio SIP:</span>
              <span className="font-[600] text-[#10B981]">{formatINR(totalDivertedMonthly)} / month</span>
            </div>
          </div>

          {/* 10-Year Wealth Projection Card */}
          <div className="rounded-none bg-[#1A1A18] text-white p-5 space-y-1 shadow-lg">
            <div className="font-[600] text-[11px] uppercase tracking-widest flex items-center gap-1.5 text-[#10B981]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10-Year Compounding Wealth Impact</span>
            </div>
            <p className="text-[14px] leading-relaxed text-white/80 font-sans-clean pt-1">
              You turned <span className="font-[600] text-white">{formatINR(subCost)}/m of rotting streaming</span> into <span className="font-[600] text-[#10B981]">{formatINR(tenYearImpact)} of compounding equity</span> at 12% CAGR.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/goals')}
            data-cursor-label="GOALS"
            className="w-full h-[54px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[16px] font-[600] hover:bg-black dark:hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <TrendingUp className="w-5 h-5 text-[#10B981]" />
            <span>View Goals Garden</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </ScrollReveal>
    </div>
  );
};
