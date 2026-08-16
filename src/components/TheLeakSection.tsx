import React, { useCallback, useRef, useState } from 'react';
import { Flame, ArrowRight, ShieldAlert, TrendingDown, LocateFixed } from 'lucide-react';
import { LEAK_SUBSCRIPTIONS, TOTAL_MONTHLY_LEAK, TOTAL_ANNUAL_LEAK, TEN_YEAR_LEAK_COMPOUND } from '../mock/leakData';
import { ScrollReveal, TextReveal, NumberCounter } from '../motion/ScrollPrimitives';
import { useNavigate } from 'react-router-dom';

function formatCoord(value: number, pos: string, neg: string) {
  const dir = value >= 0 ? pos : neg;
  return `${Math.abs(value).toFixed(4)}° ${dir}`;
}

export const TheLeakSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'locating' | 'denied' | 'unavailable'>('idle');

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocStatus('unavailable');
      return;
    }
    setLocStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocStatus('idle');
      },
      () => setLocStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-the-leak"
      className="py-24 px-6 border-t border-[var(--color-paper-border)] bg-[var(--color-paper-bg)] relative overflow-hidden font-sans-clean"
    >
      {/* Background Fine-line Ledger Grid */}
      <div className="max-w-[1120px] mx-auto space-y-16 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 font-mono-tactile text-[11px] font-[600] text-[#C93B2B] dark:text-[#E54D3C] uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-[#C93B2B]" />
              <span>02 / THE LEAK — INVISIBLE RECURRING ROT</span>
            </div>
            
            <h2 className="font-serif-editorial text-[36px] sm:text-[54px] font-[600] tracking-tight leading-[0.95] text-[var(--color-ink-primary)]">
              Small debits compound into major wealth loss.
            </h2>
            
            <p className="body-lg text-[var(--color-ink-secondary)]">
              A ₹199 stream here, a ₹1,299 unused gym pass there. Individually harmless. Together, they quietly strip your financial future.
            </p>
          </div>

          {/* Right Marginal Coordinates */}
          <div className="font-mono-tactile text-[11px] text-[var(--color-ink-tertiary)] uppercase tracking-wider space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#C93B2B] pl-4 md:pl-0 md:pr-4">
            <span className="block font-[600] text-[#C93B2B] dark:text-[#E54D3C]">AUDIT ID: #ROT-ACCUMULATOR</span>
            <span className="block tabular-nums">
              LATITUDE: {coords ? formatCoord(coords.lat, 'N', 'S') : '— press locate —'}
            </span>
            <span className="block tabular-nums">
              LONGITUDE: {coords ? formatCoord(coords.lon, 'E', 'W') : '—'}
            </span>
            <button
              type="button"
              onClick={locate}
              disabled={locStatus === 'locating'}
              className="inline-flex items-center gap-1.5 mt-1 font-[600] text-[#C93B2B] dark:text-[#E54D3C] hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${locStatus === 'locating' ? 'animate-spin' : ''}`} />
              {locStatus === 'locating' ? 'LOCATING…' : locStatus === 'denied' ? 'PERMISSION DENIED — RETRY' : locStatus === 'unavailable' ? 'GEOLOCATION UNAVAILABLE' : 'LOCATE MY DEVICE'}
            </button>
            <span className="block pt-1">STATUS: {coords ? 'DEVICE PINNED' : 'UNCHECKED DEBIT BLEED'}</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* INDIVIDUAL PAYMENTS ACCUMULATION STAGE                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Stage: Line Item Accumulation Stream (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between font-mono-tactile text-[11px] text-[var(--color-ink-tertiary)] uppercase tracking-widest border-b border-[var(--color-paper-border)] pb-2">
              <span>UNCHECKED AUTOMATED MANDATES</span>
              <span>MONTHLY COST</span>
            </div>

            <div className="space-y-3">
              {LEAK_SUBSCRIPTIONS.map((item, idx) => (
                <ScrollReveal
                  key={item.id}
                  direction="left"
                  distance={28}
                  delay={idx * 0.1}
                  className="p-4 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-sm hover:border-[#C93B2B]/40 transition-all flex items-center justify-between font-mono-tactile"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C] flex items-center justify-center font-[600] text-[12px]">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="font-[600] text-[14px] text-[var(--color-ink-primary)]">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[var(--color-ink-tertiary)]">
                        {item.descriptor} • Unused {item.lastUsedDays} days
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-editorial text-[20px] font-[600] text-[#C93B2B] dark:text-[#E54D3C]">
                      +₹{item.monthlyCost}
                    </span>
                    <span className="block text-[9px] text-[var(--color-ink-tertiary)] uppercase">/month</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Summation Rule Indicator */}
            <div className="pt-2 flex items-center gap-4 text-[#C93B2B] dark:text-[#E54D3C] font-mono-tactile text-[12px] font-[600]">
              <div className="flex-1 h-[2px] bg-[#C93B2B]/20 dark:bg-[#E54D3C]/20" />
              <span>TOTAL ACCUMULATION MERGE</span>
              <div className="flex-1 h-[2px] bg-[#C93B2B]/20 dark:bg-[#E54D3C]/20" />
            </div>
          </div>

          {/* Right Stage: Aggregated Financial Impact Cards (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Monthly Aggregated Leak Card */}
            <ScrollReveal direction="up" delay={0.3} className="p-7 rounded-none bg-[var(--color-paper-card)] border border-[#C93B2B]/30 shadow-[var(--shadow-lg)] space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between font-mono-tactile">
                <span className="eyebrow text-[#C93B2B] dark:text-[#E54D3C] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  AGGREGATED MONTHLY BLEED
                </span>
                <span className="text-[10px] font-[600] px-2.5 py-0.5 rounded-none bg-[#C93B2B]/10 text-[#C93B2B] dark:text-[#E54D3C] uppercase">
                  UNCHECKED
                </span>
              </div>

              <div className="space-y-1">
                <NumberCounter
                  targetValue={TOTAL_MONTHLY_LEAK}
                  prefix="₹"
                  suffix="/month"
                  size="xl"
                  variant="crimson"
                />
                <p className="body-sm text-[var(--color-ink-secondary)]">
                  Quietly auto-debited every 30 days from your primary salary account.
                </p>
              </div>
            </ScrollReveal>

            {/* Annual Aggregated Leak Card */}
            <ScrollReveal direction="up" delay={0.4} className="p-7 rounded-none bg-[#1A1A18] text-white space-y-4 shadow-xl relative overflow-hidden border border-white/10">
              <div className="flex items-center justify-between font-mono-tactile text-[11px]">
                <span className="text-[#E54D3C] font-[600] uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  ANNUAL COMPOUNDED DRAIN
                </span>
                <span className="text-white/40 uppercase">365 DAYS</span>
              </div>

              <div className="space-y-1">
                <div className="font-serif-editorial font-[600] text-[48px] sm:text-[56px] text-[#E54D3C] tracking-tight leading-none">
                  ₹{TOTAL_ANNUAL_LEAK.toLocaleString('en-IN')}+
                  <span className="font-sans-clean text-[16px] text-white/60 font-[400] ml-2">/year</span>
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed font-sans-clean">
                  Equal to a round-trip ticket to Tokyo or 12 months of index fund investing.
                </p>
              </div>

              <div className="p-4 rounded-none bg-white/5 border border-white/10 font-mono-tactile text-[12px] flex items-center justify-between text-white/80">
                <span>10-Yr Wealth Opportunity Cost:</span>
                <span className="font-[600] text-[#10B981]">₹{(TEN_YEAR_LEAK_COMPOUND / 100000).toFixed(2)} Lakhs</span>
              </div>
            </ScrollReveal>

            {/* Action CTA Trigger */}
            <ScrollReveal direction="up" delay={0.5} className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="w-full h-[52px] rounded-none bg-[#1B4D3E] text-[#FAF7F2] dark:bg-[#2D6A4F] font-[600] text-[15px] hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Plug Your Sub-Rot Leak Now</span>
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
              </button>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
