import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { LanguageToggle } from './LanguageToggle';
import { scrollTo } from '../lib/motion';
import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'Overview', href: '#manifesto' },
      { label: 'The Method', href: '#method' },
      { label: 'Leak Calculator', href: '#calculator' },
      { label: 'Privacy Telemetry', href: '#faq' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'Manifesto', href: '#manifesto' },
      { label: 'Field Reports', href: '#field-reports' },
      { label: 'Early Access', href: '#waitlist' },
      { label: 'Dashboard App', href: '/dashboard' },
    ],
  },
  {
    title: 'LEGAL & TRUST',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Sovereignty', href: '#' },
      { label: 'NPCI PSP Compliance', href: '#' },
      { label: 'Security Whitepaper', href: '#' },
      { label: 'On-Device Guarantee', href: '#' },
    ],
  },
];

/**
 * FooterSection Component
 * Features:
 * - Giant outline "RECLAIMR" (text-stroke bone/20) that fills to solid bone on hover
 * - 3 Columns: Product / Company / Legal
 * - "Back to top" magnetic CTA using lenis.scrollTo(0)
 * - Bottom hairline row: "© 2026 ReclaimR · Made in India"
 */
export function FooterSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="w-full pt-24 pb-12 px-6 sm:px-10 md:px-16 bg-canvas text-fg relative z-10 border-t border-fg/14 select-none">
      <div className="max-w-[1280px] mx-auto space-y-16">
        {/* Navigation Columns + Back to Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Columns */}
          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col, idx) => (
              <div key={idx} className="space-y-4 font-mono-tactile">
                <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F] block">
                  {col.title}
                </span>
                <ul className="space-y-2.5 font-sans-ui text-[14px] text-fg-2">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.href.startsWith('#') ? (
                        <button
                          type="button"
                          onClick={() => scrollTo(link.href)}
                          className="hover:text-fg transition-colors text-left cursor-pointer"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link to={link.href} className="hover:text-fg transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Back to Top + LanguageToggle Actions */}
          <div className="md:col-span-3 flex flex-wrap items-center md:justify-end gap-3">
            <LanguageToggle />

            <Magnetic>
              <button
                type="button"
                onClick={() => scrollTo(0)}
                data-cursor-label="TOP"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-none bg-surface border border-fg/14 text-fg hover:bg-prominent hover:text-prominent-fg transition-all shadow-md active:scale-[0.98] cursor-pointer group"
              >
                <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.15em]">
                  Back to top
                </span>
                <ArrowUp className="w-4 h-4 text-fg group-hover:text-prominent-fg transition-colors" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Giant Outline "RECLAIMR" (text-stroke bone/20) that fills on hover */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full text-center overflow-hidden py-4 cursor-pointer group"
        >
          <h1
            className="font-display font-[600] text-[clamp(3.5rem,14vw,12rem)] leading-none tracking-tight transition-[color,WebkitTextStrokeColor] duration-500 uppercase select-none"
            style={{
              WebkitTextStroke: '1.5px var(--color-paper-border)',
              WebkitTextStrokeColor: isHovered ? 'var(--color-forest-green)' : 'var(--color-paper-border)',
              color: isHovered ? 'var(--color-ink-primary)' : 'transparent',
            }}
          >
            RECLAIMR
          </h1>
        </div>

        {/* Bottom Hairline Row: "© 2026 ReclaimR · Made in India" */}
        <div className="pt-8 border-t border-fg/14 flex flex-wrap items-center justify-between gap-4 font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2">
          <span>© 2026 RECLAIMR · MADE IN INDIA</span>
          <span>ON-DEVICE MONETARY SOVEREIGNTY</span>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
