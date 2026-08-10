import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Search, ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClickableCard, EmptyState } from '../components/ui';
import { SubIcon } from '../components/SubIcon';
import { formatINR } from '../utils/finance';

export const SubscriptionsList: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptions } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Streaming', 'Fitness', 'Software', 'News', 'Gaming'];

  const filteredSubs = useMemo(() => subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [subscriptions, searchQuery, selectedCategory]);

  const totalMonthlySpend = useMemo(
    () => subscriptions.reduce((acc, s) => acc + s.cost, 0),
    [subscriptions],
  );
  const rottingCount = useMemo(
    () => subscriptions.filter((s) => s.status === 'rotting').length,
    [subscriptions],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-brass border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-ink-dark text-brass font-mono font-black text-xs px-3 py-1 uppercase border border-ink">
            <Layers className="w-4 h-4" />
            <span>YOUR SUBSCRIPTION STASH AUDIT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase text-ink-static tracking-tight">
            Active Subscriptions & Sub-Rot Engine
          </h1>
          <p className="text-sm font-medium text-ink-static max-w-2xl font-sans">
            Click any subscription card below to inspect its usage decay score, 10-year wealth opportunity cost, and trigger a 1-tap cancellation & micro-SIP diversion.
          </p>
        </div>

        <div className="bg-surface border-3 border-ink p-4 font-mono shadow-[4px_4px_0px_0px_var(--color-shadow)] space-y-1">
          <div className="text-xs font-black text-muted-text uppercase">Total Monthly Sub Spend</div>
          <div className="text-3xl font-black text-terra">
            {formatINR(totalMonthlySpend)}/m
          </div>
          <div className="text-[11px] font-bold text-ink">
            {rottingCount} Services Rotting Unused
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border-4 border-ink p-4 shadow-[6px_6px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[260px] relative font-mono">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" aria-hidden="true" />
          <label htmlFor="sub-search" className="sr-only">Search subscriptions</label>
          <input
            id="sub-search"
            type="text"
            placeholder="Search Netflix, Cult.fit, Hotstar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border-2 border-ink pl-10 pr-4 py-2 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center flex-wrap gap-2 font-mono text-xs" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-3 py-2 font-black uppercase border-2 border-ink transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra ${
                selectedCategory === cat
                  ? 'bg-ink-dark text-brass shadow-[2px_2px_0px_0px_var(--color-shadow)]'
                  : 'bg-surface hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Subscription Items */}
      {/* CRITICAL XPATH TEST MANDATE: Each item MUST have 'group' in className and an <h3> header inside! */}
      {filteredSubs.length === 0 && (
        <EmptyState
          title="NO MATCHING SUBSCRIPTIONS"
          message={`Nothing matches "${searchQuery}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Try a different search or category filter.`}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubs.map((sub) => {
          const isRotting = sub.status === 'rotting';
          const isDiverted = sub.status === 'diverted';

          return (
            <ClickableCard
              key={sub.id}
              onClick={() => navigate(`/subscriptions/${sub.id}`)}
              aria-label={`Inspect ${sub.name}`}
              className="group border-4 border-ink bg-surface p-5 shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:shadow-[10px_10px_0px_0px_var(--color-shadow)] hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Badge */}
              <div className="flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-ink-dark text-on-dark px-2 py-0.5 border border-ink">
                  <SubIcon name={sub.iconName} className="w-3 h-3" />
                  {sub.category}
                </span>

                {isRotting && (
                  <span className="bg-crimson text-on-accent font-black text-xs px-2 py-0.5 border border-ink uppercase flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-on-accent" aria-hidden="true" />
                    {sub.decayScore}% ROT
                  </span>
                )}

                {isDiverted && (
                  <span className="bg-jade text-ink-static font-black text-xs px-2 py-0.5 border border-ink uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-ink-static text-jade" aria-hidden="true" />
                    DIVERTED
                  </span>
                )}

                {!isRotting && !isDiverted && (
                  <span className="bg-blue text-on-accent font-black text-xs px-2 py-0.5 border border-ink uppercase">
                    ACTIVE USE
                  </span>
                )}
              </div>

              {/* Title & Description — MUST CONTAIN <h3> */}
              <div className="space-y-2">
                <h3 className="font-mono font-black text-xl text-ink group-hover:text-terra transition-colors uppercase leading-tight">
                  {sub.name}
                </h3>

                <p className="text-xs text-muted-text font-sans line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>

                <div className="bg-bg border-2 border-ink p-2.5 font-mono text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>MONTHLY COST:</span>
                    <span className="text-ink font-black text-sm">{formatINR(sub.cost)}/mo</span>
                  </div>
                  <div className="flex justify-between text-muted-text text-[11px]">
                    <span>LAST LOGGED IN:</span>
                    <span className={sub.lastUsedDaysAgo > 30 ? 'text-terra font-bold' : ''}>
                      {sub.lastUsedDaysAgo} Days Ago
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-text text-[11px]">
                    <span>RENEWAL DATE:</span>
                    <span className="font-bold">{sub.renewDate}</span>
                  </div>
                </div>
              </div>

              {/* 10 Year Wealth Opportunity Card */}
              <div className="bg-brass border-2 border-ink p-3 font-mono text-xs space-y-1 text-ink-static">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[11px] uppercase">10-Yr SIP Potential:</span>
                  <span className="font-black text-sm bg-ink-dark text-brass px-1.5 py-0.5">
                    ₹{(sub.potential10YearGrowth / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <p className="text-[10px] text-ink-static/85 font-sans leading-tight">
                  Calculated at 12% CAGR in Nifty 50 Index / Gold ETF.
                </p>
              </div>

              {/* Action Button Indicator */}
              <div className="pt-2 border-t-2 border-ink flex items-center justify-between font-mono text-xs font-black group-hover:bg-terra group-hover:text-on-accent p-2 transition-colors">
                <span>INSPECT & CANCEL</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </ClickableCard>
          );
        })}
      </div>
    </div>
  );
};