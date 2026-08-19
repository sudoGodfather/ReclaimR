import React, { useEffect, useRef } from 'react';

interface InteractiveBoxesBackgroundProps {
  className?: string;
  maxElevation?: number;
  boxSize?: number;
  gap?: number;
  interactiveRadius?: number;
}

interface BoxNode {
  gx: number;
  gy: number;
  x: number;
  y: number;
  baseY: number;
  foldProgress: number; // 0.0 (hidden on ground) -> 1.0 (unfolded 3D cube)
  targetFold: number;
  foldVelocity: number;
  glow: number;
  targetGlow: number;
}

export const InteractiveBoxesBackground: React.FC<InteractiveBoxesBackgroundProps> = ({
  className = '',
  maxElevation = 64,
  boxSize = 74,
  gap = 20,
  interactiveRadius = 240,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; lastMove: number }>({
    x: -99999,
    y: -99999,
    active: false,
    lastMove: 0,
  });
  const boxesRef = useRef<BoxNode[]>([]);
  const animFrameIdRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Theme color configuration
    const getThemeConfig = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const isDim = document.documentElement.classList.contains('dim');

      if (!isDark && !isDim) {
        // LIGHT THEME
        return {
          isLight: true,
          crosshair: 'rgba(12, 14, 11, 0.15)',
          topFaceGrad: ['#FFFFFF', '#E6EDF5'],
          topFaceBevel: 'rgba(15, 23, 42, 0.65)',
          topFaceGlow: 'rgba(0, 0, 0, 0.1)',
          leftFaceGrad: ['#DCE2E9', '#CAD3DE'],
          leftFaceStroke: 'rgba(15, 23, 42, 0.18)',
          rightFaceGrad: ['#C5CED9', '#B2BECB'],
          rightFaceStroke: 'rgba(15, 23, 42, 0.2)',
          ridgeColor: 'rgba(15, 23, 42, 0.35)',
          basePedestalStroke: 'rgba(15, 23, 42, 0.25)',
          underglow: 'rgba(0, 0, 0, 0.08)',
        };
      }

      if (isDim) {
        // DIM THEME
        return {
          isLight: false,
          crosshair: 'rgba(255, 255, 255, 0.15)',
          topFaceGrad: ['#22232B', '#14151C'],
          topFaceBevel: 'rgba(255, 255, 255, 0.9)',
          topFaceGlow: 'rgba(255, 255, 255, 0.25)',
          leftFaceGrad: ['#0A0A0F', '#121218'],
          leftFaceStroke: 'rgba(255, 255, 255, 0.09)',
          rightFaceGrad: ['#0E0E14', '#181822'],
          rightFaceStroke: 'rgba(255, 255, 255, 0.12)',
          ridgeColor: 'rgba(255, 255, 255, 0.35)',
          basePedestalStroke: 'rgba(255, 255, 255, 0.2)',
          underglow: 'rgba(255, 255, 255, 0.06)',
        };
      }

      // DARK THEME (Clean, sleek matte obsidian & silver edges)
      return {
        isLight: false,
        crosshair: 'rgba(56, 189, 248, 0.2)',
        topFaceGrad: ['#1C1D26', '#0C0D12'],
        topFaceBevel: 'rgba(255, 255, 255, 0.95)',
        topFaceGlow: 'rgba(255, 255, 255, 0.35)',
        leftFaceGrad: ['#06060A', '#0D0E14'],
        leftFaceStroke: 'rgba(255, 255, 255, 0.09)',
        rightFaceGrad: ['#0A0A10', '#12131A'],
        rightFaceStroke: 'rgba(255, 255, 255, 0.12)',
        ridgeColor: 'rgba(255, 255, 255, 0.4)',
        basePedestalStroke: 'rgba(255, 255, 255, 0.25)',
        underglow: 'rgba(255, 255, 255, 0.08)',
      };
    };

    const setupScene = () => {
      const container = containerRef.current || canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Clean sparse grid spacing matching the Spline reference
      const stepW = 120;
      const stepH = 60;

      const originX = width / 2;
      const originY = height * 0.38;

      const cols = Math.ceil(width / stepW) + 4;
      const rows = Math.ceil(height / stepH) + 6;

      const boxes: BoxNode[] = [];

      for (let gy = -Math.floor(rows / 2) - 1; gy <= Math.floor(rows / 2) + 2; gy++) {
        for (let gx = -Math.floor(cols / 2) - 1; gx <= Math.floor(cols / 2) + 1; gx++) {
          const screenX = originX + (gx - gy) * (stepW / 2);
          const screenY = originY + (gx + gy) * (stepH / 2);

          if (screenX > -boxSize && screenX < width + boxSize && screenY > -boxSize && screenY < height + boxSize) {
            boxes.push({
              gx,
              gy,
              x: screenX,
              y: screenY,
              baseY: screenY,
              foldProgress: 0,
              targetFold: 0,
              foldVelocity: 0,
              glow: 0,
              targetGlow: 0,
            });
          }
        }
      }

      // Sort back-to-front for proper 3D isometric layering
      boxes.sort((a, b) => {
        const depthA = a.gx + a.gy;
        const depthB = b.gx + b.gy;
        if (depthA !== depthB) return depthA - depthB;
        return a.y - b.y;
      });

      boxesRef.current = boxes;
      drawStatic();
    };

    // Draw static rest frame (only clean crosshair dots "+", NO noisy colored diamonds)
    const drawStatic = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const boxes = boxesRef.current;

      ctx.lineWidth = 1;
      ctx.strokeStyle = theme.crosshair;
      ctx.beginPath();
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        ctx.moveTo(b.x - 3.5, b.baseY);
        ctx.lineTo(b.x + 3.5, b.baseY);
        ctx.moveTo(b.x, b.baseY - 3.5);
        ctx.lineTo(b.x, b.baseY + 3.5);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Render loop with unfolding 3D box dynamics
    const loop = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const mouse = mouseRef.current;
      const boxes = boxesRef.current;
      let hasActiveMotion = false;

      // 1. Draw subtle background crosshairs "+"
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme.crosshair;
      ctx.beginPath();
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.foldProgress < 0.3) {
          ctx.moveTo(b.x - 3.5, b.baseY);
          ctx.lineTo(b.x + 3.5, b.baseY);
          ctx.moveTo(b.x, b.baseY - 3.5);
          ctx.lineTo(b.x, b.baseY + 3.5);
        }
      }
      ctx.stroke();

      // 2. Physics update: Unfolding spring dynamics
      const spring = 0.24;
      const damping = 0.7;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        let tFold = 0;
        let tGlow = 0;

        if (mouse.active) {
          const dx = b.x - mouse.x;
          const dy = (b.baseY - maxElevation * 0.42) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactiveRadius) {
            const factor = Math.cos((dist / interactiveRadius) * (Math.PI / 2));
            const power = Math.pow(Math.max(0, factor), 1.4);

            tFold = power;
            tGlow = power;
          }
        }

        b.targetFold = tFold;
        b.targetGlow = tGlow;

        // Spring integration for unfolding progress
        const foldForce = (b.targetFold - b.foldProgress) * spring;
        b.foldVelocity = (b.foldVelocity + foldForce) * damping;
        b.foldProgress += b.foldVelocity;

        b.glow += (b.targetGlow - b.glow) * 0.2;

        // Snap to zero when settled
        if (Math.abs(b.foldVelocity) < 0.004 && Math.abs(b.targetFold - b.foldProgress) < 0.004) {
          b.foldProgress = b.targetFold;
          b.foldVelocity = 0;
        }

        if (b.foldProgress > 0.01 || Math.abs(b.foldVelocity) > 0.004) {
          hasActiveMotion = true;
        }
      }

      // 3. Render only the unfolding 3D Boxes
      const w = boxSize;
      const h = boxSize * 0.5;
      const halfW = w / 2;
      const quarterH = h / 2;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const fold = Math.max(0, b.foldProgress);

        if (fold < 0.02) continue; // Skip flat folded boxes

        const cx = b.x;
        const baseCy = b.baseY;
        const currentH = maxElevation * fold;
        const topCy = baseCy - currentH;
        const glow = Math.min(Math.max(b.glow, 0), 1);

        ctx.save();
        ctx.globalAlpha = Math.min(fold * 1.4, 1);

        // Soft subtle underglow beneath the popped up box
        if (fold > 0.15) {
          const underglow = ctx.createRadialGradient(cx, baseCy + 5, 2, cx, baseCy + 5, w * 0.9);
          underglow.addColorStop(0, theme.underglow);
          underglow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = underglow;
          ctx.fillRect(cx - w, baseCy - quarterH, w * 2, h * 2);
        }

        // --- A. Left Face ---
        ctx.beginPath();
        ctx.moveTo(cx - halfW, topCy);
        ctx.lineTo(cx, topCy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx - halfW, baseCy);
        ctx.closePath();

        const leftGrad = ctx.createLinearGradient(cx - halfW, topCy, cx, topCy + quarterH);
        leftGrad.addColorStop(0, theme.leftFaceGrad[0]);
        leftGrad.addColorStop(1, theme.leftFaceGrad[1]);
        ctx.fillStyle = leftGrad;
        ctx.fill();

        ctx.strokeStyle = theme.leftFaceStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // --- B. Right Face ---
        ctx.beginPath();
        ctx.moveTo(cx, topCy + quarterH);
        ctx.lineTo(cx + halfW, topCy);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(cx, topCy + quarterH, cx + halfW, topCy);
        rightGrad.addColorStop(0, theme.rightFaceGrad[0]);
        rightGrad.addColorStop(1, theme.rightFaceGrad[1]);
        ctx.fillStyle = rightGrad;
        ctx.fill();

        ctx.strokeStyle = theme.rightFaceStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // --- C. Base Ground Pedestal Line ---
        ctx.beginPath();
        ctx.moveTo(cx - halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.strokeStyle = theme.basePedestalStroke;
        ctx.lineWidth = 1.2 * fold;
        ctx.stroke();

        // --- D. Top Face (Diamond) ---
        ctx.beginPath();
        ctx.moveTo(cx, topCy - quarterH);
        ctx.lineTo(cx + halfW, topCy);
        ctx.lineTo(cx, topCy + quarterH);
        ctx.lineTo(cx - halfW, topCy);
        ctx.closePath();

        const topGrad = ctx.createLinearGradient(cx - halfW, topCy - quarterH, cx + halfW, topCy + quarterH);
        topGrad.addColorStop(0, theme.topFaceGrad[0]);
        topGrad.addColorStop(1, theme.topFaceGrad[1]);
        ctx.fillStyle = topGrad;
        ctx.fill();

        // Top Face Bevel Edge: Crisp white/silver rim
        ctx.save();
        ctx.strokeStyle = theme.topFaceBevel;
        ctx.lineWidth = (theme.isLight ? 1.2 : 1.4) * fold;
        ctx.shadowColor = theme.topFaceGlow;
        ctx.shadowBlur = 3 * glow;
        ctx.stroke();
        ctx.restore();

        // --- E. Front Center Vertical Crease ---
        ctx.beginPath();
        ctx.moveTo(cx, topCy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.strokeStyle = theme.ridgeColor;
        ctx.lineWidth = 0.9 * fold;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();

      if (hasActiveMotion || mouse.active) {
        animFrameIdRef.current = requestAnimationFrame(loop);
        isRunningRef.current = true;
      } else {
        isRunningRef.current = false;
        drawStatic();
      }
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameIdRef.current = requestAnimationFrame(loop);
      }
    };

    setupScene();

    const handleResize = () => {
      setupScene();
    };

    window.addEventListener('resize', handleResize);

    const handleGlobalPointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inBounds =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inBounds) {
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
          lastMove: performance.now(),
        };
        startLoop();
      } else if (mouseRef.current.active) {
        mouseRef.current.active = false;
        mouseRef.current.x = -99999;
        mouseRef.current.y = -99999;
        startLoop();
      }
    };

    window.addEventListener('mousemove', handleGlobalPointerMove, { passive: true });

    const observer = new MutationObserver(() => {
      drawStatic();
      startLoop();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalPointerMove);
    };
  }, [boxSize, maxElevation, interactiveRadius]);

  const handlePointerLeave = () => {
    mouseRef.current = {
      x: -99999,
      y: -99999,
      active: false,
      lastMove: performance.now(),
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      style={{ touchAction: 'none' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    </div>
  );
};

export default InteractiveBoxesBackground;
