import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin once on initial load
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Module-level pointer to active Lenis instance for standalone scrollTo() function
let globalLenisInstance: Lenis | null = null;

const LenisContext = createContext<Lenis | null>(null);

export interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * MotionProvider initializes Lenis smooth scrolling with lerp: 0.09
 * and synchronizes animation frames with the GSAP ticker.
 * Gated strictly behind prefers-reduced-motion check.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip Lenis entirely when user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis with smooth lerp: 0.09
    const lenis = new Lenis({
      lerp: 0.09,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    globalLenisInstance = lenis;
    setLenisInstance(lenis);

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker to drive Lenis RAF
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      globalLenisInstance = null;
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * Custom hook to access the active Lenis smooth scroll instance
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * scrollTo helper function
 * Smoothly scrolls to element specified by ID or CSS selector.
 * Fallbacks to instant/native scroll if prefers-reduced-motion is active or Lenis is disabled.
 */
export function scrollTo(
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number }
) {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof target === 'number') {
    if (prefersReducedMotion) {
      window.scrollTo({ top: target, behavior: 'auto' });
      return;
    }

    if (globalLenisInstance) {
      globalLenisInstance.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
      });
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
    return;
  }

  let element: HTMLElement | null = null;
  if (typeof target === 'string') {
    const cleanId = target.startsWith('#') ? target.slice(1) : target;
    element = document.getElementById(cleanId) || document.querySelector<HTMLElement>(target);
  } else {
    element = target;
  }

  if (!element) return;

  if (prefersReducedMotion) {
    element.scrollIntoView({ behavior: 'auto' });
    return;
  }

  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(element, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
    });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export { gsap, ScrollTrigger };
