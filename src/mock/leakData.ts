/**
 * ReclaimR Subscription Rot Leak Mock Data
 * Represents recurring micro-debits that accumulate into major annual wealth drain.
 */

export interface LeakItem {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  lastUsedDays: number;
  mandateType: string;
  descriptor: string;
}

export const LEAK_SUBSCRIPTIONS: LeakItem[] = [
  {
    id: 'leak-1',
    name: 'Medium Publication Pass',
    category: 'Reading',
    monthlyCost: 199,
    lastUsedDays: 102,
    mandateType: 'UPI AutoPay',
    descriptor: 'AUTOPAY-MEDIUM-199',
  },
  {
    id: 'leak-2',
    name: 'Spotify Premium Family',
    category: 'Audio',
    monthlyCost: 299,
    lastUsedDays: 14,
    mandateType: 'Credit Card E-Mandate',
    descriptor: 'AUTOPAY-SPOTIFY-299',
  },
  {
    id: 'leak-3',
    name: 'iCloud 2TB Storage',
    category: 'Cloud',
    monthlyCost: 499,
    lastUsedDays: 45,
    mandateType: 'Apple ID Auto-Debit',
    descriptor: 'AUTOPAY-APPLE-499',
  },
  {
    id: 'leak-4',
    name: 'Netflix 4K Ultra HD',
    category: 'Streaming',
    monthlyCost: 799,
    lastUsedDays: 47,
    mandateType: 'UPI AutoPay',
    descriptor: 'AUTOPAY-NETFLIX-799',
  },
  {
    id: 'leak-5',
    name: 'Cult.fit Gym Membership',
    category: 'Fitness',
    monthlyCost: 1299,
    lastUsedDays: 63,
    mandateType: 'NACH Debit Mandate',
    descriptor: 'AUTOPAY-CULT-1299',
  },
];

export const TOTAL_MONTHLY_LEAK = LEAK_SUBSCRIPTIONS.reduce((acc, item) => acc + item.monthlyCost, 0); // ₹3,095
export const TOTAL_ANNUAL_LEAK = TOTAL_MONTHLY_LEAK * 12; // ₹37,140
export const TEN_YEAR_LEAK_COMPOUND = Math.round(TOTAL_MONTHLY_LEAK * ((Math.pow(1.01, 120) - 1) / 0.01)); // ~₹8.6 Lakhs
