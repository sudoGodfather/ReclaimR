import React, { useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { Goal } from '../types';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/ui';
import { SubIcon } from '../components/SubIcon';
import { sipFutureValue, formatINR } from '../utils/finance';

export const GoalsGarden: React.FC = () => {
  const { goals, addGoal } = useApp();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTarget, setNewTarget] = useState<number>(100000);
  const [newDeadline, setNewDeadline] = useState<string>('Dec 2026');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;
    const goalObj: Goal = {
      id: `goal-${Date.now()}`,
      title: trimmedTitle.slice(0, 60),
      targetAmount: Number(newTarget),
      currentAmount: 649,
      monthlyContribution: 649,
      icon: 'Target',
      deadline: newDeadline.trim(),
      category: 'Custom Goal',
      color: '#B78A3A',
    };
    addGoal(goalObj);
    setShowAddModal(false);
    setNewTitle('');
  };

  const totalDivertedInGoals = goals.reduce((acc, g) => acc + g.monthlyContribution, 0);
  const totalGoalCapital = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-jade border-4 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-shadow)] flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-ink-dark text-jade font-mono font-black text-xs px-3 py-1 uppercase border border-ink">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            <span>WEALTH DIVERSION GARDEN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase text-ink-static tracking-tight">
            Your Goals Garden
          </h1>
          <p className="text-sm font-bold text-ink-static max-w-2xl font-sans">
            Every rupee saved from cancelled sub-rot is automatically diverted into these high-yield micro-SIPs. Watch your cancelled subscriptions blossom into real wealth.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-surface border-3 border-ink p-4 font-mono shadow-[4px_4px_0px_0px_var(--color-shadow)] text-right">
            <div className="text-xs font-black text-muted-text uppercase">Total Monthly Diverted SIP</div>
            <div className="text-3xl font-black text-blue">
              {formatINR(totalDivertedInGoals)}/m
            </div>
            <div className="text-[11px] font-bold text-ink">
              Total Current Capital: {formatINR(totalGoalCapital)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-ink-dark text-brass font-mono font-black text-sm px-6 py-3 border-3 border-ink shadow-[4px_4px_0px_0px_var(--color-shadow)] hover:bg-ink-lift cursor-pointer uppercase flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            <Plus className="w-5 h-5 stroke-[3]" aria-hidden="true" />
            <span>Add New Goal</span>
          </button>
        </div>
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 && (
        <EmptyState
          title="YOUR GARDEN IS EMPTY"
          message="Plant your first wealth goal — every rupee diverted from cancelled subscriptions grows into it. Start with an emergency cushion or a dream trip."
          actionLabel="Plant Your First Goal"
          onAction={() => setShowAddModal(true)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const fiveYearCompound = sipFutureValue(goal.monthlyContribution, 5);

          return (
            <div
              key={goal.id}
              className="bg-surface border-4 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-shadow)] flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Category Badge */}
              <div className="flex justify-between items-center font-mono">
                <span className="flex items-center gap-1.5 bg-ink-dark text-on-dark text-[10px] font-black uppercase px-2 py-0.5 border border-ink">
                  <SubIcon name={goal.icon} className="w-3 h-3" />
                  {goal.category}
                </span>
                <span className="bg-brass text-ink-static font-mono font-black text-xs px-2 py-0.5 border border-ink">
                  {percent}% ACHIEVED
                </span>
              </div>

              {/* Goal Title */}
              <div className="space-y-2">
                <h3 className="font-mono font-black text-2xl text-ink uppercase leading-tight">
                  {goal.title}
                </h3>
                <p className="text-xs font-mono font-bold text-muted-text">
                  Target Deadline: {goal.deadline}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-xs font-black">
                  <span>ACCUMULATED: {formatINR(goal.currentAmount)}</span>
                  <span>GOAL: {formatINR(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-muted border-2 border-ink h-5 relative overflow-hidden">
                  <div
                    className="bg-jade h-full border-r-2 border-ink transition-all duration-1000 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Active Sub Diversion Feed */}
              <div className="bg-bg border-2 border-ink p-3 font-mono text-xs space-y-1">
                <div className="text-[10px] font-bold text-muted-text uppercase">Active Sub Diversions:</div>
                <div className="flex justify-between font-bold text-terra">
                  <span>SUB-ROT TERMINATED:</span>
                  <span>+{formatINR(goal.monthlyContribution)}/m</span>
                </div>
                <div className="flex justify-between font-bold text-ink border-t border-ink/30 pt-1">
                  <span>GOAL WEALTH SO FAR:</span>
                  <span>{formatINR(goal.currentAmount)}</span>
                </div>
              </div>

              {/* Projected Compound Wealth */}
              <div className="bg-blue text-on-accent p-3 font-mono text-xs border-2 border-ink flex items-center justify-between">
                <span>5-YR COMPOUND (12%):</span>
                <span className="font-black text-sm text-brass">
                  {formatINR(fiveYearCompound)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink-dark/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border-4 border-ink p-6 max-w-md w-full shadow-[10px_10px_0px_0px_var(--color-brass)] space-y-6">
            <div className="flex justify-between items-center border-b-4 border-ink pb-3">
              <h3 className="font-mono font-black text-xl uppercase text-ink">
                Plant a New Wealth Goal
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close goal modal"
                className="bg-ink-dark text-on-dark font-mono font-black px-2.5 py-1 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 font-mono">
              <div>
                <label htmlFor="goal-title" className="block text-xs font-black uppercase mb-1">Goal Name</label>
                <input
                  id="goal-title"
                  type="text"
                  placeholder="e.g. Electric Scooter / Emergency Cushion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={60}
                  className="w-full bg-bg border-2 border-ink p-3 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-target" className="block text-xs font-black uppercase mb-1">Target Amount (₹)</label>
                <input
                  id="goal-target"
                  type="number"
                  min={1000}
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full bg-bg border-2 border-ink p-3 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-deadline" className="block text-xs font-black uppercase mb-1">Target Deadline</label>
                <input
                  id="goal-deadline"
                  type="text"
                  placeholder="e.g. Dec 2026"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  maxLength={30}
                  className="w-full bg-bg border-2 border-ink p-3 text-sm font-bold focus:outline-none focus:bg-brass/20 focus-visible:ring-2 focus-visible:ring-terra"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-surface text-ink font-black text-sm py-3 border-2 border-ink cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-jade text-ink-static font-black text-sm py-3 border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-jade-deep cursor-pointer uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  Plant Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};