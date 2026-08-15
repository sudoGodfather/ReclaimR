import React, { useState } from 'react';
import { formatINR, sipFutureValue, sipTotalInvested } from '../../utils/finance';

interface EditorialSipProjectionChartProps {
  monthlyAmount?: number;
  years?: number;
  cagr?: number;
  title?: string;
  className?: string;
}

export const EditorialSipProjectionChart: React.FC<EditorialSipProjectionChartProps> = ({
  monthlyAmount = 1448,
  years = 10,
  cagr = 12,
  title = 'Long-Term Micro-SIP Wealth Compounding Curve',
  className = '',
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(years);

  const yearPoints = Array.from({ length: selectedYear }, (_, i) => i + 1);

  const points = yearPoints.map((y) => ({
    year: y,
    principal: sipTotalInvested(monthlyAmount, y),
    totalWealth: sipFutureValue(monthlyAmount, y, cagr),
  }));

  const maxVal = Math.max(...points.map((p) => p.totalWealth), 10000);
  const width = 600;
  const height = 220;
  const padding = 40;

  const pathPrincipalD = points.reduce((acc, p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - (p.principal / maxVal) * (height - padding * 2);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const pathWealthD = points.reduce((acc, p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - (p.totalWealth / maxVal) * (height - padding * 2);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const finalPoint = points[points.length - 1];

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-6 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-4 font-mono-tactile ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-3">
        <div>
          <h3 className="font-serif-editorial text-[18px] font-[600] text-[var(--color-ink-primary)]">
            {title}
          </h3>
          <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">
            Allocation: <strong className="text-[#10B981]">{formatINR(monthlyAmount)}/mo</strong> into Nifty 50 Index Fund (@{cagr}% CAGR)
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#10B981] font-[600]">
            <span className="w-2.5 h-2.5 rounded-none bg-[#10B981]" />
            COMPOUNDED WEALTH
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-ink-secondary)] font-[600]">
            <span className="w-2.5 h-2.5 rounded-none bg-black/30 dark:bg-white/30" />
            PRINCIPAL PAID
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Principal Area Line */}
          <path d={pathPrincipalD} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" />

          {/* Compounded Wealth Curve Line */}
          <path d={pathWealthD} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

          {/* Callout Annotation on Final Point */}
          {finalPoint && (
            <g>
              <circle
                cx={width - padding}
                cy={height - padding - (finalPoint.totalWealth / maxVal) * (height - padding * 2)}
                r="6"
                fill="#10B981"
              />
            </g>
          )}

          {/* X Axis Labels */}
          {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((p) => {
            const x = padding + ((p.year - 1) / (points.length - 1)) * (width - padding * 2);
            return (
              <text key={p.year} x={x} y={height - 10} textAnchor="middle" className="fill-[var(--color-ink-secondary)] text-[10px] font-mono-tactile font-semibold">
                Yr {p.year}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Summary Row */}
      <div className="p-4 rounded-none bg-[#1A1A18] text-white flex flex-wrap justify-between items-center text-[12px] gap-2 font-mono-tactile shadow-sm">
        <div>
          <span className="text-white/50 block text-[10px]">TOTAL OUT-OF-POCKET:</span>
          <span className="font-serif-editorial font-[600] text-[16px] text-white">
            {formatINR(finalPoint?.principal ?? 0)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[#10B981] font-[600] block text-[10px]">PROJECTED 10-YR WEALTH:</span>
          <span className="font-serif-editorial font-[600] text-[22px] text-[#10B981]">
            {formatINR(finalPoint?.totalWealth ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
