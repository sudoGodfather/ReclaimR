<div align="center">

  <img src="public/og-image.jpg" alt="ReclaimR — Stop the Rot. Start the Growth." width="100%" />

  # ReclaimR

  ### *Stop the Rot. Start the Growth.*

  [![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
  [![GSAP](https://img.shields.io/badge/GSAP-3.12-green.svg?logo=greensock)](https://gsap.com/)
  [![Lenis](https://img.shields.io/badge/Lenis-1.1-black.svg)](https://lenis.darkroom.engineering/)
  [![i18next](https://img.shields.io/badge/i18next-23.0-047857.svg?logo=i18next)](https://react.i18next.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

  <p align="center">
    <strong>On-device financial intervention protocol detecting hidden UPI AutoPay mandates and automatically compounding reclaimed cash into Nifty 50 SIPs.</strong>
  </p>

  <p align="center">
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Freclaimr%2Freclaimr">
      <img src="https://vercel.com/button" alt="Deploy with Vercel" />
    </a>
  </p>

</div>

---

## 📖 Overview

**ReclaimR** is an editorial-grade personal finance application engineered to combat the silent erosion of household wealth caused by forgotten subscription trials, neglected SaaS tools, and recurring UPI AutoPay mandates. 

Operating strictly through **on-device machine learning telemetry**, ReclaimR parses bank e-mandates locally on your device with **zero cloud uploads**, allows 1-tap NPCI mandate revocation, and channels every reclaimed rupee directly into high-yielding Nifty 50 Index SIPs.

---

## ✨ Features

- **On-Device Mandate Audit**: Local SMS and e-mandate parsing with complete data privacy (0 cloud uploads).
- **1-Tap AutoPay Revocation**: Bypasses merchant retention dark patterns via direct NPCI PSP mandate termination.
- **Editorial Ledger Calculator**: Real-time financial simulator computing 10-year micro-SIP compounding (12% CAGR).
- **Smooth Lenis Scroll Engine**: Seamless 60 FPS inertia scrolling synchronized with GSAP ScrollTrigger.
- **Bilingual i18n Support**: Instant language toggle between English and Hindi (`EN | हिंदी`) with `localStorage` persistence.
- **Early Access Protocol**: Serverless waitlist integration backed by Supabase and Resend API welcome dispatches.
- **Accessibility & Gated Motion**: WCAG AA compliant contrast ratios, visible focus indicators, and full `prefers-reduced-motion` fallbacks.
- **Secret "rot" Glitch Easter Egg**: Tactile visual easter egg responding to user keyboard interaction.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS Custom Properties |
| **Animations** | [GSAP 3](https://gsap.com/) + [ScrollTrigger](https://gsap.com/scrolltrigger) + [Lenis Scroll](https://lenis.darkroom.engineering/) |
| **Internationalization** | [react-i18next](https://react.i18next.com/) (`en.json`, `hi.json`) |
| **Backend & APIs** | Vercel Serverless Functions (`/api/waitlist`, `/api/og`), [Supabase](https://supabase.com/), [Resend](https://resend.com/) |
| **Analytics** | [Umami Telemetry](https://umami.is/) (Privacy-first custom events) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/reclaimr/reclaimr.git
   cd reclaimr
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   RESEND_API_KEY=re_123456789
   ```

4. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Run Linting & Production Build**:
   ```bash
   npm run lint && npm run build
   ```

---

## 🗺️ Product Roadmap

- [x] **Q1 2026**: On-device e-mandate scanner, Leak Calculator, and Editorial landing experience.
- [x] **Q1 2026**: Serverless waitlist infrastructure, Resend dispatch, and Bilingual i18n support.
- [ ] **Q2 2026**: Account Aggregator (AA) live bank sync with HDFC, ICICI, SBI, and Axis Bank.
- [ ] **Q3 2026**: Automated zero-touch UPI AutoPay revocation protocol via NPCI PSP APIs.
- [ ] **Q4 2026**: Multi-asset micro-SIP compounding engine (Nifty 50, Gold ETF, & Debt Funds).

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with focus for monetary sovereignty in India · © 2026 ReclaimR Protocol</sub>
</div>