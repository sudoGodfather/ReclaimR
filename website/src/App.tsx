import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './screens/LandingPage';
import { OnboardingFlow } from './screens/OnboardingFlow';
import { Dashboard } from './screens/Dashboard';
import { SubscriptionsList } from './screens/SubscriptionsList';
import { SubscriptionDetail } from './screens/SubscriptionDetail';
import { ExecutionConfirmation } from './screens/ExecutionConfirmation';
import { GoalsGarden } from './screens/GoalsGarden';
import { AlertsTimeline } from './screens/AlertsTimeline';
import { MonthlyRecoveryReport } from './screens/MonthlyRecoveryReport';
import { HowItWorks } from './screens/HowItWorks';
import { useTheme } from './useTheme';

const AppShell: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-brass font-sans">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<SubscriptionsList />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
          <Route path="/subscriptions/:id/cancelled" element={<ExecutionConfirmation />} />
          <Route path="/goals" element={<GoalsGarden />} />
          <Route path="/alerts" element={<AlertsTimeline />} />
          <Route path="/reports" element={<MonthlyRecoveryReport />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* Unknown paths fall back to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
