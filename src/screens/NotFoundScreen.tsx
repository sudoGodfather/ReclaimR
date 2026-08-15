import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';
import { Magnetic } from '../components/Magnetic';
import { SEO } from '../components/SEO';

/**
 * NotFoundScreen Component (404 Page)
 * Features:
 * - Headline: "This page died of neglect." set in Fraunces bold serif
 * - Glitching rust ZOMBIE badge
 * - Monospace ledger-rain background (<LedgerRainCanvas /> active in App.tsx)
 * - Magnetic CTA "Return Home →" linking to /
 * - On-brand design matching DESIGN.md tokens and hairline borders
 */
export function NotFoundScreen() {
  return (
    <>
      <SEO
        title="404 — Page Died of Neglect"
        description="The requested page route has dissolved into financial decay."
      />

      <div className="w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-canvas text-fg relative z-10 select-none">
        <div className="max-w-[720px] mx-auto space-y-8 p-8 sm:p-12 rounded-none bg-surface/90 border border-fg/14 backdrop-blur-md shadow-2xl flex flex-col items-center">
          {/* Eyebrow + Glitching ZOMBIE Badge */}
          <div className="flex items-center gap-3">
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-fg-2">
              404 // ROUTE UNRESOLVED
            </span>
            <span className="px-3 py-1 rounded-none bg-[#C24A2E]/20 text-[#C24A2E] border border-[#C24A2E]/40 font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] animate-pulse">
              ZOMBIE PAGE
            </span>
          </div>

          {/* Ghost Icon */}
          <div className="p-4 rounded-none bg-[#C24A2E]/10 border border-[#C24A2E]/30 text-[#C24A2E]">
            <Ghost className="w-10 h-10 animate-bounce" />
          </div>

          {/* Heading: "This page died of neglect." */}
          <div className="space-y-3">
            <h1 className="font-display font-[600] text-[clamp(36px,5.5vw,72px)] leading-[1.08] text-fg tracking-tight">
              This page died of neglect.
            </h1>
            <p className="font-sans-ui text-[16px] sm:text-[18px] text-fg-2 max-w-[520px] mx-auto leading-relaxed">
              Like an unremembered debit mandate, this route dissolved into dark-pattern entropy. Reclaim your focus and return home.
            </p>
          </div>

          {/* Magnetic CTA Home */}
          <div className="pt-4 border-t border-fg/14 w-full flex items-center justify-center">
            <Magnetic>
              <Link
                to="/"
                data-cursor-label="HOME"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-none bg-prominent text-prominent-fg font-sans-ui text-[14px] font-[600] tracking-tight hover:bg-[var(--color-prominent-hover)] transition-all shadow-xl active:scale-[0.98]"
              >
                <Home className="w-4 h-4 text-prominent-fg" />
                <span>Return Home →</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundScreen;
