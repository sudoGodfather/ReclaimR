import React, { useCallback, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* GlassRangeSlider — Glass "Liquid Lens" Range Slider                */
/* React port of the Maxuiux glass slider: white glass pill thumb    */
/* with a liquid-lens displacement filter, moss green progress bar   */
/* consistent across light, dark, and dim themes.                    */
/* ------------------------------------------------------------------ */

export interface GlassRangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  trackHeight?: number;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const GlassRangeSlider: React.FC<GlassRangeSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ariaLabel,
  trackHeight = 6,
  className = '',
  id,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clamped = Math.min(Math.max(value, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;

  const snapValue = useCallback(
    (raw: number) => {
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step]
  );

  const applyClientX = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || disabled) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      onChange(snapValue(min + (pct / 100) * (max - min)));
    },
    [disabled, max, min, onChange, snapValue]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = clamped + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = clamped - step;
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      case 'PageUp':
        next = clamped + step * 10;
        break;
      case 'PageDown':
        next = clamped - step * 10;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(snapValue(next));
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`glass-range ${className}`}
      style={{ ['--glass-track-h' as string]: `${trackHeight}px` }}
      onPointerDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        containerRef.current?.setPointerCapture(e.pointerId);
        setIsDragging(true);
        applyClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (isDragging) applyClientX(e.clientX);
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
    >
      <div className="glass-range__progress" style={{ width: `${percent}%` }} />
      <div
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(clamped)}
        aria-orientation="horizontal"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`glass-range__thumb ${isDragging ? 'glass-range__thumb--active' : ''}`}
        onKeyDown={handleKeyDown}
        style={{ left: `${percent}%` }}
      >
        <div className="glass-range__filter" />
        <div className="glass-range__overlay" />
        <div className="glass-range__specular" />
      </div>
    </div>
  );
};

export default GlassRangeSlider;
