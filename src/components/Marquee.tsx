import React from 'react';

export interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // Duration in seconds per cycle
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Marquee Component
 * Renders a continuous infinite horizontal marquee using CSS translateX keyframe animation.
 * Features a duplicated aria-hidden track for zero-gap looping and pause on hover.
 * Automatically disabled when prefers-reduced-motion is active.
 */
export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const isReverse = direction === 'right';

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap select-none group ${className}`}
    >
      <div className="inline-flex w-max shrink-0">
        <div
          className={`flex items-center shrink-0 gap-6 ${
            isReverse ? 'animate-marquee-reverse' : 'animate-marquee'
          } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {children}
        </div>

        <div
          aria-hidden="true"
          className={`flex items-center shrink-0 gap-6 ${
            isReverse ? 'animate-marquee-reverse' : 'animate-marquee'
          } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * EditorialTickerBar Component
 * Preset top bar marquee with "STOP THE ROT • START THE GROWTH •" small caps,
 * rust bullet separators (#C24A2E), and hairline border styling.
 */
export function EditorialTickerBar() {
  const items = Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="flex items-center gap-6 font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.15em] text-fg/80">
      <span>STOP THE ROT</span>
      <span className="text-[#C24A2E] text-[14px] leading-none">•</span>
      <span>START THE GROWTH</span>
      <span className="text-[#C24A2E] text-[14px] leading-none">•</span>
    </div>
  ));

  return (
    <div className="w-full bg-canvas/90 backdrop-blur-md border-b border-fg/14 py-2 relative z-[45]">
      <Marquee speed={28} pauseOnHover={true}>
        {items}
      </Marquee>
    </div>
  );
}

export default Marquee;
