import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldAlert, Sparkles, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Subscription } from '../types';
import { sipFutureValue, formatINR } from '../utils/finance';
import { NumberCounter } from '../motion/ScrollPrimitives';

interface ZombieSubscriptionCardProps {
  subscription: Subscription;
  onExecuteCancel?: (id: string) => void;
  className?: string;
}

export const ZombieSubscriptionCard: React.FC<ZombieSubscriptionCardProps> = ({
  subscription,
  onExecuteCancel,
  className = '',
}) => {
  const navigate = useNavigate();

  const isZombie = subscription.status === 'rotting' || subscription.decayScore > 60;
  const annualBleed = subscription.cost * 12;
  const tenYearLoss = sipFutureValue(subscription.cost, 10);

  const handleAction = () => {
    if (onExecuteCancel) {
      onExecuteCancel(subscription.id);
    }
    navigate(`/subscriptions/${subscription.id}`);
  };

  return (
    <div
      role="region"
      aria-label={`Zombie subscription alert for ${subscription.name}`}
      className={`rounded-none bg-[var(--color-paper-surface)] p-6 md:p-8 border shadow-[var(--shadow-md)] relative overflow-hidden transition-all duration-300 ${
        isZombie
          ? 'border-[#C93B2B]/40 dark:border-[#E54D3C]/40 animate-pulse-glow'
          : 'border-[var(--color-paper-border)]'
      } ${className}`}
    >
      {/* Background Subtle Guillotine Line */}
      <div className="absolute top-0 right-0 w-36 h-36 guillotine-pattern opacity-30 pointer-events-none rounded-bl-none" />

      <div className="space-y-6 relative z-10 font-sans-clean">
        
        {/* Top Status & Inactivity Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-paper-border)] pb-4 font-mono-tactile">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#C93B2B] dark:bg-[#E54D3C] animate-ping" />
            <span className="text-[11px] font-[600] uppercase tracking-widest text-[#C93B2B] dark:text-[#E54D3C] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-[#C93B2B]" />
              ZOMBIE SUBSCRIPTION DETECTED
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--color-ink-secondary)] font-[600]">
            <Clock className="w-3.5 h-3.5 text-[#C93B2B] dark:text-[#E54D3C]" />
            <span>INACTIVE FOR {subscription.lastUsedDaysAgo} DAYS</span>
          </div>
        </div>

        {/* Name, Category & Financial Impact */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tactile text-[11px] font-[600] uppercase text-[var(--color-ink-tertiary)]">
                {subscription.category}
              </span>
              <span className="px-2 py-0.5 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C] font-mono-tactile text-[9px] font-[600]">
                {subscription.decayScore}% DECAY SCORE
              </span>
            </div>

            <h3 className="font-serif-editorial text-[30px] md:text-[36px] font-[600] tracking-tight leading-none text-[var(--color-ink-primary)]">
              {subscription.name}
            </h3>
            <p className="text-[13px] text-[var(--color-ink-secondary)] italic font-serif-editorial pt-0.5">
              "Quietly draining your account every 30 days."
            </p>
          </div>

          <div className="font-mono-tactile text-left sm:text-right shrink-0">
            <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider block">MONTHLY DRAIN</span>
            <div className="font-serif-editorial text-[32px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] leading-none">
              {formatINR(subscription.cost)}
              <span className="font-sans-clean text-[13px] text-[var(--color-ink-secondary)] font-[400]">/mo</span>
            </div>
            <span className="text-[11px] text-[var(--color-ink-secondary)] block mt-0.5">
              {formatINR(annualBleed)}/year
            </span>
          </div>
        </div>

        {/* Audit Explanation Box (WHY It Was Flagged) */}
        <div className="p-4 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-2 font-mono-tactile">
          <div className="flex items-center gap-2 text-[11px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Audit Classification Rationale</span>
          </div>
          <p className="font-sans-clean text-[13px] text-[var(--color-ink-secondary)] leading-relaxed">
            Flagged as a <strong className="text-[var(--color-ink-primary)] font-[600]">Zombie Subscription</strong> because zero active watch time or login events were recorded in <strong className="text-[#C93B2B] dark:text-[#E54D3C]">{subscription.lastUsedDaysAgo} consecutive days</strong>, yet an auto-debit e-mandate hits on your account in 3 days.
          </p>
        </div>

        {/* Reclaim SIP Impact & Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[var(--color-paper-border)]">
          <div className="font-mono-tactile space-y-0.5">
            <span className="text-[10px] text-[#10B981] font-[600] uppercase tracking-wider block">10-YR RECLAIM COMPOUNDING POTENTIAL</span>
            <span className="font-serif-editorial text-[22px] font-[600] text-[#10B981]">
              {formatINR(tenYearLoss)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAction}
            data-cursor-label="RECLAIM"
            className="h-[48px] px-7 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[14px] tracking-[-0.01em] hover:bg-black dark:hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>Terminate Mandate & Invest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
