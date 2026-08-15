import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Check if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Number counter animation hook using ease-out interpolation
 */
export function useNumberCounter(
  targetValue: number,
  durationMs: number = 1500,
  startOnScroll: boolean = true,
): { value: number; ref: React.RefObject<HTMLDivElement | null> } {
  const [value, setValue] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion) {
      setValue(targetValue);
      return;
    }

    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOut * targetValue);
        setValue(current);

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    };

    if (!startOnScroll) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetValue, durationMs, startOnScroll, isReducedMotion]);

  return { value, ref };
}

/**
 * Parallax Y-offset scroll hook
 */
export function useParallax(speed: number = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => -(speed * 100),
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, isReducedMotion]);

  return ref;
}

/**
 * Section scroll progress hook (returns 0.0 to 1.0)
 */
export function useSectionProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const isReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isReducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setProgress(self.progress),
      });
    }, ref);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return { ref, progress };
}
