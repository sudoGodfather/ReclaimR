# PaisaPalat — Stop the Rot, Start the Growth

An autonomous AI-agent demo that detects "zombie" subscriptions in your bank/SMS logs,
calculates usage decay scores, kills unused recurring debits, and automatically diverts
the savings into micro-SIPs for your wealth goals.

## Run Locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000. No API keys or environment variables are
required — this is a pure frontend React SPA with localStorage persistence.

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server on port 3000   |
| `npm run build`    | Production build to `dist/`              |
| `npm run preview`  | Preview the production build locally     |
| `npm run lint`     | Type-check the codebase (`tsc --noEmit`) |

## Routes

| Path                             | Screen                          |
| -------------------------------- | ------------------------------- |
| `/`                              | Landing page + rot simulator    |
| `/onboarding`                    | 4-step onboarding flow          |
| `/dashboard`                     | Main dashboard                  |
| `/subscriptions`                 | Subscription stash audit        |
| `/subscriptions/:id`             | Subscription detail + cancel    |
| `/subscriptions/:id/cancelled`   | Post-cancellation receipt       |
| `/goals`                         | Goals Garden (SIP diversion)    |
| `/alerts`                        | Rot alerts timeline             |
| `/reports`                       | Monthly recovery report         |
| `/how-it-works`                  | Architecture & judge harness    |

## Structure

- `src/context/AppContext.tsx` — single source of truth for subscriptions, goals,
  alerts, and recovered savings; persists to `localStorage`.
- `src/utils/finance.ts` — all SIP/compounding math (`sipFutureValue`) and INR/lakh
  formatting; no magic numbers live in screens.
- `src/screens/` — one component per route; screens read state via `useApp()`.
- `src/components/ui/` — design-system primitives: `BrutalistCard`, `BrutalistButton`,
  `EmptyState`, `ClickableCard`.

## Demo Reset

Use **How It Works → Reset Demo Data State** (or clear the `paisapalat-*` keys in
localStorage) to restore the factory demo data.