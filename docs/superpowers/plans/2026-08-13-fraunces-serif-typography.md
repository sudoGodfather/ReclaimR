# Fraunces Serif Typography Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete ReclaimR's intended editorial design by loading the Fraunces variable serif and pointing the `--font-display` / `--font-serif-editorial` tokens at it, upgrading all 105 serif-style usages with zero JSX changes.

**Architecture:** A token-level font swap. The codebase already applies semantic classes (`font-display`, `font-serif-editorial`) across ~20 files; both tokens currently resolve to Inter. We add the self-hosted `@fontsource-variable/fraunces` package, import it in `main.tsx`, and redefine the two tokens in `index.css`. Body copy (`--font-ui`), mono labels (`--font-mono-tactile`), and UI buttons stay on Inter.

**Tech Stack:** React 19, Vite 6, Tailwind CSS v4, TypeScript 5.8, `@fontsource-variable/inter` (existing pattern to mirror).

**Spec:** `docs/superpowers/specs/2026-08-13-fraunces-serif-typography-design.md`

---

### Task 1: Install the Fraunces font dependency

**Files:**
- Modify: `package.json` (dependency list)

- [ ] **Step 1: Install the package**

Run from `/Users/vedpatelicloud.com/Downloads/reclaimr`:

```bash
npm install @fontsource-variable/fraunces
```

Expected: package added to `dependencies` in `package.json` (version `^5.x.x`) and `package-lock.json` updated.

- [ ] **Step 2: Verify it resolved**

Run: `ls node_modules/@fontsource-variable/fraunces/index.css`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @fontsource-variable/fraunces dependency"
```

---

### Task 2: Import Fraunces in the app entry

**Files:**
- Modify: `src/main.tsx` (add import alongside the Inter import)

- [ ] **Step 1: Add the import**

In `src/main.tsx`, change:

```tsx
import '@fontsource-variable/inter';
```

to:

```tsx
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
```

- [ ] **Step 2: Verify Vite dev server compiles**

Run: `npm run dev` (or check the running server at http://localhost:3001 — it hot-reloads).
Expected: no HMR error overlay; the Fraunces stylesheet is requested in Network tab (`@fontsource-variable/fraunces`).

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: load Fraunces variable serif at app entry"
```

---

### Task 3: Point display tokens at Fraunces

**Files:**
- Modify: `src/index.css` (two token definitions)

- [ ] **Step 1: Add Fraunces to the `@theme` block**

In `src/index.css`, inside the first `@theme { ... }` block (the one defining `--font-display`, `--font-ui`, `--font-mono`), add a new `--font-serif` theme variable:

```css
@theme {
  --color-ink: #0C0E0B;
  --color-bone: #F2EFE6;
  --color-moss: #2E5B3F;
  --color-rust: #C24A2E;
  --color-rust-light: #E06A45;
  --font-display: "Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-ui: "Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace;
  --font-serif: "Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif;
}
```

- [ ] **Step 2: Redefine `--font-display` and `--font-serif-editorial` in `@layer base`**

In `src/index.css`, inside `@layer base { :root { ... } }`, change:

```css
    --font-serif-editorial: var(--font-display);
```

to:

```css
    --font-serif-editorial: var(--font-serif);
    --font-display: var(--font-serif);
```

This makes both `font-display` and `font-serif-editorial` resolve to Fraunces everywhere, while `--font-ui`/`--font-mono` remain Inter.

- [ ] **Step 3: Verify tokens in the running app**

Open http://localhost:3001 in the browser and run in DevTools console:

```js
document.fonts.check('16px "Fraunces Variable"')
```

Expected: `true`.

Also verify visually: hero "ReclaimR" H1, manifesto paragraph, section headings ("The Method", "Architecture & Security"), footer giant wordmark render with serif glyphs; nav links, buttons, and mono labels stay sans.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: `tsc --noEmit` passes with no errors.

- [ ] **Step 5: Run production build**

Run: `npm run build`
Expected: build completes; Fraunces appears in the emitted assets (e.g., `dist/assets/fraunces-*.woff2`).

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat: swap display typography tokens to Fraunces serif"
```

---

### Task 4: Final verification pass

**Files:**
- None (verification only)

- [ ] **Step 1: Full regression sweep across routes**

Browse these routes in the browser and confirm no console errors and serif renders where expected:

- `/` — hero, manifesto, section headings, footer wordmark
- `/dashboard`, `/subscriptions`, `/goals`, `/alerts`, `/reports`, `/settings`, `/states`, `/how-it-works`, `/notes/why-we-built-reclaimr`

Expected: 0 console errors; headings in Fraunces; body copy in Inter; dark mode toggle still works (serif renders on black canvas too).

- [ ] **Step 2: Confirm reduced-motion & scramble H1**

Reload `/` and confirm the scramble-decode H1 animation still resolves to "ReclaimR" (font swap must not break the effect).

Expected: animation completes, final glyphs in Fraunces.

---

## Self-Review Notes

- **Spec coverage:** §2.1 font loading → Task 1 + 2; §2.2 token changes → Task 3; §2.3 fallback stack → Task 3 Step 1; §5 verification → Tasks 3–4. All spec items covered.
- **Placeholders:** none — every step has exact commands/code.
- **Type consistency:** token names match the spec (`--font-display`, `--font-serif-editorial`, `--font-serif`); `font-serif` is a standard Tailwind v4 theme key (maps to `font-serif` utility) so no conflicts with existing utilities.
