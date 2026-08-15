# Design Spec — Editorial Serif Typography Upgrade (Fraunces)

**Date:** 2026-08-13
**Status:** Approved by user (visual mockups A + "Approve serif upgrade" clicked)
**Scope:** Polish the existing ReclaimR editorial aesthetic via typography — no layout changes, no new sections.

## 1. Goal

ReclaimR's DESIGN.md specifies Fraunces (variable serif) as the display typeface, but the
codebase only loads Inter — every "serif" style silently falls back to Inter. This upgrade
completes the intended design: swap the display/serif tokens to Fraunces so hero, headlines,
manifesto, and the giant footer wordmark gain true editorial character.

## 2. Approach (token-level swap, no markup changes)

The codebase already uses semantic classes (`font-serif-editorial`, `font-display`) in **105
places** across ~20 files. By changing the font-family tokens and loading the font once, every
usage upgrades without touching JSX.

### 2.1 Font loading

- Add dependency `@fontsource-variable/fraunces` (self-hosted, matches existing
  `@fontsource-variable/inter` pattern — no CDN).
- Import it in `src/main.tsx` alongside the Inter import.

### 2.2 Token changes (`src/index.css`)

The codebase has two display-oriented families in play:

- `font-display` → `--font-display` — used by hero H1, manifesto, stat values, footer wordmark.
- `font-serif-editorial` → currently aliased to `--font-display` — used by section headings, cards, pull quotes.

To match the approved mockups (hero + manifesto + footer + headings all in serif):

- Add `--font-serif-editorial` as a real token: `"Fraunces Variable", "Fraunces", Georgia, serif`.
- Point `--font-display` at the same Fraunces stack so hero/manifesto/footer upgrade too.
- Keep `--font-ui` / `--font-sans-clean` / `--font-mono-tactile` on Inter so body copy,
  UI controls, buttons, and mono labels are untouched.

### 2.3 Fallback stack

`"Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif` — graceful degradation
if the font fails to load.

## 3. Visual placements affected (verified in mockups)

| Placement | Before (actual) | After |
|---|---|---|
| Navbar wordmark "ReclaimR" | Inter | Fraunces italic 600 |
| Hero H1 "ReclaimR" | Inter 600 | Fraunces 600, tighter tracking (-0.035em) |
| Hero italic subhead | Inter italic | Fraunces italic |
| Manifesto paragraph | Inter 500 | Fraunces 500, 26–34px |
| Section headings | Inter 600 | Fraunces 600 |
| Footer giant wordmark | Inter outline | Fraunces outline |
| Cards / stat values / quotes | Inter | Fraunces where `font-serif-editorial` is used |

## 4. What stays the same

- Inter for all body copy, UI controls, buttons, mono-tactile labels, nav links.
- The scramble-decode hero effect (runs on the H1 text — unaffected by font swap).
- Colors, spacing, borders, dark mode, all layouts.

## 5. Verification

1. `npm run lint` (tsc --noEmit) passes.
2. `npm run build` passes.
3. Browser check: hero, manifesto, section headers, navbar, footer render in Fraunces;
   body copy remains Inter; dark mode unaffected.
4. `document.fonts.check('16px "Fraunces Variable"')` returns true in the running app.

## 6. Out of scope

- Signature hero depth (₹ watermarks, layered canvas) — direction B, not selected.
- Any layout, color, or interaction changes.