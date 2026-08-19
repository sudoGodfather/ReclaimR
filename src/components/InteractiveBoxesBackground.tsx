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
  foldProgress: number; // 0.0 (flat on ground) -> 1.0 (fully unfolded 3D cube)
  targetFold: number;
}

export const InteractiveBoxesBackground: React.FC<InteractiveBoxesBackgroundProps> = ({
  className = '',
  maxElevation = 64,
  boxSize = 74,
  gap = 20,
  interactiveRadius = 160, // Tightly focused cluster matching the reference
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -99999,
    y: -99999,
    active: false,
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

    // Theme color configuration (100% Solid Opaque Colors)
    const getThemeConfig = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const isDim = document.documentElement.classList.contains('dim');

      if (!isDark && !isDim) {
        // LIGHT THEME (Solid Alabaster & Silver)
        return {
          isLight: true,
          crosshair: 'rgba(12, 14, 11, 0.16)',
          basePlateFill: '#EEF2F6',
          basePlateStroke: 'rgba(15, 23, 42, 0.14)',
          topFaceGrad: ['#FFFFFF', '#E8EDF4'],
          topFaceBevel: 'rgba(15, 23, 42, 0.65)',
          leftFaceGrad: ['#DCE2E9', '#CAD3DE'],
          leftFaceStroke: 'rgba(15, 23, 42, 0.22)',
          rightFaceGrad: ['#C5CED9', '#B2BECB'],
          rightFaceStroke: 'rgba(15, 23, 42, 0.25)',
          ridgeColor: 'rgba(15, 23, 42, 0.35)',
          neonStop1: '#0096C7', // Vivid Cyan
          neonStop2: '#023E8A', // Deep Blue
          neonStop3: '#7209B7', // Royal Purple
          neonStop4: '#D81159', // Vivid Pink
        };
      }

      if (isDim) {
        // DIM THEME (Solid Charcoal)
        return {
          isLight: false,
          crosshair: 'rgba(224, 106, 69, 0.22)',
          basePlateFill: '#14151C',
          basePlateStroke: 'rgba(255, 255, 255, 0.08)',
          topFaceGrad: ['#252632', '#181922'],
          topFaceBevel: 'rgba(255, 255, 255, 0.9)',
          leftFaceGrad: ['#0A0A0F', '#121218'],
          leftFaceStroke: 'rgba(255, 255, 255, 0.12)',
          rightFaceGrad: ['#0E0E14', '#181822'],
          rightFaceStroke: 'rgba(255, 255, 255, 0.15)',
          ridgeColor: 'rgba(255, 255, 255, 0.35)',
          neonStop1: '#00d2ff',
          neonStop2: '#38bdf8',
          neonStop3: '#a855f7',
          neonStop4: '#E06A45',
        };
      }

      // DARK THEME (100% Solid Obsidian & Silver Edges)
      return {
        isLight: false,
        crosshair: 'rgba(56, 189, 248, 0.24)',
        basePlateFill: '#0A0B10',
        basePlateStroke: 'rgba(255, 255, 255, 0.09)',
        topFaceGrad: ['#222432', '#12131A'],
        topFaceBevel: 'rgba(255, 255, 255, 0.98)',
        leftFaceGrad: ['#06060A', '#0E0E16'],
        leftFaceStroke: 'rgba(255, 255, 255, 0.14)',
        rightFaceGrad: ['#0A0A12', '#141420'],
        rightFaceStroke: 'rgba(255, 255, 255, 0.16)',
        ridgeColor: 'rgba(255, 255, 255, 0.45)',
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

      // Clean isometric grid spacing
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
            });
          }
        }
      }

      // Sort strictly from top-back to bottom-front for 100% correct isometric depth occlusion
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

    // Draw static rest frame
    const drawStatic = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const boxes = boxesRef.current;
      const w = boxSize;
      const h = boxSize * 0.5;
      const halfW = w / 2;
      const quarterH = h / 2;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const cx = b.x;
        const cy = b.baseY;

        // Ground Base Diamond Plate
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

        // Base Neon Rim on Ground
        const neonGrad = getNeonGradient(ctx, cx - halfW, cy, cx + halfW, cy + quarterH, theme);
        ctx.beginPath();
        ctx.moveTo(cx - halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Crosshair "+" in center
        ctx.strokeStyle = theme.crosshair;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 3.5, cy);
        ctx.lineTo(cx + 3.5, cy);
        ctx.moveTo(cx, cy - 3.5);
        ctx.lineTo(cx, cy + 3.5);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Render loop: Snappy, instant folding, ZERO trailing delay, 100% solid occlusion
    const loop = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const mouse = mouseRef.current;
      const boxes = boxesRef.current;
      let hasActiveMotion = false;

      const w = boxSize;
      const h = boxSize * 0.5;
      const halfW = w / 2;
      const quarterH = h / 2;

      // 1. Calculate Target Elevations (Tight focused radius, instantaneous follow)
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        let tFold = 0;

        if (mouse.active) {
          const dx = b.x - mouse.x;
          const dy = (b.baseY - maxElevation * 0.42) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactiveRadius) {
            // Tight bell curve with clean cutoff: pops high in center, zero outside radius
            const norm = dist / interactiveRadius;
            tFold = Math.max(0, 1 - norm * norm);
          }
        }

        b.targetFold = tFold;

        // Snappy instantaneous lerp: 0.28 speed gives instant pop without any lagging trail
        b.foldProgress += (b.targetFold - b.foldProgress) * 0.28;

        if (Math.abs(b.targetFold - b.foldProgress) < 0.005) {
          b.foldProgress = b.targetFold;
        }

        if (b.foldProgress > 0.005) {
          hasActiveMotion = true;
        }
      }

      // 2. Render all cells in strict isometric depth order (base plate -> solid 3D box)
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const cx = b.x;
        const baseCy = b.baseY;
        const fold = b.foldProgress;

        // A. Ground Base Diamond Plate (always solid underneath)
        ctx.beginPath();
        ctx.moveTo(cx, baseCy - quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx - halfW, baseCy);
        ctx.closePath();
        ctx.fillStyle = theme.basePlateFill;
        ctx.fill();
        ctx.strokeStyle = theme.basePlateStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Base Neon Rim on Ground
        const neonGrad = getNeonGradient(ctx, cx - halfW, baseCy, cx + halfW, baseCy + quarterH, theme);
        ctx.beginPath();
        ctx.moveTo(cx - halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // B. If not popped up, draw center crosshair
        if (fold < 0.08) {
          ctx.strokeStyle = theme.crosshair;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 3.5, baseCy);
          ctx.lineTo(cx + 3.5, baseCy);
          ctx.moveTo(cx, baseCy - 3.5);
          ctx.lineTo(cx, baseCy + 3.5);
          ctx.stroke();
          continue;
        }

        // C. If unfolded, draw 100% SOLID OPAQUE 3D Cube
        const currentH = maxElevation * fold;
        const topCy = baseCy - currentH;

        // Ensure 100% opacity with NO transparency
        ctx.globalAlpha = 1.0;

        // --- Left Face (Solid Opaque) ---
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

        // --- Right Face (Solid Opaque) ---
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

        // --- Top Face (Solid Opaque Diamond Lid) ---
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

        // Crisp Bevel Rim
        ctx.strokeStyle = theme.topFaceBevel;
        ctx.lineWidth = (theme.isLight ? 1.2 : 1.5) * Math.min(fold * 1.2, 1);
        ctx.stroke();

        // --- Front Vertical Crease ---
        ctx.beginPath();
        ctx.moveTo(cx, topCy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.strokeStyle = theme.ridgeColor;
        ctx.lineWidth = 0.9 * fold;
        ctx.stroke();

        // --- Tech Corner Accents when unfolded ---
        if (fold > 0.45) {
          const bSize = 6 * fold;
          const topNeon = getNeonGradient(ctx, cx - halfW, topCy, cx + halfW, topCy + quarterH, theme);
          ctx.strokeStyle = topNeon;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(cx - halfW - bSize, topCy);
          ctx.lineTo(cx - halfW, topCy);
          ctx.lineTo(cx - halfW, topCy - bSize * 0.5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + halfW + bSize, topCy);
          ctx.lineTo(cx + halfW, topCy);
          ctx.lineTo(cx + halfW, topCy - bSize * 0.5);
          ctx.stroke();
        }
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
