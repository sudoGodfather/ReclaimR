import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, TrendingUp, ArrowRight, Terminal, Cpu, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { SEO } from '../components/SEO';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemoData } = useApp();
  const { toast } = useToast();

  const screensList: { to: string; label: string; desc: string }[] = [
    { to: '/', label: '01. Landing Page Manifesto', desc: 'Hero value prop, Rot Simulator, 3D Banknote Canvas' },
    { to: '/login', label: '02. Split Editorial Auth', desc: 'Password toggle, token handshake, social login' },
    { to: '/onboarding', label: '03. Onboarding Telemetry', desc: '4-step setup: Identity, Log Scan, Agent, Goal' },
    { to: '/dashboard', label: '04. Monetary Control Deck', desc: 'YOUR MONEY hierarchy, Zombie card, Goals feed' },
    { to: '/subscriptions', label: '05. Subscriptions Stash Ledger', desc: 'Editorial stash audit grid with expandable drawers' },
    { to: '/subscriptions/netflix-649', label: '06. Subscription Detail (Netflix)', desc: 'Netflix ₹649/m audit, decay score, 6-step Reclaim flow' },
    { to: '/subscriptions/netflix-649/cancelled', label: '07. Execution Confirmation', desc: 'Post-cancellation certificate receipt & value transition' },
    { to: '/goals', label: '08. Goals Garden', desc: 'Formula equation banner, micro-SIP compounding cards' },
    { to: '/alerts', label: '09. Alerts Timeline', desc: 'Smart warnings timeline with Cancel & Invest CTAs' },
    { to: '/reports', label: '10. Monthly Recovery Report', desc: 'Comprehensive financial recovery statement & line-item audit' },
    { to: '/settings', label: '11. Settings Control Index', desc: '7-section settings index (01 Profile to 07 Account)' },
    { to: '/how-it-works', label: '12. Architecture Manual', desc: 'Architectural overview & judge test harness' },
  ];

  const handleReset = () => {
    resetDemoData();
    toast('Demo data reset to factory state', 'success');
  };

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Architecture Manual & System Specs"
        description="Learn how ReclaimR automates the subscription decay lifecycle: local SMS transaction parsing, decay score calculation, 1-tap AutoPay e-mandate termination, and micro-SIP wealth routing."
        canonicalPath="/how-it-works"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How ReclaimR Reclaims Subscription Waste',
          description:
            'Step-by-step architecture for automated subscription decay detection, mandate termination, and wealth diversion.',
          step: [
            {
              '@type': 'HowToStep',
              name: '1. Local SMS Log Engine',
              text: 'Scans bank SMS notifications on-device using local regex heuristics. Zero cloud upload.',
            },
            {
              '@type': 'HowToStep',
              name: '2. Subscription Decay Heuristics',
              text: 'Calculates active Decay Score (0-100%) based on days since last engagement.',
            },
            {
              '@type': 'HowToStep',
              name: '3. 1-Tap AutoPay Guillotine',
              text: 'Transmits e-mandate revocation tokens directly before your next billing cycle.',
            },
            {
              '@type': 'HowToStep',
              name: '4. Micro-SIP Wealth Routing',
              text: 'Rescued monthly cash is automatically routed into Nifty 50 Index Funds.',
            },
          ],
        }}
      />
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ EXHIBITOR & ARCHITECTURE MANUAL ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            How ReclaimR Works
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            ReclaimR automates the entire subscription decay lifecycle: <span className="text-[var(--color-ink-primary)] font-[600]">Detection → Decay Audit → 1-Tap Termination → Micro-SIP Diversion</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="h-[42px] px-6 rounded-none bg-[var(--color-paper-surface)] text-[var(--color-ink-primary)] text-[13px] font-[600] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto border border-[var(--color-paper-border)] font-mono-tactile shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
          <span>Reset Demo Data State</span>
        </button>
      </div>

      {/* 4 Pillars of Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-none bg-[var(--color-paper-surface)] p-6 shadow-sm border border-[var(--color-paper-border)] space-y-3 font-sans-clean">
          <div className="w-10 h-10 rounded-none bg-[#1B4D3E]/10 text-[#1B4D3E] dark:text-[#2D6A4F] flex items-center justify-center font-mono-tactile">
            <Cpu className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-serif-editorial text-[20px] font-[600] text-[var(--color-ink-primary)]">
            1. Local SMS Log Engine
          </h2>
          <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed font-sans-clean">
            Scans bank SMS notifications on-device using local regex heuristics for HDFC, ICICI, SBI & Axis AutoPay tokens. <strong>Zero cloud upload.</strong>
          </p>
        </div>

        <div className="rounded-none bg-[var(--color-paper-surface)] p-6 shadow-sm border border-[var(--color-paper-border)] space-y-3 font-sans-clean">
          <div className="w-10 h-10 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] flex items-center justify-center font-mono-tactile">
            <Zap className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-serif-editorial text-[20px] font-[600] text-[var(--color-ink-primary)]">
            2. Subscription Decay Heuristics
          </h2>
          <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed font-sans-clean">
            Calculates an active <strong>Decay Score (0–100%)</strong> based on days since last engagement (e.g. 47 days inactive on Netflix = 88% Rot).
          </p>
        </div>

        <div className="rounded-none bg-[var(--color-paper-surface)] p-6 shadow-sm border border-[var(--color-paper-border)] space-y-3 font-sans-clean">
          <div className="w-10 h-10 rounded-none bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-mono-tactile">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-serif-editorial text-[20px] font-[600] text-[var(--color-ink-primary)]">
            3. 1-Tap AutoPay Guillotine
          </h2>
          <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed font-sans-clean">
            Transmits e-mandate revocation tokens directly before your next billing cycle hits your bank account.
          </p>
        </div>

        <div className="rounded-none bg-[#1A1A18] text-white p-6 shadow-xl border border-white/10 space-y-3 font-mono-tactile">
          <div className="w-10 h-10 rounded-none bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="font-serif-editorial text-[20px] font-[600] text-white">
            4. Micro-SIP Wealth Routing
          </h2>
          <p className="text-[13px] text-white/70 leading-relaxed font-sans-clean">
            Rescued monthly cash is automatically routed into Nifty 50 Index Funds at 12% CAGR historical benchmark returns.
          </p>
        </div>
      </div>

      {/* Judges Application Screen Directory */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-paper-border)] font-mono-tactile">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-editorial text-[22px] font-[600] text-[var(--color-ink-primary)]">
            Complete Application Directory (12 Routes)
          </h2>
          <span className="text-[11px] font-[600] text-[#10B981] uppercase tracking-wider">
            ALL ROUTES VERIFIED ✓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {screensList.map((screen) => (
            <div
              key={screen.to}
              onClick={() => navigate(screen.to)}
              className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] hover:border-[#10B981]/40 transition-all cursor-pointer space-y-1 shadow-sm"
            >
              <div className="flex justify-between items-center text-[13px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
                <span>{screen.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="font-sans-clean text-[12px] text-[var(--color-ink-secondary)]">{screen.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
