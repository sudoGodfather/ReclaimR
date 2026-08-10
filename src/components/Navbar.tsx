import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Shield, TrendingUp, Bell, PieChart, Info, Layers, Moon, Sun, Menu, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Shield, activeClass: 'bg-brass text-ink-static' },
  { to: '/subscriptions', label: 'Subscriptions', icon: Layers, activeClass: 'bg-brass text-ink-static' },
  { to: '/goals', label: 'Goals Garden', icon: TrendingUp, activeClass: 'bg-jade text-ink-static' },
  { to: '/alerts', label: 'Alerts', icon: Bell, activeClass: 'bg-terra text-on-accent' },
  { to: '/reports', label: 'Reports', icon: PieChart, activeClass: 'bg-blue text-on-accent' },
  { to: '/how-it-works', label: 'How It Works', icon: Info, activeClass: 'bg-blue text-on-accent' },
];

const linkBase =
  'px-3 py-2 text-xs font-mono font-black uppercase border-2 border-ink flex items-center gap-1.5 transition-all';
const linkIdle =
  'bg-surface hover:bg-muted shadow-[2px_2px_0px_0px_var(--color-shadow)]';
const linkActive =
  'shadow-[3px_3px_0px_0px_var(--color-shadow)] -translate-x-px -translate-y-px';

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const { activeAlerts, totalRotMonthly, totalDivertedMonthly } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg border-b-4 border-ink shadow-[0_4px_0_0_var(--color-shadow)]">
      {/* Ticker strip */}
      <div className="bg-ink-dark text-brass font-mono text-xs py-1.5 px-4 overflow-hidden border-b-2 border-ink flex items-center justify-between font-bold tracking-wider">
        <div className="flex items-center gap-3 animate-pulse">
          <span className="bg-terra text-on-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border border-on-dark">
            LIVE ROT AUDIT
          </span>
          <span>⚡ INDIA BLEEDS ₹4,500 CR/YR IN ZOMBIE SUBSCRIPTIONS</span>
          <span className="hidden md:inline">| ROT PREVENTED TODAY: ₹1,48,500</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-black uppercase">
          <span className="text-jade">AUTONOMOUS DIVERTER: ACTIVE</span>
          <Link
            to="/how-it-works"
            className="hover:underline text-brass bg-ink-lift px-2 py-0.5 border border-ink-line"
          >
            JUDGES DEMO MODE ↗
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 text-left group">
          <div className="w-11 h-11 bg-brass border-3 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] flex items-center justify-center text-ink-static font-black text-2xl group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter text-ink uppercase leading-none font-mono">
                RECLAIM<span className="bg-terra text-on-accent px-1">R</span>
              </span>
              <span className="hidden sm:inline-block bg-blue text-on-accent text-[10px] font-mono font-bold px-1.5 py-0.5 border border-ink uppercase">
                v3.0
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-text font-mono tracking-tight uppercase">
              Stop the Rot, Start the Growth
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center flex-wrap gap-2 sm:gap-3" aria-label="Primary">
          {navItems.map(({ to, label, icon: Icon, activeClass }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? `${activeClass} ${linkActive}` : linkIdle}`
              }
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{label}</span>
              {to === '/alerts' && activeAlerts.length > 0 && (
                <span
                  className="w-2 h-2 bg-terra rounded-full animate-ping border border-ink absolute -top-1 -right-1"
                  aria-label={`${activeAlerts.length} unread alerts`}
                />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Rot summary badge (desktop) */}
        <div className="hidden lg:flex items-center gap-3 bg-surface border-2 border-ink p-1.5 shadow-[3px_3px_0px_0px_var(--color-shadow)]">
          <div className="bg-crimson text-on-accent font-mono text-xs font-black px-2 py-1 flex items-center gap-1">
            <span>ROT:</span>
            <span>₹{totalRotMonthly.toLocaleString('en-IN')}/m</span>
          </div>
          <div className="bg-jade text-ink-static font-mono text-xs font-black px-2 py-1 flex items-center gap-1">
            <span>DIVERTED:</span>
            <span>₹{totalDivertedMonthly.toLocaleString('en-IN')}/m</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 bg-surface text-ink border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] hover:bg-muted transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5" aria-hidden="true" />
              : <Moon className="w-5 h-5" aria-hidden="true" />}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-10 h-10 bg-ink-dark text-brass border-2 border-ink shadow-[3px_3px_0px_0px_var(--color-shadow)] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
          >
            {mobileOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t-4 border-ink bg-surface px-4 py-3 space-y-2"
          aria-label="Mobile navigation"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-xs font-mono font-black uppercase border-2 border-ink ${
                  isActive ? 'bg-brass text-ink-static' : 'bg-bg hover:bg-muted'
                }`
              }
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{label}</span>
              {to === '/alerts' && activeAlerts.length > 0 && (
                <span className="ml-auto bg-terra text-on-accent px-1.5 py-0.5 text-[10px] font-black border border-ink">
                  {activeAlerts.length}
                </span>
              )}
            </NavLink>
          ))}
          <div className="flex gap-2 pt-2 border-t-2 border-ink">
            <div className="flex-1 bg-crimson text-on-accent font-mono text-xs font-black px-2 py-1 text-center">
              ROT: ₹{totalRotMonthly.toLocaleString('en-IN')}/m
            </div>
            <div className="flex-1 bg-jade text-ink-static font-mono text-xs font-black px-2 py-1 text-center">
              DIVERTED: ₹{totalDivertedMonthly.toLocaleString('en-IN')}/m
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
