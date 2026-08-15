import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('reclaimr_lang') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Update <html lang> on language switch & persist in localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    localStorage.setItem('reclaimr_lang', lng);
  }
});

// Sync initial html lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLang;
}

export default i18n;
