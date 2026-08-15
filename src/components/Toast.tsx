import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  variant: 'success' | 'info';
}

interface ToastContextValue {
  toast: (message: string, variant?: Toast['variant']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: Toast['variant'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast viewport — non-blocking, above everything */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 border px-4 py-3 rounded-none font-mono-tactile text-[12px] font-[600] uppercase tracking-wider shadow-[0_12px_36px_rgba(0,0,0,0.18)] ${
              t.variant === 'success'
                ? 'bg-[#10B981] text-white border-emerald-400/30'
                : 'bg-[#121316] text-[#38BDF8] border-white/10'
            }`}
          >
            {t.variant === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" aria-hidden="true" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
