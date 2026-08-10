import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENT_PERSONALITIES, INITIAL_GOALS } from '../data/mockData';
import { Zap, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClickableCard } from '../components/ui';
import { sipFutureValue, formatLakhs, formatINR } from '../utils/finance';

const AGENT_STORAGE_KEY = 'reclaimr-agent-id';
const GOAL_STORAGE_KEY = 'reclaimr-goal-id';

function loadPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function savePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* non-fatal */
  }
}

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptions } = useApp();
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('Aarav Sharma');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(() =>
    loadPref(AGENT_STORAGE_KEY, 'savage-auditor'),
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string>(() =>
    loadPref(GOAL_STORAGE_KEY, 'japan-trip'),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvancedRef = useRef<boolean>(false);

  const rottingSubs = subscriptions.filter((s) => s.status === 'rotting');
  const totalRotMonthly = rottingSubs.reduce((acc, s) => acc + s.cost, 0);
  const selectedGoal = INITIAL_GOALS.find((g) => g.id === selectedGoalId) || INITIAL_GOALS[0];

  useEffect(() => {
    savePref(AGENT_STORAGE_KEY, selectedAgentId);
  }, [selectedAgentId]);
  useEffect(() => {
    savePref(GOAL_STORAGE_KEY, selectedGoalId);
  }, [selectedGoalId]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startScanSimulation = () => {
    setIsScanning(true);
    setScanProgress(0);
    autoAdvancedRef.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsScanning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  /* Auto-advance once the scan completes — no manual click required.
     Guarded by a ref so navigating Back into step 2 doesn't re-fire. */
  useEffect(() => {
    if (step === 2 && scanProgress >= 100 && !isScanning && !autoAdvancedRef.current) {
      autoAdvancedRef.current = true;
      const t = setTimeout(() => setStep(3), 900);
      return () => clearTimeout(t);
    }
  }, [step, scanProgress, isScanning]);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      startScanSimulation();
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (isScanning) return; // Block leaving mid-scan: state would go stale
    setStep((s) => s - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Step Header Indicator */}
      <div className="bg-ink-dark text-on-dark p-4 border-4 border-ink shadow-[6px_6px_0px_0px_var(--color-brass)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-terra text-on-accent px-2 py-0.5 text-xs font-mono font-black uppercase">
              STEP {step} OF 4
            </span>
            <span className="text-brass text-xs font-mono font-bold">
              RECLAIMR WEALTH ONBOARDING
            </span>
          </div>
          <h1 className="text-2xl font-mono font-black uppercase tracking-tight text-on-dark mt-1">
            {step === 1 && '1. Verify Identity & Bank Permissions'}
            {step === 2 && '2. Autonomous Subscription Rot Scan'}
            {step === 3 && '3. Choose Your Autonomous Agent'}
            {step === 4 && '4. Set Your Primary Wealth Goal'}
          </h1>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 h-3 border-2 border-white font-mono text-[10px] flex items-center justify-center font-bold ${
                s === step
                  ? 'bg-brass text-ink-static'
                  : s < step
                  ? 'bg-jade text-ink-static'
                  : 'bg-ink-lift text-muted-on-dark'
              }`}
            >
              0{s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Identity & Permissions */}
      {step === 1 && (
        <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] space-y-6">
          <div className="border-l-4 border-terra pl-4 space-y-1">
            <h2 className="text-xl font-mono font-black uppercase text-ink">
              Connect Your Bank Mandates & SMS Scraper
            </h2>
            <p className="text-sm text-muted-text">
              ReclaimR reads SMS transactions locally on your device to parse recurring debit notifications (UPI AutoPay, E-mandates, NACH). Zero bank login credentials needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div>
              <label htmlFor="onboard-name" className="block text-xs font-black uppercase mb-1">Your Name</label>
              <input
                id="onboard-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-muted border-2 border-ink p-3 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
              />
            </div>
            <div>
              <label htmlFor="onboard-phone" className="block text-xs font-black uppercase mb-1">Mobile Number (UPI Linked)</label>
              <input
                id="onboard-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-muted border-2 border-ink p-3 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
              />
            </div>
          </div>

          <div className="bg-terra-tint border-2 border-ink p-4 space-y-3 font-mono">
            <div className="flex items-center gap-2 text-xs font-black text-terra uppercase">
              <Lock className="w-4 h-4" />
              <span>SECURITY & PRIVACY GUARANTEE</span>
            </div>
            <ul className="text-xs text-ink space-y-1 font-sans">
              <li>✔ Read-only SMS parsing for transaction keywords (e.g., "debited for Netflix", "Hotstar Mandate").</li>
              <li>✔ Bank account numbers and passcodes are NEVER requested or stored.</li>
              <li>✔ Fully compliant with RBI Digital Lending & AutoPay Mandate guidelines.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full bg-terra text-on-accent font-mono font-black text-lg py-4 border-2 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-terra-deep cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <span>Grant Read-Only Scan Access</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}

      {/* Step 2: Scanning Simulation */}
      {step === 2 && (
        <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] space-y-6">
          <div className="border-l-4 border-brass pl-4 space-y-1">
            <h2 className="text-xl font-mono font-black uppercase text-ink">
              Scanning UPI AutoPay & SMS Transaction Logs...
            </h2>
            <p className="text-sm text-muted-text">
              Parsing 1,240 SMS records across HDFC, ICICI, SBI, Cred, and Paytm.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs font-black uppercase">
              <label htmlFor="scan-progress">SCAN PROGRESS</label>
              <span className="text-terra">{scanProgress}% COMPLETE</span>
            </div>
            <div className="w-full bg-muted border-2 border-ink h-6 overflow-hidden relative">
              <div
                id="scan-progress"
                role="progressbar"
                aria-valuenow={scanProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="bg-brass h-full border-r-2 border-ink transition-all duration-300 flex items-center justify-center text-xs font-black text-ink-static"
                style={{ width: `${scanProgress}%` }}
              >
                {scanProgress > 20 && `${scanProgress}%`}
              </div>
            </div>
          </div>

          {/* Realtime Detection Log Feed */}
          <div className="bg-ink-dark text-jade font-mono text-xs p-4 border-2 border-ink h-48 overflow-y-auto space-y-2" aria-live="polite">
            <p className="text-on-dark">▶ [0.1s] Initializing SMS Scraper Module v2.4...</p>
            <p>▶ [0.3s] Found mandate: HDFC-NETFLIX-649-AUTOPAY (Last watch: 47 days ago)</p>
            {scanProgress >= 40 && (
              <p>▶ [0.6s] Found mandate: DISNEY-HOTSTAR-299-RECURRING (Decay score: 72%)</p>
            )}
            {scanProgress >= 60 && (
              <p className="text-terra">▶ [0.9s] CRITICAL ROT DETECTED: CULT.FIT ELITE ₹1,750/m (0 visits in 64 days)</p>
            )}
            {scanProgress >= 80 && (
              <p>▶ [1.2s] Found mandate: DUOLINGO-SUPER-299 (Streak broken 50 days ago)</p>
            )}
            {scanProgress >= 100 && (
              <p className="text-brass font-black">
                ✔ SCAN COMPLETE: {rottingSubs.length} ROTTING SUBSCRIPTIONS DETECTED (TOTAL BLEED: {formatINR(totalRotMonthly)}/MONTH)
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={isScanning}
              className="bg-surface text-ink font-mono font-bold px-4 py-3 border-2 border-ink shadow-[2px_2px_0px_0px_var(--color-shadow)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={scanProgress < 100}
              className={`flex-1 font-mono font-black text-lg py-4 border-2 border-ink uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                scanProgress >= 100
                  ? 'bg-brass text-ink-static shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-brass-deep cursor-pointer'
                  : 'bg-muted text-muted-text cursor-not-allowed'
              }`}
            >
              <span>{scanProgress >= 100 ? 'Proceed to Agent Selection' : `Scanning... (${scanProgress}%)`}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Agent Personality */}
      {step === 3 && (
        <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] space-y-6">
          <div className="border-l-4 border-blue pl-4 space-y-1">
            <h2 className="text-xl font-mono font-black uppercase text-ink">
              Select Your Autonomous Agent Personality
            </h2>
            <p className="text-sm text-muted-text">
              This AI agent dictates how aggressive ReclaimR is when cancelling unused subscriptions and prompting micro-diversions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENT_PERSONALITIES.map((agent) => {
              const isSelected = selectedAgentId === agent.id;
              return (
                <ClickableCard
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select agent: ${agent.name} (${agent.aggression})`}
                  className={`border-4 border-ink p-5 transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-brass shadow-[6px_6px_0px_0px_var(--color-shadow)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-surface hover:bg-muted shadow-[3px_3px_0px_0px_var(--color-shadow)]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{agent.avatar}</span>
                      <span
                        className="text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-ink text-on-dark"
                        style={{ backgroundColor: agent.accentColor }}
                      >
                        {agent.aggression}
                      </span>
                    </div>

                    <h3 className="font-mono font-black text-lg uppercase text-ink">
                      {agent.name}
                    </h3>
                    <p className="text-xs font-bold text-muted-text font-mono">
                      "{agent.tagline}"
                    </p>
                    <p className="text-xs text-muted-text leading-relaxed font-sans">
                      {agent.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t-2 border-ink flex items-center justify-between font-mono text-xs font-black">
                    <span>{isSelected ? '✓ SELECTED' : 'SELECT AGENT'}</span>
                    <span>→</span>
                  </div>
                </ClickableCard>
              );
            })}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="bg-surface text-ink font-mono font-bold px-4 py-3 border-2 border-ink shadow-[2px_2px_0px_0px_var(--color-shadow)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-blue text-on-accent font-mono font-black text-lg py-4 border-2 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-blue-deep cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <span>Confirm Agent & Set Wealth Goal</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Set Micro-Investment Goal */}
      {step === 4 && (
        <div className="bg-surface border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] space-y-6">
          <div className="border-l-4 border-jade pl-4 space-y-1">
            <h2 className="text-xl font-mono font-black uppercase text-ink">
              Choose Where Your Sub-Rot Savings Get Diverted
            </h2>
            <p className="text-sm text-muted-text">
              When ReclaimR cancels an unused debit, it automatically sets up an equivalent SIP into this goal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_GOALS.map((goal) => {
              const isSelected = selectedGoalId === goal.id;
              return (
                <ClickableCard
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select goal: ${goal.title}`}
                  className={`border-4 border-ink p-5 transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-jade text-ink-static shadow-[6px_6px_0px_0px_var(--color-shadow)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-surface hover:bg-muted shadow-[3px_3px_0px_0px_var(--color-shadow)]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black bg-ink-dark text-on-dark px-2 py-0.5 uppercase">
                        {goal.category}
                      </span>
                      <span className="text-xs font-mono font-bold">Target: {formatINR(goal.targetAmount)}</span>
                    </div>

                    <h3 className="font-mono font-black text-lg uppercase leading-tight">
                      {goal.title}
                    </h3>
                    <p className="text-xs font-mono font-bold">
                      Target Date: {goal.deadline}
                    </p>
                  </div>

                  <div className="bg-on-accent/80 border-2 border-ink p-3 font-mono text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>CURRENT SIP:</span>
                      <span>{formatINR(goal.monthlyContribution)}/m</span>
                    </div>
                    <div className="flex justify-between font-bold text-terra">
                      <span>DIVERTED FROM ROT:</span>
                      <span>+{formatINR(totalRotMonthly)}/m</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-ink flex items-center justify-between font-mono text-xs font-black">
                    <span>{isSelected ? '✓ PRIMARY GOAL' : 'SELECT GOAL'}</span>
                    <span>→</span>
                  </div>
                </ClickableCard>
              );
            })}
          </div>

          <div className="bg-brass border-4 border-ink p-4 text-ink-static font-mono space-y-2">
            <div className="font-black text-sm uppercase flex items-center gap-2">
              <Zap className="w-5 h-5 fill-ink-static" />
              <span>READY TO LAUNCH YOUR ROT REPORT & DASHBOARD</span>
            </div>
            <p className="text-xs font-sans text-ink-static/85 leading-snug">
              {rottingSubs.length} rotting subscriptions found ({formatINR(totalRotMonthly)}/m total bleed). Selected goal: <span className="font-bold underline">{selectedGoal.title}</span>. Diverting {formatINR(totalRotMonthly)}/m adds {formatLakhs(sipFutureValue(totalRotMonthly, 5))} over 5 years.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-surface text-ink font-mono font-bold px-4 py-3 border-2 border-ink shadow-[2px_2px_0px_0px_var(--color-shadow)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-terra text-on-accent font-mono font-black text-lg py-4 border-2 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-terra-deep cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <span>Launch My Dashboard</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};