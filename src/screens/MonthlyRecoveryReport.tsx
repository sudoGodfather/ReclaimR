import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Download, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { sipFutureValue, formatINR, formatLakhs } from '../utils/finance';

export const MonthlyRecoveryReport: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscriptions, totalSaved, totalDivertedMonthly } = useApp();

  const totalRotMonthly = useMemo(
    () => subscriptions.filter((s) => s.status === 'rotting').reduce((acc, s) => acc + s.cost, 0),
    [subscriptions],
  );
  const rottingCount = useMemo(
    () => subscriptions.filter((s) => s.status === 'rotting').length,
    [subscriptions],
  );
  const tenYearCompound = sipFutureValue(totalDivertedMonthly, 10);
  const statementMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase();

  const handleExportPdf = () => {
    toast('PDF audit export queued — demo build', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Header Banner */}
      <div className="bg-blue text-on-accent border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-brass text-ink-static font-mono font-black text-xs px-3 py-1 uppercase border border-ink">
            <PieChart className="w-4 h-4" aria-hidden="true" />
            <span>MONTHLY WEALTH AUDIT STATEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-on-accent">
            Monthly Recovery Report
          </h1>
          <p className="text-sm font-medium text-on-accent/90 max-w-2xl font-sans">
            Comprehensive financial recovery audit showing money rescued from subscription rot, micro-SIP returns, and 10-year wealth projection.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportPdf}
            className="bg-brass text-ink-static font-mono font-black text-xs px-4 py-3 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-brass-deep cursor-pointer uppercase flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Statement Sheet */}
      <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[10px_10px_0px_0px_var(--color-shadow)] space-y-8">
        {/* Month Title */}
        <div className="flex justify-between items-center border-b-4 border-ink pb-4 font-mono">
          <div>
            <h2 className="text-2xl font-black uppercase text-ink">{statementMonth} AUDIT STATEMENT</h2>
            <p className="text-xs text-muted-text font-bold">ACCOUNT HOLDER: AARAV SHARMA • HDFC BANK AUTOPAY SCAN</p>
          </div>
          <span className="bg-jade text-ink-static font-black text-sm px-3 py-1 border-2 border-ink uppercase">
            GRADE: A+ WEALTH PROTECTED
          </span>
        </div>

        {/* 4 Block Stat Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="bg-terra-tint border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-muted-text uppercase">Sub-Rot Identified</div>
            <div className="text-3xl font-black text-terra">{formatINR(totalRotMonthly)}/m</div>
            <div className="text-[10px] text-muted-text">{rottingCount} Unused Services</div>
          </div>

          <div className="bg-jade-tint border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-muted-text uppercase">Rescued Into SIP</div>
            <div className="text-3xl font-black text-blue">{formatINR(totalDivertedMonthly)}/m</div>
            <div className="text-[10px] text-muted-text">Japan Trip 2026 SIP</div>
          </div>

          <div className="bg-brass border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-ink-static uppercase">Cumulative Savings</div>
            <div className="text-3xl font-black text-ink-static">{formatINR(totalSaved)}</div>
            <div className="text-[10px] text-ink-static/85">In 6 Months</div>
          </div>

          <div className="bg-ink-dark text-on-dark border-3 border-ink p-4 space-y-1">
            <div className="text-xs font-bold text-jade uppercase">10-Yr Wealth Compound</div>
            <div className="text-3xl font-black text-brass">{formatLakhs(tenYearCompound)}</div>
            <div className="text-[10px] text-muted-on-dark">12% Projected CAGR</div>
          </div>
        </div>

        {/* Table of Subscriptions */}
        <div className="space-y-4">
          <h3 className="font-mono font-black text-xl text-ink uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue" aria-hidden="true" />
            <span>Subscription Line-Item Audit</span>
          </h3>

          <div className="overflow-x-auto border-4 border-ink font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">
                Subscription line-item audit with monthly cost, decay score, status and action result
              </caption>
              <thead>
                <tr className="bg-ink-dark text-brass border-b-4 border-ink uppercase font-black">
                  <th scope="col" className="p-3 border-r-2 border-ink-line">Subscription</th>
                  <th scope="col" className="p-3 border-r-2 border-ink-line">Cost</th>
                  <th scope="col" className="p-3 border-r-2 border-ink-line">Decay Score</th>
                  <th scope="col" className="p-3 border-r-2 border-ink-line">Status</th>
                  <th scope="col" className="p-3">Action Result</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted font-bold">
                    <td className="p-3 border-r-2 border-ink uppercase text-ink font-black">
                      {sub.name}
                    </td>
                    <td className="p-3 border-r-2 border-ink">{formatINR(sub.cost)}/m</td>
                    <td className="p-3 border-r-2 border-ink">
                      <span className={sub.decayScore > 60 ? 'text-terra font-black' : 'text-jade'}>
                        {sub.decayScore}%
                      </span>
                    </td>
                    <td className="p-3 border-r-2 border-ink uppercase">
                      {sub.status === 'rotting' && (
                        <span className="bg-crimson text-on-accent px-2 py-0.5 text-[10px]">ROTTING</span>
                      )}
                      {sub.status === 'diverted' && (
                        <span className="bg-jade text-ink-static px-2 py-0.5 text-[10px]">DIVERTED</span>
                      )}
                      {sub.status === 'active' && (
                        <span className="bg-blue text-on-accent px-2 py-0.5 text-[10px]">ACTIVE USE</span>
                      )}
                    </td>
                    <td className="p-3 font-sans text-xs">
                      {sub.status === 'diverted' ? (
                        <span className="text-blue font-bold">Converted to Japan Trip SIP (+{formatINR(sub.cost)}/m)</span>
                      ) : sub.status === 'rotting' ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/subscriptions/${sub.id}`)}
                          className="bg-terra text-on-accent font-mono text-[10px] font-black px-2 py-1 uppercase cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                        >
                          Cancel & Divert ↗
                        </button>
                      ) : (
                        <span className="text-muted-text">High engagement retention</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA to Dashboard or How it works */}
        <div className="pt-4 border-t-4 border-ink flex flex-wrap justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-ink-dark text-on-dark font-mono font-black text-sm px-6 py-3 border-2 border-ink hover:bg-ink-lift cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            ← Return to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate('/how-it-works')}
            className="bg-brass text-ink-static font-mono font-black text-sm px-6 py-3 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-brass-deep cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            View Judges Architecture ↗
          </button>
        </div>
      </div>
    </div>
  );
};