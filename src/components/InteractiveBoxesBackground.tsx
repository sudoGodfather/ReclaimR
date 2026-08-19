import React, { useEffect, useRef } from 'react';

interface InteractiveBoxesBackgroundProps {
  className?: string;
  maxElevation?: number;
  boxSize?: number;
  interactiveRadius?: number;
}

interface BoxNode {
  gx: number;
  gy: number;
  x: number;
  y: number;
  baseY: number;
  scale: number;        // 0 (hidden) -> 1 (fully popped out)
  targetScale: number;
  scaleVelocity: number;
  height: number;       // 0 -> maxElevation
  targetHeight: number;
  heightVelocity: number;
  glow: number;         // 0 -> 1
  targetGlow: number;
}

export const InteractiveBoxesBackground: React.FC<InteractiveBoxesBackgroundProps> = ({
  className = '',
  maxElevation = 64,
  boxSize = 74,
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

      // Isometric step dimensions (Sparse density matching the Spline reference image)
      const stepW = 118; // Wide column spacing
      const stepH = 59;  // 2:1 isometric row spacing

      const originX = width / 2;
      const originY = height * 0.38;

      const cols = Math.ceil(width / stepW) + 4;
      const rows = Math.ceil(height / stepH) + 6;

      const boxes: BoxNode[] = [];

      // Generate isometric grid nodes
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
              scale: 0,        // ALL BOXES INITIALLY HIDDEN
              targetScale: 0,
              scaleVelocity: 0,
              height: 0,       // 0 ELEVATION
              targetHeight: 0,
              heightVelocity: 0,
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

    // Neon gradient matching Electric Cyan -> Sky Blue -> Violet Purple -> Neon Magenta
    const getNeonGradient = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, '#00d2ff');   // Electric Cyan
      grad.addColorStop(0.35, '#38bdf8'); // Sky Blue
      grad.addColorStop(0.7, '#a855f7');  // Violet Purple
      grad.addColorStop(1, '#ec4899');   // Neon Magenta / Pink
      return grad;
    };

    // Draw static rest frame (only clean sparse crosshairs)
    const drawStatic = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const boxes = boxesRef.current;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
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

    // Render loop with dynamic pop-out physics
    const loop = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const boxes = boxesRef.current;
      let hasActiveMotion = false;

      // 1. Draw background crosshair markers
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
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
          const dy = b.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactiveRadius) {
            // Smooth cosine falloff
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

        // Spring physics for scale
        const scaleForce = (b.targetScale - b.scale) * spring;
        b.scaleVelocity = (b.scaleVelocity + scaleForce) * damping;
        b.scale += b.scaleVelocity;

        // Spring physics for height
        const heightForce = (b.targetHeight - b.height) * spring;
        b.heightVelocity = (b.heightVelocity + heightForce) * damping;
        b.height += b.heightVelocity;

        // Glow interpolation
        b.glow += (b.targetGlow - b.glow) * 0.2;

        // Snap to zero when settled
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

        if (s < 0.02 || curH < 0.5) continue; // Skip un-popped boxes

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

        // A. Atmospheric Underglow
        if (s > 0.2) {
          const underglow = ctx.createRadialGradient(cx, baseCy + 5, 2, cx, baseCy + 5, w * 1.1);
          underglow.addColorStop(0, cx < width / 2 ? 'rgba(0, 210, 255, 0.35)' : 'rgba(236, 72, 153, 0.35)');
          underglow.addColorStop(0.6, 'rgba(168, 85, 247, 0.15)');
          underglow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = underglow;
          ctx.fillRect(cx - w * 1.2, baseCy - quarterH, w * 2.4, h * 2.4);
        }

        const neonGrad = getNeonGradient(ctx, cx - halfW, cy, cx + halfW, cy + quarterH);

        // B. Left Face
        ctx.beginPath();
        ctx.moveTo(cx - halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx - halfW, baseCy);
        ctx.closePath();

        const leftGrad = ctx.createLinearGradient(cx - halfW, cy, cx, cy + quarterH);
        leftGrad.addColorStop(0, '#06060a');
        leftGrad.addColorStop(1, '#0e0e16');
        ctx.fillStyle = leftGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // C. Right Face
        ctx.beginPath();
        ctx.moveTo(cx, cy + quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(cx, cy + quarterH, cx + halfW, cy);
        rightGrad.addColorStop(0, '#0a0a12');
        rightGrad.addColorStop(1, '#141420');
        ctx.fillStyle = rightGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // D. Glowing Neon Base Pedestal Rim (Electric Cyan -> Magenta)
        ctx.beginPath();
        ctx.moveTo(cx - halfW, baseCy);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.lineTo(cx + halfW, baseCy);
        ctx.strokeStyle = neonGrad;
        ctx.lineWidth = 2.4 * s;
        ctx.save();
        ctx.shadowColor = cx < width / 2 ? '#00d2ff' : '#ec4899';
        ctx.shadowBlur = (10 + glow * 10) * s;
        ctx.stroke();
        ctx.restore();

        // E. Top Face (Diamond)
        ctx.beginPath();
        ctx.moveTo(cx, cy - quarterH);
        ctx.lineTo(cx + halfW, cy);
        ctx.lineTo(cx, cy + quarterH);
        ctx.lineTo(cx - halfW, cy);
        ctx.closePath();

        const topGrad = ctx.createLinearGradient(cx - halfW, cy - quarterH, cx + halfW, cy + quarterH);
        topGrad.addColorStop(0, '#1c1d28');
        topGrad.addColorStop(1, '#0b0b10');
        ctx.fillStyle = topGrad;
        ctx.fill();

        // Top Face Bevel Edge: Crisp white/silver rim with neon touch
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.4 * s;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4 * glow;
        ctx.stroke();
        ctx.restore();

        // Front Center Vertical Ridge
        ctx.beginPath();
        ctx.moveTo(cx, cy + quarterH);
        ctx.lineTo(cx, baseCy + quarterH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
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

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
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
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto bg-[#000000] ${className}`}
      style={{ touchAction: 'none' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    </div>
  );
};

export default InteractiveBoxesBackground;
