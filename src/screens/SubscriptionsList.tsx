import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sipFutureValue, formatINR } from '../utils/finance';
import { ScrollReveal } from '../motion/ScrollPrimitives';
import { EditorialState } from '../components/ui/EditorialState';
import { SEO } from '../components/SEO';

export const SubscriptionsList: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptions } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'rotting' | 'diverted' | 'active'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set(subscriptions.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, [subscriptions]);

  // Filter subscriptions
  const filteredSubs = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [subscriptions, searchTerm, selectedCategory, statusFilter]);

  const totalMonthlyBleed = useMemo(() => {
    return subscriptions.filter((s) => s.status === 'rotting').reduce((acc, s) => acc + s.cost, 0);
  }, [subscriptions]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Subscriptions Stash Ledger"
        description="Audit all detected debit mandates, active credit card subscriptions, decay scores, and trigger 1-tap AutoPay e-mandate cancellations in ReclaimR."
        canonicalPath="/subscriptions"
      />
      
      {/* Editorial Header & Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ STASH AUDIT & RECLAIM CATALOG ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Subscription Stash Ledger
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Live catalog of all detected automated mandates. Click any row to inspect decay scores, compounding potential, or trigger 1-tap cancellation.
          </p>
        </div>

        {/* Right Summary Metric Box */}
        <div className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-sm text-left md:text-right font-mono-tactile shrink-0">
          <p className="text-[11px] font-[600] tracking-[0.08em] uppercase text-[#C93B2B] dark:text-[#E54D3C]">
            ACTIVE ROT DRAIN
          </p>
          <p className="font-serif-editorial text-[32px] font-[600] tracking-tight mt-0.5 text-[#C93B2B] dark:text-[#E54D3C]">
            {formatINR(totalMonthlyBleed)}<span className="font-sans-clean text-[14px] font-[400] text-[var(--color-ink-secondary)]">/mo</span>
          </p>
          <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-1">
            {subscriptions.filter((s) => s.status === 'rotting').length} Unused Subscriptions
          </p>
        </div>
      </div>

      {/* SEARCH BAR & FILTER CONTROLS */}
      <div className="space-y-4 font-mono-tactile">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)]" />
            <input
              type="text"
              placeholder="Filter by subscription name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] pl-11 pr-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] text-[13px] text-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] self-start sm:self-auto text-[11px]">
            {(['all', 'rotting', 'diverted', 'active'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-none uppercase font-[600] transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18]'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-none uppercase font-[600] whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] dark:bg-[#2D6A4F] dark:border-[#2D6A4F]'
                  : 'bg-[var(--color-paper-surface)] border-[var(--color-paper-border)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-paper-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* EDITORIAL LARGE ROW SUBSCRIPTION LEDGER TABLE */}
      <div className="space-y-0 divide-y divide-[var(--color-paper-border)] border-t border-b border-[var(--color-paper-border)]">
        {filteredSubs.length === 0 ? (
          <div className="py-8">
            <EditorialState
              type={
                subscriptions.length === 0
                  ? 'no-subscriptions'
                  : statusFilter === 'rotting'
                  ? 'no-zombie-subscriptions'
                  : 'empty'
              }
              onPrimaryAction={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setStatusFilter('all');
              }}
              primaryActionLabel="Clear Active Filters"
            />
          </div>
        ) : (
          filteredSubs.map((sub, index) => {
            const indexStr = (index + 1).toString().padStart(2, '0');
            const annualCost = sub.cost * 12;
            const tenYearWealth = sipFutureValue(sub.cost, 10);
            const isExpanded = expandedId === sub.id;

            return (
              <ScrollReveal key={sub.id} direction="none" className="group">
                {/* Main Large Table Row */}
                <div
                  onClick={() => navigate(`/subscriptions/${sub.id}`)}
                  data-cursor-label="INSPECT"
                  className="py-6 px-4 md:px-6 hover:bg-[var(--color-paper-hover)]/70 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Column: Index, Name, Category */}
                  <div className="flex items-start md:items-center gap-5 min-w-[280px]">
                    <span className="font-mono-tactile text-[14px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F] pt-0.5 md:pt-0">
                      {indexStr}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif-editorial text-[22px] md:text-[26px] font-[600] tracking-tight leading-none group-hover:text-[#1B4D3E] dark:group-hover:text-[#2D6A4F] transition-colors">
                          {sub.name}
                        </h2>
                        {sub.status === 'rotting' && (
                          <span className="px-2 py-0.5 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C] font-mono-tactile text-[9px] font-[600] uppercase">
                            ROT {sub.decayScore}%
                          </span>
                        )}
                        {sub.status === 'diverted' && (
                          <span className="px-2 py-0.5 rounded-none bg-[#10B981]/15 text-[#10B981] font-mono-tactile text-[9px] font-[600] uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> DIVERTED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-mono-tactile text-[11px] text-[var(--color-ink-secondary)]">
                        <span className="uppercase font-[600]">{sub.category}</span>
                        <span>•</span>
                        <span>Last used {sub.lastUsedDaysAgo}d ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Monthly & Annual Costs */}
                  <div className="grid grid-cols-2 md:flex items-center gap-6 font-mono-tactile">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">MONTHLY</span>
                      <span className="font-serif-editorial text-[22px] font-[600] text-[var(--color-ink-primary)]">
                        {formatINR(sub.cost)}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">ANNUAL BLEED</span>
                      <span className="text-[15px] font-[600] text-[var(--color-ink-secondary)]">
                        {formatINR(annualCost)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: 10-Yr Reclaim Potential & Action Button */}
                  <div className="flex items-center justify-between md:justify-end gap-4 font-mono-tactile">
                    <div className="hidden lg:block text-right space-y-0.5">
                      <span className="text-[10px] text-[#10B981] font-[600] uppercase tracking-wider block">10-YR RECLAIM SIP</span>
                      <span className="font-serif-editorial text-[20px] font-[600] text-[#10B981]">
                        {formatINR(tenYearWealth)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/subscriptions/${sub.id}`);
                        }}
                        className="h-[38px] px-5 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[12px] font-[600] tracking-[-0.01em] hover:bg-black dark:hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{sub.status === 'rotting' ? 'REVIEW' : 'INSPECT'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleExpand(sub.id, e)}
                        aria-label="Toggle details"
                        className="w-9 h-9 rounded-none bg-black/5 dark:bg-white/10 text-[var(--color-ink-primary)] flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Detail Drawer */}
                {isExpanded && (
                  <div className="p-6 bg-[var(--color-paper-card)] border-t border-[var(--color-paper-border)] space-y-6 font-mono-tactile">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Rot Score Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-[600] uppercase">
                          <span>Usage Decay Score</span>
                          <span className={sub.decayScore > 60 ? 'text-[#C93B2B]' : 'text-[#10B981]'}>{sub.decayScore}% Rot</span>
                        </div>
                        <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-none overflow-hidden">
                          <div
                            className={`h-full rounded-none transition-all duration-500 ${sub.decayScore > 60 ? 'bg-[#C93B2B]' : 'bg-[#10B981]'}`}
                            style={{ width: `${sub.decayScore}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[var(--color-ink-tertiary)]">
                          Last active login recorded {sub.lastUsedDaysAgo} days ago.
                        </p>
                      </div>

                      {/* Financial Compounding Spec */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">10-Yr Compounded Micro-SIP</span>
                        <div className="font-serif-editorial text-[24px] font-[600] text-[#10B981]">
                          {formatINR(tenYearWealth)}
                        </div>
                        <p className="text-[11px] text-[var(--color-ink-tertiary)]">
                          If converted into Nifty 50 Index Fund at 12% CAGR.
                        </p>
                      </div>

                      {/* Quick Action Trigger */}
                      <div className="flex flex-col justify-end space-y-2 font-sans-clean">
                        <button
                          type="button"
                          onClick={() => navigate(`/subscriptions/${sub.id}`)}
                          className="h-[40px] px-5 rounded-none bg-[#1B4D3E] text-white dark:bg-[#2D6A4F] dark:text-[#FAF7F2] font-[600] text-[13px] hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-[#10B981]" />
                          <span>Cancel & Invest {formatINR(sub.cost)}/mo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            );
          })
        )}
      </div>
    </div>
  );
};
