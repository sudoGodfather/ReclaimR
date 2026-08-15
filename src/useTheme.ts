import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'dim';

const STORAGE_KEY = 'reclaimr-theme';
const THEMES: Theme[] = ['light', 'dark', 'dim'];

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'dim') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark' || theme === 'dim');
    document.documentElement.classList.toggle('dim', theme === 'dim');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore storage errors */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' || t === 'dim' ? 'light' : 'dark'));

  return { theme, setTheme, toggleTheme };
}
