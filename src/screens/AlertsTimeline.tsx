import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/ui';
import { formatINR } from '../utils/finance';

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
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Header Banner */}
      <div className="bg-terra text-on-accent border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-ink-dark text-brass font-mono font-black text-xs px-3 py-1 uppercase border border-on-dark">
            <Bell className="w-4 h-4" aria-hidden="true" />
            <span>REAL-TIME SUB-ROT ALERTS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-on-accent">
            Alerts & Mandate Warnings
          </h1>
          <p className="text-sm font-medium text-on-accent/90 max-w-2xl font-sans">
            Live timeline of auto-detected recurring debits, upcoming renewals, price increases, and unused subscription decay alerts.
          </p>
        </div>

        <div className="bg-ink-dark text-on-dark border-2 border-on-dark p-4 font-mono text-right shadow-[4px_4px_0px_0px_var(--color-on-dark)]">
          <div className="text-xs font-black text-brass uppercase">
            {activeAlerts.length} UNREAD ALERTS
          </div>
          <div className="text-2xl font-black text-terra">{formatINR(atRiskMonthly)} AT RISK</div>
        </div>
      </div>

      {activeAlerts.length === 0 && (
        <EmptyState
          title="NO ROT DETECTED"
          message="Your subscriptions are clean — every detected mandate has been reviewed. Cancelled ones are now growing as SIPs in your Goals Garden."
          actionLabel="View Goals Garden"
          onAction={() => navigate('/goals')}
        />
      )}

      {/* Timeline Feed */}
      <div className="space-y-6 relative border-l-4 border-ink pl-6 sm:pl-8 ml-4 sm:ml-6">
        {activeAlerts.map((alert) => {
          const isHigh = alert.urgency === 'high';

          return (
            <div key={alert.id} className="relative group">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 border-3 border-ink flex items-center justify-center font-mono font-black text-xs ${
                  isHigh ? 'bg-terra text-on-accent' : 'bg-brass text-ink-static'
                }`}
              >
                !
              </div>

              {/* Alert Card */}
              <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] hover:shadow-[10px_10px_0px_0px_var(--color-shadow)] transition-all space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-ink ${
                        isHigh ? 'bg-terra text-on-accent' : 'bg-brass text-ink-static'
                      }`}
                    >
                      {alert.urgency.toUpperCase()} PRIORITY
                    </span>
                    <span className="font-mono text-xs font-bold text-muted-text">
                      {alert.date}
                    </span>
                  </div>

                  <span className="font-mono font-black text-sm bg-ink-dark text-brass px-2 py-0.5">
                    AMOUNT: {formatINR(alert.amount)}/m
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono font-black text-xl text-ink uppercase">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-muted-text font-sans leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Card Action Buttons - CRITICAL: Contains 'Cancel & Invest' or 'Divert' */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 font-mono">
                  <div className="text-xs font-bold text-muted-text">
                    TARGET: {alert.subscriptionName}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.subscriptionId)}
                      className="bg-terra text-on-accent font-mono font-black text-xs px-5 py-2.5 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-terra-deep cursor-pointer uppercase flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <Zap className="w-4 h-4 fill-on-accent" aria-hidden="true" />
                      <span>Cancel & Invest</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAlertAction(alert.subscriptionId)}
                      className="bg-jade text-ink-static font-mono font-black text-xs px-4 py-2.5 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-jade-deep cursor-pointer uppercase flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      <span>Divert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolved Alerts Section */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-mono font-black text-lg uppercase text-ink flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-jade" aria-hidden="true" />
            <span>Resolved ({resolvedAlerts.length})</span>
          </h2>
          <div className="space-y-3">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-jade-tint border-2 border-ink p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-3 opacity-80"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jade" aria-hidden="true" />
                  <span className="font-black text-ink uppercase">{alert.title}</span>
                  <span className="text-muted-text font-sans">— {alert.subscriptionName}</span>
                </div>
                <span className="bg-ink-dark text-jade px-2 py-0.5 font-black uppercase">
                  ✓ {formatINR(alert.amount)}/m Recovered
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};