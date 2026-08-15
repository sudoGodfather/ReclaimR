import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does ReclaimR ensure my financial data remains 100% safe?',
    a: 'ReclaimR operates strictly through on-device machine learning telemetry. Your SMS logs and bank AutoPay e-mandates are parsed locally on your phone hardware. Zero transaction logs or personal identifiers are ever uploaded to cloud servers or third-party data brokers.',
  },
  {
    q: 'Which Indian banks and UPI PSPs are currently supported?',
    a: 'ReclaimR supports all major Indian banks including HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra Bank, and popular UPI PSP apps like PhonePe, Google Pay, Paytm, and CRED.',
  },
  {
    q: 'Can I use ReclaimR if I don’t have a corporate salary account?',
    a: 'Absolutely. ReclaimR works seamlessly with any Indian savings account, NRE/NRO account, or current account that has active UPI AutoPay or debit mandates registered under your mobile number.',
  },
  {
    q: 'What happens if a subscription service uses dark patterns to resist cancellation?',
    a: 'You never have to deal with merchant dark patterns or retention phone calls. ReclaimR dispatches NPCI-compliant e-mandate revocation orders directly to your bank and UPI PSP, terminating the authorization at the source.',
  },
  {
    q: 'How does ReclaimR pricing work and are there hidden commissions?',
    a: 'ReclaimR is free forever for up to 5 subscriptions. Our Plus tier is ₹149/month for unlimited mandate scanning and automated Nifty 50 SIP compounding. We charge 0% commission on your investment returns.',
  },
  {
    q: 'Is my transaction history ever logged or sold to advertisers?',
    a: 'Never. Our business model is purely subscription-driven, not ad-supported. We do not track, profile, or sell user financial data under any circumstances. Privacy is our core engineering foundation.',
  },
];

/**
 * FaqSection Component
 * 6 Questions (data safety, banks supported, no salary account?, cancellation help, pricing, privacy).
 * Features:
 * - Accordion via grid-template-rows animation (300ms)
 * - Plus icon rotates 45° to form × when open
 * - Single-open behavior
 * - Proper aria-expanded and aria-controls attributes
 */
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-canvas text-fg relative z-10 border-b border-fg/14 select-none"
    >
      <div className="max-w-[1080px] mx-auto space-y-12">
        {/* Chapter Header */}
        <div className="flex items-center justify-between border-b border-fg/14 pb-6">
          <div>
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F]">
              CHAPTER 09 // FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display font-[600] text-[clamp(32px,4.5vw,64px)] text-fg tracking-tight mt-1">
              Clear Clarifications
            </h2>
          </div>
          <span className="font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg-2 hidden sm:inline">
            6 INQUIRIES ANSWERED
          </span>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-fg/14 border-t border-b border-fg/14">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="py-6 transition-colors duration-300">
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                  className="w-full flex items-center justify-between gap-6 text-left group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2E5B3F] rounded-none p-2"
                >
                  <span className="font-display font-[600] text-[18px] sm:text-[22px] text-fg group-hover:text-[#44805A] transition-colors leading-snug">
                    {item.q}
                  </span>

                  <div className="p-2 rounded-none bg-surface border border-fg/14 text-fg shrink-0 group-hover:border-[#2E5B3F] transition-colors">
                    <Plus
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-[#C24A2E]' : 'rotate-0 text-fg'
                      }`}
                    />
                  </div>
                </button>

                {/* Grid Template Rows 0fr -> 1fr Animation (300ms) */}
                <div
                  id={`faq-content-${idx}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-premium)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans-ui text-[15px] sm:text-[16px] leading-[1.7] text-fg-2 pt-4 pr-12">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
