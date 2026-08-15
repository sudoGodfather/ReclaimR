import React, { useEffect, useRef } from 'react';
import { useLenis } from '../lib/motion';

const LEDGER_STRINGS = [
  'NETFLIX −₹649',
  'GYM MANDATE −₹1,750 · IDLE 64D',
  'OTT BUNDLE −₹299',
  'SAAS CLOUD −₹1,499 · IDLE 84D',
  'ICICI AUTOPAY −₹999',
  'STREAMING PRO −₹799 · UNUSED',
  'MAGAZINE SUB −₹399',
  'MUSIC FAMILY −₹209 · IDLE 60D',
  'STORAGE TIER −₹650',
  'NEWS DIGEST −₹499 · IDLE 140D',
  'FITNESS APP −₹1,200',
  'GAMING PASS −₹899 · UNUSED',
];

interface Column {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
  fontSize: number;
}

/**
 * LedgerRainCanvas Component
 * Fixed full-screen HTML5 background canvas rendering columns of monospace zombie subscription charges.
 * Opacity: 0.05-0.08 bone (#F2EFE6).
 * Drifts slowly upward, incorporating Lenis scroll velocity (lenis.velocity * 0.02).
 * DPR-aware, automatically pauses on document.hidden and prefers-reduced-motion.
 */
export function LedgerRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lenis = useLenis();
  const lenisVelocityRef = useRef<number>(0);

  // Sync lenis velocity
  useEffect(() => {
    if (!lenis) return;
    const onScroll = (e: { velocity?: number }) => {
      lenisVelocityRef.current = e.velocity || 0;
    };
    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let columns: Column[] = [];
    let isTabHidden = document.hidden;

    const initCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Columns layout
      const colWidth = 240;
      const numCols = Math.ceil(width / colWidth) + 1;

      columns = [];
      for (let i = 0; i < numCols; i++) {
        const text = LEDGER_STRINGS[i % LEDGER_STRINGS.length];
        columns.push({
          x: i * colWidth + 16,
          y: Math.random() * height,
          speed: 0.35 + Math.random() * 0.25, // 0.35 - 0.6px per frame base upward speed
          text: text,
          opacity: 0.05 + Math.random() * 0.03, // 0.05 - 0.08 opacity bone
          fontSize: 11,
        });
      }
    };

    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    const handleVisibilityChange = () => {
      isTabHidden = document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isTabHidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const scrollVelocity = lenisVelocityRef.current * 0.02;
      const ink =
        getComputedStyle(document.documentElement).getPropertyValue('--color-ink-primary').trim() ||
        '#F2EFE6';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Drift upward: base speed + scroll velocity
        col.y -= col.speed + scrollVelocity;

        // Wrap around vertically
        if (col.y < -40) {
          col.y = height + Math.random() * 40;
          col.text = LEDGER_STRINGS[Math.floor(Math.random() * LEDGER_STRINGS.length)];
        } else if (col.y > height + 50) {
          col.y = -30;
        }

        ctx.globalAlpha = col.opacity;
        ctx.fillStyle = ink;
        ctx.font = `${col.fontSize}px 'SF Mono', ui-monospace, 'JetBrains Mono', monospace`;
        ctx.fillText(col.text, col.x, col.y);
      }
      ctx.globalAlpha = 1;

      // Smooth decay of lenis velocity when scroll stops
      lenisVelocityRef.current *= 0.92;

      animId = requestAnimationFrame(render);
    };

    const handleBurst = () => {
      columns.forEach((col) => {
        col.speed += 8;
        col.opacity = Math.min(0.3, col.opacity * 3);
      });
    };

    window.addEventListener('ledger-rain-burst', handleBurst);
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('ledger-rain-burst', handleBurst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] pointer-events-none"
    />
  );
}

export default LedgerRainCanvas;
