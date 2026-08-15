import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sliders,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { EditorialState, StateType } from '../components/ui/EditorialState';
import { ScrollReveal } from '../motion/ScrollPrimitives';

interface StateOption {
  id: StateType;
  label: string;
  category: 'System Async' | 'Ledger & Data' | 'Execution';
  description: string;
}

export const StateAuditStudio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateType>('loading');
  const [lastActionTriggered, setLastActionTriggered] = useState<string | null>(null);

  const stateOptions: StateOption[] = [
    {
      id: 'loading',
      label: '01. Loading Telemetry',
      category: 'System Async',
      description: 'Async data fetch loader with live status ticker & tactile step pulse.',
    },
    {
      id: 'empty',
      label: '02. Empty Search Query',
      category: 'Ledger & Data',
      description: 'Filter or search query scope with zero matching ledger entries.',
    },
    {
      id: 'error',
      label: '03. Telemetry Error',
      category: 'System Async',
      description: 'Runtime telemetry exception fault with diagnostic code & retry CTA.',
    },
    {
      id: 'disconnected',
      label: '04. Bank Disconnected',
      category: 'System Async',
      description: 'Account aggregator open-banking token expired or link severed.',
    },
    {
      id: 'unauthorized',
      label: '05. Session Unauthorized',
      category: 'System Async',
      description: 'Security protocol engaged due to expired security token.',
    },
    {
      id: 'unavailable',
      label: '06. Service Unavailable',
      category: 'System Async',
      description: 'Interbank UPI AutoPay revocation gateway undergoing scheduled maintenance.',
    },
    {
      id: 'no-subscriptions',
      label: '07. No Subscriptions',
      category: 'Ledger & Data',
      description: 'Account ledger uninitialized with 0 active mandates linked.',
    },
    {
      id: 'no-zombie-subscriptions',
      label: '08. No Zombie Subscriptions',
      category: 'Ledger & Data',
      description: 'Clean financial ledger celebration with 0 rotting subscriptions detected.',
    },
    {
      id: 'no-goals',
      label: '09. No Wealth Goals',
      category: 'Ledger & Data',
      description: 'Goals garden empty with zero wealth diversion destinations created.',
    },
    {
      id: 'no-savings',
      label: '10. No Savings Yet',
      category: 'Ledger & Data',
      description: 'Reclaim sequence unstarted with zero dollars rescued so far.',
    },
    {
      id: 'successful-cancellation',
      label: '11. Successful Cancellation',
      category: 'Execution',
      description: 'Mandate revocation certificate receipt with compounding micro-SIP.',
    },
    {
      id: 'failed-cancellation',
      label: '12. Failed Cancellation',
      category: 'Execution',
      description: 'Merchant dark-pattern blockage with bypass assistant CTA.',
    },
  ];

  const handlePrimaryAction = () => {
    setLastActionTriggered(`Primary Action triggered for [${selectedState}] state`);
    if (selectedState === 'no-subscriptions' || selectedState === 'no-savings') {
      navigate('/subscriptions');
    } else if (selectedState === 'no-goals' || selectedState === 'successful-cancellation') {
      navigate('/goals');
    } else if (selectedState === 'disconnected' || selectedState === 'unauthorized') {
      navigate('/login');
    }
  };

  const handleSecondaryAction = () => {
    setLastActionTriggered(`Secondary Action triggered for [${selectedState}] state`);
  };

  const currentStateInfo = stateOptions.find((s) => s.id === selectedState);

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8 font-mono-tactile">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ DESIGN SYSTEM AUDIT STUDIO • ALL 12 UI STATES ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Async & Conditional UI States Audit
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1 font-sans-clean">
            Interactive test harness inspecting all 12 editorial UI states. Every state strictly presents <strong className="text-[var(--color-ink-primary)] font-[600]">WHAT HAPPENED</strong>, <strong className="text-[var(--color-ink-primary)] font-[600]">WHAT IT MEANS</strong>, and <strong className="text-[var(--color-ink-primary)] font-[600]">WHAT TO DO NEXT</strong>.
          </p>
        </div>

        <div className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] text-[11px] space-y-1 shrink-0">
          <div className="flex items-center gap-2 text-[#10B981] font-[600]">
            <Sparkles className="w-4 h-4" />
            <span>12 / 12 STATES AUDITED & READY</span>
          </div>
          <p className="text-[var(--color-ink-tertiary)]">Money in Check Editorial Aesthetics</p>
        </div>
      </div>

      {/* 12-State Interactive Selector Matrix */}
      <div className="space-y-3 font-mono-tactile">
        <div className="flex justify-between items-center text-[11px] font-[600] uppercase tracking-wider text-[var(--color-ink-secondary)]">
          <span>SELECT UI STATE PRESET TO AUDIT:</span>
          <span>CURRENT: {selectedState.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {stateOptions.map((opt) => {
            const isSelected = selectedState === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedState(opt.id);
                  setLastActionTriggered(null);
                }}
                className={`p-3 rounded-none text-left transition-all cursor-pointer border flex flex-col justify-between h-[76px] ${
                  isSelected
                    ? 'bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] border-transparent shadow-lg scale-[1.02]'
                    : 'bg-[var(--color-paper-surface)] border-[var(--color-paper-border)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-paper-hover)] hover:text-[var(--color-ink-primary)]'
                }`}
              >
                <span className="text-[10px] font-[600] tracking-wider uppercase opacity-70">
                  {opt.category}
                </span>
                <span className="font-[600] text-[12px] leading-tight line-clamp-2">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Live State Display Card Stage */}
      <ScrollReveal direction="none" className="space-y-6">
        <div className="flex items-center justify-between font-mono-tactile text-[12px]">
          <span className="text-[var(--color-ink-tertiary)] uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1B4D3E] dark:text-[#2D6A4F]" />
            <span>LIVE EDITORIAL STATE RENDER:</span>
          </span>
          <span className="text-[11px] text-[var(--color-ink-secondary)] font-[600]">
            {currentStateInfo?.description}
          </span>
        </div>

        {/* Render Live EditorialState Component */}
        <EditorialState
          type={selectedState}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleSecondaryAction}
        />
      </ScrollReveal>

      {/* Inspector Log & Trigger Feedback Panel */}
      <div className="rounded-none bg-[var(--color-paper-surface)] p-6 border border-[var(--color-paper-border)] shadow-sm space-y-4 font-mono-tactile">
        <div className="flex items-center justify-between border-b border-[var(--color-paper-border)] pb-3">
          <span className="text-[11px] font-[600] uppercase text-[#1B4D3E] dark:text-[#2D6A4F] flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>AUDIT STUDIO ACTION EVENT LOGGER</span>
          </span>
          <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase">
            STATUS: ACTIVE AUDIT
          </span>
        </div>

        <div className="p-4 rounded-none bg-[#1A1A18] text-white text-[12px] space-y-2 font-mono-tactile">
          <div className="flex items-center gap-2 text-white/50">
            <span>&gt; Selected State Key:</span>
            <span className="text-[#10B981] font-[600]">{selectedState}</span>
          </div>

          <div className="flex items-center gap-2 text-white/50">
            <span>&gt; Required Content Contract:</span>
            <span className="text-white font-[600]">WHAT HAPPENED ✓ | WHAT IT MEANS ✓ | WHAT TO DO NEXT ✓</span>
          </div>

          {lastActionTriggered ? (
            <div className="flex items-center gap-2 text-[#10B981]">
              <span>&gt; Last Action Event:</span>
              <span className="font-[600]">{lastActionTriggered}</span>
            </div>
          ) : (
            <div className="text-white/40 italic">
              &gt; Click action buttons inside the card above to test micro-interactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
