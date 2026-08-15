import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor Component
 * Features an 8px dot + 36px trailing ring with mix-blend-difference.
 * Uses requestAnimationFrame lerp follow.
 * Scales the ring 1.6x when hovering over interactive elements (a, button, [data-hover]).
 * Automatically disabled when (pointer: coarse) or prefers-reduced-motion is active.
 */
export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isCoarse && !reducedMotion;
  });

  const targetPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const isHoveredRef = useRef<boolean>(false);
  const isMouseDownRef = useRef<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const checkMedia = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsEnabled(!isCoarse && !reducedMotion);
    };

    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    coarseQuery.addEventListener('change', checkMedia);
    motionQuery.addEventListener('change', checkMedia);

    return () => {
      coarseQuery.removeEventListener('change', checkMedia);
      motionQuery.removeEventListener('change', checkMedia);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handlePointerMove = (e: PointerEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isHovered = Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-hover]') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('label')
      );

      isHoveredRef.current = isHovered;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isMouseDownRef.current = true;
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    const renderLoop = () => {
      // Direct positioning for center dot
      dotPos.current.x = targetPos.current.x;
      dotPos.current.y = targetPos.current.y;

      // rAF Lerp follow for 36px ring (0.12 smooth lerp)
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.12;

      const isHovered = isHoveredRef.current;
      const isDown = isMouseDownRef.current;

      if (dotRef.current) {
        const dotScale = isDown ? 0.7 : 1;
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      if (ringRef.current) {
        // Ring scales 1.6x over a, button, [data-hover]
        const ringScale = isDown ? 1.2 : isHovered ? 1.6 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* 8px Precision Center Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
        className="fixed top-0 left-0 w-2 h-2 rounded-none bg-black dark:bg-white pointer-events-none z-[99999] will-change-transform"
      />

      {/* 36px Outer Trailing Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-none border border-black dark:border-white pointer-events-none z-[99998] will-change-transform transition-transform duration-150 ease-out"
      />
    </>
  );
};

export default CustomCursor;
