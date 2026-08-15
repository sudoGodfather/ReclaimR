import React from 'react';

/**
 * EditorialGridOverlay
 * Renders the big checked grid column lines and subtle tactile grid annotations (e4, c5, Nf3, Nc6, O-O)
 * as seen in the "Money in Check" editorial art direction reference image.
 */
export const EditorialGridOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20 dark:opacity-15"
    >
      {/* 6-Column Vertical Grid Lines Spanning Screen */}
      <div className="max-w-[1280px] h-full mx-auto px-6 grid grid-cols-6 border-x border-[#1B4D3E]/15 dark:border-white/10">
        <div className="border-r border-[#1B4D3E]/10 dark:border-white/10 h-full relative">
          <span className="absolute top-[18%] left-4 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30 italic">
            e4
          </span>
          <span className="absolute top-[52%] left-6 font-mono-tactile text-[11px] text-[#1B4D3E]/35 dark:text-white/25">
            c3
          </span>
          <span className="absolute top-[82%] left-10 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30">
            d6
          </span>
        </div>

        <div className="border-r border-[#1B4D3E]/10 dark:border-white/10 h-full relative">
          <span className="absolute top-[24%] left-6 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30 italic">
            c5
          </span>
          <span className="absolute top-[68%] left-8 font-mono-tactile text-[11px] text-[#1B4D3E]/35 dark:text-white/25">
            Nf6
          </span>
        </div>

        <div className="border-r border-[#1B4D3E]/10 dark:border-white/10 h-full relative">
          <span className="absolute top-[32%] left-4 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30">
            Nf3
          </span>
          <span className="absolute top-[90%] left-6 font-mono-tactile text-[11px] text-[#1B4D3E]/35 dark:text-white/25">
            S C R O L L ↓
          </span>
        </div>

        <div className="border-r border-[#1B4D3E]/10 dark:border-white/10 h-full relative">
          <span className="absolute top-[28%] right-6 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30">
            Nc6
          </span>
          <span className="absolute top-[70%] right-8 font-mono-tactile text-[11px] text-[#1B4D3E]/35 dark:text-white/25">
            d3
          </span>
        </div>

        <div className="border-r border-[#1B4D3E]/10 dark:border-white/10 h-full relative">
          <span className="absolute top-[48%] left-4 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30">
            Bc4
          </span>
          <span className="absolute top-[88%] left-6 font-mono-tactile text-[11px] text-[#1B4D3E]/35 dark:text-white/25">
            O-O
          </span>
        </div>

        <div className="h-full relative">
          <span className="absolute top-[42%] right-6 font-mono-tactile text-[11px] text-[#1B4D3E]/40 dark:text-white/30">
            Bc5
          </span>
          <span className="absolute top-[60%] right-4 font-mono-tactile text-[10px] tracking-widest uppercase text-[#1B4D3E]/30 dark:text-white/20">
            N // S
          </span>
        </div>
      </div>
    </div>
  );
};
