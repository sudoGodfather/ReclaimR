import { useEffect, useRef } from 'react';
import { useToast } from './Toast';

/**
 * EasterEggRotListener Component
 * Features:
 * - Listens for user typing "rot" anywhere on the page
 * - Gated strictly behind prefers-reduced-motion and touch device (pointer: coarse) checks
 * - Ignores keypresses inside input, textarea, select, or editable elements
 * - Triggers 1.5s hue-rotate glitch burst on body + ledger rain canvas burst event
 * - Shows toast: "The rot stops here."
 */
export function EasterEggRotListener() {
  const { toast } = useToast();
  const bufferRef = useRef<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disabled on reduced motion and coarse touch devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || isReducedMotion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses inside text inputs, textareas, or contenteditables
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;

      bufferRef.current = [...bufferRef.current.slice(-2), key];
      const typedString = bufferRef.current.join('');

      if (typedString === 'rot') {
        bufferRef.current = [];

        // Trigger 1.5s Glitch Burst
        document.body.classList.add('glitch-burst-active');
        window.dispatchEvent(new CustomEvent('ledger-rain-burst'));

        toast('The rot stops here.', 'success');

        setTimeout(() => {
          document.body.classList.remove('glitch-burst-active');
        }, 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  return null;
}

export default EasterEggRotListener;
