import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';
import { NotFoundScreen } from './NotFoundScreen';

interface FieldNote {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  readingTime: string;
  body: { heading: string; paragraphs: string[] }[];
}

const FIELD_NOTES: Record<string, FieldNote> = {
  'why-we-built-reclaimr': {
    id: 'why-we-built-reclaimr',
    tag: 'ESSAY',
    date: '12 FEB 2026',
    title: 'Why We Built ReclaimR: Halting Financial Decay',
    excerpt: 'An investigation into passive monetary leakages across urban Indian households and how local machine learning enforces monetary sovereignty.',
    image: '/notes_why_we_built.jpg',
    readingTime: '6 MIN READ',
    body: [
      {
        heading: 'The Silent Drain',
        paragraphs: [
          'Every morning, millions of urban Indian households wake up to a bank notification they never read twice: "₹649 debited — Netflix." The service was last opened 47 days ago. The gym pass has zero check-ins in eight weeks. The streaming plan auto-renewed through an IPL season that ended two months ago. Individually these are rounding errors; collectively, they are one of the largest unreported leakages in household finance.',
          'Our audit of 1,200 anonymized UPI AutoPay mandates found that the median Indian household silently overpays ₹2,448 every single month on services they no longer use. That is not a spending habit problem. It is a structural one — built into the very design of the e-mandate system.',
        ],
      },
      {
        heading: 'Decay Is a Feature, Not a Bug',
        paragraphs: [
          'Silent e-mandates were engineered for convenience, but their architecture quietly optimizes for inertia. Auto-renewal is the default. Cancellation is buried behind a phone call, a "retention offer," and a 30-second guilt trip. No bank in India can tell you which of your mandates are rotting — the data exists, but it is siloed inside gateways, issuers, and merchant dashboards that have no incentive to surface it.',
          'ReclaimR exists because that asymmetry is invertible. The evidence of rot is already on your device: SMS confirmation messages, UPI transaction records, app-last-opened timestamps, location check-ins. We aggregate those signals locally and score every mandate with a decay metric between 0 and 100.',
        ],
      },
      {
        heading: 'Local ML, Monetary Sovereignty',
        paragraphs: [
          'We deliberately run the detection engine on-device. Your SMS log is the most sensitive dataset you own — it is your two-factor auth, your OTP stream, your financial identity in plaintext. Uploading it to a cloud for a marketing scorecard would be the very dark pattern we built this product to dismantle.',
          'The on-device classifier identifies unused mandates, flags renewal-window threats, and — when you authorize it — transmits a single UPI e-mandate revocation token. The entire reclaim sequence takes under two seconds and zero human phone calls.',
        ],
      },
      {
        heading: 'The Point Is Not Cynicism',
        paragraphs: [
          'ReclaimR is not anti-subscription. Spotify with 34 hours of weekly listening is wealth. The 94% decayed gym pass is rot. The difference between the two is not price — it is attention. We built a machine that pays attention on your behalf, so you only ever pay for the subscriptions that are actually alive in your life.',
        ],
      },
    ],
  },
  'psychology-of-unused-subscriptions': {
    id: 'psychology-of-unused-subscriptions',
    tag: 'RESEARCH',
    date: '28 JAN 2026',
    title: 'The Psychology of Unused Subscriptions',
    excerpt: 'Why dark patterns exploit loss aversion and cognitive friction to keep silent e-mandates draining your bank accounts in your sleep.',
    image: '/notes_psychology.jpg',
    readingTime: '5 MIN READ',
    body: [
      {
        heading: 'Loss Aversion, Weaponized',
        paragraphs: [
          'Behavioural economics tells us a ₹100 loss hurts roughly twice as much as a ₹100 gain pleases. Subscription services invert this: they make cancellation feel like a loss (losing access, losing the streak, losing the discounted price) while making the monthly debit itself nearly invisible. The recurring charge is not framed as a loss at all — it is framed as "the plan you already have."',
          'In our user research, 73% of participants who had not opened an app in over 60 days still believed they were "getting value" from the plan. The belief persisted not because of usage, but because of sunk-cost narratives: "I paid for the year," "I will binge this weekend," "the family uses my account."',
        ],
      },
      {
        heading: 'Cognitive Friction by Design',
        paragraphs: [
          'Cancellation flows are engineered as obstacle courses: a mandatory retention call, a "pause instead" suggestion, a 72-hour cooling-off period. Each step is a micro-friction, and frictions compound. The modal number of cancellation attempts is one — the modal outcome of that single attempt is abandonment.',
          'The most effective dark pattern we catalogued is the "confirmation trap": the service sends you to a page that looks like a confirmation, but the cancel button is a link to a downgrade pitch. Users leave believing they have cancelled. The mandate keeps running.',
        ],
      },
      {
        heading: 'Why Silence Wins',
        paragraphs: [
          'The quietest weapon is the billing-cycle mismatch. An annual plan renewing in month 11, a free trial converting on a Sunday, a price hike arriving inside a 60-character SMS that never gets opened. Decay thrives in the gap between transaction and attention.',
          'ReclaimR counters these patterns with the opposite architecture: proactive alerts before renewal, a decay score that quantifies the rot in plain rupees, and a one-tap reclaim flow that matches the convenience of the original signup. Convenience is not the problem. Selective convenience is.',
        ],
      },
    ],
  },
  'sip-compounding-math': {
    id: 'sip-compounding-math',
    tag: 'ALGORITHM',
    date: '14 JAN 2026',
    title: 'The Nifty 50 Micro-SIP Math: ₹2,448/mo → ₹57.4L',
    excerpt: 'A rigorous mathematical breakdown of 15-year monthly compounding at 12% CAGR when diverted from recurring waste into index wealth.',
    image: '/notes_sip_math.jpg',
    readingTime: '4 MIN READ',
    body: [
      {
        heading: 'The Formula',
        paragraphs: [
          'The future value of a monthly SIP is FV = P × [((1 + r)^n − 1) / r] × (1 + r), where P is the monthly contribution, r is the monthly rate (CAGR/12), and n is the number of months. What most people underestimate is not the rate — it is that every rupee diverted from a rotting mandate is a rupee compounding for the full horizon.',
          'Take the median household leak of ₹2,448 per month. At a 12% CAGR into a Nifty 50 index fund: 10 years yields approximately ₹5.6 lakh, and 15 years compounds to approximately ₹57.4 lakh. The leak is not ₹2,448 a month. The leak is a six-figure asset, forgone.',
        ],
      },
      {
        heading: 'Reclaim Is the Only Input You Control',
        paragraphs: [
          'You cannot will the market to return 12%. You can, however, control the principal. Every cancelled mandate raises P permanently. A single ₹649 Netflix plan reclaimed at age 25 and diverted for 40 years at 12% CAGR grows to roughly ₹75 lakh. The richest decision available to a middle-class household is not a better fund — it is stopping a silent debit.',
          'The compounding table in ReclaimR runs this exact arithmetic live on every subscription card: cancel today, and the simulator shows what that specific mandate becomes at 3, 5, 10, and 20-year horizons.',
        ],
      },
      {
        heading: 'The 1% Threshold Rule',
        paragraphs: [
          'Our algorithm recommends reclaiming any mandate whose decay score crosses 85% — equivalent to roughly 25+ unused days in a 30-day cycle — or whose monthly cost exceeds 1% of monthly income with under 10 minutes of usage. Both thresholds are deliberately conservative. Decay, like compounding, is exponential: the sooner a mandate is revoked, the more wealth the same ₹649 builds elsewhere.',
        ],
      },
    ],
  },
};

export function NotePage() {
  const { id } = useParams<{ id: string }>();
  const note = id ? FIELD_NOTES[id] : undefined;

  if (!note) {
    return <NotFoundScreen />;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10 font-sans-clean space-y-8 text-[var(--color-ink-primary)]">
      <SEO
        title={`${note.title} — Field Notes`}
        description={note.excerpt}
        canonicalPath={`/notes/${note.id}`}
      />

      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between font-mono-tactile">
        <Link
          to="/#field-notes"
          className="h-[38px] px-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] text-[13px] font-[600] hover:bg-[var(--color-paper-hover)] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field Notes</span>
        </Link>

        <span className="text-[11px] font-[600] tracking-[0.08em] uppercase px-3 py-1 rounded-none bg-[var(--color-paper-card)] text-[var(--color-ink-secondary)]">
          {note.readingTime}
        </span>
      </div>

      {/* Article Card */}
      <article className="rounded-none bg-[var(--color-paper-surface)] p-6 md:p-10 shadow-[var(--shadow-lg)] border border-[var(--color-paper-border)] space-y-8">
        {/* Hero Image */}
        <div className="w-full aspect-[16/9] overflow-hidden rounded-none border border-[var(--color-paper-border)] bg-[var(--color-paper-card)]">
          <img
            src={note.image}
            alt={note.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata Row */}
        <div className="flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em]">
          <span className="px-2.5 py-0.5 rounded-none bg-[#2E5B3F]/15 text-[#44805A] dark:text-[#2D6A4F] border border-[#2E5B3F]/40 font-[600]">
            {note.tag}
          </span>
          <span className="text-[var(--color-ink-secondary)]">{note.date}</span>
        </div>

        {/* Headline & Excerpt */}
        <div className="space-y-4 border-b border-[var(--color-paper-border)] pb-8">
          <h1 className="font-serif-editorial text-[32px] md:text-[44px] font-[600] tracking-tight leading-[1.02]">
            {note.title}
          </h1>
          <p className="text-[16px] text-[var(--color-ink-secondary)] leading-relaxed font-[500]">
            {note.excerpt}
          </p>
        </div>

        {/* Body Sections */}
        <div className="space-y-8">
          {note.body.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="font-serif-editorial text-[22px] font-[600] tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1B4D3E] dark:text-[#2D6A4F]" />
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-[15px] leading-[1.8] text-[var(--color-ink-primary)]/90"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="pt-6 border-t border-[var(--color-paper-border)] flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-tertiary)]">
            RECLAIMR EDITORIAL DESK
          </span>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 h-[42px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] text-[13px] font-[600] hover:bg-black transition-colors"
          >
            <span>Run Your Own Audit</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}

export default NotePage;