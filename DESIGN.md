# DESIGN.md — ReclaimR Dark Editorial Design System & Technical Spec

> **Brand Identity**: ReclaimR — Zombie Subscription Decay & Wealth Diversion System  
> **Visual Art Direction**: Dark Editorial Ledger inspired by [moneyincheck.org](https://moneyincheck.org)  
> **Core Aesthetic**: High-contrast ink background, raw bone typography, moss green financial growth accents, terracotta rust decay alerts, hairline structural grid dividers, tactile noise overlay, and exponential scroll-driven motion.

---

## 1. Color Palette & Token System

All colors are established using CSS custom properties with strict dark editorial identity.

```css
:root {
  /* ----------------------------------------------------------------- */
  /* 1. CORE BRAND COLOR TOKENS                                        */
  /* ----------------------------------------------------------------- */
  --color-ink-bg: #0C0E0B;             /* Primary Ink Canvas Background */
  --color-bone-text: #F2EFE6;          /* Raw Parchment / Primary Bone Text */
  --color-bone-muted: #A3A096;         /* Secondary Muted Bone */
  --color-bone-dim: #54524B;           /* Dim Slate Bone */

  /* Sovereign Signal Colors */
  --color-moss-growth: #2E5B3F;        /* Moss Green — Diverted Wealth & SIP Growth */
  --color-moss-light: #44805A;         /* Bright Moss Highlight */
  --color-moss-tint: rgba(46, 91, 63, 0.16); /* Soft Moss Glow Fill */

  --color-rust-rot: #C24A2E;           /* Terracotta Rust — Zombie Waste & Decay */
  --color-rust-light: #E06042;         /* Vibrant Rust Alert */
  --color-rust-tint: rgba(194, 74, 46, 0.16); /* Soft Rust Glow Fill */

  /* Surface & Hairline Structural Divider Specs */
  --color-surface-card: #141713;       /* Dark Parchment Elevated Card */
  --color-surface-overlay: #1A1E19;    /* Sticky Bar & Modal Surface */
  --color-border-hairline: rgba(242, 239, 230, 0.14); /* 1px Hairline Dividers (rgba(bone, 0.14)) */
  --color-border-accent: rgba(242, 239, 230, 0.28);   /* Active Hairline Focus */
}
```

---

## 2. Typography System & Clamp-Based Type Scale

### 2.1 Font Stacks
* **Primary Typeface — `Inter`**: Geometric sans-serif designed for computer screens. Used as the single primary typeface for hero headlines, section titles, navigation, buttons, and body prose. Bundled via `@fontsource-variable/inter` with system sans-serif fallback (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) for fast loading and cross-OS readability.
* **Accent / Code Typeface — Monospace**: `SF Mono` / `ui-monospace` / `JetBrains Mono`, utilized selectively for code blocks, numeric figures, ledger metrics, and data-dense UI elements (small-caps labels, table headers, audit IDs).

### 2.2 Fluid Type Scale (`clamp()`)
| Token Name | Family | Size Formula (`clamp()`) | Weight | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--text-display-2xl` | Inter | `clamp(48px, 9.5vw, 136px)` | 600 | `0.95` | `-0.04em` | Main Landing Page Hero |
| `--text-display-xl` | Inter | `clamp(36px, 6.5vw, 92px)` | 600 | `1.02` | `-0.03em` | Major Section Headers |
| `--text-display-lg` | Inter | `clamp(28px, 4.5vw, 56px)` | 600 | `1.08` | `-0.025em` | Section Titles & Cards |
| `--text-heading-md` | Inter | `clamp(20px, 2.5vw, 32px)` | 600 | `1.2` | `-0.015em` | Subsection & Feature Headlines |
| `--text-body-lg` | Inter | `clamp(16px, 1.4vw, 20px)` | 400 | `1.5` | `-0.01em` | Editorial Lead Paragraphs |
| `--text-body-md` | Inter | `clamp(14px, 1.1vw, 16px)` | 400 | `1.5` | `0em` | UI Controls & Standard Copy |
| `--text-mono-sm` | Monospace | `clamp(11px, 0.85vw, 13px)`| 500 | `1.4` | `0.08em` | Small-caps labels, ledger metrics |

```css
.font-display {
  font-family: "Inter Variable", "Inter", -apple-system, sans-serif;
  font-weight: 600;
}

.font-sans-ui {
  font-family: "Inter Variable", "Inter", -apple-system, sans-serif;
}

.font-mono-tactile {
  font-family: "SF Mono", ui-monospace, "JetBrains Mono", monospace;
  font-feature-settings: "tnum" 1, "zero" 1;
}

.label-small-caps {
  font-family: "SF Mono", ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-bone-muted);
}
```

---

## 3. Spacing System (8pt Grid Standard)

All spacing values conform strictly to an 8pt base grid for proportional layout hierarchy:

```css
:root {
  --space-1: 4px;   /* 0.5x */
  --space-2: 8px;   /* 1x   */
  --space-3: 12px;  /* 1.5x */
  --space-4: 16px;  /* 2x   */
  --space-6: 24px;  /* 3x   */
  --space-8: 32px;  /* 4x   */
  --space-12: 48px; /* 6x   */
  --space-16: 64px; /* 8x   */
  --space-24: 96px; /* 12x  */
  --space-32: 128px;/* 16x  */

  /* Responsive Fluid Section Gaps */
  --section-gap-sm: clamp(48px, 8vw, 80px);
  --section-gap-md: clamp(80px, 12vw, 140px);
  --section-gap-lg: clamp(112px, 16vw, 200px);
}
```

---

## 4. Hairline Borders & Noise Overlay Specification

### 4.1 Hairline Borders Specification
* **Border Color**: `rgba(242, 239, 230, 0.14)` (`rgba(bone, 0.14)`).
* **Border Width**: Exactly `1px`.
* **Grid Application**: 1px horizontal and vertical dividers creating structured editorial ledger panels across hero, feature cards, and table headers.

### 4.2 Tactile Film Noise Overlay Specification
* **Implementation**: Fixed pseudo-element / full-viewport SVG noise overlay.
* **SVG Texture Primitive**: `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />`
* **Opacity**: `0.035` (3.5% subtle film grain overlay).
* **Blend Mode**: `mix-blend-mode: soft-light` (or `overlay`).
* **Pointer Events**: `pointer-events: none; z-index: 9999;` (does not block interaction).

```css
/* Noise Overlay Spec */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```

---

## 5. Motion Principles & Timing

### 5.1 Easing & Timing Curves
* **Easing**: Exponential Ease-Out (`cubic-bezier(0.16, 1, 0.3, 1)` / `expo.out`) for buttery, responsive entrances without elastic bounce.
* **Duration Standard**: `0.8s` to `1.2s` for scroll-triggered reveals, word-by-word opacity lighting, and pinned card stack transitions.

### 5.2 Scroll Effects Stack
1. **Lenis Smooth Scroll**: Fluid scroll physics (`lerp: 0.08, smoothWheel: true`) maintaining momentum during long editorial scrolls.
2. **GSAP ScrollTrigger Reveals**: Staggered text entrances and section scrubbers utilizing 0.8–1.2s exponential easing.
3. **Word-by-Word Scroll Highlighting**: Hero and manifesto copy illuminated from 20% dim bone opacity to 100% full bone brightness as user scrolls through text triggers.
4. **Sticky Two-Column Layout**: Left column pins chapter headers while right column smoothly scrolls detailed sub-features.
5. **Stacked Pinned Cards Deck**: Zombie subscription cards lock to viewport center, scaling down slightly (e.g. 0.96 scale, translateY -20px) as the next card scrolls into view.
6. **Canvas "Ledger Rain" Background**: Interactive canvas rendering decaying subscription debit charges (`-₹699 Netflix`, `-₹299 Gym`, `-₹499 SaaS`) falling smoothly and transforming into green moss Nifty 50 SIP vectors.
7. **Animated Counters**: Smoothly interpolated financial figures (`₹0` -> `₹1,48,500` accumulated growth over 5 years).

### 5.3 Accessibility Motion Gating (`prefers-reduced-motion`)
ALL motion effects (Lenis smooth scroll, GSAP ScrollTrigger transitions, continuous canvas animation, word-by-word reveals) MUST be gated behind `prefers-reduced-motion: reduce`. When reduced motion is enabled:
* Scroll reverts to standard browser scrolling.
* Canvas ledger rain freezes or renders static background.
* Reveals render immediately at 100% opacity without scale or translate transforms.

---

## 6. Architecture & Code Conventions

* **Components**: Placed strictly in `src/components/`.
* **Hooks**: Placed strictly in `src/lib/`.
* **Theme Tokens**: Defined in `src/theme/tokens.css` and exported in `src/theme/tokens.ts`.
* **State & Logic Rules**: Existing application state (`AppContext`), mock datasets, routing, and subscription revocation logic MUST NOT be deleted or broken.
