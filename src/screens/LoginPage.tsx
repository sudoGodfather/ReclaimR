import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EditorialInput } from '../components/ui/FormPrimitives';
import { ScrollReveal, TextReveal } from '../motion/ScrollPrimitives';
import { SEO } from '../components/SEO';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('aarav.sharma@reclaimr.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-paper-grid text-[var(--color-ink-primary)] font-sans-clean flex items-center justify-center p-6">
      <SEO
        title="Sign In — Autonomous Financial Telemetry"
        description="Sign in to ReclaimR to manage your active e-mandates, inspect rotting subscriptions, and review your automated Nifty 50 micro-SIP diversions."
        canonicalPath="/login"
      />
      
      <div className="max-w-[1120px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-xl)] overflow-hidden">
        
        {/* ------------------------------------------------------------------ */}
        {/* LEFT STAGE (50% / 6 COLUMNS): EDITORIAL MANIFESTO                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-6 bg-[#1A1A18] text-white p-8 sm:p-12 flex flex-col justify-between space-y-12 relative overflow-hidden">
          {/* Subtle Guillotine Engraving Background */}
          <div className="absolute top-0 right-0 w-64 h-64 guillotine-pattern opacity-20 pointer-events-none rounded-bl-none" />

          {/* Top Branding Metadata */}
          <div className="space-y-4 font-mono-tactile relative z-10">
            <div className="flex items-center gap-2 text-[11px] font-[600] text-[#10B981] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>RECLAIMR SECURE AUTHENTICATION</span>
            </div>
            
            <div className="text-[11px] text-white/50 space-y-0.5 border-l-2 border-[#10B981] pl-3">
              <div>№ RC-2026-AUTH-TOKEN</div>
              <div>JURISDICTION: BOMBAY // 19.0760° N</div>
            </div>
          </div>

          {/* Major Editorial Headline */}
          <div className="space-y-4 relative z-10">
            <TextReveal
              as="h1"
              text="Your money should know where it goes."
              type="words"
              staggerDuration={0.06}
              className="display-lg text-white font-[600] leading-[0.92]"
            />
            <p className="text-[15px] text-white/70 font-sans-clean leading-relaxed max-w-md pt-2">
              Sign in to manage your active e-mandates, inspect rotting subscriptions, and review your automated Nifty 50 micro-SIP diversions.
            </p>
          </div>

          {/* Bottom Security Seal */}
          <div className="p-4 rounded-none bg-white/5 border border-white/10 font-mono-tactile text-[12px] text-white/80 space-y-1 relative z-10">
            <div className="flex items-center gap-2 text-[#10B981] font-[600] uppercase text-[10px] tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>On-Device SMS Log Security</span>
            </div>
            <p className="text-[11px] text-white/60 font-sans-clean">
              Zero cloud credential storage. Local SMS log parsing occurs exclusively on your hardware.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT STAGE (50% / 6 COLUMNS): AUTHENTICATION FORM               */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-8">
          
          <div className="space-y-2">
            <span className="font-mono-tactile text-[11px] font-[600] uppercase tracking-widest text-[#1B4D3E] dark:text-[#2D6A4F]">
              [ ACCOUNT ACCESS ]
            </span>
            <h2 className="font-serif-editorial text-[32px] font-[600] tracking-tight">
              Sign In to ReclaimR
            </h2>
            <p className="text-[13px] text-[var(--color-ink-secondary)]">
              Enter your credentials or use single sign-on to access your cockpit.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-4 rounded-none bg-[#C93B2B]/10 border border-[#C93B2B]/30 text-[#C93B2B] font-mono-tactile text-[12px] font-[600]">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <EditorialInput
              label="Email Address"
              type="email"
              placeholder="aarav.sharma@reclaimr.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1.5 font-sans-clean">
              <div className="flex justify-between items-baseline font-mono-tactile">
                <label className="text-[11px] font-[600] text-[var(--color-ink-secondary)] uppercase tracking-wider">
                  Password <span className="text-[#C93B2B]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-[600] text-[#1B4D3E] dark:text-[#2D6A4F] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[44px] px-4 pr-11 rounded-none bg-[var(--color-paper-card)] text-[14px] font-[500] text-[var(--color-ink-primary)] border border-[var(--color-paper-border)] focus:outline-none focus:border-[#1B4D3E] focus-visible:ring-2 focus-visible:ring-[#1B4D3E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-primary)] cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              data-cursor-label="SIGN IN"
              className="w-full h-[52px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[15px] hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>{isLoading ? 'Executing Token Handshake...' : 'Sign In to Cockpit'}</span>
              <ArrowRight className="w-4 h-4 text-[#10B981]" />
            </button>
          </form>

          {/* Social Single Sign-On Divider */}
          <div className="space-y-4 font-mono-tactile">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[var(--color-paper-border)]" />
              <span className="bg-[var(--color-paper-surface)] px-3 text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider absolute">
                Or Continue With
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="h-[44px] rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[13px] font-[600] text-[var(--color-ink-primary)] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Google Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                className="h-[44px] rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[13px] font-[600] text-[var(--color-ink-primary)] hover:bg-[var(--color-paper-hover)] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Apple ID</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] flex items-center justify-center p-4">
          <div className="bg-[var(--color-paper-surface)] rounded-none p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[var(--color-paper-border)] space-y-4 font-mono-tactile">
            <h3 className="font-serif-editorial text-[22px] font-[600]">Reset Security Token</h3>
            <p className="font-sans-clean text-[13px] text-[var(--color-ink-secondary)]">
              Enter your email address to receive a secure one-time password link.
            </p>
            <EditorialInput label="Email Address" type="email" defaultValue={email} required />
            <div className="flex gap-3 pt-2 font-sans-clean">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-1/2 h-[44px] rounded-none bg-[var(--color-paper-card)] text-[var(--color-ink-primary)] font-[600] text-[13px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-1/2 h-[44px] rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px]"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
