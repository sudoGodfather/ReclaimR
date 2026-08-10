import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, TrendingUp, ArrowRight, Terminal, Cpu, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemoData } = useApp();
  const { toast } = useToast();

  const screensList: { to: string; label: string; desc: string }[] = [
    { to: '/', label: '1. Landing Page', desc: 'Hero value prop, Rot Simulator, CTA buttons' },
    { to: '/onboarding', label: '2. Onboarding Flow', desc: '4-step setup: Identity, Scan, Agent, Goal' },
    { to: '/dashboard', label: '3. Main Dashboard', desc: 'Active Sub-Rot overview, Review buttons, Goals widget' },
    { to: '/subscriptions', label: '4. Subscriptions List', desc: 'Your Stash audit grid with clickable items' },
    { to: '/subscriptions/netflix-649', label: '5. Subscription Detail (Netflix)', desc: 'Netflix ₹649/m audit, decay score, Cancel CTAs' },
    { to: '/subscriptions/netflix-649/cancelled', label: '6. Execution Confirmation', desc: 'Post-cancellation receipt, View My Goals button' },
    { to: '/goals', label: '7. Goals Garden', desc: 'Micro-SIP goal cards, compounding simulator' },
    { to: '/alerts', label: '8. Alerts Timeline', desc: 'Smart warnings timeline with Cancel & Invest CTAs' },
    { to: '/reports', label: '9. Monthly Recovery Report', desc: 'Comprehensive financial recovery statement' },
    { to: '/how-it-works', label: '10. How It Works (Judges)', desc: 'Architectural overview & judge test harness' },
  ];

  const handleReset = () => {
    resetDemoData();
    toast('Demo data reset to factory state', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Header Banner */}
      <div className="bg-ink-dark text-brass border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-terra)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink-line pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase">
            <span className="bg-terra text-on-accent px-2 py-0.5 border border-on-dark">JUDGES & EXHIBITOR GUIDE</span>
            <span>PAISAPALAT v3.0 PROTOCOL</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="bg-brass text-ink-static font-mono font-black text-xs px-3 py-1.5 border border-ink hover:bg-surface cursor-pointer uppercase flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Demo Data State</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-on-dark">
          How PaisaPalat Works: Architecture & Judge Manual
        </h1>

        <p className="text-sm font-sans text-muted-on-dark max-w-3xl leading-relaxed">
          PaisaPalat solves the ₹4,500 Crore Indian subscription-decay crisis. Most Indians set up UPI AutoPay mandates for streaming or gyms, then forget them. PaisaPalat automates the entire lifecycle: <span className="text-brass font-bold">Detection → Decay Audit → 1-Tap Termination → Micro-SIP Diversion</span>.
        </p>
      </div>

      {/* 4 Pillars of Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-3">
          <div className="w-10 h-10 bg-terra text-on-accent border-2 border-ink font-mono font-black flex items-center justify-center text-lg">
            <Cpu className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="font-mono font-black text-xl uppercase text-ink">
            1. Autonomous SMS & Mandate Scraper
          </h3>
          <p className="text-xs text-muted-text leading-relaxed font-sans">
            Parses device SMS logs and UPI AutoPay bank mandate tokens locally. Identifies recurring merchant descriptors (e.g. "NETFLIX_MANDATE", "CULTFIT_RECURRING") without asking for sensitive banking passwords.
          </p>
        </div>

        <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-3">
          <div className="w-10 h-10 bg-brass text-ink-static border-2 border-ink font-mono font-black flex items-center justify-center text-lg">
            <Zap className="w-5 h-5 fill-ink-static" aria-hidden="true" />
          </div>
          <h3 className="font-mono font-black text-xl uppercase text-ink">
            2. Usage Decay Engine (Rot Metric)
          </h3>
          <p className="text-xs text-muted-text leading-relaxed font-sans">
            Computes a real-time decay score (0-100%). If a user hasn't checked in or watched content in 30+ days, decay spikes above 80%. Translates waste into watch-cost-per-unit (e.g., ₹649 per episode watched).
          </p>
        </div>

        <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-3">
          <div className="w-10 h-10 bg-jade text-ink-static border-2 border-ink font-mono font-black flex items-center justify-center text-lg">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="font-mono font-black text-xl uppercase text-ink">
            3. 1-Tap Cancellation Broker
          </h3>
          <p className="text-xs text-muted-text leading-relaxed font-sans">
            Sends an automated cancel signal directly to UPI AutoPay e-mandates or generates a 1-tap guided cancellation deep link before the bank debit date hits.
          </p>
        </div>

        <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-3">
          <div className="w-10 h-10 bg-blue text-on-accent border-2 border-ink font-mono font-black flex items-center justify-center text-lg">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="font-mono font-black text-xl uppercase text-ink">
            4. Micro-SIP Wealth Diversion Engine
          </h3>
          <p className="text-xs text-muted-text leading-relaxed font-sans">
            Crucial step: Rather than leaving saved cash in a checking account to get spent on impulse food delivery, PaisaPalat immediately provisions an equivalent micro-SIP in Nifty 50 Index Fund or Gold ETF.
          </p>
        </div>
      </div>

      {/* Interactive Judge Screen Test Harness */}
      <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[10px_10px_0px_0px_var(--color-shadow)] space-y-6">
        <div className="border-b-4 border-ink pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-terra" aria-hidden="true" />
            <h2 className="text-2xl font-mono font-black uppercase text-ink">
              Judge Test Harness: Jump To Any Prototype Screen
            </h2>
          </div>
          <p className="text-xs font-mono text-muted-text mt-1">
            Click any button below to immediately render and inspect that screen's interactions and layout:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono">
          {screensList.map((sc) => (
            <button
              key={sc.to}
              type="button"
              onClick={() => navigate(sc.to)}
              className="bg-bg border-3 border-ink p-3 hover:bg-brass-tint text-left transition-all cursor-pointer shadow-[3px_3px_0px_0px_var(--color-shadow)] flex flex-col justify-between space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            >
              <div>
                <div className="font-black text-xs text-ink uppercase">
                  {sc.label}
                </div>
                <p className="text-[10px] text-muted-text font-sans line-clamp-2 mt-1">
                  {sc.desc}
                </p>
              </div>
              <span className="text-[10px] font-black text-terra group-hover:text-ink uppercase">
                TEST SCREEN ↗
              </span>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t-2 border-ink flex flex-wrap justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            className="bg-terra text-on-accent font-mono font-black text-sm px-6 py-4 border-3 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-terra-deep cursor-pointer uppercase flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <span>Run Full Onboarding Simulation</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-jade text-ink-static font-mono font-black text-sm px-6 py-4 border-3 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-jade-deep cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            Go To Live Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};