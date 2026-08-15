import React, { useId } from 'react';
import { GlassRangeSlider } from './GlassRangeSlider';

/* ------------------------------------------------------------------ */
/* 1. EditorialInput — Lightweight Editorial Input Primitive          */
/* ------------------------------------------------------------------ */

export interface EditorialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const EditorialInput: React.FC<EditorialInputProps> = ({
  label,
  helperText,
  error,
  id: customId,
  className = '',
  required,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5 font-sans-clean">
      <div className="flex justify-between items-baseline font-mono-tactile">
        <label
          htmlFor={inputId}
          className="text-[11px] font-[600] text-[var(--color-ink-secondary)] uppercase tracking-wider"
        >
          {label} {required && <span className="text-[#C93B2B]">*</span>}
        </label>
        {error && (
          <span id={errorId} className="text-[11px] font-[600] text-[#C93B2B] uppercase">
            {error}
          </span>
        )}
      </div>

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        required={required}
        className={`w-full h-[44px] px-4 rounded-none bg-[var(--color-paper-card)] text-[14px] font-[500] text-[var(--color-ink-primary)] border transition-all duration-200
          placeholder:text-[var(--color-ink-tertiary)]
          focus:outline-none focus:border-[#1B4D3E] focus-visible:ring-2 focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-1
          ${error ? 'border-[#C93B2B]' : 'border-[var(--color-paper-border)] hover:border-black/30 dark:hover:border-white/30'}
          ${className}`}
        {...rest}
      />

      {helperText && !error && (
        <p id={helperId} className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
          {helperText}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. EditorialSelect — Lightweight Select Primitive                  */
/* ------------------------------------------------------------------ */

export interface EditorialSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  helperText?: string;
  error?: string;
}

export const EditorialSelect: React.FC<EditorialSelectProps> = ({
  label,
  options,
  helperText,
  error,
  id: customId,
  className = '',
  required,
  ...rest
}) => {
  const generatedId = useId();
  const selectId = customId || generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  return (
    <div className="space-y-1.5 font-sans-clean">
      <div className="flex justify-between items-baseline font-mono-tactile">
        <label
          htmlFor={selectId}
          className="text-[11px] font-[600] text-[var(--color-ink-secondary)] uppercase tracking-wider"
        >
          {label} {required && <span className="text-[#C93B2B]">*</span>}
        </label>
        {error && (
          <span id={errorId} className="text-[11px] font-[600] text-[#C93B2B] uppercase">
            {error}
          </span>
        )}
      </div>

      <select
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        required={required}
        className={`w-full h-[44px] px-4 rounded-none bg-[var(--color-paper-card)] text-[14px] font-[500] text-[var(--color-ink-primary)] border transition-all duration-200 cursor-pointer
          focus:outline-none focus:border-[#1B4D3E] focus-visible:ring-2 focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-1
          ${error ? 'border-[#C93B2B]' : 'border-[var(--color-paper-border)] hover:border-black/30 dark:hover:border-white/30'}
          ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p id={helperId} className="text-[11px] text-[var(--color-ink-tertiary)] font-mono-tactile">
          {helperText}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3. EditorialSlider — Range Slider with Tabular Value Display        */
/* ------------------------------------------------------------------ */

export interface EditorialSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  valueDisplay: string;
  minLabel?: string;
  maxLabel?: string;
  trackHeight?: number;
  id?: string;
  className?: string;
}

export const EditorialSlider: React.FC<EditorialSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  valueDisplay,
  minLabel,
  maxLabel,
  trackHeight = 8,
  id: customId,
  className = '',
}) => {
  const generatedId = useId();
  const sliderId = customId || generatedId;

  return (
    <div className="space-y-2 font-mono-tactile">
      <div className="flex justify-between items-baseline text-[12px] font-[600]">
        <label htmlFor={sliderId} className="text-[var(--color-ink-secondary)] cursor-pointer">
          {label}:
        </label>
        <span className="font-[600] text-[var(--color-ink-primary)]">{valueDisplay}</span>
      </div>

      <GlassRangeSlider
        id={sliderId}
        value={value}
        min={min}
        max={max}
        step={step}
        trackHeight={trackHeight}
        onChange={onChange}
        ariaLabel={label}
        className={className}
      />

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[11px] text-[var(--color-ink-tertiary)]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};
