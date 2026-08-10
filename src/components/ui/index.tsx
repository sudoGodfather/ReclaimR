import React from 'react';

/* ------------------------------------------------------------------ */
/*  BrutalistCard — shared card container with neo-brutalist shadow    */
/* ------------------------------------------------------------------ */

const shadowMap = {
  sm: 'shadow-[2px_2px_0px_0px_var(--color-shadow)]',
  md: 'shadow-[4px_4px_0px_0px_var(--color-shadow)]',
  lg: 'shadow-[6px_6px_0px_0px_var(--color-shadow)]',
  xl: 'shadow-[8px_8px_0px_0px_var(--color-shadow)]',
  xxl: 'shadow-[10px_10px_0px_0px_var(--color-shadow)]',
} as const;

interface BrutalistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: keyof typeof shadowMap;
  border?: boolean;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  className = '',
  shadow = 'lg',
  border = true,
  ...rest
}) => (
  <div
    className={`${border ? 'border-4 border-ink' : ''} ${shadowMap[shadow]} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/*  BrutalistButton — shared button with focus ring + variants         */
/* ------------------------------------------------------------------ */

type Variant = 'terra' | 'brass' | 'jade' | 'blue' | 'ink' | 'surface';

const variantMap: Record<Variant, string> = {
  terra: 'bg-terra text-on-accent hover:bg-terra-deep',
  brass: 'bg-brass text-ink-static hover:bg-brass-deep',
  jade: 'bg-jade text-ink-static hover:bg-jade-deep',
  blue: 'bg-blue text-on-accent hover:bg-blue-deep',
  ink: 'bg-ink-dark text-brass hover:bg-ink-lift',
  surface: 'bg-surface text-ink hover:bg-muted',
};

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  shadow?: keyof typeof shadowMap;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  className = '',
  variant = 'surface',
  shadow = 'sm',
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    className={`font-mono font-black uppercase border-2 border-ink cursor-pointer
      transition-all hover:translate-x-px hover:translate-y-px
      focus:outline-none focus-visible:ring-2 focus-visible:ring-terra focus-visible:ring-offset-2 focus-visible:ring-offset-bg
      disabled:cursor-not-allowed disabled:opacity-60
      ${variantMap[variant]} ${shadowMap[shadow]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  EmptyState — consistent empty/placeholder blocks                   */
/* ------------------------------------------------------------------ */

interface EmptyStateProps {
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
}) => (
  <div className="border-3 border-ink bg-muted p-8 text-center space-y-3 font-mono">
    <div className="text-4xl">▚▞</div>
    <h3 className="font-black text-lg uppercase text-ink">{title}</h3>
    <p className="text-xs text-muted-text font-sans max-w-md mx-auto">{message}</p>
    {actionLabel && onAction && (
      <div className="pt-2">
        <BrutalistButton variant="jade" className="px-6 py-3 text-xs" onClick={onAction}>
          {actionLabel}
        </BrutalistButton>
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/*  FocusRing — utility wrapper to make div-cards keyboard accessible  */
/* ------------------------------------------------------------------ */

interface ClickableCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ClickableCard: React.FC<ClickableCardProps> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    type="button"
    className={`w-full text-left cursor-pointer
      focus:outline-none focus-visible:ring-2 focus-visible:ring-terra focus-visible:ring-offset-2 focus-visible:ring-offset-bg
      ${className}`}
    {...rest}
  >
    {children}
  </button>
);
