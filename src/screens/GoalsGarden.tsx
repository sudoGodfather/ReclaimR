import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, X, Sparkles, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { Goal } from '../types';
import { useApp } from '../context/AppContext';
import { EditorialState } from '../components/ui/EditorialState';
import { SubIcon } from '../components/SubIcon';
import { sipFutureValue, formatINR, formatLakhs } from '../utils/finance';
import { ScrollReveal, NumberCounter } from '../motion/ScrollPrimitives';
import { EditorialInput, EditorialSelect } from '../components/ui/FormPrimitives';
import { SEO } from '../components/SEO';

export const GoalsGarden: React.FC = () => {
  const navigate = useNavigate();
  const { goals, addGoal, totalDivertedMonthly } = useApp();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTarget, setNewTarget] = useState<number>(100000);
  const [newCategory, setNewCategory] = useState<string>('Travel');
  const [newDeadline, setNewDeadline] = useState<string>('Dec 2026');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    const goalObj: Goal = {
      id: `goal-${Date.now()}`,
      title: trimmedTitle.slice(0, 60),
      targetAmount: Number(newTarget),
      currentAmount: 1200,
      monthlyContribution: totalDivertedMonthly > 0 ? totalDivertedMonthly : 649,
      icon: 'Target',
      deadline: newDeadline.trim(),
      category: newCategory,
      color: '#10B981',
    };

    addGoal(goalObj);
    setShowAddModal(false);
    setNewTitle('');
  };

  const totalGoalCapital = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalReclaimedMonthly = totalDivertedMonthly > 0 ? totalDivertedMonthly : 1448;
  const totalInvestableMonthly = totalReclaimedMonthly;
  const fiveYearPortfolioWealth = sipFutureValue(totalInvestableMonthly, 5);

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Goals Garden — Micro-SIP Wealth Routing"
        description="Watch reclaimed subscription cash sprout into long-term wealth. Manage micro-SIP compounding targets and index fund allocations in ReclaimR's Goals Garden."
        canonicalPath="/goals"
      />
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#10B981]">
            [ WEALTH DIVERSION & SIP GARDEN ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Goals Garden
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Every rupee rescued from subscription decay is automatically redirected into high-yield micro-SIPs. Watch cancelled subscriptions blossom into real wealth.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          data-cursor-label="PLANT"
          className="h-[46px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[13px] font-[600] tracking-[-0.01em] hover:bg-black dark:hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto shadow-md"
        >
          <Plus className="w-4 h-4 text-[#10B981]" />
          <span>Plant New Goal</span>
        </button>
      </div>

      {/* FINANCIAL EQUATION BANNER (CURRENT + RECLAIMED = INVESTABLE) */}
      <ScrollReveal direction="up" className="p-6 md:p-8 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] font-mono-tactile space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-paper-border)] pb-3">
          <span className="text-[11px] font-[600] uppercase text-[#10B981] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            LIVE CAPITAL DIVERSION FORMULA
          </span>
          <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase">AUTOMATED NIFTY 50 ROUTER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center text-center md:text-left">
          <div className="md:col-span-2 space-y-1 p-4 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)]">
            <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">CURRENT SAVED CAPITAL</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[var(--color-ink-primary)]">
              {formatINR(totalGoalCapital)}
            </div>
            <span className="text-[10px] text-[var(--color-ink-secondary)] block">In Active Goals</span>
          </div>

          <div className="md:col-span-1 text-[24px] font-[600] text-[#10B981] text-center">+</div>

          <div className="md:col-span-2 space-y-1 p-4 rounded-none bg-[#10B981]/10 border border-[#10B981]/30">
            <span className="text-[10px] text-[#10B981] font-[600] uppercase tracking-wider block">RECLAIMED SUB MONEY</span>
            <div className="font-serif-editorial text-[26px] font-[600] text-[#10B981]">
              +{formatINR(totalReclaimedMonthly)}<span className="font-sans-clean text-[12px] font-[400]">/mo</span>
            </div>
            <span className="text-[10px] text-[#10B981] font-[600] block">Diverted from Rot</span>
          </div>

          <div className="md:col-span-1 text-[24px] font-[600] text-[#10B981] text-center">=</div>

          <div className="md:col-span-1 space-y-1 p-4 rounded-none bg-[#1A1A18] text-white shadow-lg">
            <span className="text-[10px] text-[#10B981] font-[600] uppercase tracking-wider block">INVESTABLE SIP</span>
            <div className="font-serif-editorial text-[24px] font-[600] text-[#10B981]">
              {formatINR(totalInvestableMonthly)}<span className="font-sans-clean text-[11px] text-white/60 font-[400]">/mo</span>
            </div>
            <span className="text-[9px] text-white/50 block">Monthly Allocation</span>
          </div>
        </div>
      </ScrollReveal>

      {/* GOALS CARDS GRID */}
      {goals.length === 0 && (
        <EditorialState
          type="no-goals"
          onPrimaryAction={() => setShowAddModal(true)}
          primaryActionLabel="Plant Your First Goal"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const fiveYearCompound = sipFutureValue(goal.monthlyContribution, 5);

          return (
            <ScrollReveal
              key={goal.id}
              direction="up"
              className="rounded-none bg-[var(--color-paper-surface)] p-6 border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] flex flex-col justify-between space-y-6 relative overflow-hidden font-sans-clean hover:border-[#10B981]/40 transition-all"
            >
              <div className="flex justify-between items-center font-mono-tactile">
                <span className="flex items-center gap-1.5 text-[11px] font-[600] text-[var(--color-ink-secondary)] uppercase tracking-wider">
                  <SubIcon name={goal.icon} className="w-3.5 h-3.5 text-[#10B981]" />
                  {goal.category}
                </span>
                <span className="bg-[#10B981]/15 text-[#10B981] font-[600] text-[11px] px-2.5 py-0.5 rounded-none uppercase">
                  {percent}% Achieved
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif-editorial font-[600] text-[24px] text-[var(--color-ink-primary)] tracking-tight leading-tight">
                  {goal.title}
                </h2>
                <p className="text-[12px] text-[var(--color-ink-secondary)] font-mono-tactile font-[500]">
                  Target Deadline: {goal.deadline}
                </p>
              </div>

              <div className="space-y-2 font-mono-tactile">
                <div className="flex justify-between items-baseline text-[12px]">
                  <span className="text-[var(--color-ink-secondary)]">Current Saved: <strong className="text-[var(--color-ink-primary)]">{formatINR(goal.currentAmount)}</strong></span>
                  <span className="font-[600] text-[14px]">Goal: {formatINR(goal.targetAmount)}</span>
                </div>
                
                <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-none overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-none transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[12px] space-y-1.5 font-mono-tactile">
                <div className="text-[10px] font-[600] text-[var(--color-ink-tertiary)] uppercase tracking-wider">ACTIVE DIVERSION FEED:</div>
                <div className="flex justify-between font-[600] text-[#10B981]">
                  <span>Sub-Rot Diverted:</span>
                  <span>+{formatINR(goal.monthlyContribution)}/mo</span>
                </div>
              </div>

              <div className="p-4 rounded-none bg-[#1A1A18] text-white text-[12px] flex items-center justify-between font-mono-tactile shadow-sm">
                <span className="text-white/70 font-[500]">5-Yr Compound Projection:</span>
                <span className="font-serif-editorial font-[600] text-[#10B981] text-[18px]">
                  {formatINR(fiveYearCompound)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-ink-tertiary)] font-mono-tactile">
                <Info className="w-3 h-3 text-[#10B981] shrink-0" />
                <span>Projections assume 12% historical CAGR index returns (non-guaranteed).</span>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* REDESIGNED EDITORIAL ADD GOAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] flex items-center justify-center p-4">
          <div className="bg-[var(--color-paper-surface)] rounded-none p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[var(--color-paper-border)] space-y-6">
            <div className="flex justify-between items-center border-b border-[var(--color-paper-border)] pb-4 font-mono-tactile">
              <h2 className="font-serif-editorial font-[600] text-[22px] text-[var(--color-ink-primary)]">
                Plant a New Wealth Goal
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-none bg-black/5 dark:bg-white/10 text-[var(--color-ink-primary)] flex items-center justify-center hover:bg-black/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 font-sans-clean">
              <EditorialInput
                label="Goal Title"
                placeholder="e.g. Electric Scooter / Emergency Cushion"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={60}
                required
              />

              <EditorialInput
                label="Target Amount (₹)"
                type="number"
                min={1000}
                value={newTarget}
                onChange={(e) => setNewTarget(Number(e.target.value))}
                required
              />

              <EditorialSelect
                label="Goal Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                options={[
                  { value: 'Travel', label: 'Travel & Experience' },
                  { value: 'Emergency', label: 'Emergency Cushion' },
                  { value: 'Education', label: 'Education & Learning' },
                  { value: 'Home', label: 'Home & Real Estate' },
                  { value: 'Retirement', label: 'Retirement Equity' },
                ]}
              />

              <EditorialInput
                label="Target Deadline"
                placeholder="e.g. Dec 2026"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                maxLength={30}
                required
              />

              <div className="flex gap-3 pt-2 font-sans-clean">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 h-[46px] rounded-none bg-[var(--color-paper-card)] text-[var(--color-ink-primary)] font-[600] text-[13px] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 h-[46px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px] hover:bg-black transition-colors cursor-pointer"
                >
                  Plant Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
