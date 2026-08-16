import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { InvisibleDrainSection } from '../components/InvisibleDrainSection';
import { StickyTwoColumnSection } from '../components/StickyTwoColumnSection';
import { PullQuoteSection } from '../components/PullQuoteSection';
import { InvertedStatsBand } from '../components/InvertedStatsBand';
import { ReclaimedServicesMarquee } from '../components/ReclaimedServicesMarquee';
import { FieldNotesSection } from '../components/FieldNotesSection';
import { WaitlistSection } from '../components/WaitlistSection';
import { FooterSection } from '../components/FooterSection';
import { SEO } from '../components/SEO';

// Lazy Loaded Non-Critical Components
const StackedCardsSection = React.lazy(() => import('../components/StackedCardsSection').then((m) => ({ default: m.StackedCardsSection })));
const LeakCalculator = React.lazy(() => import('../components/LeakCalculator').then((m) => ({ default: m.LeakCalculator })));
const FieldReportsSection = React.lazy(() => import('../components/FieldReportsSection').then((m) => ({ default: m.FieldReportsSection })));
const FaqSection = React.lazy(() => import('../components/FaqSection').then((m) => ({ default: m.FaqSection })));

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-[var(--color-ink-primary)] font-sans-clean selection:bg-[#1B4D3E] selection:text-white relative landing-atmosphere">
      <SEO
        title="ReclaimR — Stop the Rot. Start the Growth."
        description="ReclaimR detects unused debit mandates & forgotten subscriptions on-device, terminates them with 1 tap, and diverts wasted monthly cash into high-yield Nifty 50 SIPs. Zero cloud upload."
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              'name': 'ReclaimR',
              'applicationCategory': 'FinanceApplication',
              'operatingSystem': 'Web, iOS, Android',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'INR',
              },
              'description':
                'Autonomous wealth-protection & micro-diversion agent. Detects unused debit mandates on-device, terminates them with 1 tap, and diverts wasted monthly cash into Nifty 50 SIPs.',
            },
            {
              '@type': 'Organization',
              'name': 'ReclaimR Financial Technologies',
              'url': 'https://reclaimr.app',
              'logo': 'https://reclaimr.app/favicon.svg',
              'slogan': 'Stop paying for subscriptions you forgot. We put your money back in check.',
            },
          ],
        }}
      />
      {/* Hero Section (100svh) */}
      <HeroSection />

      {/* Chapter 01: The Invisible Drain Manifesto (Word-by-word Scrubbing) */}
      <InvisibleDrainSection />

      {/* Chapter 02: Sticky Two-Column Section with Rust Draw-On Underline */}
      <StickyTwoColumnSection />

      {/* Chapter 03: Full-Bleed Editorial Pull Quote */}
      <PullQuoteSection />

      {/* Inverted Stats Band (Bone bg, Ink text) */}
      <InvertedStatsBand />

      <React.Suspense fallback={null}>
        {/* Chapter 03: The Method — Stacked & Pinned Cards (01 Detect, 02 Cancel, 03 Grow) */}
        <StackedCardsSection />

        {/* Chapter 04: Interactive Leak Calculator & Compounding Simulator */}
        <LeakCalculator />

        {/* Chapter 05: User Field Reports */}
        <FieldReportsSection />
      </React.Suspense>

      {/* Popular Reclaimed Services Marquee */}
      <ReclaimedServicesMarquee />

      {/* Chapter 07.5: Editorial Field Notes */}
      <FieldNotesSection />

      {/* Chapter 08: Early Access Protocol Waitlist */}
      <WaitlistSection />

      <React.Suspense fallback={null}>
        {/* Chapter 09: Frequently Asked Questions */}
        <FaqSection />
      </React.Suspense>

      {/* Chapter 10: Editorial Footer Section */}
      <FooterSection />
    </div>
  );
};