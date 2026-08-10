import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Terminal } from 'lucide-react';

const navSections: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Core Navigation',
    links: [
      { to: '/', label: '→ Landing Page' },
      { to: '/onboarding', label: '→ Onboarding Flow' },
      { to: '/dashboard', label: '→ Main Dashboard' },
      { to: '/subscriptions', label: '→ Subscriptions List' },
    ],
  },
  {
    title: 'Execution & Reports',
    links: [
      { to: '/goals', label: '→ Goals Garden' },
      { to: '/alerts', label: '→ Alerts Timeline' },
      { to: '/reports', label: '→ Monthly Recovery Report' },
      { to: '/how-it-works', label: '→ How It Works (Judges Guide)' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-dark text-on-dark border-t-4 border-ink mt-16 font-mono">
      {/* Top banner */}
      <div className="bg-brass text-ink-static font-black py-2 px-4 text-center text-xs tracking-wider border-b-2 border-ink uppercase flex items-center justify-center gap-2">
        <Zap className="w-4 h-4" aria-hidden="true" />
        <span>AUTONOMOUS UPI/SMS SUB-ROT SCRAPER RUNNING ON CLOUD RUN SECURE CONTAINER</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-terra text-on-accent px-2 py-0.5 font-black text-xl border border-on-dark">
              RECLAIMR
            </span>
          </div>
          <p className="text-xs text-muted-on-dark font-sans mb-4">
            India's 1st Wealth-Protection & Micro-Diversion Agent. We automatically scan bank/SMS
            subscriptions, calculate decay, kill unused services, and divert savings into
            high-yield SIPs.
          </p>
          <div className="inline-block bg-ink-lift border border-ink-line p-2 text-[10px] text-muted-on-dark">
            <span className="text-jade">● SYSTEM STATUS:</span> 100% OPERATIONAL
          </div>
        </div>

        {navSections.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h4 className="text-sm font-black uppercase text-brass mb-3 border-b-2 border-ink-line pb-1">
              {section.title}
            </h4>
            <ul className="space-y-2 text-xs">
              {section.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-brass hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="bg-ink-lift border-2 border-brass p-4">
          <div className="flex items-center gap-2 mb-2 text-brass">
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <h5 className="font-black text-xs uppercase">BAUHAUS BRUTALIST SPEC</h5>
          </div>
          <p className="text-[11px] text-muted-on-dark leading-tight mb-3 font-sans">
            Designed for high contrast, instant decision making, and automated micro-diversion to
            transform passive subscription leaks into long-term compounding wealth.
          </p>
          <Link
            to="/how-it-works"
            className="block w-full text-center bg-brass text-ink-static font-black text-xs py-2 uppercase border border-ink hover:bg-surface shadow-[2px_2px_0px_0px_var(--color-on-dark)]"
          >
            VIEW JUDGES ARCHITECTURE ↗
          </Link>
        </div>
      </div>

      <div className="border-t border-ink-line py-4 px-4 text-center text-xs text-muted-on-dark flex flex-wrap justify-between max-w-7xl mx-auto">
        <span>© 2026 RECLAIMR. ALL RIGHTS RESERVED.</span>
        <span className="text-jade font-bold">BUILT FOR HACKATHON DEMO & WEALTH FREEDOM</span>
      </div>
    </footer>
  );
};
