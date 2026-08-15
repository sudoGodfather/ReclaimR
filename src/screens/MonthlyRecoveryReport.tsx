import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileSpreadsheet, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { sipFutureValue, formatINR, formatLakhs } from '../utils/finance';
import { EditorialTrajectoryChart } from '../components/charts/EditorialTrajectoryChart';
import { EditorialSpendingBreakdownChart } from '../components/charts/EditorialSpendingBreakdownChart';
import { EditorialSipProjectionChart } from '../components/charts/EditorialSipProjectionChart';
import { SEO } from '../components/SEO';

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
    <div className="max-w-[1080px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Monthly Financial Recovery Report"
        description="Comprehensive financial recovery statement showing capital rescued from subscription rot, micro-SIP returns, and itemized line-item audit logs in ReclaimR."
        canonicalPath="/reports"
      />
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ MONTHLY WEALTH AUDIT STATEMENT ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Monthly Recovery Report
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Comprehensive financial recovery audit showing money rescued from subscription rot, micro-SIP returns, and 10-year wealth projections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          data-cursor-label="EXPORT"
          className="h-[42px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[13px] font-[600] tracking-[-0.01em] hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto shadow-md"
        >
          <Download className="w-4 h-4 text-[#10B981]" />
          <span>Export PDF Audit</span>
        </button>
      </div>

      {/* Main Statement Card */}
      <div className="rounded-none bg-[var(--color-paper-surface)] p-6 md:p-10 shadow-[var(--shadow-lg)] border border-[var(--color-paper-border)] space-y-8">
        
        {/* Statement Month Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-6">
          <div>
            <h2 className="font-serif-editorial text-[24px] font-[600] tracking-tight">{statementMonth} AUDIT STATEMENT</h2>
            <p className="font-mono-tactile text-[12px] text-[var(--color-ink-secondary)] font-[500] mt-0.5">AARAV SHARMA • HDFC BANK AUTOPAY SCAN</p>
          </div>
          <span className="font-mono-tactile bg-[#10B981]/15 text-[#10B981] font-[600] text-[12px] px-3 py-1 rounded-none uppercase self-start sm:self-auto">
            Grade: A+ Wealth Protected
          </span>
        </div>

        {/* 4 Block Stat Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-tactile">
          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-1">
            <span className="text-[10px] font-[600] text-[#C93B2B] uppercase tracking-wider block">SUB-ROT IDENTIFIED</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[#C93B2B]">{formatINR(totalRotMonthly)}/mo</div>
            <span className="text-[12px] text-[var(--color-ink-secondary)] block">{rottingCount} Unused Services</span>
          </div>

          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-1">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider block">RESCUED INTO SIP</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[#10B981]">{formatINR(totalDivertedMonthly)}/mo</div>
            <span className="text-[12px] text-[var(--color-ink-secondary)] block">Japan Trip 2026 SIP</span>
          </div>

          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-1">
            <span className="text-[10px] font-[600] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">CUMULATIVE SAVINGS</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[var(--color-ink-primary)]">{formatINR(totalSaved)}</div>
            <span className="text-[12px] text-[var(--color-ink-secondary)] block">In 6 Months</span>
          </div>

          <div className="p-5 rounded-none bg-[#1A1A18] text-white space-y-1 shadow-md">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-wider block">10-YR WEALTH COMPOUND</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[#10B981]">{formatLakhs(tenYearCompound)}</div>
            <span className="text-[12px] text-white/50 block">12% Projected CAGR</span>
          </div>
        </div>

        {/* Editorial Charts Section */}
        <div className="space-y-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EditorialTrajectoryChart />
            <EditorialSpendingBreakdownChart />
          </div>
          <EditorialSipProjectionChart monthlyAmount={totalDivertedMonthly > 0 ? totalDivertedMonthly : 1448} />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* REDESIGNED EDITORIAL INFORMATION-DESIGN TABLE (RESPONSIVE STACK)   */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-4 pt-6 border-t border-[var(--color-paper-border)]">
          <h2 className="font-serif-editorial font-[600] text-[22px] tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1B4D3E] dark:text-[#2D6A4F]" />
            <span>Subscription Line-Item Audit Ledger</span>
          </h2>

          {/* Desktop Tabular View */}
          <div className="hidden md:block overflow-x-auto rounded-none border border-[var(--color-paper-border)] font-mono-tactile">
            <table className="w-full text-left text-[13px] border-collapse">
              <caption className="sr-only">Subscription line-item audit table with costs and status</caption>
              <thead>
                <tr className="bg-[var(--color-paper-card)] text-[var(--color-ink-secondary)] font-[600] uppercase text-[10px] tracking-wider border-b border-[var(--color-paper-border)]">
                  <th scope="col" className="p-4">#</th>
                  <th scope="col" className="p-4">Subscription</th>
                  <th scope="col" className="p-4">Category</th>
                  <th scope="col" className="p-4 text-right">Monthly Cost</th>
                  <th scope="col" className="p-4 text-right">Decay Score</th>
                  <th scope="col" className="p-4">Status</th>
                  <th scope="col" className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-paper-border)] font-sans-clean">
                {subscriptions.map((sub, idx) => {
                  const idxStr = (idx + 1).toString().padStart(2, '0');
                  return (
                    <tr
                      key={sub.id}
                      onClick={() => navigate(`/subscriptions/${sub.id}`)}
                      className="hover:bg-[var(--color-paper-hover)]/70 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-mono-tactile font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
                        {idxStr}
                      </td>
                      <td className="p-4 font-[600] text-[var(--color-ink-primary)] font-serif-editorial text-[16px]">
                        {sub.name}
                      </td>
                      <td className="p-4 font-mono-tactile text-[11px] text-[var(--color-ink-secondary)] uppercase">
                        {sub.category}
                      </td>
                      <td className="p-4 text-right font-mono-tactile font-[600] text-[var(--color-ink-primary)]">
                        {formatINR(sub.cost)}/mo
                      </td>
                      <td className="p-4 text-right font-mono-tactile font-[600]">
                        <span className={sub.decayScore > 60 ? 'text-[#C93B2B]' : 'text-[#10B981]'}>
                          {sub.decayScore}%
                        </span>
                      </td>
                      <td className="p-4 uppercase font-mono-tactile">
                        {sub.status === 'rotting' && (
                          <span className="bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C] font-[600] px-2.5 py-0.5 rounded-none text-[10px]">Rotting</span>
                        )}
                        {sub.status === 'diverted' && (
                          <span className="bg-[#10B981]/15 text-[#10B981] font-[600] px-2.5 py-0.5 rounded-none text-[10px]">Diverted</span>
                        )}
                        {sub.status === 'active' && (
                          <span className="bg-[#1B4D3E]/10 text-[#1B4D3E] dark:text-[#2D6A4F] font-[600] px-2.5 py-0.5 rounded-none text-[10px]">Active</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono-tactile">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/subscriptions/${sub.id}`);
                          }}
                          className="h-[30px] px-3.5 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[11px] font-[600] cursor-pointer"
                        >
                          {sub.status === 'rotting' ? 'Cancel & Divert ↗' : 'Inspect ↗'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Information Blocks */}
          <div className="md:hidden space-y-3 font-mono-tactile">
            {subscriptions.map((sub, idx) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/subscriptions/${sub.id}`)}
                className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] space-y-3 shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
                    0{(idx + 1)}
                  </span>
                  <span className={`text-[10px] font-[600] px-2.5 py-0.5 rounded-none uppercase ${
                    sub.status === 'rotting' ? 'bg-[#C93B2B]/10 text-[#C93B2B]' : 'bg-[#10B981]/15 text-[#10B981]'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif-editorial text-[18px] font-[600]">{sub.name}</h3>
                  <p className="text-[11px] text-[var(--color-ink-secondary)]">{sub.category} • {sub.decayScore}% Rot</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[var(--color-paper-border)]">
                  <span className="font-serif-editorial text-[18px] font-[600]">{formatINR(sub.cost)}/mo</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/subscriptions/${sub.id}`);
                    }}
                    className="h-[30px] px-3.5 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[11px] font-[600]"
                  >
                    Inspect ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="pt-4 border-t border-[var(--color-paper-border)] flex flex-wrap justify-between items-center gap-4 font-mono-tactile">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="h-[42px] px-6 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[13px] font-[600] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer"
          >
            ← Return to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate('/how-it-works')}
            className="h-[42px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[13px] font-[600] hover:bg-black transition-colors cursor-pointer"
          >
            View Judges Architecture ↗
          </button>
        </div>

      </div>
    </div>
  );
};
