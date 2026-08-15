import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

/**
 * CookieConsentBanner Component
 * Features:
 * - Minimal bottom-left floating hairline card
 * - Text: "We use cookies only to keep the rot out."
 * - Accept / No thanks buttons
 * - Persists decision in localStorage ('reclaimr_cookie_consent')
 * - Gates analytics tracking on user acceptance
 */
export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('reclaimr_cookie_consent');
    if (!consent) {
      // Delay presentation slightly for editorial entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('reclaimr_cookie_consent', 'accepted');
    setIsVisible(false);
    trackEvent('cookie_consent', { decision: 'accepted' });
  };

  const handleDecline = () => {
    localStorage.setItem('reclaimr_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Privacy Consent"
      className="fixed bottom-6 left-6 z-[250] max-w-[380px] p-5 rounded-none bg-surface/95 border border-fg/14 backdrop-blur-md shadow-2xl text-fg select-none"
    >
      <div className="space-y-3 font-sans-ui">
        {/* Header Metadata */}
        <div className="flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-[#2E5B3F]">
          <div className="flex items-center gap-2">
            <Cookie className="w-3.5 h-3.5 text-[#2E5B3F]" />
            <span>COOKIE TELEMETRY</span>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-fg-2" />
        </div>

        {/* Copy */}
        <p className="font-display font-[600] text-[15px] leading-snug text-fg">
          “We use cookies only to keep the rot out.”
        </p>

        <p className="text-[12px] leading-relaxed text-fg-2">
          Privacy telemetry only. Zero data sales, zero cloud profile sync, zero third-party ads.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 py-2 px-4 rounded-none bg-[#2E5B3F] hover:bg-[#44805A] text-fg font-sans-ui text-[12px] font-[600] tracking-tight transition-colors cursor-pointer shadow-md"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="py-2 px-4 rounded-none border border-fg/14 text-fg-2 hover:text-fg hover:border-fg/30 font-sans-ui text-[12px] font-[600] tracking-tight transition-colors cursor-pointer"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
