# ReclaimR Redesign Plan & Codebase Inventory (TODO.md)

## 1. Executive Summary & Application Inventory

The ReclaimR application is a React 19 + Vite + Tailwind CSS v4 zombie-subscription detection and wealth diversion platform. The codebase consists of an extensive screen suite, data provider context, financial modeling engines, and interactive charts.

### 1.1 Codebase Structure
```
/
├── index.html                  # HTML entry point, Google Fonts preconnect, theme script
├── package.json                # React 19, Vite 6, Tailwind CSS v4, GSAP 3.15, React Router v7
├── vite.config.ts              # Vite configuration with Tailwind CSS plugin
├── tsconfig.json               # Strict TypeScript configuration
├── DESIGN.md                   # Complete Editorial Design System specification
├── TODO.md                     # Codebase inventory and implementation tracking (this file)
└── src/
    ├── main.tsx                # React root renderer
    ├── App.tsx                 # Router configuration & lazy loaded screen imports
    ├── index.css               # Tailwind directives, font declarations, global rules
    ├── types.ts                # TypeScript interfaces for subscriptions, mandates, SIP goals
    ├── useTheme.ts             # Theme state management hook
    ├── context/
    │   └── AppContext.tsx      # AppState context (subscriptions, cancel flow, SIP goals)
    ├── data/
    │   └── mockData.ts         # Mock subscriptions, mandates, alerts, recovery stats
    ├── mock/
    │   └── leakData.ts         # Zombie subscription leakage datasets
    ├── utils/
    │   └── finance.ts          # Compound interest, SIP returns, e-mandate savings math
    ├── theme/
    │   ├── tokens.css          # CSS Custom Properties (Colors, Typography, Spacing, Shadows)
    │   └── tokens.ts           # TypeScript token registry export
    ├── motion/
    │   ├── ScrollPrimitives.tsx# Scroll-triggered reveal containers
    │   └── useScrollAnimation.ts # Custom scroll animation hooks
    ├── components/
    │   ├── Navbar.tsx          # Sticky navigation bar with monetary status
    │   ├── Footer.tsx          # Editorial footer with system metrics & disclaimers
    │   ├── CustomCursor.tsx    # Smooth lerp custom editorial cursor
    │   ├── EditorialGridOverlay.tsx # 1px hairline ledger grid overlay
    │   ├── FloatingBanknoteCanvas.tsx # Falling currency banknote interactive canvas
    │   ├── TheLeakSection.tsx  # Subscription leak breakdown component
    │   ├── WealthDiversionFlowSection.tsx # SIP diversion process visualization
    │   ├── ZombieSubscriptionCard.tsx # Subscription card with revocation action
    │   ├── Toast.tsx           # Accessible notification provider
    │   ├── SubIcon.tsx         # Brand icon renderer
    │   ├── charts/
    │   │   ├── EditorialSipProjectionChart.tsx    # SIP compounding growth projection
    │   │   ├── EditorialSpendingBreakdownChart.tsx# Zombie subscription spend analysis
    │   │   └── EditorialTrajectoryChart.tsx       # Reclaimed wealth trajectory over time
    │   └── ui/
    │       ├── EditorialState.tsx # Loading, Empty, and Error state components
    │       ├── FormPrimitives.tsx # Button, Input, Toggle, Switch primitives
    │       └── index.tsx          # UI primitive exports
    └── screens/
        ├── LandingPage.tsx     # Primary editorial scroll-driven landing page
        ├── OnboardingFlow.tsx  # Bank account link & e-mandate scan wizard
        ├── Dashboard.tsx       # Monetary control deck & active subscription monitor
        ├── SubscriptionsList.tsx# Full subscription catalog & filters
        ├── SubscriptionDetail.tsx# Deep dive into subscription billing history
        ├── ExecutionConfirmation.tsx# Revocation & SIP diversion confirmation screen
        ├── GoalsGarden.tsx     # Wealth diversion SIP goals allocation
        ├── AlertsTimeline.tsx  # Price hike & renewal alert timeline
        ├── MonthlyRecoveryReport.tsx # Monthly reclaimed savings audit report
        ├── HowItWorks.tsx      # Technical methodology & bank mandate explanation
        ├── LoginPage.tsx       # Authentication & security access screen
        ├── SettingsPage.tsx    # User preferences & security keys
        └── StateAuditStudio.tsx# UI testing & component audit studio
```

---

## 2. Redesign Task Roadmap

- [x] **P01 Audit Codebase & Create Documentation**
  - [x] Audit all components, screens, hooks, and context.
  - [x] Write `TODO.md` documenting full structure and task checklist.
  - [x] Write `DESIGN.md` defining color tokens (ink `#0C0E0B`, bone `#F2EFE6`, moss `#2E5B3F`, rust `#C24A2E`), type scale, 8pt spacing, hairline borders `rgba(#F2EFE6, 0.14)`, noise overlay spec, and motion principles (expo easing, 0.8–1.2s).

- [ ] **P02 Design Tokens & Base Styles Setup**
  - [ ] Update Google Fonts in `index.html` to import `Fraunces`, `Space Grotesk`, and `JetBrains Mono`.
  - [ ] Refactor `src/theme/tokens.css` to implement the ink/bone/moss/rust color palette and CSS custom properties.
  - [ ] Refactor `src/theme/tokens.ts` to reflect the updated token system.
  - [ ] Add SVG Noise Overlay component and CSS noise texture definitions in `src/index.css`.

- [ ] **P03 Core Motion Infrastructure (`src/lib/`)**
  - [ ] Create `src/lib/useReducedMotion.ts` for accessibility gating.
  - [ ] Create `src/lib/useLenis.ts` for Lenis smooth scrolling integration.
  - [ ] Create `src/lib/useGSAP.ts` or GSAP ScrollTrigger utility helpers with exponential easing (`cubic-bezier(0.16, 1, 0.3, 1)` / `expo.out`, 0.8s–1.2s duration).

- [ ] **P04 Component Refactoring & Redesign (`src/components/`)**
  - [ ] Build `LedgerRainCanvas.tsx` (background of dissolving zombie charges into moss SIP vectors).
  - [ ] Build `WordHighlightText.tsx` (word-by-word scroll-driven opacity illumination).
  - [ ] Build `StickyTwoColumn.tsx` (pinned chapter header on left, scrolling editorial content on right).
  - [ ] Build `StackedPinnedCards.tsx` (pinned card deck scrubbing through zombie subscriptions).
  - [ ] Build `AnimatedCounter.tsx` (exponential counter ticker for reclaimed savings).
  - [ ] Redesign `Navbar.tsx` and `Footer.tsx` with dark ink aesthetics and hairline borders.

- [ ] **P05 Landing Page Assembly (`src/screens/LandingPage.tsx`)**
  - [ ] Re-architect `LandingPage.tsx` using the editorial scroll sections while keeping all interactive flows connected.

- [ ] **P06 Verification & Polish**
  - [ ] Verify `npm run lint` / TypeScript strict mode cleanly passes.
  - [ ] Verify `prefers-reduced-motion` cleanly disables all motion effects.
  - [ ] Verify all application screens and interactive features function flawlessly.
