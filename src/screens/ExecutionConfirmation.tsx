import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, formatINR } from '../utils/finance';

export const ExecutionConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { subscriptions, goals } = useApp();

  const sub = subscriptions.find((s) => s.id === id);
  const subCost = sub?.cost ?? 649;
  const subName = sub?.name ?? 'Netflix Premium (4K)';
  const primaryGoal = goals[0];

  const tenYearImpact = sipFutureValue(subCost, 10);
  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans space-y-8">
      {/* Brutalist Stamp Card */}
      <div className="bg-jade border-4 border-ink p-8 shadow-[12px_12px_0px_0px_var(--color-shadow)] relative overflow-hidden space-y-6">
        {/* Top Rot Killed Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-ink-dark text-jade border-2 border-ink font-mono font-black flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_var(--color-on-dark)]">
              ✓
            </div>
            <div>
              <span className="bg-ink-dark text-brass font-mono font-black text-xs px-2 py-0.5 uppercase">
                AUTONOMOUS EXECUTION SUCCESS
              </span>
              <h1 className="text-3xl sm:text-4xl font-mono font-black uppercase text-ink-static">
                Sub-Rot Terminated!
              </h1>
            </div>
          </div>

          <div className="bg-ink-dark text-on-dark font-mono text-xs font-black p-2.5 border-2 border-ink uppercase text-right">
            <div>REF: #CANCEL-{subName.split(' ')[0].replace(/[^A-Z]/gi, '').toUpperCase()}-{subCost}</div>
            <div className="text-jade">STATUS: EXECUTED</div>
          </div>
        </div>

        {/* Receipt Box */}
        <div className="bg-surface border-4 border-ink p-6 space-y-4 font-mono">
          <h2 className="font-black text-lg text-ink uppercase border-b-2 border-ink pb-2 flex items-center justify-between">
            <span>OFFICIAL PAISAPALAT RECOVERY RECEIPT</span>
            <span className="text-blue">{monthLabel}</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-bg border-2 border-ink p-3">
              <span className="font-bold text-muted-text">TERMINATED MANDATE:</span>
              <span className="font-black text-ink text-sm">{subName}</span>
            </div>

            <div className="flex justify-between items-center bg-bg border-2 border-ink p-3">
              <span className="font-bold text-muted-text">MONTHLY CASH SAVED:</span>
              <span className="font-black text-terra text-sm">{formatINR(subCost)} / month</span>
            </div>

            <div className="flex justify-between items-center bg-jade-tint border-2 border-ink p-3">
              <span className="font-bold text-muted-text">SIP MICRO-DIVERTED TO:</span>
              <span className="font-black text-blue text-sm">{primaryGoal?.title ?? 'Cherry Blossom Japan Trip 2026'}</span>
            </div>

            <div className="flex justify-between items-center bg-terra-tint border-2 border-ink p-3">
              <span className="font-bold text-muted-text">AUTOMATED SIP FREQUENCY:</span>
              <span className="font-black text-ink">Monthly on 14th (Same as old debit date)</span>
            </div>
          </div>

          <div className="bg-brass border-2 border-ink p-4 text-ink-static space-y-1">
            <div className="font-black text-xs uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-ink-static" aria-hidden="true" />
              <span>10-YEAR WEALTH MULTIPLIER IMPACT</span>
            </div>
            <p className="text-xs font-sans font-medium text-ink-static/85">
              You turned <span className="font-bold">{formatINR(subCost)}/m of rotting video pixels</span> into <span className="font-bold underline">{formatINR(tenYearImpact)} of compounding Nifty 50 equity</span>. Your future self thanks you.
            </p>
          </div>
        </div>

        {/* Action Button - MUST contain text matching 'View My Goals' */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="w-full bg-ink-dark text-brass font-mono font-black text-lg py-5 px-6 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-on-dark)] hover:bg-ink-lift cursor-pointer uppercase flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            <TrendingUp className="w-6 h-6" aria-hidden="true" />
            <span>View My Goals</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};