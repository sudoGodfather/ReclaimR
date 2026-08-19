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
  foldProgress: number; // 0.0 (flat folded on ground) -> 1.0 (fully unfolded 3D cube)
  targetFold: number;
  foldVelocity: number;
  glow: number;
  targetGlow: number;
}

export const InteractiveBoxesBackground: React.FC<InteractiveBoxesBackgroundProps> = ({
  className = '',
  maxElevation = 68,
  boxSize = 76,
  gap = 20,
  interactiveRadius = 250,
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

    // Theme configuration
    const getThemeConfig = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const isDim = document.documentElement.classList.contains('dim');

      if (!isDark && !isDim) {
        // LIGHT THEME
        return {
          isLight: true,
          crosshair: 'rgba(12, 14, 11, 0.16)',
          basePlateFill: 'rgba(235, 240, 246, 0.6)',
          basePlateStroke: 'rgba(15, 23, 42, 0.14)',
          topFaceGrad: ['#FFFFFF', '#E6EDF5'],
          topFaceBevel: 'rgba(15, 23, 42, 0.55)',
          topFaceBevelGlow: 'rgba(0, 180, 216, 0.3)',
          leftFaceGrad: ['#DCE2E9', '#CAD3DE'],
          leftFaceStroke: 'rgba(15, 23, 42, 0.15)',
          rightFaceGrad: ['#C5CED9', '#B2BECB'],
          rightFaceStroke: 'rgba(15, 23, 42, 0.18)',
          ridgeColor: 'rgba(15, 23, 42, 0.3)',
          neonStop1: '#0096C7', // Vivid Cyan
          neonStop2: '#023E8A', // Deep Blue
          neonStop3: '#7209B7', // Royal Purple
          neonStop4: '#D81159', // Vivid Pink
        };
      }

      if (isDim) {
        // DIM THEME
        return {
          isLight: false,
          crosshair: 'rgba(224, 106, 69, 0.22)',
          basePlateFill: 'rgba(18, 19, 25, 0.6)',
          basePlateStroke: 'rgba(255, 255, 255, 0.08)',
          topFaceGrad: ['#22232B', '#14151C'],
          topFaceBevel: 'rgba(255, 255, 255, 0.85)',
          topFaceBevelGlow: 'rgba(224, 106, 69, 0.35)',
          leftFaceGrad: ['#0A0A0F', '#121218'],
          leftFaceStroke: 'rgba(255, 255, 255, 0.08)',
          rightFaceGrad: ['#0E0E14', '#181822'],
          rightFaceStroke: 'rgba(255, 255, 255, 0.1)',
          ridgeColor: 'rgba(255, 255, 255, 0.35)',
          neonStop1: '#00d2ff',
          neonStop2: '#38bdf8',
          neonStop3: '#a855f7',
          neonStop4: '#E06A45',
        };
      }

      // DARK THEME (Matching Spline Reference)
      return {
        isLight: false,
        crosshair: 'rgba(56, 189, 248, 0.24)',
        basePlateFill: 'rgba(10, 11, 16, 0.75)',
        basePlateStroke: 'rgba(255, 255, 255, 0.09)',
        topFaceGrad: ['#1E1F2A', '#0D0E14'],
        topFaceBevel: 'rgba(255, 255, 255, 0.98)',
        topFaceBevelGlow: 'rgba(255, 255, 255, 0.45)',
        leftFaceGrad: ['#06060A', '#0E0E16'],
        leftFaceStroke: 'rgba(255, 255, 255, 0.1)',
        rightFaceGrad: ['#0A0A12', '#141420'],
        rightFaceStroke: 'rgba(255, 255, 255, 0.12)',
        ridgeColor: 'rgba(255, 255, 255, 0.4)',
        neonStop1: '#00d2ff', // Electric Cyan
        neonStop2: '#38bdf8', // Sky Blue
        neonStop3: '#a855f7', // Violet Purple
        neonStop4: '#ec4899', // Hot Pink/Magenta
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

      // Step dimensions (matching the clean density in the reference)
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
              foldProgress: 0, // Starts flat on base plate
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

    const getNeonGradient = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      theme: ReturnType<typeof getThemeConfig>
    ) => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, theme.neonStop1);
      grad.addColorStop(0.35, theme.neonStop2);
      grad.addColorStop(0.7, theme.neonStop3);
      grad.addColorStop(1, theme.neonStop4);
      return grad;
    };

    // Draw base ground layer (Base colour plates + neon perimeter rims + crosshairs)
    const drawBaseLayer = (
      theme: ReturnType<typeof getThemeConfig>,
      boxes: BoxNode[]
    ) => {
      const w = boxSize;
      const h = boxSize * 0.5;
      const halfW = w / 2;
      const quarterH = h / 2;

      // 1. Draw subtle base diamond plates & crosshairs across all grid cells
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const cx = b.x;
        const cy = b.baseY;

        // Ground Diamond Base Plate
        ctx.beginPath();
        ctx.moveTo(cx, cy - quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx - halfW, cy);
        ctx.closePath();

        ctx.fillStyle = theme.basePlateFill;
        ctx.fill();

        ctx.strokeStyle = theme.basePlateStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // 2. Base Neon Rim on Ground (The prominent base colour from the reference)
        const neonGrad = getNeonGradient(ctx, cx - halfW, cy, cx + halfW, cy + quarterH, theme);
        ctx.beginPath();
        ctx.moveTo(cx - halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Crosshair "+" in center if box is not unfolded
        if (b.foldProgress < 0.25) {
          ctx.strokeStyle = theme.crosshair;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 3.5, cy);
          ctx.lineTo(cx + 3.5, cy);
          ctx.moveTo(cx, cy - 3.5);
          ctx.lineTo(cx, cy + 3.5);
          ctx.stroke();
        }
      }
    };

    // Draw static rest frame
    const drawStatic = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const boxes = boxesRef.current;

      drawBaseLayer(theme, boxes);

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

      // Draw the ground base plates and neon perimeter
      drawBaseLayer(theme, boxes);

      // Physics update: Unfolding spring dynamics
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
            // Smooth cosine falloff
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

      // Render unfolding 3D Boxes
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

        ctx.save();
        ctx.globalAlpha = Math.min(fold * 1.4, 1);

        const neonGrad = getNeonGradient(ctx, cx - halfW, topCy, cx + halfW, topCy + quarterH, theme);

        // 1. Left Face (Unfolds from ground base up to top diamond)
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

        // 2. Right Face (Unfolds from ground base up to top diamond)
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

        // 3. Glowing Neon Base Pedestal Edge (The signature under-rim glow)
        ctx.beginPath();
        ctx.moveTo(cx - halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 2.6 * Math.min(fold * 1.2, 1);
        ctx.stroke();

        // 4. Top Face (Diamond lid that pushes up as box unfolds)
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

        // Top Face Bevel Edge
        ctx.save();
        ctx.strokeStyle = theme.topFaceBevel;
        ctx.lineWidth = (theme.isLight ? 1.2 : 1.5) * fold;
        ctx.stroke();
        ctx.restore();

        // 5. Front Center Vertical Crease / Spine
        ctx.beginPath();
        ctx.moveTo(cx, topCy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.strokeStyle = theme.ridgeColor;
        ctx.lineWidth = 0.9 * fold;
        ctx.stroke();

        // 6. Tech Corner Brackets when unfolding (matching the reference styling)
        if (fold > 0.4) {
          const bSize = 6 * fold;
          ctx.strokeStyle = neonGrad;
          ctx.lineWidth = 1.2;

          // Left corner bracket
          ctx.beginPath();
          ctx.moveTo(cx - halfW - bSize, topCy);
          ctx.lineTo(cx - halfW, topCy);
          ctx.lineTo(cx - halfW, topCy - bSize * 0.5);
          ctx.stroke();

          // Right corner bracket
          ctx.beginPath();
          ctx.moveTo(cx + halfW + bSize, topCy);
          ctx.lineTo(cx + halfW, topCy);
          ctx.lineTo(cx + halfW, topCy - bSize * 0.5);
          ctx.stroke();
        }

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
