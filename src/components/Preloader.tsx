import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export interface PreloaderProps {
  onComplete?: () => void;
}

/**
 * Preloader Component
 * Rendered once per session (sessionStorage).
 * Theme-adaptive canvas background, ink Fraunces-italic percent counter (0 -> 100 over ~1.2s),
 * cycling words ("detect / cancel / grow"), and a clip-path curtain wipe up (700ms).
 * Skipped entirely when prefers-reduced-motion is active or already shown in session.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [cyclingWord, setCyclingWord] = useState<string>('detect');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Skip on reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldRender(false);
      onComplete?.();
      return;
    }

    // 2. Run once per session via sessionStorage
    const hasSeenPreloader = sessionStorage.getItem('reclaimr_preloader_shown');
    if (hasSeenPreloader) {
      setShouldRender(false);
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Lock body scroll during preloader presentation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const progressObj = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('reclaimr_preloader_shown', 'true');
          document.body.style.overflow = originalOverflow;
          setShouldRender(false);
          onComplete?.();
        },
      });

      // 0 -> 100 counter over ~1.2s with word cycling
      tl.to(progressObj, {
        val: 100,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const currentVal = Math.floor(progressObj.val);
          setCounter(currentVal);
          if (currentVal < 33) {
            setCyclingWord('detect');
          } else if (currentVal < 66) {
            setCyclingWord('cancel');
          } else {
            setCyclingWord('grow');
          }
        },
      });

      // Brief hold at 100%
      tl.to({}, { duration: 0.1 });

      // Clip-path curtain wipe up over 700ms with smooth expo.out curve
      tl.to(container, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.7,
        ease: 'expo.out',
      });
    }, container);

    return () => {
      ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Application loading screen"
      aria-live="polite"
      className="fixed inset-0 z-[99999] flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-canvas text-fg select-none"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Top Header Information */}
      <div className="flex items-center justify-between border-b border-fg/15 pb-4">
        <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.12em] text-fg-2">
          RECLAIMR / MONETARY CONTROL
        </span>
        <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-[0.12em] text-fg-2">
          SYS.INIT // 2026
        </span>
      </div>

      {/* Center Animated Counter */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline space-x-2">
          <span className="font-display italic text-[80px] sm:text-[120px] md:text-[160px] leading-none font-[600] tracking-tighter text-fg">
            {counter}
          </span>
          <span className="font-display italic text-[36px] sm:text-[48px] md:text-[64px] text-fg-2 font-[400]">
            %
          </span>
        </div>

        {/* Cycling Word Subtext */}
        <div className="mt-4 h-8 overflow-hidden">
          <span className="font-sans-ui text-[14px] sm:text-[16px] uppercase tracking-[0.25em] font-[600] text-fg-2 inline-block transition-transform duration-200">
            [{cyclingWord}]
          </span>
        </div>
      </div>

      {/* Bottom Footer Information */}
      <div className="flex items-center justify-between border-t border-fg/15 pt-4 font-mono-tactile text-[11px] uppercase tracking-[0.1em] text-fg-3">
        <span>ZOMBIE SUB DETECTOR</span>
        <span>AUTOMATED SIP DIVERSION</span>
      </div>
    </div>
  );
}

export default Preloader;
