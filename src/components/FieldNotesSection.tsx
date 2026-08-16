import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';

const FIELD_NOTES = [
  {
    id: 'why-we-built-reclaimr',
    tag: 'ESSAY',
    date: '12 FEB 2026',
    title: 'Why We Built ReclaimR: Halting Financial Decay',
    excerpt: 'An investigation into passive monetary leakages across urban Indian households and how local machine learning enforces monetary sovereignty.',
    image: '/notes_why_we_built.jpg',
    href: '/notes/why-we-built-reclaimr',
  },
  {
    id: 'psychology-of-unused-subscriptions',
    tag: 'RESEARCH',
    date: '28 JAN 2026',
    title: 'The Psychology of Unused Subscriptions',
    excerpt: 'Why dark patterns exploit loss aversion and cognitive friction to keep silent e-mandates draining your bank accounts in your sleep.',
    image: '/notes_psychology.jpg',
    href: '/notes/psychology-of-unused-subscriptions',
  },
  {
    id: 'sip-compounding-math',
    tag: 'ALGORITHM',
    date: '14 JAN 2026',
    title: 'The Nifty 50 Micro-SIP Math: ₹2,448/mo → ₹57.4L',
    excerpt: 'A rigorous mathematical breakdown of 15-year monthly compounding at 12% CAGR when diverted from recurring waste into index wealth.',
    image: '/notes_sip_math.jpg',
    href: '/notes/sip-compounding-math',
  },
];

/**
 * FieldNotesSection Component
 * Features:
 * - 3 Dated editorial cards (Why we built ReclaimR / The psychology of unused subs / The SIP math)
 * - Hover Ken Burns image zoom (scale 1.10 over 700ms)
 * - Link stubs to /notes/*
 * - Editorial hairline borders, small-caps dates, and hover moss border shifts
 */
export function FieldNotesSection() {
  return (
    <section
      id="field-notes"
      className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-canvas text-fg relative z-10 border-b border-fg/14 select-none"
    >
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Section Chapter Header */}
        <div className="flex items-center justify-between border-b border-fg/14 pb-6">
          <div>
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.2em] text-[#2E5B3F]">
              CHAPTER 07 // EDITORIAL DISPATCHES
            </span>
            <h2 className="font-display font-[600] text-[clamp(32px,4.5vw,64px)] text-fg tracking-tight mt-1">
              Field Notes
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono-tactile text-[11px] uppercase tracking-[0.15em] text-fg hidden sm:flex">
            <BookOpen className="w-4 h-4 text-[#2E5B3F]" />
            <span>3 ESSAYS & RESEARCH DISPATCHES</span>
          </div>
        </div>

        {/* 3 Dated Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FIELD_NOTES.map((note) => (
            <Link
              key={note.id}
              to={note.href}
              className="group flex flex-col justify-between p-6 rounded-none bg-surface border border-fg/14 hover:border-[#2E5B3F] hover:-translate-y-[2px] hover:shadow-xl transition-all duration-250 ease-[var(--ease-premium)] shadow-lg cursor-pointer focus-visible:ring-2 ring-rust ring-offset-2 outline-none"
            >
              <div className="space-y-6">
                {/* Ken Burns Hover Image Container */}
                <div className="w-full aspect-[16/9] overflow-hidden rounded-none border border-fg/14 bg-canvas">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover brightness-[1.12] saturate-[1.05] transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Metadata Row */}
                <div className="flex items-center justify-between font-mono-tactile text-[11px] uppercase tracking-[0.15em]">
                  <span className="px-2.5 py-0.5 rounded-none bg-[#2E5B3F]/20 text-[#44805A] border border-[#2E5B3F]/40 font-[600]">
                    {note.tag}
                  </span>
                  <span className="text-fg">{note.date}</span>
                </div>

                {/* Title & Excerpt */}
                <div className="space-y-2.5">
                  <h3 className="font-display font-[600] text-[20px] text-fg group-hover:text-[#44805A] transition-colors leading-snug">
                    {note.title}
                  </h3>
                  <p className="font-sans-ui text-[14px] leading-relaxed text-fg line-clamp-3">
                    {note.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Link Stub */}
              <div className="pt-6 mt-6 border-t border-fg/14 flex items-center justify-between font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.15em] text-fg group-hover:text-[#44805A]">
                <span>Read Dispatch</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FieldNotesSection;
