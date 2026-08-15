import React from 'react';
import { formatINR } from '../../utils/finance';
import { useApp } from '../../context/AppContext';

interface CategorySpending {
  category: string;
  amount: number;
  rotPercentage: number;
  color: string;
}

interface EditorialSpendingBreakdownChartProps {
  data?: CategorySpending[];
  title?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  Streaming: 'Streaming',
  Fitness: 'Fitness',
  Software: 'Software & Productivity',
  Gaming: 'Gaming',
  News: 'Publications & News',
  Utility: 'Utilities & Bills',
};

const CATEGORY_COLORS: Record<string, string> = {
  Streaming: '#C93B2B',
  Fitness: '#1A1A18',
  Software: '#1B4D3E',
  Gaming: '#6E8B74',
  News: '#B8860B',
  Utility: '#47608F',
};

function buildCategoryData(subscriptions: { category: string; cost: number; decayScore: number }[]): CategorySpending[] {
  const groups = new Map<string, { amount: number; decaySum: number; count: number }>();
  for (const s of subscriptions) {
    const group = groups.get(s.category) ?? { amount: 0, decaySum: 0, count: 0 };
    group.amount += s.cost;
    group.decaySum += s.decayScore;
    group.count += 1;
    groups.set(s.category, group);
  }
  return Array.from(groups.entries()).map(([category, g]) => ({
    category: CATEGORY_LABELS[category] ?? category,
    amount: g.amount,
    rotPercentage: Math.round(g.decaySum / g.count),
    color: CATEGORY_COLORS[category] ?? '#1A1A18',
  }));
}

export const EditorialSpendingBreakdownChart: React.FC<EditorialSpendingBreakdownChartProps> = ({
  data,
  title = 'Subscription Spending & Rot Exposure by Category',
  className = '',
}) => {
  const { subscriptions } = useApp();
  const resolvedData = data ?? buildCategoryData(subscriptions);
  const maxAmount = Math.max(...resolvedData.map((d) => d.amount), 3000);
  const totalSpending = resolvedData.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-6 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6 font-mono-tactile ${className}`}
    >
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-paper-border)] pb-3">
        <div>
          <h3 className="font-serif-editorial text-[18px] font-[600] text-[var(--color-ink-primary)]">
            {title}
          </h3>
          <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">
            Total Monthly Exposure: <strong className="text-[var(--color-ink-primary)]">{formatINR(totalSpending)}/mo</strong>
          </p>
        </div>

        <span className="text-[10px] font-[600] px-3 py-1 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] uppercase">
          ROT BREAKDOWN
        </span>
      </div>

      {/* Horizontal Editorial Bar Ledger */}
      <div className="space-y-4">
        {resolvedData.map((cat) => {
          const widthPercent = Math.round((cat.amount / maxAmount) * 100);

          return (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-[600] text-[var(--color-ink-primary)] uppercase tracking-wide">
                  {cat.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-[600] text-[#C93B2B]">
                    {cat.rotPercentage}% ROT
                  </span>
                  <span className="font-serif-editorial text-[15px] font-[600]">
                    {formatINR(cat.amount)}/mo
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-black/5 dark:bg-white/5 h-3 rounded-none overflow-hidden p-0.5 border border-[var(--color-paper-border)]">
                <div
                  className="h-full rounded-none transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[10px] text-[var(--color-ink-tertiary)] border-t border-[var(--color-paper-border)]">
        * Rot Percentage indicates days unused over 30-day billing cycles.
      </div>
    </div>
  );
};
