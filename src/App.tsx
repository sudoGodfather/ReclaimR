import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import { MotionProvider } from './lib/motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { EasterEggRotListener } from './components/EasterEggRotListener';
import { EditorialState } from './components/ui/EditorialState';

// Code-Split Lazy Loaded Heavy Components
const LedgerRainCanvas = lazy(() => import('./components/LedgerRainCanvas').then((m) => ({ default: m.LedgerRainCanvas })));

// Code-Split Lazy Loaded Screen Components
const LandingPage = lazy(() => import('./screens/LandingPage').then((m) => ({ default: m.LandingPage })));
const OnboardingFlow = lazy(() => import('./screens/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow })));
const Dashboard = lazy(() => import('./screens/Dashboard').then((m) => ({ default: m.Dashboard })));
const SubscriptionsList = lazy(() => import('./screens/SubscriptionsList').then((m) => ({ default: m.SubscriptionsList })));
const SubscriptionDetail = lazy(() => import('./screens/SubscriptionDetail').then((m) => ({ default: m.SubscriptionDetail })));
const ExecutionConfirmation = lazy(() => import('./screens/ExecutionConfirmation').then((m) => ({ default: m.ExecutionConfirmation })));
const GoalsGarden = lazy(() => import('./screens/GoalsGarden').then((m) => ({ default: m.GoalsGarden })));
const AlertsTimeline = lazy(() => import('./screens/AlertsTimeline').then((m) => ({ default: m.AlertsTimeline })));
const MonthlyRecoveryReport = lazy(() => import('./screens/MonthlyRecoveryReport').then((m) => ({ default: m.MonthlyRecoveryReport })));
const HowItWorks = lazy(() => import('./screens/HowItWorks').then((m) => ({ default: m.HowItWorks })));
const LoginPage = lazy(() => import('./screens/LoginPage').then((m) => ({ default: m.LoginPage })));
const SettingsPage = lazy(() => import('./screens/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const StateAuditStudio = lazy(() => import('./screens/StateAuditStudio').then((m) => ({ default: m.StateAuditStudio })));
const NotePage = lazy(() => import('./screens/NotePage').then((m) => ({ default: m.NotePage })));
const NotFoundScreen = lazy(() => import('./screens/NotFoundScreen').then((m) => ({ default: m.NotFoundScreen })));

/* Suspense Loading Fallback */
const LoadingFallback = () => (
  <div className="max-w-[880px] mx-auto px-6 py-16">
    <EditorialState type="loading" />
  </div>
);

/* Scroll Restoration & Route Transition Wrapper */
const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      try {
        const transition = (document as any).startViewTransition?.(() => {});
        transition?.finished?.catch?.(() => {});
      } catch (e) {}
    }

    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 320);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isNavigating && (
        <div
          role="progressbar"
          aria-label="Navigating route"
          className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-[#10B981] animate-pulse pointer-events-none"
        />
      )}

      <div key={location.pathname} className="animate-page-enter">
        {children}
      </div>
    </>
  );
};

/* Site-wide Footer — hidden on the landing route ("/"), which renders its own FooterSection */
const SiteFooter: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return <Footer />;
};

export function App() {
  return (
    <MotionProvider>
      <AppProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[var(--color-paper-bg)] text-[var(--color-ink-primary)] font-sans-clean flex flex-col selection:bg-[#1B4D3E] selection:text-white relative">
              
              {/* Session-gated Editorial Preloader */}
              <Preloader />

              {/* Secret "rot" Easter Egg Keyboard Listener */}
              <EasterEggRotListener />

              {/* Accessible Skip to Main Content Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-5 focus:py-2.5 focus:bg-[#1B4D3E] focus:text-white focus:rounded-none focus:shadow-xl font-mono-tactile text-[12px] uppercase font-[600]"
              >
                Skip to main content
              </a>

              {/* Liquid-lens SVG displacement filter for the glass range slider thumbs */}
              <svg width="0" height="0" aria-hidden="true" focusable="false">
                <defs>
                  <filter id="mini-liquid-lens" x="-50%" y="-50%" width="200%" height="200%">
                    <feImage
                      x="0"
                      y="0"
                      result="normalMap"
                      href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><radialGradient id='invmap' cx='50%' cy='50%' r='75%'><stop offset='0%' stop-color='rgb(128,128,255)'/><stop offset='90%' stop-color='rgb(255,255,255)'/></radialGradient><rect width='100%' height='100%' fill='url(#invmap)'/></svg>"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="normalMap"
                      scale="-252"
                      xChannelSelector="R"
                      yChannelSelector="G"
                      result="displaced"
                    />
                    <feMerge>
                      <feMergeNode in="displaced" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              {/* Custom Lerp Desktop Cursor */}
              <CustomCursor />

              {/* Monospace Ledger Rain Canvas Background (Lazy Loaded) */}
              <Suspense fallback={null}>
                <LedgerRainCanvas />
              </Suspense>

              <Navbar />

              <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pt-[124px] lg:pt-16">
                <PageTransitionWrapper>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/onboarding" element={<OnboardingFlow />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/subscriptions" element={<SubscriptionsList />} />
                      <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
                      <Route path="/subscriptions/:id/cancelled" element={<ExecutionConfirmation />} />
                      <Route path="/goals" element={<GoalsGarden />} />
                      <Route path="/alerts" element={<AlertsTimeline />} />
                      <Route path="/reports" element={<MonthlyRecoveryReport />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/states" element={<StateAuditStudio />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/notes/:id" element={<NotePage />} />
                      <Route path="*" element={<NotFoundScreen />} />
                    </Routes>
                  </Suspense>
                </PageTransitionWrapper>
              </main>

              {/* Site-wide Footer (hidden on landing route, which renders its own FooterSection) */}
              <SiteFooter />

              {/* Minimal Cookie Consent Banner */}
              <CookieConsentBanner />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
    </MotionProvider>
  );
}

export default App;
