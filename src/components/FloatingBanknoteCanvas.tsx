import React, { useState, useEffect, useRef } from 'react';
import { Eye, RotateCw, Sparkles, Shield, Lock, CheckCircle2 } from 'lucide-react';

interface FloatingBanknoteCanvasProps {
  reclaimedMonthly: number;
  decayRate: number; // 0 to 100
}

export const FloatingBanknoteCanvas: React.FC<FloatingBanknoteCanvasProps> = ({
  reclaimedMonthly,
  decayRate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeInspectorMark, setActiveInspectorMark] = useState<string | null>(null);

  // Mouse tracking for smooth 3D spring tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setRotation({
        x: (-y / rect.height) * 16,
        y: (x / rect.width) * 16,
      });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const totalTenYear = Math.round(reclaimedMonthly * ((Math.pow(1.01, 120) - 1) / 0.01));

  return (
    <div className="relative w-full max-w-[720px] mx-auto my-6" ref={containerRef}>
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2 font-mono-tactile text-[11px] uppercase tracking-wider text-[#6B6A66] dark:text-[#9CA3AF]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-[#10B981] animate-pulse" />
          <span>[ 3D DRIFTING CURRENCY CANVAS // RC-2026 ]</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#121316] dark:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Show Front' : 'Flip Note ↗'}</span>
          </button>
        </div>
      </div>

      {/* 3D Bill Wrapper */}
      <div
        className="relative w-full aspect-[2.1/1] rounded-none transition-transform duration-300 ease-out preserve-3d cursor-grab active:cursor-grabbing"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg) translateZ(0)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT SIDE OF BANKNOTE */}
        <div
          className={`absolute inset-0 rounded-none p-6 sm:p-8 flex flex-col justify-between overflow-hidden banknote-border transition-all ${
            isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{
            background: decayRate > 50
              ? 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FCA5A5 100%)'
              : 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
            color: decayRate > 50 ? '#991B1B' : '#065F46',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Guillotine Fine Pattern Overlay */}
          <div className="absolute inset-0 guillotine-pattern pointer-events-none opacity-40" />

          {/* Top Note Header */}
          <div className="relative z-10 flex items-start justify-between border-b border-current/20 pb-4">
            <div>
              <p className="font-mono-tactile text-[10px] sm:text-[11px] font-[600] uppercase tracking-[0.2em] opacity-80">
                RECLAIMR WEALTH RESERVE • INDIA
              </p>
              <h2 className="font-serif-editorial text-[22px] sm:text-[28px] font-[600] tracking-tight leading-tight mt-0.5">
                {decayRate > 50 ? 'Sub-Rot Bleed Certificate' : 'Nifty 50 Wealth Certificate'}
              </h2>
            </div>

            <div className="text-right font-mono-tactile">
              <span className="text-[10px] uppercase tracking-widest block opacity-70">SERIAL NO.</span>
              <span className="text-[12px] sm:text-[13px] font-[600] tracking-wider">№ RC-2026-SIP</span>
            </div>
          </div>

          {/* Middle Body */}
          <div className="relative z-10 my-auto py-2 flex flex-col sm:flex-row items-baseline justify-between gap-4">
            <div>
              <p className="font-mono-tactile text-[10px] uppercase tracking-widest opacity-80">
                Guaranteed Monthly Diversion
              </p>
              <div className="font-serif-editorial text-[36px] sm:text-[54px] font-[600] tracking-[-0.03em] leading-none">
                ₹{reclaimedMonthly.toLocaleString('en-IN')}
                <span className="font-sans-clean text-[16px] font-[500] opacity-80 ml-1">/month</span>
              </div>
            </div>

            <div className="sm:text-right font-mono-tactile space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-current/10 text-[11px] font-[600]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>10-Yr Value: ₹{(totalTenYear / 100000).toFixed(2)} Lakhs</span>
              </div>
              <p className="text-[10px] opacity-70 block">Auto-compounding @ 12% p.a.</p>
            </div>
          </div>

          {/* Bottom Security Seals & Interactive Inspector Pins */}
          <div className="relative z-10 flex items-center justify-between border-t border-current/20 pt-4 font-mono-tactile text-[10px] sm:text-[11px] uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInspectorMark(activeInspectorMark === 'watermark' ? null : 'watermark');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-none border transition-all cursor-pointer ${
                  activeInspectorMark === 'watermark' ? 'bg-current text-white dark:text-black border-transparent' : 'border-current/30 hover:bg-current/10'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>[1] Watermark</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInspectorMark(activeInspectorMark === 'mandate' ? null : 'mandate');
                }}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-none border transition-all cursor-pointer ${
                  activeInspectorMark === 'mandate' ? 'bg-current text-white dark:text-black border-transparent' : 'border-current/30 hover:bg-current/10'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>[2] AutoPay Token</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="font-[600]">AUTHENTICATED BY UPI AUTOPAY</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE OF BANKNOTE */}
        <div
          className={`absolute inset-0 rounded-none p-6 sm:p-8 flex flex-col justify-between overflow-hidden banknote-border transition-all bg-[#121316] text-white ${
            !isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex justify-between items-start border-b border-white/20 pb-4 font-mono-tactile text-[11px]">
            <div>
              <p className="text-[#10B981] font-[600] uppercase tracking-widest">AUTOPAY MANDATE GUILLOTINE</p>
              <p className="text-white/60 text-[10px] mt-0.5">RBI COMPLIANT DIRECT CANCEL ENGINE</p>
            </div>
            <span className="text-white/40">№ RECLAIMR-2026-BACK</span>
          </div>

          <div className="my-auto space-y-3 font-mono-tactile text-[12px]">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-none border border-white/10">
              <span className="text-white/60">Execution Latency:</span>
              <span className="font-[600] text-[#10B981]">Instant (&lt; 200ms)</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-none border border-white/10">
              <span className="text-white/60">Target Index:</span>
              <span className="font-[600] text-white">Nifty 50 Direct Plan (0% Commission)</span>
            </div>
          </div>

          <div className="border-t border-white/20 pt-3 flex justify-between items-center font-mono-tactile text-[10px] text-white/50">
            <span>IN RECLAIMR WE TRUST</span>
            <span className="text-[#10B981] font-[600] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED ZERO-ROT
            </span>
          </div>
        </div>
      </div>

      {/* Security Inspector Tooltip Overlay */}
      {activeInspectorMark && (
        <div className="mt-4 p-4 rounded-none bg-[#121316] text-white border border-white/10 font-sans-clean text-[13px] shadow-xl flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div>
            {activeInspectorMark === 'watermark' && (
              <>
                <p className="font-[600] text-[#10B981]">Security Feature 01: On-Device Watermark</p>
                <p className="text-white/80 text-[12px] mt-1">
                  Your SMS transaction logs never hit a cloud server. Local heuristics identify recurring merchant debit strings and generate an encrypted token on your device.
                </p>
              </>
            )}
            {activeInspectorMark === 'mandate' && (
              <>
                <p className="font-[600] text-[#10B981]">Security Feature 02: UPI AutoPay Revocation Token</p>
                <p className="text-white/80 text-[12px] mt-1">
                  When you tap cancel, ReclaimR sends a formal revocation signal to your bank e-mandate registry before your next debit cycle triggers.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
