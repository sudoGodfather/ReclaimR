import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal, Flame, Zap, UserCheck } from 'lucide-react';
import { EditorialInput, EditorialSelect } from '../components/ui/FormPrimitives';
import { ScrollReveal } from '../motion/ScrollPrimitives';
import { SEO } from '../components/SEO';

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();

  // 4-Step Wizard State
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('Aarav Sharma');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [bank, setBank] = useState<string>('HDFC Bank');
  const [selectedAgent, setSelectedAgent] = useState<string>('savage');
  const [selectedGoal, setSelectedGoal] = useState<string>('Japan Trip 2026');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    // Start automated SMS scan simulation
    setIsScanning(true);
    let p = 0;
    const timer = setInterval(() => {
      p += 15;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setIsScanning(false);
      }
    }, 400);
  };

  const handleFinishOnboarding = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-[760px] mx-auto px-6 py-12 font-sans-clean text-[var(--color-ink-primary)] space-y-8">
      <SEO
        title="Start 2-Min Audit — Wealth Protection Onboarding"
        description="4-step telemetry setup: connect local SMS parsing, scan active debit mandates, configure your autonomous agent persona, and allocate reclaimed subscription cash."
        canonicalPath="/onboarding"
      />
      {/* Wizard Header Stepper */}
      <div className="flex items-center justify-between font-mono-tactile border-b border-[var(--color-paper-border)] pb-6">
        <div>
          <span className="eyebrow text-[#1B4D3E] dark:text-[#2D6A4F] block">ONBOARDING & TELEMETRY SETUP</span>
          <h1 className="font-serif-editorial text-[28px] font-[600] tracking-tight mt-0.5">
            Step 0{step} of 04 — {step === 1 && 'Identity & Bank Mandates'}
            {step === 2 && 'Autonomous SMS Log Scan'}
            {step === 3 && 'Agent Persona Selection'}
            {step === 4 && 'First Wealth Goal Allocation'}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-[600] bg-[var(--color-paper-card)] px-3 py-1 rounded-none border border-[var(--color-paper-border)]">
          <span className="text-[#10B981]">STEP {step} / 4</span>
        </div>
      </div>

      {/* STEP 1: IDENTITY & LOGIN / SIGNUP FORM */}
      {step === 1 && (
        <ScrollReveal direction="up" className="p-6 md:p-8 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif-editorial text-[22px] font-[600]">Provide your telemetry details</h2>
            <p className="text-[13px] text-[var(--color-ink-secondary)]">
              Used solely on-device to match UPI AutoPay SMS debit notifications. Zero cloud data storage.
            </p>
          </div>

          <form onSubmit={handleNextStep1} className="space-y-5">
            <EditorialInput
              label="Full Name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              helperText="Will appear on your monthly wealth audit statements"
              required
            />

            <EditorialInput
              label="Mobile Number (SMS Scan)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="Requires local SMS log permission on Android/iOS"
              required
            />

            <EditorialSelect
              label="Primary Salary Bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              options={[
                { value: 'HDFC Bank', label: 'HDFC Bank Direct AutoPay' },
                { value: 'ICICI Bank', label: 'ICICI Bank iMobile E-Mandate' },
                { value: 'SBI', label: 'State Bank of India YONO' },
                { value: 'Axis Bank', label: 'Axis Bank AutoPay Gateway' },
              ]}
              helperText="Configures bank-specific e-mandate revocation protocol"
            />

            <div className="pt-2">
              <button
                type="submit"
                data-cursor-label="CONTINUE"
                className="w-full h-[52px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[15px] hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Authorize & Scan Mandates</span>
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
              </button>
            </div>
          </form>
        </ScrollReveal>
      )}

      {/* STEP 2: AUTONOMOUS SMS SCAN LOG */}
      {step === 2 && (
        <ScrollReveal direction="up" className="p-6 md:p-8 rounded-none bg-[#1A1A18] text-white space-y-6 shadow-2xl border border-white/10 font-mono-tactile">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Terminal className="w-5 h-5 text-[#10B981]" />
            <h2 className="font-serif-editorial text-[20px] font-[600]">Parsing Device SMS & E-Mandate Logs</h2>
          </div>

          <div className="space-y-3 text-[13px] text-white/80 font-mono-tactile">
            <div className="flex items-center gap-2 text-[#10B981]">
              <span>[0.0s]</span> <span>Initialized local device log parser v4.2</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <span>[0.4s]</span> <span>Scanned 284 SMS notifications from HDFC AutoPay</span>
            </div>
            <div className="flex items-center gap-2 text-[#C93B2B]">
              <span>[0.8s]</span> <span>Detected rot mandate: Netflix Premium (₹649/mo) — 47d unused</span>
            </div>
            <div className="flex items-center gap-2 text-[#C93B2B]">
              <span>[1.2s]</span> <span>Detected rot mandate: Cult.fit Elite (₹1,750/mo) — 64d unused</span>
            </div>
            <div className="flex items-center gap-2 text-[#C93B2B]">
              <span>[1.6s]</span> <span>Detected rot mandate: Disney+ Hotstar VIP (₹299/mo) — 32d unused</span>
            </div>
            <div className="flex items-center gap-2 text-[#C93B2B]">
              <span>[2.0s]</span> <span>Detected rot mandate: Duolingo Super (₹299/mo) — 51d unused</span>
            </div>
            <div className="flex items-center gap-2 text-[#C93B2B]">
              <span>[2.4s]</span> <span>Detected rot mandate: Times Prime (₹100/mo) — 120d unused</span>
            </div>
            <div className="flex items-center gap-2 text-[#10B981]">
              <span>[2.8s]</span> <span>Total monthly leak identified: ₹3,097/month</span>
            </div>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-none overflow-hidden">
            <div className="bg-[#10B981] h-full rounded-none transition-all duration-300" style={{ width: `${scanProgress}%` }} />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={isScanning}
              className="w-full h-[50px] rounded-none bg-white text-[#1A1A18] font-[600] text-[15px] hover:bg-white/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Proceed to Agent Selection →</span>
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* STEP 3: AGENT PERSONA SELECTION */}
      {step === 3 && (
        <ScrollReveal direction="up" className="p-6 md:p-8 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif-editorial text-[22px] font-[600]">Select your Autonomous Reclaim Agent</h2>
            <p className="text-[13px] text-[var(--color-ink-secondary)]">
              Your AI agent continuously audits usage patterns and presents 1-tap cancellation advice.
            </p>
          </div>

          <div className="space-y-4 font-mono-tactile">
            {[
              { id: 'savage', title: 'Savage Auditor AI', desc: 'Roasts wasteful subscriptions & forces action before renewal dates hit.', icon: Flame, color: '#C93B2B' },
              { id: 'gentle', title: 'Gentle Nudge AI', desc: 'Politely suggests cancellation options after 45 consecutive unused days.', icon: UserCheck, color: '#6E8B74' },
              { id: 'tactical', title: 'Tactical Wealth Engine', desc: 'Maximizes Nifty 50 compound yield projections with mathematical rigor.', icon: Zap, color: '#1B4D3E' },
            ].map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-5 rounded-none border cursor-pointer transition-all flex items-start gap-4 ${
                  selectedAgent === agent.id
                    ? 'border-[#1B4D3E] bg-[#1B4D3E]/10 dark:border-[#2D6A4F]'
                    : 'border-[var(--color-paper-border)] bg-[var(--color-paper-surface)] hover:border-black/30'
                }`}
              >
                <div className="w-10 h-10 rounded-none grid place-items-center bg-white dark:bg-[#1A1A18] shadow-sm shrink-0">
                  <agent.icon className="w-5 h-5 text-[#1B4D3E] dark:text-[#2D6A4F]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-[600] text-[16px] text-[var(--color-ink-primary)]">{agent.title}</h3>
                    {selectedAgent === agent.id && <span className="text-[#10B981] font-[600] text-[11px]">ACTIVE</span>}
                  </div>
                  <p className="font-sans-clean text-[13px] text-[var(--color-ink-secondary)]">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full h-[52px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[15px] hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Next: Allocate First Wealth Goal →</span>
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* STEP 4: FIRST WEALTH GOAL */}
      {step === 4 && (
        <ScrollReveal direction="up" className="p-6 md:p-8 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif-editorial text-[22px] font-[600]">Select your primary wealth goal</h2>
            <p className="text-[13px] text-[var(--color-ink-secondary)]">
              All money rescued from cancelled subscriptions will automatically flow into this goal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tactile">
            {[
              { id: 'Japan Trip 2026', target: '₹1,50,000', icon: '✈️' },
              { id: 'Emergency Cushion', target: '₹2,00,000', icon: '🛡️' },
              { id: 'Electric Scooter', target: '₹1,20,000', icon: '⚡' },
            ].map((g) => (
              <div
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`p-5 rounded-none border cursor-pointer transition-all space-y-2 text-center ${
                  selectedGoal === g.id
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : 'border-[var(--color-paper-border)] bg-[var(--color-paper-surface)]'
                }`}
              >
                <div className="text-3xl">{g.icon}</div>
                <h3 className="font-[600] text-[14px]">{g.id}</h3>
                <span className="text-[11px] text-[var(--color-ink-tertiary)] block">Target: {g.target}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleFinishOnboarding}
              data-cursor-label="ENTER"
              className="w-full h-[54px] rounded-none bg-[#1B4D3E] text-white dark:bg-[#2D6A4F] font-[600] text-[16px] hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
            >
              <Sparkles className="w-5 h-5 text-[#10B981]" />
              <span>Enter ReclaimR Cockpit →</span>
            </button>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};
