import React from 'react';

const RECLAIMED_SERVICES = [
  'NETFLIX',
  'AMAZON PRIME',
  'SPOTIFY',
  'CULT.FIT GYM',
  'ADOBE CREATIVE CLOUD',
  'MEDIUM',
  'DISNEY+ HOTSTAR',
  'YOUTUBE PREMIUM',
  'NEW YORK TIMES',
  'PLAYSTATION PLUS',
  'XBOX GAME PASS',
];

/**
 * ReclaimedServicesMarquee Component
 * Continuous marquee of service wordmarks users reclaimed money from.
 * Initial state at 40% opacity, shifts to 100% on hover.
 * Pauses marquee animation on hover.
 */
export function ReclaimedServicesMarquee() {
  return (
    <section className="w-full py-8 bg-canvas border-y border-fg/14 relative z-10 overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-6 mb-4 flex items-center justify-between">
        <span className="font-mono-tactile text-[10px] font-[600] uppercase tracking-[0.2em] text-fg-2">
          POPULAR RECLAIMED SERVICES
        </span>
        <span className="font-mono-tactile text-[10px] uppercase tracking-[0.15em] text-[#C24A2E]">
          100% UNUSED MANDATES REVOKED
        </span>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex group [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-12 sm:gap-16 animate-marquee group-hover:[animation-play-state:paused] pr-12 sm:pr-16">
          {RECLAIMED_SERVICES.map((name, i) => (
            <div
              key={i}
              className="font-mono-tactile text-[14px] sm:text-[16px] font-[600] tracking-[0.25em] uppercase text-fg opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-none bg-[#C24A2E]" />
              <span>{name}</span>
            </div>
          ))}
        </div>

        {/* Duplicated Aria-Hidden Track 2 */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-12 sm:gap-16 animate-marquee group-hover:[animation-play-state:paused] pr-12 sm:pr-16"
        >
          {RECLAIMED_SERVICES.map((name, i) => (
            <div
              key={`dup-${i}`}
              className="font-mono-tactile text-[14px] sm:text-[16px] font-[600] tracking-[0.25em] uppercase text-fg opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-none bg-[#C24A2E]" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReclaimedServicesMarquee;
