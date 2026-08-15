import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, ShieldAlert, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/ui';
import { formatINR } from '../utils/finance';
import { ScrollReveal } from '../motion/ScrollPrimitives';
import { SEO } from '../components/SEO';

export const AlertsTimeline: React.FC = () => {
  const navigate = useNavigate();
  const { activeAlerts, alerts } = useApp();

  const atRiskMonthly = useMemo(
    () => activeAlerts.reduce((acc, a) => acc + a.amount, 0),
    [activeAlerts],
  );
  const resolvedAlerts = useMemo(
    () => alerts.filter((a) => a.actionTaken),
    [alerts],
  );

  const handleAlertAction = (subscriptionId: string) => {
    navigate(`/subscriptions/${subscriptionId}`);
  };

  return (
    <div className="max-w-[880px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Smart Alerts Timeline"
        description="Real-time sub-rot warning telemetry monitoring auto-detected recurring debits, upcoming AutoPay renewals, and price spikes in ReclaimR."
        canonicalPath="/alerts"
      />
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#C93B2B] dark:text-[#E54D3C]">
            [ REAL-TIME SUB-ROT WARNING TELEMETRY ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Alerts & Mandates Timeline
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Live timeline of auto-detected recurring debits, upcoming renewal dates, price spikes, and unused subscription rot warnings.
          </p>
        </div>

        <div className="p-5 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-sm min-w-[220px] text-left md:text-right font-mono-tactile shrink-0">
          <p className="text-[11px] font-[600] tracking-[0.08em] uppercase text-[#C93B2B] dark:text-[#E54D3C]">
            {activeAlerts.length} Active Warnings
          </p>
          <p className="font-serif-editorial text-[32px] font-[600] tracking-tight mt-0.5 text-[#C93B2B] dark:text-[#E54D3C]">
            {formatINR(atRiskMonthly)}<span className="font-sans-clean text-[14px] font-[400] text-[var(--color-ink-secondary)]">/mo</span>
          </p>
        </div>
      </div>

      {activeAlerts.length === 0 && (
        <EmptyState
          title="NO ROT DETECTED"
          message="Your subscriptions are clean — every detected mandate has been reviewed."
          actionLabel="View Goals Garden"
          onAction={() => navigate('/goals')}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* EDITORIAL TIMELINE LIST (NUMBERED & STACKED INFO BLOCKS)           */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-6 relative border-l-2 border-[var(--color-paper-border)] pl-6 ml-3 font-mono-tactile">
        {activeAlerts.map((alert, idx) => {
          const isHigh = alert.urgency === 'high';
          const indexStr = (idx + 1).toString().padStart(2, '0');

          return (
            <ScrollReveal key={alert.id} direction="left" distance={20} className="relative group">
              {/* Timeline Indicator Bullet */}
              <div
                className={`absolute -left-[31px] top-6 w-4 h-4 rounded-none border-2 border-[var(--color-paper-bg)] ${
                  isHigh ? 'bg-[#C93B2B] dark:bg-[#E54D3C]' : 'bg-[#B8860B] dark:bg-[#D4AF37]'
                }`}
              />

              {/* Editorial Information Block */}
              <div className="p-6 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-4 font-sans-clean hover:border-[#C93B2B]/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-paper-border)] pb-3 font-mono-tactile">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">
                      {indexStr}
                    </span>

                    <span
                      className={`text-[10px] font-[600] tracking-wider uppercase px-2.5 py-0.5 rounded-none ${
                        isHigh ? 'bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C]' : 'bg-[#B8860B]/10 text-[#B8860B]'
                      }`}
                    >
                      {alert.urgency} Priority
                    </span>

                    <span className="text-[12px] text-[var(--color-ink-secondary)]">
                      {alert.date}
                    </span>
                  </div>

                  <span className="font-serif-editorial text-[20px] font-[600] text-[#C93B2B] dark:text-[#E54D3C]">
                    {formatINR(alert.amount)}/mo
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif-editorial font-[600] text-[20px] text-[var(--color-ink-primary)] tracking-tight">
                    {alert.title}
                  </h3>
                  <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Card Action Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 font-mono-tactile">
                  <div className="text-[12px] text-[var(--color-ink-secondary)]">
                    Target Mandate: <strong className="text-[var(--color-ink-primary)]">{alert.subscriptionName}</strong>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.subscriptionId)}
                      data-cursor-label="RECLAIM"
                      className="h-[38px] px-5 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[12px] font-[600] hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Cancel & Invest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Resolved Alerts Ledger */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[var(--color-paper-border)]">
          <h2 className="font-serif-editorial font-[600] text-[20px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Resolved Mandate Warnings ({resolvedAlerts.length})</span>
          </h2>
          <div className="space-y-2.5 font-mono-tactile">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[13px] flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="font-[600] text-[var(--color-ink-primary)]">{alert.title}</span>
                  <span className="text-[var(--color-ink-tertiary)]">— {alert.subscriptionName}</span>
                </div>
                <span className="text-[#10B981] font-[600]">
                  ✓ {formatINR(alert.amount)}/mo Recovered into SIP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
