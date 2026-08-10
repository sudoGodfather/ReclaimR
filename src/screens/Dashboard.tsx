import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, ArrowRight, CheckCircle2, Plus, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubIcon } from '../components/SubIcon';
import { EmptyState } from '../components/ui';
import { sipFutureValue, formatLakhs, formatINR } from '../utils/finance';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptions, goals, activeAlerts, totalRotMonthly, totalDivertedMonthly, totalSaved } = useApp();

  const rotting = useMemo(
    () => subscriptions.filter((s) => s.status === 'rotting'),
    [subscriptions],
  );
  const diverted = useMemo(
    () => subscriptions.filter((s) => s.status === 'diverted'),
    [subscriptions],
  );
  const primaryGoal = goals[0];

  const tenYearLoss = sipFutureValue(totalRotMonthly, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner & Quick Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Sub-Rot Card */}
        <div className="bg-terra text-on-accent border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] relative overflow-hidden space-y-2">
          <div className="flex justify-between items-center font-mono text-xs uppercase font-black">
            <span>ACTIVE SUB-ROT</span>
            <span className="bg-ink-dark text-terra px-2 py-0.5 border border-on-dark">CRITICAL</span>
          </div>
          <div className="text-4xl font-mono font-black tracking-tight">
            {formatINR(totalRotMonthly)}
            <span className="text-sm font-normal">/mo</span>
          </div>
          <p className="font-mono text-xs text-on-accent/90 font-bold">
            {rotting.length} subscriptions rotting right now
          </p>
          <div className="text-[11px] font-mono text-on-accent border-t border-on-accent/30 pt-2">
            10-Yr Loss: {formatLakhs(tenYearLoss)}
          </div>
        </div>

        {/* Wealth Diverted Card */}
        <div className="bg-jade text-ink-static border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-2">
          <div className="flex justify-between items-center font-mono text-xs uppercase font-black">
            <span>SIP WEALTH DIVERTED</span>
            <span className="bg-ink-dark text-jade px-2 py-0.5">GROWING</span>
          </div>
          <div className="text-4xl font-mono font-black tracking-tight">
            {formatINR(totalDivertedMonthly)}
            <span className="text-sm font-normal">/mo</span>
          </div>
          <p className="font-mono text-xs text-ink-static font-bold">
            Redirected into Nifty 50 & Gold SIPs
          </p>
          <div className="text-[11px] font-mono text-ink-static/80 border-t border-ink-static/30 pt-2 font-bold">
            Target: {primaryGoal ? primaryGoal.title : 'Your Goal'} (+{formatINR(totalDivertedMonthly)}/m)
          </div>
        </div>

        {/* Total Recovered Cash */}
        <div className="bg-brass text-ink-static border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-2">
          <div className="flex justify-between items-center font-mono text-xs uppercase font-black">
            <span>TOTAL RECOVERED TO DATE</span>
            <span className="bg-ink-dark text-brass px-2 py-0.5">SAVED</span>
          </div>
          <div className="text-4xl font-mono font-black tracking-tight">
            {formatINR(totalSaved)}
          </div>
          <p className="font-mono text-xs text-ink-static font-bold">
            Prevented debit auto-claims in last 6 mos
          </p>
          <div className="text-[11px] font-mono text-ink-static/80 border-t border-ink-static/30 pt-2 font-bold">
            {diverted.length} Zombie debits killed permanently
          </div>
        </div>

        {/* Agent Persona Quick Bar */}
        <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-black text-terra uppercase">
              <Zap className="w-4 h-4 fill-terra" />
              <span>THE SAVAGE AUDITOR AGENT</span>
            </div>
            <p className="text-xs font-sans text-muted-text italic leading-snug">
              "You watched 0 hours of Netflix this month but donated ₹649 to Reed Hastings. Should I execute the cancellation now?"
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/subscriptions/netflix-649')}
            className="w-full bg-ink-dark text-brass font-mono font-black text-xs py-2 border-2 border-ink hover:bg-ink-lift cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            Review Netflix Audit ↗
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Rotting Subscriptions needing Review */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-terra text-on-accent font-mono font-black text-xs px-2 py-0.5 uppercase">
                    ACTION REQUIRED
                  </span>
                  <h2 className="text-2xl font-mono font-black uppercase text-ink">
                    High-Decay Subscriptions
                  </h2>
                </div>
                <p className="text-xs font-mono text-muted-text">
                  Unused subscriptions detected with over 60% decay score
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/subscriptions')}
                className="bg-ink-dark text-on-dark font-mono font-bold text-xs px-4 py-2 border-2 border-ink hover:bg-ink-lift cursor-pointer uppercase flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                <span>View All Stash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* List of Subscriptions with 'Review' button */}
            <div className="space-y-4">
              {rotting.length === 0 && (
                <EmptyState
                  title="NO ROT DETECTED"
                  message="Your subscriptions are clean — nothing is bleeding. Add a goal to start diverting future savings."
                  actionLabel="Go to Goals Garden"
                  onAction={() => navigate('/goals')}
                />
              )}
              {rotting.map((sub) => (
                <div
                  key={sub.id}
                  className="border-3 border-ink p-4 bg-bg hover:bg-surface transition-all flex flex-wrap items-center justify-between gap-4 shadow-[3px_3px_0px_0px_var(--color-shadow)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-terra text-on-accent border-2 border-ink font-mono font-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_var(--color-shadow)]">
                      <SubIcon name={sub.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-black text-lg text-ink uppercase">
                          {sub.name}
                        </h3>
                        <span className="bg-crimson text-on-accent font-mono text-[10px] font-black px-1.5 py-0.5 uppercase border border-ink">
                          {sub.decayScore}% ROT
                        </span>
                      </div>
                      <p className="text-xs text-muted-text font-sans">
                        {sub.description}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-terra mt-0.5">
                        Renews: {sub.renewDate} • Unused {sub.lastUsedDaysAgo} Days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right font-mono">
                      <div className="font-black text-xl text-ink">
                        {formatINR(sub.cost)}/m
                      </div>
                      <div className="text-[10px] font-bold text-muted-text">
                        10-Yr SIP: ₹{(sub.potential10YearGrowth / 100000).toFixed(2)}L
                      </div>
                    </div>

                    {/* Primary Navigation Test Target: Review Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/subscriptions/${sub.id}`)}
                      className="bg-brass text-ink-static font-mono font-black text-xs px-5 py-3 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-brass-deep cursor-pointer uppercase flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Diverted / Converted Subscriptions */}
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-4">
            <h3 className="font-mono font-black text-lg uppercase text-ink flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-jade fill-ink-static" />
              <span>Diverted Subscriptions (Active SIPs)</span>
            </h3>

            <div className="space-y-3">
              {diverted.length === 0 && (
                <EmptyState
                  title="NO DIVERSIONS YET"
                  message="Cancel your first rotting subscription and its cost is instantly converted into a Nifty 50 micro-SIP."
                  actionLabel="Review Rotting Subscriptions"
                  onAction={() => navigate('/subscriptions')}
                />
              )}
              {diverted.map((sub) => (
                <div key={sub.id} className="border-2 border-ink p-3 bg-jade-tint flex justify-between items-center font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <SubIcon name={sub.iconName} className="w-4 h-4" />
                    <span className="font-black text-ink">{sub.name}</span>
                    <span className="text-muted-text ml-2 font-sans">→ Diverted into Nifty 50 Index SIP</span>
                  </div>
                  <div className="font-black text-jade bg-ink-dark px-2 py-1">
                    +{formatINR(sub.cost)}/m RECOVERED
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Goals Garden Preview + Alerts Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Goals Garden Widget */}
          <div className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-ink pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-jade" />
                <h3 className="font-mono font-black text-lg uppercase text-ink">
                  Goals Garden
                </h3>
              </div>

              {/* Primary Navigation Test Target: New Goal Button */}
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="bg-jade text-ink-static font-mono font-black text-xs px-3 py-1.5 border-2 border-ink hover:bg-jade-deep cursor-pointer uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_var(--color-shadow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>New Goal</span>
              </button>
            </div>

            <div className="space-y-4">
              {goalList(goals, navigate)}
            </div>

            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="w-full bg-ink-dark text-on-dark font-mono font-black text-xs py-2.5 border-2 border-ink hover:bg-ink-lift cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
            >
              Manage Goals Garden ↗
            </button>
          </div>

          {/* Quick Urgent Alerts Timeline Widget */}
          <div className="bg-terra-tint border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-ink pb-2">
              <h3 className="font-mono font-black text-base uppercase text-terra flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 fill-terra text-on-dark" />
                <span>Urgent Rot Alerts</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/alerts')}
                className="text-xs font-mono font-black underline cursor-pointer text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                View Timeline
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {activeAlerts.length === 0 && (
                <div className="bg-surface border-2 border-ink p-3 text-center font-mono text-[11px] font-black uppercase text-jade">
                  ✓ All Clear — No Unresolved Alerts
                </div>
              )}
              {activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="bg-surface border-2 border-ink p-3 space-y-1">
                  <div className="font-black text-ink">{alert.title}</div>
                  <p className="text-[11px] font-sans text-muted-text">{alert.message}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/subscriptions/${alert.subscriptionId}`)}
                    className="mt-2 text-[10px] font-black bg-terra text-on-accent px-2 py-1 border border-ink uppercase cursor-pointer inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    Cancel & Divert {formatINR(alert.amount)} ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Goal widget rows — extracted so they can be rendered with proper types. */
function goalList(goals: ReturnType<typeof useApp>['goals'], navigate: ReturnType<typeof useNavigate>) {
  return goals.map((goal) => {
    const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
    return (
      <button
        type="button"
        key={goal.id}
        onClick={() => navigate('/goals')}
        className="w-full text-left border-2 border-ink p-3 bg-bg hover:bg-surface cursor-pointer transition-all space-y-2 shadow-[2px_2px_0px_0px_var(--color-shadow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
      >
        <div className="flex justify-between items-start font-mono">
          <div>
            <h4 className="font-black text-sm text-ink uppercase">{goal.title}</h4>
            <p className="text-[10px] text-muted-text">Deadline: {goal.deadline}</p>
          </div>
          <span className="bg-ink-dark text-brass text-xs font-black px-1.5 py-0.5">
            {percent}%
          </span>
        </div>

        <div className="w-full bg-muted border-2 border-ink h-3 overflow-hidden">
          <div
            className="bg-jade h-full transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono font-bold">
          <span>{formatINR(goal.currentAmount)} saved</span>
          <span className="text-terra">+{formatINR(goal.monthlyContribution)}/m SIP</span>
        </div>
      </button>
    );
  });
}