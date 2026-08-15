import React, { useState } from 'react';
import { formatINR } from '../../utils/finance';
import { useApp } from '../../context/AppContext';

interface DataPoint {
  label: string;
  leakingAmount: number;
  reclaimedAmount: number;
}

interface EditorialTrajectoryChartProps {
  data?: DataPoint[];
  title?: string;
  className?: string;
}

function buildTrajectoryData(leakingMonthly: number, divertedMonthly: number): DataPoint[] {
  const now = new Date();
  const points: DataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const progress = (5 - i) / 5;
    points.push({
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
      leakingAmount: leakingMonthly,
      reclaimedAmount: Math.round(divertedMonthly * progress),
    });
  }
  return points;
}

export const EditorialTrajectoryChart: React.FC<EditorialTrajectoryChartProps> = ({
  data,
  title = 'Savings Trajectory vs Unchecked Rot',
  className = '',
}) => {
  const { subscriptions } = useApp();
  const leakingMonthly = subscriptions
    .filter((s) => s.status === 'rotting')
    .reduce((acc, s) => acc + s.cost, 0);
  const divertedMonthly = subscriptions
    .filter((s) => s.status === 'diverted')
    .reduce((acc, s) => acc + s.cost, 0);
  const resolvedData = data ?? buildTrajectoryData(leakingMonthly, divertedMonthly);
  const [activeIdx, setActiveIdx] = useState<number | null>(resolvedData.length - 1);

  const maxVal = Math.max(...resolvedData.map((d) => Math.max(d.leakingAmount, d.reclaimedAmount)), 4000);
  const width = 600;
  const height = 240;
  const padding = 40;

  // Generate SVG path coordinates
  const pointsReclaimed = resolvedData.map((d, i) => {
    const x = padding + (i / (resolvedData.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.reclaimedAmount / maxVal) * (height - padding * 2);
    return { x, y, data: d, index: i };
  });

  const pointsLeaking = resolvedData.map((d, i) => {
    const x = padding + (i / (resolvedData.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.leakingAmount / maxVal) * (height - padding * 2);
    return { x, y, data: d, index: i };
  });

  const pathReclaimedD = pointsReclaimed.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  const pathLeakingD = pointsLeaking.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  const activePoint = activeIdx !== null ? pointsReclaimed[activeIdx] : null;

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-6 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-4 font-mono-tactile ${className}`}
    >
      {/* Chart Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-3">
        <h3 className="font-serif-editorial text-[18px] font-[600] text-[var(--color-ink-primary)]">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#10B981] font-[600]">
            <span className="w-2.5 h-2.5 rounded-none bg-[#10B981]" />
            RECLAIMED SIP SAVINGS
          </span>
          <span className="flex items-center gap-1.5 text-[#C93B2B] font-[600]">
            <span className="w-2.5 h-2.5 rounded-none bg-[#C93B2B]" />
            UNCHECKED ROT DRAIN
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Subtle Horizontal Gridlines */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = height - padding - ratio * (height - padding * 2);
            return (
              <g key={idx}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[var(--color-ink-tertiary)] text-[9px] font-mono-tactile"
                >
                  {formatINR(Math.round(ratio * maxVal))}
                </text>
              </g>
            );
          })}

          {/* Unchecked Leaking Line (Red Dashed) */}
          <path
            d={pathLeakingD}
            fill="none"
            stroke="#C93B2B"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="opacity-70"
          />

          {/* Reclaimed SIP Savings Line (Solid Green) */}
          <path
            d={pathReclaimedD}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Interactive Focus Points */}
          {pointsReclaimed.map((p, i) => (
            <g
              key={i}
              tabIndex={0}
              role="button"
              aria-label={`${p.data.label}: Reclaimed ${formatINR(p.data.reclaimedAmount)}`}
              onClick={() => setActiveIdx(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveIdx(i);
              }}
              className="cursor-pointer focus:outline-none"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={activeIdx === i ? 6 : 4}
                fill={activeIdx === i ? '#10B981' : 'var(--color-paper-surface)'}
                stroke="#10B981"
                strokeWidth="2"
                className="transition-all"
              />
            </g>
          ))}

          {/* Direct On-Chart Callout Annotation */}
          {activePoint && (
            <g transform={`translate(${activePoint.x}, ${activePoint.y - 12})`}>
              <rect
                x="-50"
                y="-24"
                width="100"
                height="20"
                rx="0"
                fill="#1A1A18"
                className="shadow-md"
              />
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                fill="#10B981"
                className="text-[10px] font-mono-tactile font-semibold"
              >
                {formatINR(activePoint.data.reclaimedAmount)}/mo
              </text>
            </g>
          )}

          {/* X Axis Month Labels */}
          {resolvedData.map((d, i) => {
            const x = padding + (i / (resolvedData.length - 1)) * (width - padding * 2);
            return (
              <text
                key={i}
                x={x}
                y={height - 12}
                textAnchor="middle"
                className="fill-[var(--color-ink-secondary)] text-[10px] font-mono-tactile font-semibold"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Accessible Summary Caption */}
      <div className="p-3 rounded-none bg-[var(--color-paper-card)] text-[11px] text-[var(--color-ink-secondary)] flex justify-between items-center">
        <span>Active Audit Point: <strong className="text-[#10B981]">{activePoint?.data.label}</strong></span>
        <span>Reclaimed Total: <strong className="text-[#10B981]">{formatINR(activePoint?.data.reclaimedAmount ?? 0)}/mo</strong></span>
      </div>
    </div>
  );
};
