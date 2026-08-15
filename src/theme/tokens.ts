/**
 * ReclaimR Design System Token Registry (TypeScript)
 * Single source of truth for design tokens used in components, charts, and inline styles.
 */

export const colors = {
  paper: {
    bg: 'var(--color-paper-bg)',
    surface: 'var(--color-paper-surface)',
    card: 'var(--color-paper-card)',
    muted: 'var(--color-paper-muted)',
    border: 'var(--color-paper-border)',
    hover: 'var(--color-paper-hover)',
  },
  ink: {
    primary: 'var(--color-ink-primary)',
    secondary: 'var(--color-ink-secondary)',
    tertiary: 'var(--color-ink-tertiary)',
    static: 'var(--color-ink-static)',
  },
  forest: {
    main: 'var(--color-forest-green)',
    light: 'var(--color-forest-light)',
    tint: 'var(--color-forest-tint)',
  },
  sage: {
    main: 'var(--color-sage-olive)',
    dark: 'var(--color-sage-dark)',
    tint: 'var(--color-sage-tint)',
  },
  crimson: {
    main: 'var(--color-crimson-rot)',
    tint: 'var(--color-crimson-tint)',
  },
  brass: {
    main: 'var(--color-brass-gold)',
    tint: 'var(--color-brass-tint)',
  },
} as const;

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export const spacing = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  24: 'var(--space-24)',
  32: 'var(--space-32)',
} as const;

export const radii = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'var(--radius-full)',
} as const;

export const zIndex = {
  deep: 'var(--z-deep)',
  base: 'var(--z-base)',
  lift: 'var(--z-lift)',
  dock: 'var(--z-dock)',
  header: 'var(--z-header)',
  overlay: 'var(--z-overlay)',
  toast: 'var(--z-toast)',
} as const;

export const containerWidths = {
  narrow: 'var(--width-narrow)',
  medium: 'var(--width-medium)',
  standard: 'var(--width-standard)',
  wide: 'var(--width-wide)',
  hero: 'var(--width-hero)',
} as const;

export const transitions = {
  editorial: 'var(--ease-editorial)',
  fast: 'var(--duration-fast)',
  base: 'var(--duration-base)',
  slow: 'var(--duration-slow)',
  reveal: 'var(--duration-reveal)',
} as const;
