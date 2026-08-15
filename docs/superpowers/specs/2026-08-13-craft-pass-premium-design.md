# Design Spec — Craft Pass: Apple-Level Premium Polish

**Date:** 2026-08-13
**Status:** Approved by user (hybrid identity direction + approach A, both sections)
**Scope:** Polish pass on ReclaimR's landing experience — motion, spacing, surfaces, component polish. No new sections, no layout restructuring, no content changes.

## 1. Goal

Bring Apple-grade craft to the existing editorial identity. Keep the hybrid direction: Apple surfaces/motion language, moss/rust/bone accents, Fraunces serif display, Inter body. The site already has GSAP + ScrollTrigger (Reveal, Magnetic, custom cursor, glass navbar); this pass makes the *craft* consistent and premium rather than adding effects.

## 2. Design Principles

1. **Consistency of craft over decoration** — one easing curve, one card spec, one button spec, everywhere.
2. **Restraint** — no new effects; refine and harmonize what exists.
3. **Tokens over ad-hoc classes** — every radius/shadow/duration/easing change flows through the existing token system.

## 3. Changes

### 3.1 Easing & duration tokens

- Add `--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)` (expo-out settle) to `src/theme/tokens.css` — becomes the standard for interactive transitions.
- Durations via existing tokens: 150ms hover, 250ms transitions, 800ms reveals. Replace ad-hoc `duration-300`/`duration-500` strings in touched components with token-driven values.
- Keep `--ease-editorial` for scroll-triggered reveals if desired; interactive elements use `--ease-premium`.

### 3.2 Interactive surface spec (shared rules)

Applied to: StackedCards, PricingSection tiers, BuilderSection steps, FieldNotes cards, FAQ items, LeakCalculator panel, Waitlist card.

- Rest: `rounded-[20px]` (`--radius-lg`), hairline `border border-fg/8`, `shadow-sm`.
- Hover: `shadow-lg`, `-translate-y-[2px]`, 250ms `--ease-premium`.
- Primary pill buttons (navbar CTA, waitlist submit, pricing CTA): Apple press physics — `hover:-translate-y-[1px]` + glow shadow, `active:scale-[0.97]`, 250ms.
- Primary CTA hover gets moss→rust gradient glow (brand accent moment).
- Focus: `focus-visible:ring-2 ring-rust ring-offset-2` on interactive elements for accessibility parity.
- Remove raw `hover:scale-[1.02]` / `transition-all` scatter in touched components (62 occurrences across components — those in scope above).

### 3.3 Navbar glass

- Scrolled state: `bg-canvas/70 backdrop-blur-xl backdrop-saturate-150 border-b border-fg/10` (was `bg-canvas/85 backdrop-blur-md border-fg/14`).
- Mobile sheet: same glass treatment, `rounded-[20px]`, `shadow-2xl`.
- No changes to wordmark, links, or CTA markup.

### 3.4 Motion refinement

- `Reveal` (`src/components/Reveal.tsx`): easing `expo.out` → `power3.out`, default distance 24 → 20, keep `once`, keep `prefers-reduced-motion` gate.
- Hero headline + manifesto get optional blur-in: `filter: blur(4px) → blur(0)` alongside fade/slide — only on the two hero reveals, via a `blur` prop on Reveal (default off).
- Stat band counters: verify entrance timing harmonized to ~800ms across all counters (InvertedStatsBand).
- Marquee: unchanged.

### 3.5 Dark mode depth

- Glass surfaces use `bg-canvas/60` in dark (verify `--color-canvas` resolves per theme).
- Cards must use existing dark shadow tokens (`--shadow-*` in the `.dark` block) — audit and apply where missing.

## 4. Non-goals (explicitly out of scope)

- New sections, new copy, layout restructuring.
- Scroll narrative effects (sticky-scale manifesto, parallax) — approach B, not selected.
- Full glassmorphism restyle (approach C) — contradicts approved editorial identity.
- Changes to Fraunces/Inter font stack, colors, or the scramble-decode hero effect.

## 5. Verification

1. `npm run lint` (tsc --noEmit) passes.
2. `npm run build` passes.
3. Browser checks on `/`:
   - Navbar glass (blur + saturate + hairline) appears after 80px scroll; mobile sheet glass.
   - Cards lift with hairline borders; buttons have Apple press physics; focus rings visible via keyboard tab.
   - Reveal animations settle with power3; hero blur-in on load; counters animate.
   - Dark mode toggle: glass + shadows render correctly.
4. `prefers-reduced-motion: reduce` — all motion gated off, content fully visible.
5. No console errors.
