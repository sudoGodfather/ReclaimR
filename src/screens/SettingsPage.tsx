import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Database, Trash2, RefreshCw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { EditorialInput, EditorialSelect, EditorialSlider } from '../components/ui/FormPrimitives';
import { ScrollReveal } from '../motion/ScrollPrimitives';
import { SEO } from '../components/SEO';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetDemoData } = useApp();

  const [activeSection, setActiveSection] = useState<string>('01');
  
  // Profile & System Pointer State
  const [userName, setUserName] = useState<string>('Aarav Sharma');
  const [email, setEmail] = useState<string>('aarav.sharma@reclaimr.in');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [bank, setBank] = useState<string>('HDFC Bank');
  const [cursorMode, setCursorMode] = useState<string>(
    () => localStorage.getItem('reclaimr-custom-cursor') || 'enabled'
  );

  const handleCursorChange = (newMode: string) => {
    setCursorMode(newMode);
    localStorage.setItem('reclaimr-custom-cursor', newMode);
    window.dispatchEvent(new Event('storage'));
  };

  // Subscriptions & Decay Thresholds
  const [rotThresholdDays, setRotThresholdDays] = useState<number>(30);
  const [defaultCategory, setDefaultCategory] = useState<string>('Streaming');

  // Financial Goals Default
  const [defaultCagr, setDefaultCagr] = useState<number>(12);
  const [defaultFund, setDefaultFund] = useState<string>('Nifty 50 Direct Index');

  // Notifications
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);

  const sections = [
    { id: '01', number: '01', title: 'PROFILE', desc: 'Personal telemetry & bank mandate identity' },
    { id: '02', number: '02', title: 'SUBSCRIPTIONS', desc: 'AutoPay scan heuristics & decay rules' },
    { id: '03', number: '03', title: 'FINANCIAL GOALS', desc: 'Default micro-SIP allocation & index targets' },
    { id: '04', number: '04', title: 'NOTIFICATIONS', desc: 'Renewal lead time & rot alert sensitivity' },
    { id: '05', number: '05', title: 'SECURITY', desc: 'On-device log encryption & biometrics' },
    { id: '06', number: '06', title: 'DATA', desc: 'Export wealth audit CSV/PDF & local storage' },
    { id: '07', number: '07', title: 'ACCOUNT', desc: 'System reset & destructive actions' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Settings updated successfully', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all ReclaimR subscriptions, goals, and alerts to initial demo data?')) {
      resetDemoData();
      toast('Demo data reset to default state', 'info');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10 space-y-10 font-sans-clean text-[var(--color-ink-primary)]">
      <SEO
        title="Settings Control Index"
        description="Configure telemetry scanning rules, micro-SIP compounding defaults, security protocols, and account data export in ReclaimR."
        canonicalPath="/settings"
      />
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-paper-border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono-tactile text-[11px] font-[600] tracking-[0.12em] uppercase text-[#1B4D3E] dark:text-[#2D6A4F]">
            [ SYSTEM PREFERENCES & ACCOUNT INDEX ]
          </p>
          <h1 className="font-serif-editorial text-[36px] md:text-[52px] font-[600] tracking-tight leading-[0.95]">
            Settings Control Index
          </h1>
          <p className="body-lg text-[var(--color-ink-secondary)] pt-1">
            Configure telemetry scanning rules, micro-SIP compounding defaults, security protocols, and account data export.
          </p>
        </div>

        <div className="font-mono-tactile text-[11px] text-[var(--color-ink-tertiary)] uppercase tracking-wider space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-[#1B4D3E] pl-4 md:pl-0 md:pr-4 shrink-0">
          <span className="block font-[600] text-[#1B4D3E] dark:text-[#2D6A4F]">№ RC-2026-SETTINGS</span>
          <span className="block">BUILD VERSION: v4.2.0-PROD</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* EDITORIAL INDEX SIDEBAR & CONTENT LAYOUT (ASYMMETRICAL 12-COL GRID)  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Index Navigation (4 Columns) */}
        <div className="lg:col-span-4 space-y-2 font-mono-tactile">
          <span className="eyebrow text-[var(--color-ink-tertiary)] block pb-1">INDEX SECTIONS</span>
          
          <div className="divide-y divide-[var(--color-paper-border)] border-t border-b border-[var(--color-paper-border)]">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full py-3.5 px-3 text-left transition-all cursor-pointer flex items-center justify-between group ${
                  activeSection === sec.id
                    ? 'bg-[#1B4D3E] dark:bg-[#2D6A4F] text-white font-[600]'
                    : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] hover:bg-[var(--color-paper-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[12px] font-[600] ${activeSection === sec.id ? 'text-[#10B981]' : 'text-[#1B4D3E]'}`}>
                    {sec.number}
                  </span>
                  <span className="text-[13px] tracking-wider uppercase">{sec.title}</span>
                </div>

                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeSection === sec.id ? 'translate-x-1 text-[#10B981]' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel Stage (8 Columns) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-none bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] shadow-[var(--shadow-md)] space-y-6">
          
          {/* SECTION 01: PROFILE */}
          {activeSection === '01' && (
            <ScrollReveal direction="up" className="space-y-6">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#1B4D3E] uppercase tracking-wider block">01 / IDENTITY & MANDATES</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Profile Telemetry</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <EditorialInput label="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                <EditorialInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <EditorialInput label="Phone (SMS Log Scan)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <EditorialSelect
                  label="Primary Bank Mandate"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  options={[
                    { value: 'HDFC Bank', label: 'HDFC Bank Direct AutoPay' },
                    { value: 'ICICI Bank', label: 'ICICI Bank iMobile E-Mandate' },
                    { value: 'SBI', label: 'State Bank of India YONO' },
                    { value: 'Axis Bank', label: 'Axis Bank AutoPay Gateway' },
                  ]}
                />
                <EditorialSelect
                  label="UI Mouse Pointer Mode"
                  value={cursorMode}
                  onChange={(e) => handleCursorChange(e.target.value)}
                  options={[
                    { value: 'enabled', label: 'Ultra-Fast Precision Custom Cursor' },
                    { value: 'disabled', label: 'Native OS System Cursor (Default Arrow)' },
                  ]}
                  helperText="Switch between high-precision custom cursor and standard OS mouse cursor"
                />
                <button type="submit" className="h-[46px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px] hover:bg-black transition-colors cursor-pointer">
                  Save Profile Settings
                </button>
              </form>
            </ScrollReveal>
          )}

          {/* SECTION 02: SUBSCRIPTIONS */}
          {activeSection === '02' && (
            <ScrollReveal direction="up" className="space-y-6">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#1B4D3E] uppercase tracking-wider block">02 / DECAY RULES</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Subscription Rot Heuristics</h2>
              </div>

              <div className="space-y-5">
                <EditorialSlider
                  label="Inactivity Rot Threshold"
                  value={rotThresholdDays}
                  onChange={(v) => setRotThresholdDays(v)}
                  min={15}
                  max={60}
                  valueDisplay={`${rotThresholdDays} Days Unused`}
                  minLabel="15 Days (Aggressive)"
                  maxLabel="60 Days (Relaxed)"
                />

                <EditorialSelect
                  label="Default Filter Category"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                  options={[
                    { value: 'Streaming', label: 'Streaming Services' },
                    { value: 'Fitness', label: 'Fitness & Gym' },
                    { value: 'Software', label: 'Design & Software' },
                    { value: 'Publications', label: 'Publications & News' },
                  ]}
                />

                <button type="button" onClick={() => toast('Subscription rules saved', 'success')} className="h-[46px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px]">
                  Save Rot Heuristics
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION 03: FINANCIAL GOALS */}
          {activeSection === '03' && (
            <ScrollReveal direction="up" className="space-y-6">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#10B981] uppercase tracking-wider block">03 / MICRO-SIP ROUTING</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Financial Goal Defaults</h2>
              </div>

              <div className="space-y-5">
                <EditorialSelect
                  label="Target Index Allocation Fund"
                  value={defaultFund}
                  onChange={(e) => setDefaultFund(e.target.value)}
                  options={[
                    { value: 'Nifty 50 Direct Index', label: 'Nifty 50 Direct Index Fund (0% Expense)' },
                    { value: 'Nifty Next 50', label: 'Nifty Next 50 Index Fund' },
                    { value: 'Parag Parikh Flexi Cap', label: 'Parag Parikh Flexi Cap Fund' },
                  ]}
                />

                <EditorialSlider
                  label="Projected CAGR Return Benchmark"
                  value={defaultCagr}
                  onChange={(v) => setDefaultCagr(v)}
                  min={8}
                  max={18}
                  valueDisplay={`${defaultCagr}% / Year`}
                  minLabel="8% Conservative"
                  maxLabel="18% Aggressive"
                />

                <button type="button" onClick={() => toast('SIP defaults updated', 'success')} className="h-[46px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px]">
                  Update Micro-SIP Defaults
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION 04: NOTIFICATIONS */}
          {activeSection === '04' && (
            <ScrollReveal direction="up" className="space-y-6">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#1B4D3E] uppercase tracking-wider block">04 / RENEWAL WARNINGS</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Notification Sensitivity</h2>
              </div>

              <div className="space-y-5 font-mono-tactile">
                <EditorialSlider
                  label="Renewal Lead Time Warning"
                  value={leadTimeDays}
                  onChange={(v) => setLeadTimeDays(v)}
                  min={1}
                  max={7}
                  valueDisplay={`${leadTimeDays} Days Before Auto-Debit`}
                  minLabel="1 Day"
                  maxLabel="7 Days"
                />

                <button type="button" onClick={() => toast('Notification preferences saved', 'success')} className="h-[46px] px-6 rounded-none bg-[#1A1A18] text-white dark:bg-[#F4F0E6] dark:text-[#1A1A18] font-[600] text-[13px]">
                  Save Notification Settings
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION 05: SECURITY */}
          {activeSection === '05' && (
            <ScrollReveal direction="up" className="space-y-6 font-mono-tactile">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#10B981] uppercase tracking-wider block">05 / HARDWARE ENCRYPTION</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Security & Local Tokens</h2>
              </div>

              <div className="p-5 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-[600]">SMS Parser Security Key</span>
                  <span className="text-[#10B981] font-[600]">ACTIVE ✓</span>
                </div>
                <p className="font-sans-clean text-[12px] text-[var(--color-ink-secondary)]">
                  On-device AES-256 local token key matching SMS debit formats.
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION 06: DATA */}
          {activeSection === '06' && (
            <ScrollReveal direction="up" className="space-y-6 font-mono-tactile">
              <div className="border-b border-[var(--color-paper-border)] pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#1B4D3E] uppercase tracking-wider block">06 / AUDIT EXPORT</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] mt-0.5">Data & Exports</h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => toast('Wealth Audit CSV exported', 'success')}
                  className="h-[44px] px-6 rounded-none bg-[var(--color-paper-card)] border border-[var(--color-paper-border)] text-[13px] font-[600] cursor-pointer"
                >
                  Export Wealth Audit CSV 📥
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION 07: ACCOUNT (DESTRUCTIVE ZONE) */}
          {activeSection === '07' && (
            <ScrollReveal direction="up" className="space-y-6 font-mono-tactile">
              <div className="border-b border-[#C93B2B]/40 pb-4">
                <span className="font-mono-tactile text-[11px] font-[600] text-[#C93B2B] uppercase tracking-wider block">07 / DESTRUCTIVE ZONE</span>
                <h2 className="font-serif-editorial text-[24px] font-[600] text-[#C93B2B] mt-0.5">Account & System Reset</h2>
              </div>

              <div className="p-5 rounded-none bg-[#C93B2B]/10 border border-[#C93B2B]/30 space-y-3 font-sans-clean">
                <h3 className="font-mono-tactile font-[600] text-[14px] text-[#C93B2B]">Reset Demo Application Data</h3>
                <p className="text-[13px] text-[var(--color-ink-secondary)]">
                  Resets all rotting subscriptions, cancelled mandates, and micro-SIP goal progress back to the default demo state.
                </p>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="h-[42px] px-6 rounded-none bg-[#C93B2B] text-white font-[600] text-[13px] hover:bg-[#a82d1f] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Demo Application Data</span>
                </button>
              </div>
            </ScrollReveal>
          )}

        </div>

      </div>
    </div>
  );
};
