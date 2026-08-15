import React, { useState, useEffect } from 'react';
import {
  Loader2,
  SearchX,
  AlertTriangle,
  Unplug,
  Lock,
  ServerOff,
  Inbox,
  Sparkles,
  Sprout,
  PiggyBank,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { BrutalistButton } from './index';

export type StateType =
  | 'loading'
  | 'empty'
  | 'error'
  | 'disconnected'
  | 'unauthorized'
  | 'unavailable'
  | 'no-subscriptions'
  | 'no-zombie-subscriptions'
  | 'no-zombies'
  | 'no-goals'
  | 'no-savings'
  | 'successful-cancellation'
  | 'cancellation-success'
  | 'failed-cancellation'
  | 'cancellation-failed';

export interface EditorialStateProps {
  type?: StateType;
  // Optional custom overrides
  title?: string;
  subtitle?: string;
  whatHappened?: string;
  whatItMeans?: string;
  whatToDoNext?: string;
  errorCode?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
}

interface StateConfig {
  badgeText: string;
  badgeVariant: 'forest' | 'crimson' | 'gold' | 'ink' | 'muted';
  title: string;
  whatHappened: string;
  whatItMeans: string;
  whatToDoNext: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryLabel: string;
  secondaryLabel?: string;
  errorCode?: string;
}

export const EditorialState: React.FC<EditorialStateProps> = ({
  type = 'empty',
  title: customTitle,
  whatHappened: customWhatHappened,
  whatItMeans: customWhatItMeans,
  whatToDoNext: customWhatToDoNext,
  errorCode: customErrorCode,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  // Loading ticker animation step
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingTickerSteps = [
    'Handshaking open-banking telemetry logs...',
    'Parsing SMS e-mandates & UPI AutoPay tokens...',
    'Calculating decay scores and usage metrics...',
    'Compiling micro-SIP diversion projections...',
  ];

  useEffect(() => {
    if (type === 'loading') {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTickerSteps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [type]);

  const getStateConfig = (): StateConfig => {
    switch (type) {
      case 'loading':
        return {
          badgeText: 'ASYNC TELEMETRY SYNCHRONIZATION',
          badgeVariant: 'forest',
          title: 'Fetching Mandate Telemetry...',
          whatHappened: 'BACKGROUND DATA SYNC IN PROGRESS',
          whatItMeans:
            'ReclaimR is inspecting active account aggregator feeds, parsing UPI AutoPay tokens, and calculating real-time rot scores.',
          whatToDoNext:
            'Sit back for a moment while telemetry compiles, or cancel background sync if needed.',
          icon: Loader2,
          primaryLabel: 'Refresh Telemetry',
          secondaryLabel: 'Cancel Sync',
        };

      case 'empty':
        return {
          badgeText: 'QUERY SCOPE LEDGER',
          badgeVariant: 'muted',
          title: 'No Matching Records Found',
          whatHappened: 'SEARCH / FILTER RETURNED ZERO RESULTS',
          whatItMeans:
            'No active subscription mandates, rot warnings, or ledger entries match your current search string or applied filters.',
          whatToDoNext:
            'Clear active search parameters or reset status filters to view your entire subscription catalog.',
          icon: SearchX,
          primaryLabel: 'Reset Filters',
          secondaryLabel: 'View Full Catalog',
        };

      case 'error':
        return {
          badgeText: 'SYSTEM EXECUTION FAULT',
          badgeVariant: 'crimson',
          title: 'Telemetry Synchronization Interrupted',
          whatHappened: 'UNHANDLED RUNTIME OR LOG PARSE EXCEPTION',
          whatItMeans:
            'An unexpected data format fault or network exception occurred while parsing mandate transaction records.',
          whatToDoNext:
            'Retry the operation, verify network connectivity, or return to the main Monetary Control Deck.',
          icon: AlertTriangle,
          primaryLabel: 'Retry Telemetry Sync',
          secondaryLabel: 'Return to Control Deck',
          errorCode: 'ERR_TELEMETRY_PARSER_FAULT_0x409',
        };

      case 'disconnected':
        return {
          badgeText: 'TELEMETRY LINK SEVERED',
          badgeVariant: 'crimson',
          title: 'Bank & E-Mandate Link Disconnected',
          whatHappened: 'ACCOUNT AGGREGATOR TOKEN EXPIRED',
          whatItMeans:
            'Your Open Banking connection to HDFC/ICICI Account Aggregator has lost active session authorization. Automated decay monitoring is paused.',
          whatToDoNext:
            'Re-authenticate your bank credentials to reconnect live mandate telemetry and restore 1-tap cancellations.',
          icon: Unplug,
          primaryLabel: 'Reconnect Bank Link',
          secondaryLabel: 'Enter Manual Fallback',
        };

      case 'unauthorized':
        return {
          badgeText: 'SECURITY LOCK ENGAGED',
          badgeVariant: 'ink',
          title: 'Session Authentication Required',
          whatHappened: 'SECURITY TOKEN EXPIRED OR MISSING',
          whatItMeans:
            'Your session token has expired. Subscription details and bank credentials are encrypted and locked to safeguard your financial privacy.',
          whatToDoNext:
            'Authenticate with your biometric key or log in with your security credentials to unlock your monetary control deck.',
          icon: Lock,
          primaryLabel: 'Authenticate Session',
          secondaryLabel: 'Return to Login',
        };

      case 'unavailable':
        return {
          badgeText: 'NPCI GATEWAY MAINTENANCE',
          badgeVariant: 'gold',
          title: 'Revocation Service Temporarily Unavailable',
          whatHappened: 'INTERBANK AUTOPAY GATEWAY UNDER MAINTENANCE',
          whatItMeans:
            'NPCI UPI AutoPay interbank revocation servers are undergoing scheduled maintenance. Direct 1-tap e-mandate cancellations are temporarily paused.',
          whatToDoNext:
            'Queue an automated cancellation request for when servers resume, or check interbank gateway health status.',
          icon: ServerOff,
          primaryLabel: 'Queue Automated Cancellation',
          secondaryLabel: 'Check Gateway Status',
        };

      case 'no-subscriptions':
        return {
          badgeText: 'LEDGER UNINITIALIZED',
          badgeVariant: 'muted',
          title: 'No Subscriptions Linked Yet',
          whatHappened: 'ZERO MANDATES DETECTED IN ACCOUNT',
          whatItMeans:
            'ReclaimR has not linked any bank statements, SMS receipts, or UPI e-mandates to your account catalog yet.',
          whatToDoNext:
            'Run the statement auto-scanner or link your primary bank account to instantly detect hidden subscription rot.',
          icon: Inbox,
          primaryLabel: 'Run Statement Scanner',
          secondaryLabel: 'Add Mandate Manually',
        };

      case 'no-zombie-subscriptions':
      case 'no-zombies':
        return {
          badgeText: 'CLEAN FINANCIAL LEDGER',
          badgeVariant: 'forest',
          title: 'Zero Subscription Rot Detected!',
          whatHappened: 'ALL ACTIVE SUBSCRIPTIONS HAVE HIGH UTILITY',
          whatItMeans:
            'Sensational news! Every mandate in your catalog was used within the last 14 days. You have zero active cash leakage.',
          whatToDoNext:
            'Plant a new wealth goal in Goals Garden, adjust rot sensitivity thresholds, or run a fresh bank scan.',
          icon: Sparkles,
          primaryLabel: 'Plant Wealth Goal',
          secondaryLabel: 'Audit Catalog',
        };

      case 'no-goals':
        return {
          badgeText: 'GARDEN UNPLANTED',
          badgeVariant: 'forest',
          title: 'Your Goals Garden is Empty',
          whatHappened: 'ZERO WEALTH DIVERSION GOALS CREATED',
          whatItMeans:
            'Rescued subscription cash needs a dedicated destination. Without a goal, reclaimed funds risk slipping back into impulse spending.',
          whatToDoNext:
            'Plant your first wealth goal (e.g. Travel, Emergency Cushion, EV Scooter) to automatically route diverted sub money into index funds.',
          icon: Sprout,
          primaryLabel: 'Plant Your First Goal',
          secondaryLabel: 'Learn Micro-SIP Routing',
        };

      case 'no-savings':
        return {
          badgeText: 'RECLAIM UNSTARTED',
          badgeVariant: 'gold',
          title: 'Zero Dollars Reclaimed So Far',
          whatHappened: 'NO MANDATE CANCELLATIONS EXECUTED YET',
          whatItMeans:
            'Your rotting subscriptions are currently leaking ₹3,097/month. Executing your first 1-tap cancellation instantly redirects that cash into wealth.',
          whatToDoNext:
            'Inspect your highest-rot subscription in the Stash Ledger and execute your first 1-tap mandate revocation.',
          icon: PiggyBank,
          primaryLabel: 'Inspect Stash Ledger',
          secondaryLabel: 'View Reclaim Calculator',
        };

      case 'successful-cancellation':
      case 'cancellation-success':
        return {
          badgeText: 'AUTONOMOUS EXECUTION SUCCESS',
          badgeVariant: 'forest',
          title: 'Sub-Rot Terminated & Wealth Diverted!',
          whatHappened: 'UPI AUTOPAY E-MANDATE TOKEN REVOKED',
          whatItMeans:
            'The automated debit token was officially killed. Monthly capital has been redirected into your primary Nifty 50 Index Fund micro-SIP.',
          whatToDoNext:
            'View your official security receipt certificate, track portfolio progress in Goals Garden, or kill remaining rot.',
          icon: CheckCircle2,
          primaryLabel: 'View Goals Garden',
          secondaryLabel: 'Download Certificate Receipt',
        };

      case 'failed-cancellation':
      case 'cancellation-failed':
        return {
          badgeText: 'MERCHANT REVOCATION BLOCKAGE',
          badgeVariant: 'crimson',
          title: 'Mandate Revocation Blocked by Merchant',
          whatHappened: 'MERCHANT DARK PATTERN DETECTED',
          whatItMeans:
            'The vendor blocks direct API cancellation (e.g. requires mandatory retention phone call, physical branch visit, or obscure manual form).',
          whatToDoNext:
            'Launch the ReclaimR Dark Pattern Bypass Assistant to generate a legally binding cancellation letter or file a bank dispute.',
          icon: XCircle,
          primaryLabel: 'Launch Bypass Assistant',
          secondaryLabel: 'Generate Certified Cancellation Letter',
          errorCode: 'ERR_MERCHANT_DARK_PATTERN_OBSTRUCTION',
        };

      default:
        return {
          badgeText: 'STATUS UPDATE',
          badgeVariant: 'muted',
          title: 'Notice',
          whatHappened: 'EVENT OCCURRED',
          whatItMeans: 'No further details available.',
          whatToDoNext: 'Return to previous screen.',
          icon: Inbox,
          primaryLabel: 'Continue',
        };
    }
  };

  const config = getStateConfig();

  const title = customTitle || config.title;
  const whatHappened = customWhatHappened || config.whatHappened;
  const whatItMeans = customWhatItMeans || config.whatItMeans;
  const whatToDoNext = customWhatToDoNext || config.whatToDoNext;
  const errorCode = customErrorCode || config.errorCode;

  const badgeVariantStyles = {
    forest: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
    crimson: 'bg-[#C93B2B]/15 text-[#C93B2B] dark:text-[#E54D3C] border-[#C93B2B]/30',
    gold: 'bg-[#B8860B]/15 text-[#B8860B] dark:text-[#D4AF37] border-[#B8860B]/30',
    ink: 'bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] border-transparent',
    muted: 'bg-[var(--color-paper-card)] text-[var(--color-ink-secondary)] border-[var(--color-paper-border)]',
  };

  const IconComponent = config.icon;

  return (
    <div
      className={`rounded-none bg-[var(--color-paper-surface)] p-6 sm:p-10 border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] relative overflow-hidden font-sans-clean ${className}`}
    >
      {/* Guillotine Security Pattern Watermark Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 guillotine-pattern opacity-20 pointer-events-none rounded-bl-none" />

      <div className="space-y-8 relative z-10">
        {/* Top Header & Tactile Eyebrow Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-6 font-mono-tactile">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 shadow-sm border ${
                config.badgeVariant === 'forest'
                  ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                  : config.badgeVariant === 'crimson'
                  ? 'bg-[#C93B2B]/15 text-[#C93B2B] dark:text-[#E54D3C] border-[#C93B2B]/30'
                  : config.badgeVariant === 'gold'
                  ? 'bg-[#B8860B]/15 text-[#B8860B] dark:text-[#D4AF37] border-[#B8860B]/30'
                  : 'bg-[var(--color-paper-card)] text-[var(--color-ink-primary)] border-[var(--color-paper-border)]'
              }`}
            >
              <IconComponent
                className={`w-6 h-6 ${type === 'loading' ? 'animate-spin text-[#10B981]' : ''}`}
              />
            </div>

            <div className="space-y-1">
              <span
                className={`inline-block px-3 py-0.5 rounded-none text-[10px] font-[600] uppercase tracking-wider border ${
                  badgeVariantStyles[config.badgeVariant]
                }`}
              >
                {config.badgeText}
              </span>
              <h2 className="font-serif-editorial text-[24px] sm:text-[32px] font-[600] tracking-tight leading-none text-[var(--color-ink-primary)]">
                {title}
              </h2>
            </div>
          </div>

          {errorCode && (
            <div className="px-3 py-1.5 rounded-none bg-black/5 dark:bg-white/10 text-[10px] font-[600] text-[var(--color-ink-tertiary)] border border-[var(--color-paper-border)] self-start sm:self-auto font-mono-tactile">
              CODE: {errorCode}
            </div>
          )}
        </div>

        {/* Async Loading Animated Status Ticker */}
        {type === 'loading' && (
          <div className="p-4 rounded-none bg-[#1A1A18] text-white font-mono-tactile space-y-2 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-[#10B981]">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>LIVE TELEMETRY TICKER</span>
              </span>
              <span>[STEP 0{loadingStep + 1} / 04]</span>
            </div>
            <div className="text-[13px] font-[500] text-white/90 animate-pulse">
              &gt; {loadingTickerSteps[loadingStep]}
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-none overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-none transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 3 MANDATORY STRUCTURED SECTIONS: WHAT HAPPENED, WHAT IT MEANS, WHAT TO DO NEXT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans-clean">
          {/* SECTION 1: WHAT HAPPENED */}
          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-2">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] uppercase text-[#C93B2B] dark:text-[#E54D3C] tracking-wider">
              <span className="w-2 h-2 rounded-none bg-[#C93B2B] dark:bg-[#E54D3C]" />
              <span>1. WHAT HAPPENED</span>
            </div>
            <p className="font-serif-editorial text-[18px] font-[600] leading-snug text-[var(--color-ink-primary)] pt-1">
              {whatHappened}
            </p>
          </div>

          {/* SECTION 2: WHAT IT MEANS */}
          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-2">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] uppercase text-[#B8860B] dark:text-[#D4AF37] tracking-wider">
              <span className="w-2 h-2 rounded-none bg-[#B8860B] dark:bg-[#D4AF37]" />
              <span>2. WHAT IT MEANS</span>
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--color-ink-secondary)] pt-1">
              {whatItMeans}
            </p>
          </div>

          {/* SECTION 3: WHAT TO DO NEXT */}
          <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[#10B981]/40 space-y-2">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] uppercase text-[#10B981] tracking-wider">
              <span className="w-2 h-2 rounded-none bg-[#10B981]" />
              <span>3. WHAT TO DO NEXT</span>
            </div>
            <p className="text-[14px] font-[500] leading-relaxed text-[var(--color-ink-primary)] pt-1">
              {whatToDoNext}
            </p>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 border-t border-[var(--color-paper-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tactile">
          <div className="text-[11px] text-[var(--color-ink-tertiary)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Editorial UI State Auditor Verified</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {config.secondaryLabel && (
              <BrutalistButton
                variant="secondary"
                size="sm"
                onClick={onSecondaryAction}
                className="w-full sm:w-auto"
              >
                <span>{secondaryActionLabel || config.secondaryLabel}</span>
              </BrutalistButton>
            )}

            <BrutalistButton
              variant="primary"
              size="sm"
              onClick={onPrimaryAction}
              className="w-full sm:w-auto"
            >
              <span>{primaryActionLabel || config.primaryLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </BrutalistButton>
          </div>
        </div>
      </div>
    </div>
  );
};
