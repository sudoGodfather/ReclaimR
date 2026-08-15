import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme, type Theme } from '../useTheme';

interface NavbarProps {
  theme?: Theme;
  onToggleTheme?: () => void;
}

/**
 * Navbar Component — "Two Hover" floating glass design
 * - Big glass pill: wordmark + nav links (Overview → Audit Studio) + CTA
 * - Small glass pill: liquid-glass 3-option theme switcher (light / dark / dim)
 * - Pills stack vertically on <lg, sit side-by-side on lg+
 * - Hide on scroll down, show on scroll up / when still
 */
export const Navbar: React.FC<NavbarProps> = ({ theme: externalTheme, onToggleTheme: externalToggle }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { theme, setTheme } = useTheme();

  const activeTheme = externalTheme ?? theme;

  const handleSelectTheme = (next: Theme) => {
    if (externalToggle) {
      externalToggle();
    } else {
      setTheme(next);
    }
  };

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/dashboard', label: 'Control Deck' },
    { to: '/subscriptions', label: 'Stash Ledger' },
    { to: '/goals', label: 'Goals Garden' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/states', label: 'Audit Studio' },
  ];

  // Smart visibility: hidden only while actively scrolling down;
  // always appears when still, scrolling up, or near the top.
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let stillTimer: number | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Actively scrolling down past 140px → hide to maximize reading space
      if (currentScrollY > 140 && currentScrollY > lastScrollY + 4) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY - 4 || currentScrollY <= 80) {
        // Scrolling up or near top → show
        setIsHidden(false);
      }

      // User goes still → nav reappears after a short pause
      if (stillTimer) window.clearTimeout(stillTimer);
      stillTimer = window.setTimeout(() => {
        setIsHidden(false);
      }, 250);

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (stillTimer) window.clearTimeout(stillTimer);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[var(--z-header)] transition-transform duration-300 ease-out ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Liquid-glass RGB-split SVG filter — referenced by .liquid-nav via backdrop-filter: url(#glass-filter-_r_b_) */}
      <svg
        className="glass-surface__filter"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="glass-filter-_r_b_"
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" seed="11" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" result="dispRed" scale="-20" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
            <feDisplacementMap in="SourceGraphic" in2="map" result="dispGreen" scale="-24" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
            <feDisplacementMap in="SourceGraphic" in2="map" result="dispBlue" scale="-28" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation="3" />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-2.5 px-3 pt-2.5 lg:pt-3">
        {/* Big glass pill: wordmark + nav links + CTA */}
        <div className="liquid-nav rounded-none h-[52px] pl-4 pr-1.5 flex items-center gap-2.5 md:gap-3 lg:gap-5 border border-fg/10">
          <Link
            to="/"
            aria-label="ReclaimR Homepage"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <span className="font-display italic text-[21px] sm:text-[22px] lg:text-[24px] font-[600] tracking-tight text-fg group-hover:text-[#44805A] transition-colors">
              ReclaimR
            </span>
          </Link>

          {/* Editorial Nav Links */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-5 font-sans-ui text-[13px] font-[500]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`transition-colors duration-150 ${
                    isActive
                      ? 'text-fg font-[600] border-b border-transparent pb-0.5 bg-[linear-gradient(90deg,#2E5B3F,#C24A2E)] bg-no-repeat bg-[length:100%_2px] bg-[position:0_100%]'
                      : 'text-fg-2 hover:text-fg'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Magnetic "Get early access" Button */}
          <Magnetic>
            <Link
              to="/onboarding"
              data-cursor-label="ACCESS"
              aria-label="Get early access to ReclaimR"
              className="btn-premium hidden sm:inline-flex items-center gap-1.5 h-[36px] px-3.5 lg:px-4 text-prominent-fg font-sans-ui font-[600] text-[13px] tracking-tight shadow-md shrink-0"
            >
              <span>Get early access</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-prominent-fg" />
            </Link>
          </Magnetic>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-none bg-prominent/10 flex items-center justify-center text-fg cursor-pointer shrink-0"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Small glass pill: liquid-glass theme switcher */}
        <div className="liquid-nav rounded-none p-1 flex items-center justify-center border border-fg/10">
          <ThemeSwitcher theme={activeTheme} onSelect={handleSelectTheme} />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-[124px] left-4 right-4 z-50">
          <div className="rounded-none liquid-nav border border-fg/14 p-6 space-y-4 font-sans-ui text-fg">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[14px] font-[600] text-fg-2 hover:text-fg py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-fg/14">
              <Link
                to="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-none bg-prominent text-prominent-fg font-[600] text-[13px] text-center shadow-lg transition-all duration-250 ease-[var(--ease-premium)] hover:-translate-y-[1px] hover:shadow-xl active:scale-[0.97]"
              >
                <span>Get early access</span>
                <ArrowUpRight className="w-4 h-4 text-prominent-fg" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;