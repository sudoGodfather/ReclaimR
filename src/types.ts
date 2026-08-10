export interface Subscription {
  id: string;
  name: string;
  category: 'Streaming' | 'Fitness' | 'Software' | 'Gaming' | 'News' | 'Utility';
  cost: number; // Monthly cost in INR
  billingCycle: 'monthly' | 'yearly';
  lastUsedDaysAgo: number;
  decayScore: number; // 0 to 100 (higher = worse rot)
  status: 'rotting' | 'active' | 'diverted' | 'paused';
  iconName: string;
  renewDate: string;
  cancellationEase: 'Instant API' | 'Guided' | 'Manual';
  description: string;
  potential10YearGrowth: number; // Compound wealth at 12% CAGR
  watchCostPerUnit?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  icon: string;
  deadline: string;
  category: string;
  color: string;
}

export interface RotAlert {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  type: 'renewal_warning' | 'unused_decay' | 'price_hike' | 'trial_ending';
  title: string;
  message: string;
  date: string;
  amount: number;
  urgency: 'high' | 'medium' | 'low';
  actionTaken?: boolean;
}

export interface AgentPersonality {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  aggression: 'Aggressive' | 'Balanced' | 'Gentle';
  accentColor: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  monthlyRotLimit: number;
  selectedAgentId: string;
  selectedGoalId: string;
  bankConnected: boolean;
  upiConnected: boolean;
  totalSaved: number;
  totalDivertedMonthly: number;
}
