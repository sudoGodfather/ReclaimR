import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ShieldCheck, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1A1A18] text-white border-t border-white/10 font-sans-clean relative overflow-hidden pt-20 pb-12 selection:bg-[#10B981] selection:text-black">
      
      {/* Background Guillotine Pattern Engraving */}
      <div className="absolute top-0 right-0 w-96 h-96 guillotine-pattern opacity-15 pointer-events-none rounded-bl-none" />

      <div className="max-w-[1120px] mx-auto px-6 space-y-16 relative z-10">
        
        {/* ------------------------------------------------------------------ */}
        {/* TOP EDITORIAL FINAL BRAND STATEMENT & NEWSLETTER / DISCLOSURE        */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-white/10 pb-12">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] text-[#10B981] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>COLOPHON // EDITION 2026</span>
            </div>

            <h2 className="font-serif-editorial text-[36px] sm:text-[54px] font-[600] tracking-tight leading-[0.95] text-white">
              Stop paying for things you forgot.
            </h2>

            <p className="font-serif-editorial text-[22px] italic text-[#10B981] font-[400]">
              Turn subscription rot into compounding equity.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4 font-mono-tactile text-[12px] text-white/70 border-l-0 lg:border-l border-white/10 pl-0 lg:pl-8">
            <div className="space-y-1">
              <span className="text-[10px] font-[600] text-white/40 uppercase tracking-widest block">SECURITY & AUDIT JURISDICTION</span>
              <div className="text-white font-[600]">BOMBAY // 19.0760° N, 72.8777° E</div>
              <div className="text-white/60">RBI Digital AutoPay E-Mandate Compliant</div>
            </div>

            <div className="p-4 rounded-none bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                ON-DEVICE PRIVACY GUARANTEE
              </span>
              <p className="text-[11px] text-white/60 font-sans-clean leading-relaxed">
                ReclaimR processes SMS debit logs locally on your device hardware. Zero cloud credential sync.
              </p>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MIDDLE COLUMNS: NAVIGATION, LEGAL & CONTACT                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono-tactile text-[12px]">
          
          {/* Column 1: 01 DISCOVER */}
          <div className="space-y-3">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">
              01 // DISCOVER
            </span>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Overview Manifesto
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works (Judges Manual)
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Start SMS Audit</span>
                  <ArrowUpRight className="w-3 h-3 text-[#10B981]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: 02 RECLAIM */}
          <div className="space-y-3">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">
              02 // RECLAIM
            </span>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Monetary Control Deck
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-white transition-colors">
                  Stash Ledger (All Subs)
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-white transition-colors">
                  Mandate Rot Warnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 03 GROW & REPORTS */}
          <div className="space-y-3">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">
              03 // GROW & AUDIT
            </span>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/goals" className="hover:text-white transition-colors">
                  Goals Garden & Micro-SIP
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  Monthly Recovery Report
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Settings Control Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL & CONTACT */}
          <div className="space-y-3">
            <span className="text-[10px] font-[600] text-[#10B981] uppercase tracking-widest block">
              04 // LEGAL & CONTACT
            </span>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy & Log Protocol
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:support@reclaimr.in" className="hover:text-white transition-colors text-[#10B981] font-[600]">
                  support@reclaimr.in
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub Repository" className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">
                <Github className="w-4 h-4 text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter Profile" className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn Page" className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* OVERSIZED EDITORIAL BRAND WORDMARK & COPYRIGHT BAR                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="overflow-hidden">
            <div className="font-serif-editorial text-[64px] sm:text-[110px] lg:text-[160px] font-[600] tracking-[-0.04em] leading-none text-white/90 text-center select-none">
              RECLAIMR
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tactile text-[11px] text-white/40 uppercase tracking-widest border-t border-white/5 pt-4">
            <div>© 2026 RECLAIMR TECHNOLOGIES INC. ALL RIGHTS RESERVED.</div>
            <div>COLOPHON SERIAL № RC-2026-COLOPHON</div>
          </div>
        </div>

      </div>
    </footer>
  );
};
