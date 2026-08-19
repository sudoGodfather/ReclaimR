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
  scale: number;
  targetScale: number;
  scaleVelocity: number;
  height: number;
  targetHeight: number;
  heightVelocity: number;
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

    // Theme color palettes
    const getThemeConfig = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const isDim = document.documentElement.classList.contains('dim');

      if (!isDark && !isDim) {
        // LIGHT THEME
        return {
          isLight: true,
          crosshair: 'rgba(12, 14, 11, 0.16)',
          topFaceGrad: ['#FFFFFF', '#E8EEF5'],
          topFaceBevel: 'rgba(15, 23, 42, 0.45)',
          topFaceBevelGlow: 'rgba(0, 180, 216, 0.25)',
          leftFaceGrad: ['#DCE2E9', '#CAD3DE'],
          leftFaceStroke: 'rgba(15, 23, 42, 0.15)',
          rightFaceGrad: ['#C5CED9', '#B2BECB'],
          rightFaceStroke: 'rgba(15, 23, 42, 0.18)',
          ridgeColor: 'rgba(15, 23, 42, 0.25)',
          neonStop1: '#0096C7', // Vivid Cyan
          neonStop2: '#023E8A', // Deep Blue
          neonStop3: '#7209B7', // Royal Purple
          neonStop4: '#D81159', // Vivid Pink
          underglowCyan: 'rgba(0, 150, 199, 0.28)',
          underglowPink: 'rgba(216, 17, 89, 0.28)',
          underglowViolet: 'rgba(114, 9, 183, 0.16)',
        };
      }

      if (isDim) {
        // DIM THEME
        return {
          isLight: false,
          crosshair: 'rgba(224, 106, 69, 0.22)',
          topFaceGrad: ['#22232B', '#14151C'],
          topFaceBevel: 'rgba(255, 255, 255, 0.85)',
          topFaceBevelGlow: 'rgba(224, 106, 69, 0.3)',
          leftFaceGrad: ['#0A0A0F', '#121218'],
          leftFaceStroke: 'rgba(255, 255, 255, 0.08)',
          rightFaceGrad: ['#0E0E14', '#181822'],
          rightFaceStroke: 'rgba(255, 255, 255, 0.1)',
          ridgeColor: 'rgba(255, 255, 255, 0.35)',
          neonStop1: '#00d2ff',
          neonStop2: '#38bdf8',
          neonStop3: '#a855f7',
          neonStop4: '#E06A45', // Rust
          underglowCyan: 'rgba(0, 210, 255, 0.32)',
          underglowPink: 'rgba(224, 106, 69, 0.32)',
          underglowViolet: 'rgba(168, 85, 247, 0.15)',
        };
      }

      // DARK THEME
      return {
        isLight: false,
        crosshair: 'rgba(56, 189, 248, 0.22)',
        topFaceGrad: ['#1C1D28', '#0B0B10'],
        topFaceBevel: 'rgba(255, 255, 255, 0.95)',
        topFaceBevelGlow: 'rgba(255, 255, 255, 0.4)',
        leftFaceGrad: ['#06060A', '#0E0E16'],
        leftFaceStroke: 'rgba(255, 255, 255, 0.08)',
        rightFaceGrad: ['#0A0A12', '#141420'],
        rightFaceStroke: 'rgba(255, 255, 255, 0.1)',
        ridgeColor: 'rgba(255, 255, 255, 0.35)',
        neonStop1: '#00d2ff',
        neonStop2: '#38bdf8',
        neonStop3: '#a855f7',
        neonStop4: '#ec4899',
        underglowCyan: 'rgba(0, 210, 255, 0.35)',
        underglowPink: 'rgba(236, 72, 153, 0.35)',
        underglowViolet: 'rgba(168, 85, 247, 0.15)',
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

      const stepW = 118;
      const stepH = 59;

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
              scale: 0,
              targetScale: 0,
              scaleVelocity: 0,
              height: 0,
              targetHeight: 0,
              heightVelocity: 0,
              glow: 0,
              targetGlow: 0,
            });
          }
        }
      }

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

    const loop = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const theme = getThemeConfig();
      const mouse = mouseRef.current;
      const boxes = boxesRef.current;
      let hasActiveMotion = false;

      // 1. Draw crosshairs
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme.crosshair;
      ctx.beginPath();
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.scale < 0.3) {
          ctx.moveTo(b.x - 3.5, b.baseY);
          ctx.lineTo(b.x + 3.5, b.baseY);
          ctx.moveTo(b.x, b.baseY - 3.5);
          ctx.lineTo(b.x, b.baseY + 3.5);
        }
      }
      ctx.stroke();

      // 2. Physics update
      const spring = 0.26;
      const damping = 0.72;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        let tScale = 0;
        let tHeight = 0;
        let tGlow = 0;

        if (mouse.active) {
          const dx = b.x - mouse.x;
          const dy = (b.baseY - maxElevation * 0.42) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactiveRadius) {
            const factor = Math.cos((dist / interactiveRadius) * (Math.PI / 2));
            const power = Math.pow(Math.max(0, factor), 1.5);

            tScale = power;
            tHeight = power * maxElevation;
            tGlow = power;
          }
        }

        b.targetScale = tScale;
        b.targetHeight = tHeight;
        b.targetGlow = tGlow;

        // Spring integration
        const scaleForce = (b.targetScale - b.scale) * spring;
        b.scaleVelocity = (b.scaleVelocity + scaleForce) * damping;
        b.scale += b.scaleVelocity;

        const heightForce = (b.targetHeight - b.height) * spring;
        b.heightVelocity = (b.heightVelocity + heightForce) * damping;
        b.height += b.heightVelocity;

        b.glow += (b.targetGlow - b.glow) * 0.2;

        if (Math.abs(b.scaleVelocity) < 0.005 && Math.abs(b.targetScale - b.scale) < 0.005) {
          b.scale = b.targetScale;
          b.scaleVelocity = 0;
        }
        if (Math.abs(b.heightVelocity) < 0.05 && Math.abs(b.targetHeight - b.height) < 0.05) {
          b.height = b.targetHeight;
          b.heightVelocity = 0;
        }

        if (b.scale > 0.01 || b.height > 0.1 || Math.abs(b.scaleVelocity) > 0.005) {
          hasActiveMotion = true;
        }
      }

      // 3. Render popped-out 3D boxes
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const s = Math.max(0, b.scale);
        const curH = Math.max(0, b.height);

        if (s < 0.02 || curH < 0.5) continue;

        const cx = b.x;
        const cy = b.baseY - curH;
        const baseCy = b.baseY;
        const w = boxSize * s;
        const h = (boxSize * 0.5) * s;
        const halfW = w / 2;
        const quarterH = h / 2;
        const glow = Math.min(Math.max(b.glow, 0), 1);

        ctx.save();
        ctx.globalAlpha = Math.min(s * 1.3, 1);

        // Underglow
        if (s > 0.2) {
          const underglow = ctx.createRadialGradient(cx, baseCy + 5, 2, cx, baseCy + 5, w * 1.1);
          underglow.addColorStop(0, cx < width / 2 ? theme.underglowCyan : theme.underglowPink);
          underglow.addColorStop(0.6, theme.underglowViolet);
          underglow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = underglow;
          ctx.fillRect(cx - w * 1.2, baseCy - quarterH, w * 2.4, h * 2.4);
        }

        const neonGrad = getNeonGradient(ctx, cx - halfW, cy, cx + halfW, cy + quarterH, theme);

        // A. Left Face
        ctx.beginPath();
        ctx.moveTo(cx - halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx - halfW, baseCy);
        ctx.closePath();

        const leftGrad = ctx.createLinearGradient(cx - halfW, cy, cx, cy + quarterH);
        leftGrad.addColorStop(0, theme.leftFaceGrad[0]);
        leftGrad.addColorStop(1, theme.leftFaceGrad[1]);
        ctx.fillStyle = leftGrad;
        ctx.fill();

        ctx.strokeStyle = theme.leftFaceStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // B. Right Face
        ctx.beginPath();
        ctx.moveTo(cx, cy + quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(cx, cy + quarterH, cx + halfW, cy);
        rightGrad.addColorStop(0, theme.rightFaceGrad[0]);
        rightGrad.addColorStop(1, theme.rightFaceGrad[1]);
        ctx.fillStyle = rightGrad;
        ctx.fill();

        ctx.strokeStyle = theme.rightFaceStroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // C. Glowing Base Pedestal Rim
        ctx.beginPath();
        ctx.moveTo(cx - halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 2.4 * s;
        ctx.save();
        ctx.shadowColor = cx < width / 2 ? theme.neonStop1 : theme.neonStop4;
        ctx.shadowBlur = (10 + glow * 10) * s;
        ctx.stroke();
        ctx.restore();

        // D. Top Face (Diamond)
        ctx.beginPath();
        ctx.moveTo(cx, cy - quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx - halfW, cy);
        ctx.closePath();

        const topGrad = ctx.createLinearGradient(cx - halfW, cy - quarterH, cx + halfW, cy + quarterH);
        topGrad.addColorStop(0, theme.topFaceGrad[0]);
        topGrad.addColorStop(1, theme.topFaceGrad[1]);
        ctx.fillStyle = topGrad;
        ctx.fill();

        // Top Face Bevel Edge
        ctx.save();
        ctx.strokeStyle = theme.topFaceBevel;
        ctx.lineWidth = (theme.isLight ? 1.1 : 1.4) * s;
        ctx.shadowColor = theme.topFaceBevelGlow;
        ctx.shadowBlur = 4 * glow;
        ctx.stroke();
        ctx.restore();

        // Front Center Vertical Ridge
        ctx.beginPath();
        ctx.moveTo(cx, cy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.strokeStyle = theme.ridgeColor;
        ctx.lineWidth = 0.9 * s;
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

    // Watch for theme class changes on <html>
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
