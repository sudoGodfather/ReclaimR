import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Subscription, Goal, RotAlert } from '../types';
import {
  INITIAL_SUBSCRIPTIONS, INITIAL_GOALS, INITIAL_ALERTS, INITIAL_USER_PROFILE,
} from '../data/mockData';

const STORAGE_KEYS = {
  subs: 'reclaimr-subscriptions',
  goals: 'reclaimr-goals',
  alerts: 'reclaimr-alerts',
  totalSaved: 'reclaimr-total-saved',
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function persist<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

interface AppContextValue {
  subscriptions: Subscription[];
  goals: Goal[];
  alerts: RotAlert[];
  activeAlerts: RotAlert[];
  totalRotMonthly: number;
  totalDivertedMonthly: number;
  totalSaved: number;
  executeCancellation: (subId: string) => Subscription | undefined;
  addGoal: (goal: Goal) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    loadFromStorage(STORAGE_KEYS.subs, INITIAL_SUBSCRIPTIONS),
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadFromStorage(STORAGE_KEYS.goals, INITIAL_GOALS),
  );
  const [alerts, setAlerts] = useState<RotAlert[]>(() =>
    loadFromStorage(STORAGE_KEYS.alerts, INITIAL_ALERTS),
  );
  const [totalSaved, setTotalSaved] = useState<number>(() =>
    loadFromStorage(STORAGE_KEYS.totalSaved, INITIAL_USER_PROFILE.totalSaved),
  );

  /* ------------------------- persistence ------------------------- */
  useEffect(() => persist(STORAGE_KEYS.subs, subscriptions), [subscriptions]);
  useEffect(() => persist(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => persist(STORAGE_KEYS.alerts, alerts), [alerts]);
  useEffect(() => persist(STORAGE_KEYS.totalSaved, totalSaved), [totalSaved]);

  /* ----------------------- derived values ------------------------ */
  const totalRotMonthly = useMemo(
    () => subscriptions
      .filter((s) => s.status === 'rotting')
      .reduce((acc, s) => acc + s.cost, 0),
    [subscriptions],
  );

  const totalDivertedMonthly = useMemo(
    () => subscriptions
      .filter((s) => s.status === 'diverted')
      .reduce((acc, s) => acc + s.cost, 0),
    [subscriptions],
  );

  const activeAlerts = useMemo(
    () => alerts.filter((a) => !a.actionTaken),
    [alerts],
  );

  /* -------------------------- actions ---------------------------- */

  /**
   * Cancels a subscription, marks it diverted, routes its ACTUAL cost
   * into the primary goal, and resolves matching alerts.
   *
   * Returns the cancelled subscription so callers can build receipts.
   */
  const executeCancellation = useCallback(
    (subId: string): Subscription | undefined => {
      const sub = subscriptions.find((s) => s.id === subId);
      if (!sub) return undefined;

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subId ? { ...s, status: 'diverted', decayScore: 0 } : s,
        ),
      );

      setGoals((prev) =>
        prev.map((g, idx) =>
          idx === 0
            ? {
                ...g,
                monthlyContribution: g.monthlyContribution + sub.cost,
                currentAmount: g.currentAmount + sub.cost,
              }
            : g,
        ),
      );

      setAlerts((prev) =>
        prev.map((a) =>
          a.subscriptionId === subId ? { ...a, actionTaken: true } : a,
        ),
      );

      setTotalSaved((prev) => prev + sub.cost);

      return sub;
    },
    [subscriptions],
  );

  const addGoal = useCallback((goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  }, []);

  const resetDemoData = useCallback(() => {
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setGoals(INITIAL_GOALS);
    setAlerts(INITIAL_ALERTS);
    setTotalSaved(INITIAL_USER_PROFILE.totalSaved);
  }, []);

  const value: AppContextValue = {
    subscriptions,
    goals,
    alerts,
    activeAlerts,
    totalRotMonthly,
    totalDivertedMonthly,
    totalSaved,
    executeCancellation,
    addGoal,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
