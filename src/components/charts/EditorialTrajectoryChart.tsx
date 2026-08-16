import React, { useId, useMemo, useState } from 'react';
import { formatINR, formatINRCompact } from '../../utils/finance';
import { useApp } from '../../context/AppContext';

interface TrajectoryPoint {
  label: string;
  rotCumulative: number;
  reclaimedCumulative: number;
  projected: boolean;
}

interface EditorialTrajectoryChartProps {
  data?: TrajectoryPoint[];
  title?: string;
  className?: string;
}

const PAST_MONTHS = 6;
const FUTURE_MONTHS = 6;
const ANNUAL_CAGR = 12;

function buildTrajectoryData(leakingMonthly: number, divertedMonthly: number): TrajectoryPoint[] {
  const r = ANNUAL_CAGR / 100 / 12;
  const now = new Date();
  const points: TrajectoryPoint[] = [];
  let balance = 0;

  for (let i = 1; i <= PAST_MONTHS + FUTURE_MONTHS; i++) {
    const monthsAgo = PAST_MONTHS - i;
    const d = new Date(now.getFullYear(), now.getMonth() + monthsAgo, 1);
    const projected = i > PAST_MONTHS;
    const monthContribution = projected ? divertedMonthly : (divertedMonthly * i) / PAST_MONTHS;
    balance = projected ? balance * (1 + r) + monthContribution : balance + monthContribution;

    points.push({
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
      rotCumulative: Math.round(leakingMonthly * i),
      reclaimedCumulative: Math.round(balance),
      projected,
    });
  }
  return points;
}

function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const norm = raw / mag;
  const factor = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return factor * mag;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export const EditorialTrajectoryChart: React.FC<EditorialTrajectoryChartProps> = ({
  data,
  title = 'Savings Trajectory vs Unchecked Rot',
  className = '',
}) => {
  const { subscriptions } = useApp();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const leakingMonthly = subscriptions
    .filter((s) => s.status === 'rotting')
    .reduce((acc, s) => acc + s.cost, 0);
  const divertedMonthly = subscriptions
    .filter((s) => s.status === 'diverted')
    .reduce((acc, s) => acc + s.cost, 0);

  const resolvedData = data ?? buildTrajectoryData(leakingMonthly, divertedMonthly);
  const [activeIdx, setActiveIdx] = useState<number>(PAST_MONTHS - 1);

  const { ticks, yMin, yMax } = useMemo(() => {
    const rotFinal = Math.max(...resolvedData.map((d) => d.rotCumulative), 2000);
    const greenFinal = Math.max(...resolvedData.map((d) => d.reclaimedCumulative), 2000);
    const step = niceStep(Math.max(rotFinal, greenFinal) / 3);
    const max = Math.ceil(greenFinal / step) * step;
    const min = -Math.ceil(rotFinal / step) * step;
    const list: number[] = [];
    for (let v = min; v <= max; v += step) list.push(v);
    return { ticks: list, yMin: min, yMax: max };
  }, [resolvedData]);

  const width = 640;
  const height = 300;
  const padL = 52;
  const padR = 24;
  const padT = 26;
  const padB = 40;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const xAt = (i: number) => padL + (i / (resolvedData.length - 1)) * plotW;
  const yAt = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = yAt(0);

  const ptsReclaimed = resolvedData.map((d, i) => ({ x: xAt(i), y: yAt(d.reclaimedCumulative), i }));
  const ptsRot = resolvedData.map((d, i) => ({ x: xAt(i), y: yAt(-d.rotCumulative), i }));

  const todayIdx = PAST_MONTHS - 1;
  const todayX = xAt(Math.min(todayIdx, resolvedData.length - 1));

  const realizedGreen = ptsReclaimed.slice(0, todayIdx + 1);
  const projectedGreen = ptsReclaimed.slice(todayIdx);
  const realizedRot = ptsRot.slice(0, todayIdx + 1);
  const projectedRot = ptsRot.slice(todayIdx);

  const greenAreaD = `${smoothPath(ptsReclaimed)} L ${ptsReclaimed[ptsReclaimed.length - 1].x} ${zeroY} L ${ptsReclaimed[0].x} ${zeroY} Z`;
  const rotAreaD = `${smoothPath(ptsRot)} L ${ptsRot[ptsRot.length - 1].x} ${zeroY} L ${ptsRot[0].x} ${zeroY} Z`;

  const active = resolvedData[Math.min(activeIdx, resolvedData.length - 1)];
  const last = resolvedData[resolvedData.length - 1];
  const activeX = xAt(activeIdx);
  const netDivergence = (last?.reclaimedCumulative ?? 0) + (last?.rotCumulative ?? 0);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const idx = Math.round(((px - padL) / plotW) * (resolvedData.length - 1));
    setActiveIdx(Math.max(0, Math.min(resolvedData.length - 1, idx)));
  };

  return (
    <div
      role="region"
      aria-label={title}
      className={`p-6 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-4 font-mono-tactile ${className}`}
    >
      {/* Chart Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-paper-border)] pb-3">
        <div>
          <h3 className="font-serif-editorial text-[18px] font-[600] text-[var(--color-ink-primary)]">
            {title}
          </h3>
          <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-0.5">
            Cumulative 12-month cash-flow divergence • @{ANNUAL_CAGR}% projected CAGR on reclaimed capital
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#10B981] font-[600]">
            <span className="w-2.5 h-2.5 rounded-none bg-[#10B981]" />
            RECLAIMED SIP WEALTH
          </span>
          <span className="flex items-center gap-1.5 text-[#C93B2B] font-[600]">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="border border-[#C93B2B]/40">
              <line x1="0" y1="12" x2="12" y2="0" stroke="#C93B2B" strokeWidth="1.5" />
              <line x1="6" y1="14" x2="14" y2="6" stroke="#C93B2B" strokeWidth="1.5" />
            </svg>
            UNCHECKED ROT DRAIN
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-ink-tertiary)] font-[600]">
            <svg width="14" height="2" viewBox="0 0 14 2" aria-hidden="true">
              <line x1="0" y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
            PROJECTED
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIdx(todayIdx)}
        >
          <defs>
            <pattern
              id={`rotHatch-${uid}`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#C93B2B" strokeWidth="1.5" strokeOpacity="0.22" />
            </pattern>
            <linearGradient id={`greenFade-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gridline Ticks */}
          {ticks.map((v) => (
            <g key={v}>
              {v !== 0 && (
                <line
                  x1={padL}
                  y1={yAt(v)}
                  x2={width - padR}
                  y2={yAt(v)}
                  stroke="currentColor"
                  strokeOpacity="0.07"
                  strokeDasharray="3 5"
                />
              )}
              <text
                x={padL - 8}
                y={yAt(v) + 3}
                textAnchor="end"
                className="fill-[var(--color-ink-tertiary)] text-[9px] font-mono-tactile"
              >
                {formatINRCompact(v)}
              </text>
            </g>
          ))}

          {/* Rot Drain Zone (hatched) */}
          <path d={rotAreaD} fill={`url(#rotHatch-${uid})`} />
          <path d={rotAreaD} fill="#C93B2B" fillOpacity="0.05" />

          {/* Reclaimed Wealth Zone (gradient) */}
          <path d={greenAreaD} fill={`url(#greenFade-${uid})`} />

          {/* Zero Baseline */}
          <line x1={padL} y1={zeroY} x2={width - padR} y2={zeroY} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
          <text
            x={width - padR}
            y={zeroY - 5}
            textAnchor="end"
            className="fill-[var(--color-ink-tertiary)] text-[8px] font-mono-tactile tracking-wider"
          >
            ZERO BASELINE
          </text>

          {/* TODAY Divider */}
          <line x1={todayX} y1={padT - 4} x2={todayX} y2={height - padB} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 4" />
          <rect x={todayX - 21} y={2} width="42" height="15" fill="#1A1A18" />
          <text x={todayX} y={13} textAnchor="middle" fill="#F2EFE6" className="text-[8px] font-mono-tactile font-semibold tracking-widest">
            TODAY
          </text>

          {/* Rot Drain Line: realized + projected */}
          <path d={smoothPath(realizedRot)} fill="none" stroke="#C93B2B" strokeWidth="2" />
          <path d={smoothPath(projectedRot)} fill="none" stroke="#C93B2B" strokeWidth="2" strokeDasharray="5 4" className="opacity-80" />

          {/* Reclaimed Wealth Curve: realized + projected */}
          <path d={smoothPath(realizedGreen)} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={smoothPath(projectedGreen)} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 5" className="opacity-80" />

          {/* End-State Markers */}
          <g>
            <circle cx={ptsRot[ptsRot.length - 1].x} cy={ptsRot[ptsRot.length - 1].y} r="4" fill="var(--color-paper-surface)" stroke="#C93B2B" strokeWidth="2" />
            <text
              x={width - padR}
              y={ptsRot[ptsRot.length - 1].y + 16}
              textAnchor="end"
              fill="#C93B2B"
              className="text-[10px] font-mono-tactile font-[700]"
            >
              −{formatINRCompact(last.rotCumulative)} DRAINED
            </text>

            <circle cx={ptsReclaimed[ptsReclaimed.length - 1].x} cy={ptsReclaimed[ptsReclaimed.length - 1].y} r="5" fill="#10B981" />
            <text
              x={width - padR}
              y={ptsReclaimed[ptsReclaimed.length - 1].y - 10}
              textAnchor="end"
              fill="#10B981"
              className="text-[10px] font-mono-tactile font-[700]"
            >
              +{formatINRCompact(last.reclaimedCumulative)} RECLAIMED
            </text>
          </g>

          {/* Crosshair */}
          <line x1={activeX} y1={padT - 4} x2={activeX} y2={height - padB} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx={activeX} cy={yAt(active.reclaimedCumulative)} r="6" fill="#10B981" stroke="var(--color-paper-surface)" strokeWidth="2" />
          <circle cx={activeX} cy={yAt(-active.rotCumulative)} r="5" fill="#C93B2B" stroke="var(--color-paper-surface)" strokeWidth="2" />

          {/* Keyboard-Accessible Audit Points */}
          {ptsReclaimed.map((p) => (
            <circle
              key={p.i}
              tabIndex={0}
              role="button"
              aria-label={`${resolvedData[p.i].label}: reclaimed ${formatINR(resolvedData[p.i].reclaimedCumulative)}, rot drain ${formatINR(resolvedData[p.i].rotCumulative)}`}
              cx={p.x}
              cy={p.y}
              r={activeIdx === p.i ? 6 : 3.5}
              fill={activeIdx === p.i ? '#10B981' : 'var(--color-paper-surface)'}
              stroke="#10B981"
              strokeWidth="2"
              className="cursor-pointer focus:outline-none transition-all"
              onClick={() => setActiveIdx(p.i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveIdx(p.i);
              }}
            />
          ))}

          {/* X Axis Month Labels */}
          {resolvedData.map((d, i) => (
            <text
              key={i}
              x={xAt(i)}
              y={height - 14}
              textAnchor="middle"
              className={`text-[9px] font-mono-tactile ${i === todayIdx ? 'fill-[var(--color-ink-primary)] font-[700]' : 'fill-[var(--color-ink-secondary)]'}`}
            >
              {d.label}
            </text>
          ))}
        </svg>

        {/* Crosshair Telemetry Tooltip */}
        {active && (
          <div
            className="absolute top-0 pointer-events-none w-[164px] bg-[#1A1A18] text-white border border-white/15 shadow-xl p-3 space-y-1.5 font-mono-tactile"
            style={{ left: `clamp(0px, calc(${(activeX / width) * 100}% - 82px), calc(100% - 164px))` }}
          >
            <div className="flex items-center justify-between text-[9px] tracking-widest">
              <span className="font-[700] text-[#F2EFE6]">{active.label.toUpperCase()}</span>
              {active.projected ? (
                <span className="px-1.5 py-0.5 bg-white/10 text-white/60">PROJECTION</span>
              ) : (
                <span className="px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981]">REALIZED</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-white/50">
                <span className="w-1.5 h-1.5 bg-[#C93B2B]" /> ROT DRAIN
              </span>
              <span className="text-[#E54D3C] font-[600]">−{formatINR(active.rotCumulative)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-white/50">
                <span className="w-1.5 h-1.5 bg-[#10B981]" /> SIP WEALTH
              </span>
              <span className="text-[#10B981] font-[600]">+{formatINR(active.reclaimedCumulative)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] border-t border-white/15 pt-1.5">
              <span className="text-white/50">NET POSITION</span>
              <span className={`font-[700] ${active.reclaimedCumulative - active.rotCumulative >= 0 ? 'text-[#10B981]' : 'text-[#E54D3C]'}`}>
                {active.reclaimedCumulative - active.rotCumulative >= 0 ? '+' : '−'}
                {formatINR(Math.abs(active.reclaimedCumulative - active.rotCumulative))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Divergence Ledger Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tactile">
        <div className="p-3 rounded-none bg-[var(--color-paper-card)] border border-[#C93B2B]/30 space-y-0.5">
          <span className="text-[9px] font-[600] text-[#C93B2B] uppercase tracking-widest block">
            12-MO ROT DRAIN
          </span>
          <span className="font-serif-editorial text-[20px] font-[600] text-[#C93B2B] leading-none">
            −{formatINR(last?.rotCumulative ?? 0)}
          </span>
        </div>

        <div className="p-3 rounded-none bg-[var(--color-paper-card)] border border-[#10B981]/30 space-y-0.5">
          <span className="text-[9px] font-[600] text-[#10B981] uppercase tracking-widest block">
            12-MO SIP WEALTH
          </span>
          <span className="font-serif-editorial text-[20px] font-[600] text-[#10B981] leading-none">
            +{formatINR(last?.reclaimedCumulative ?? 0)}
          </span>
        </div>

        <div className="p-3 rounded-none bg-[#1A1A18] border border-white/10 space-y-0.5 text-right">
          <span className="text-[9px] font-[600] text-white/50 uppercase tracking-widest block">
            NET DIVERGENCE
          </span>
          <span className="font-serif-editorial text-[20px] font-[600] text-[#10B981] leading-none">
            +{formatINR(netDivergence)}
          </span>
        </div>
      </div>

      {/* Accessible Summary Caption */}
      <p className="text-[10px] text-[var(--color-ink-tertiary)] border-t border-[var(--color-paper-border)] pt-3">
        Active Audit Point: <strong className="text-[#10B981]">{active.label}</strong> —{' '}
        {formatINR(active.reclaimedCumulative)} reclaimed against {formatINR(active.rotCumulative)} drained.
        Projection assumes {ANNUAL_CAGR}% CAGR on micro-SIP capital.
      </p>
    </div>
  );
};
