import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

/**
 * LanguageToggle Component
 * Allows switching between English ('en') and Hindi ('hi').
 * Updates react-i18next state, persists in localStorage, and updates <html lang>.
 */
export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    trackEvent('language_toggle', { lang: nextLang });
    trackEvent('cta_click', { target: 'language_toggle', lang: nextLang });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle Language (English / Hindi)"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-surface border border-fg/14 text-fg font-mono-tactile text-[11px] font-[600] hover:bg-prominent hover:text-prominent-fg transition-colors cursor-pointer"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === 'en' ? 'EN' : 'HI'}</span>
      <span className="opacity-40">|</span>
      <span className="opacity-60">{currentLang === 'en' ? 'हिंदी' : 'ENG'}</span>
    </button>
  );
}

export default LanguageToggle;
