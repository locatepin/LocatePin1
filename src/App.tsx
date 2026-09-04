import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { AccessLocationProvider } from "./context/AccessLocationContext";
import { LoginPage } from "./components/LoginPage";
import { SubscriptionModelPage } from "./components/SubscriptionModelPage";
import { Header } from "./components/Header";
import { NavigationTabs, TabType } from "./components/NavigationTabs";
import { WebsiteTrafficGeneratorBar } from "./components/WebsiteTrafficGeneratorBar";
import { RealTimeOverview } from "./components/RealTimeOverview";
import { TrafficGeneratorAI } from "./components/TrafficGeneratorAI";
import { GrowthOpportunitiesAI } from "./components/GrowthOpportunitiesAI";
import { BehaviorAnalytics } from "./components/BehaviorAnalytics";
import { AcquisitionChannels } from "./components/AcquisitionChannels";
import { LiveTrackerSandbox } from "./components/LiveTrackerSandbox";
import { GoogleMapsRankBooster } from "./components/GoogleMapsRankBooster";
import { ClientBillingAndPayments } from "./components/ClientBillingAndPayments";
import { UserProfileAndBusinessUpload } from "./components/UserProfileAndBusinessUpload";
import { BankPaymentModal } from "./components/BankPaymentModal";
import { ExportReportModal } from "./components/ExportReportModal";
import { AnomaliesBar } from "./components/AnomaliesBar";
import { AdminMembersSubscriptionPage } from "./components/AdminMembersSubscriptionPage";
import { MapPin } from "lucide-react";
import { Logo } from "./components/Logo";

function AppContent() {
  const { isAuthenticated, hasActiveSubscription, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("realtime");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBankPaymentModalOpen, setIsBankPaymentModalOpen] = useState(false);

  // 1. Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 text-[#e5e5e5]">
        <div className="animate-pulse mb-4">
          <Logo size="xl" showText={false} imageOnly={true} />
        </div>
        <p className="font-serif italic text-lg text-white font-bold">
          LocatePin<span className="text-[#c5a059] font-sans">.ai</span>
        </p>
        <span className="text-xs text-zinc-500 font-mono mt-1">Initializing Secure Session...</span>
      </div>
    );
  }

  // 2. Step 1: Show Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 3. Step 2: Show Subscription Model Page if user hasn't selected/activated a plan yet
  if (!hasActiveSubscription) {
    return <SubscriptionModelPage />;
  }

  // 4. Step 3: Main Secure Dashboard
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-sans selection:bg-[#c5a059] selection:text-black">
      {/* 1. Header with user profile & logout */}
      <Header
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSimulationDrawer={() => setActiveTab("traffic-generator")}
        onOpenPaymentModal={() => setIsBankPaymentModalOpen(true)}
        onOpenBusinessPortal={() => setActiveTab("business-portal")}
        onOpenAdminPanel={() => setActiveTab("admin-panel")}
      />

      {/* 2. Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 3. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Active Anomaly Alerts (if any) */}
        <AnomaliesBar />

        {/* Prominent Website URL & Keyword Traffic Generator Bar */}
        <WebsiteTrafficGeneratorBar
          onNavigateToMaps={() => setActiveTab("google-maps-seo")}
          onGenerated={() => {
            // Keep on current tab or guide to real-time telemetry
          }}
        />

        {/* Tab Views */}
        {activeTab === "realtime" && <RealTimeOverview />}
        {activeTab === "admin-panel" && <AdminMembersSubscriptionPage />}
        {activeTab === "google-maps-seo" && <GoogleMapsRankBooster />}
        {activeTab === "bank-billing" && <ClientBillingAndPayments />}
        {activeTab === "business-portal" && <UserProfileAndBusinessUpload />}
        {activeTab === "traffic-generator" && <TrafficGeneratorAI />}
        {activeTab === "growth-opportunities" && <GrowthOpportunitiesAI />}
        {activeTab === "behavior" && <BehaviorAnalytics />}
        {activeTab === "acquisition" && <AcquisitionChannels />}
        {activeTab === "live-tracker" && <LiveTrackerSandbox />}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0a0a0a] py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo size="xs" imageOnly={true} />
            <span className="font-serif italic text-sm text-white font-bold">LocatePin<span className="text-[#c5a059] font-sans">.ai</span></span>
            <span>&bull;</span>
            <span>Google Maps #1 Ranking & Real-Time Traffic Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
            <span>Lossless Concurrency Telemetry</span>
            <span>&bull;</span>
            <span className="text-[#c5a059]">Gemini 3.7 Flash Engine</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <BankPaymentModal
        isOpen={isBankPaymentModalOpen}
        onClose={() => setIsBankPaymentModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <AccessLocationProvider>
          <AppContent />
        </AccessLocationProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}
