import React from 'react';
import { sipFutureValue, formatINR, formatLakhs } from '../../utils/finance';

/* ------------------------------------------------------------------ */
/* BrutalistButton — Tactile Micro-Interaction Button                 */
/* ------------------------------------------------------------------ */

export interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-sans-clean font-[600] rounded-none inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] hover:bg-black dark:hover:bg-white shadow-md hover:shadow-lg',
    secondary:
      'bg-[var(--color-paper-card)] text-[var(--color-ink-primary)] border border-[var(--color-paper-border)] hover:bg-[var(--color-paper-hover)] hover:border-black/30 dark:hover:border-white/30',
    danger:
      'bg-[#C93B2B] text-white hover:bg-[#a82d1f] shadow-md hover:shadow-lg',
    ghost:
      'bg-transparent text-[var(--color-ink-primary)] hover:bg-black/5 dark:hover:bg-white/5',
  };

  const sizeStyles = {
    sm: 'h-[36px] px-4 text-[12px]',
    md: 'h-[44px] px-6 text-[14px]',
    lg: 'h-[52px] px-8 text-[16px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* BrutalistCard — Tactile Micro-Interaction Container Card          */
/* ------------------------------------------------------------------ */

export interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-none bg-[var(--color-paper-surface)] p-6 border border-[var(--color-paper-border)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-out ${
        hoverable || onClick
          ? 'hover:border-black/30 dark:hover:border-white/30 hover:shadow-[var(--shadow-md)] cursor-pointer active:scale-[0.995]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FinancialFigure — Visually Dominant Editorial Figure Primitive    */
/* ------------------------------------------------------------------ */

export interface FinancialFigureProps {
  amount?: number;
  value?: number;
  prefix?: string;
  suffix?: string;
  perMonth?: boolean;
  perYear?: boolean;
  variant?: 'ink' | 'forest' | 'crimson' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FinancialFigure: React.FC<FinancialFigureProps> = ({
  amount,
  value,
  prefix,
  suffix = '',
  perMonth = false,
  perYear = false,
  variant = 'ink',
  size = 'lg',
  className = '',
}) => {
  const targetVal = amount ?? value ?? 0;

  const variantStyles = {
    ink: 'text-[var(--color-ink-primary)]',
    forest: 'text-[#10B981]',
    crimson: 'text-[#C93B2B] dark:text-[#E54D3C]',
    gold: 'text-[#B8860B] dark:text-[#D4AF37]',
  };

  const sizeStyles = {
    sm: 'text-[22px]',
    md: 'text-[32px]',
    lg: 'text-[48px]',
    xl: 'text-[72px]',
  };

  const formattedStr = prefix ? `${prefix}${targetVal.toLocaleString('en-IN')}${suffix}` : formatINR(targetVal);

  return (
    <span
      className={`font-serif-editorial font-[600] tracking-tight leading-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {formattedStr}
      {perMonth && <span className="font-sans-clean text-[0.35em] font-[400] text-[var(--color-ink-secondary)] opacity-80">/mo</span>}
      {perYear && <span className="font-sans-clean text-[0.35em] font-[400] text-[var(--color-ink-secondary)] opacity-80">/yr</span>}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* EmptyState — Reusable Editorial Empty State                       */
/* ------------------------------------------------------------------ */
/* EditorialState — Reusable Editorial State System                   */
/* ------------------------------------------------------------------ */

export { EditorialState } from './EditorialState';
export type { EditorialStateProps, StateType } from './EditorialState';
import { EditorialState } from './EditorialState';

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <EditorialState
      type="empty"
      title={title}
      whatHappened={title}
      whatItMeans={message}
      whatToDoNext={actionLabel ? `Click '${actionLabel}' to proceed.` : 'Adjust active parameters.'}
      primaryActionLabel={actionLabel}
      onPrimaryAction={onAction}
    />
  );
};

/* ------------------------------------------------------------------ */
/* ClickableCard — Backward Compatibility Alias                       */
/* ------------------------------------------------------------------ */

export const ClickableCard = BrutalistCard;

