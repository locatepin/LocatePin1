import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  Download,
  Sparkles,
  Play,
  Pause,
  Zap,
  Globe,
  RefreshCw,
  Sliders,
  Building2,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  UserCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { OFFICIAL_BANK_DETAILS, INITIAL_USER_ACCOUNTS } from "../data/bankAndSubscriptionData";
import { WelcomeEmailModal } from "./WelcomeEmailModal";
import { Logo } from "./Logo";
import { LiveAccessLocationPill } from "./LiveAccessLocationPill";

interface HeaderProps {
  onOpenExportModal: () => void;
  onOpenSimulationDrawer: () => void;
  onOpenPaymentModal?: () => void;
  onOpenBusinessPortal?: () => void;
  onOpenAdminPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExportModal,
  onOpenSimulationDrawer,
  onOpenPaymentModal,
  onOpenBusinessPortal,
  onOpenAdminPanel,
}) => {
  const {
    activeVisitors,
    isLiveStreaming,
    setIsLiveStreaming,
    selectedWebsite,
    setSelectedWebsite,
    timeRange,
    setTimeRange,
    triggerManualTrafficBurst,
    anomalies,
  } = useAnalytics();

  const { user, isTrialActive, trialSecondsRemaining, logout } = useAuth();

  const [burstDropdownOpen, setBurstDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [welcomeEmailModalOpen, setWelcomeEmailModalOpen] = useState(false);

  const formatTrialTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800 text-[#e5e5e5] px-3 sm:px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Brand & Live Status */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-3">
            <Logo size="md" imageOnly={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                  LocatePin<span className="text-[#c5a059] font-sans font-bold text-sm not-italic">.ai</span>
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] font-bold tracking-wide">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${!isLiveStreaming ? 'hidden' : ''}`}></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span>{isLiveStreaming ? "LIVE" : "PAUSED"}</span>
                </div>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-400 hidden sm:block">
                Google Maps #1 & Real-Time Traffic Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Domain & Time Selection + 1-Hour Free Trial Badge */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {/* 1-Hour Free Trial Active Pill */}
          {isTrialActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex-shrink-0 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">Trial: {formatTrialTime(trialSecondsRemaining)}</span>
              {onOpenPaymentModal && (
                <button
                  onClick={onOpenPaymentModal}
                  className="ml-1 px-1.5 py-0.5 rounded bg-[#c5a059] text-black font-sans font-bold text-[10px] hover:bg-[#d4b57a] transition-all cursor-pointer flex items-center gap-0.5"
                >
                  <span>Upgrade ₹5,000</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Domain selector */}
          <div className="flex items-center bg-[#121212] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 transition-colors flex-shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#c5a059] mr-1.5 flex-shrink-0" />
            <select
              id="website-selector"
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer font-medium max-w-[140px] sm:max-w-none text-xs"
            >
              <option value="locatepin.ai" className="bg-[#0a0a0a] text-zinc-200">locatepin.ai (Theme Aquarium)</option>
              <option value="themeaquarium.com" className="bg-[#0a0a0a] text-zinc-200">themeaquarium.com (Chennai)</option>
              <option value="app.locatepin.ai" className="bg-[#0a0a0a] text-zinc-200">app.locatepin.ai</option>
            </select>
          </div>

          {/* Live Access 10 km Location Pill */}
          <div className="flex-shrink-0">
            <LiveAccessLocationPill />
          </div>

          {/* Timeframe */}
          <div className="flex items-center bg-[#121212] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 transition-colors flex-shrink-0">
            <select
              id="timerange-selector"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer font-medium text-xs"
            >
              <option value="Today (Live)" className="bg-[#0a0a0a] text-zinc-200">Today (Live)</option>
              <option value="Last 24 Hours" className="bg-[#0a0a0a] text-zinc-200">Last 24 Hours</option>
              <option value="Last 7 Days" className="bg-[#0a0a0a] text-zinc-200">Last 7 Days</option>
              <option value="Last 30 Days" className="bg-[#0a0a0a] text-zinc-200">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Right: Controls, User Profile, & Actions */}
        <div className="flex items-center gap-2 justify-between md:justify-end flex-wrap sm:flex-nowrap">
          {/* Quick Traffic Generator Burst */}
          <div className="relative">
            <button
              id="traffic-burst-menu-btn"
              onClick={() => setBurstDropdownOpen(!burstDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15120d] hover:bg-[#1f1a10] border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Simulate Burst</span>
            </button>

            {burstDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-zinc-500 px-2 py-1 uppercase tracking-widest">
                  Inject Traffic Influx
                </p>
                <button
                  onClick={() => {
                    triggerManualTrafficBurst(25, "Social");
                    setBurstDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Viral Social Spike</span>
                  <span className="text-emerald-400 font-mono text-[11px]">+25 users</span>
                </button>
                <button
                  onClick={() => {
                    triggerManualTrafficBurst(60, "Organic Search");
                    setBurstDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>Google Search Surge</span>
                  <span className="text-emerald-400 font-mono text-[11px]">+60 users</span>
                </button>
                <button
                  onClick={() => {
                    triggerManualTrafficBurst(150, "Referral");
                    setBurstDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span>HackerNews Feature</span>
                  <span className="text-emerald-400 font-mono text-[11px]">+150 users</span>
                </button>
                <div className="border-t border-zinc-800 my-1"></div>
                <button
                  onClick={() => {
                    onOpenSimulationDrawer();
                    setBurstDropdownOpen(false);
                  }}
                  className="w-full text-center px-2 py-1.5 text-xs font-semibold text-[#c5a059] hover:bg-[#15120d] rounded-lg transition-colors"
                >
                  Configure AI Generator &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Direct KVB Bank Pay & UPI Button */}
          {onOpenPaymentModal && (
            <button
              id="header-bank-pay-btn"
              onClick={onOpenPaymentModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f1a10] hover:bg-[#2e2618] border border-[#c5a059]/60 text-[#c5a059] text-xs font-bold shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">KVB Pay (₹5,000)</span>
              <span className="sm:hidden">Pay</span>
            </button>
          )}

          {/* Export Reports Button */}
          <button
            id="export-reports-header-btn"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden lg:inline">Report</span>
          </button>

          {/* User Profile & Auth Pill */}
          {user && (
            <div className="relative">
              <button
                id="header-user-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-all cursor-pointer shadow-sm"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                        user.role === "admin"
                          ? "bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {user.role === "admin" ? "ADMIN" : "OWNER"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block font-mono truncate max-w-[120px] mt-0.5">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono truncate">{user.email}</p>
                      <span className="text-[10px] text-[#c5a059] block mt-0.5">
                        {user.role === "admin" ? "Super Admin Access" : (user.businessName || "Verified Business")}
                      </span>
                    </div>
                  </div>

                  {/* Account & Subscription Info */}
                  <div className="py-2.5 space-y-2">
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">
                        Active Access
                      </span>
                      <span className="text-white font-medium block truncate">
                        {isTrialActive ? `1-Hour Free Trial (${formatTrialTime(trialSecondsRemaining)})` : (user.activePlan || "₹5,000/mo Monthly Retainer")}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
                        {isTrialActive ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>1-Hour Trial Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified 24/7 Access</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Subscriptions Panel Link */}
                  {onOpenAdminPanel && (
                    <button
                      onClick={() => {
                        onOpenAdminPanel();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 rounded-lg flex items-center gap-2 font-bold transition-colors cursor-pointer border border-[#c5a059]/30"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Admin: Subscriptions & Members</span>
                    </button>
                  )}

                  {/* Billing Portal Link */}
                  {onOpenPaymentModal && (
                    <button
                      onClick={() => {
                        onOpenPaymentModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>KVB Bank & UPI Settlement</span>
                    </button>
                  )}

                  {/* Welcome Email Link */}
                  <button
                    onClick={() => {
                      setWelcomeEmailModalOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center gap-2 border-t border-zinc-800/80 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Welcome & Plan Email</span>
                  </button>

                  {/* Business Upload Portal Link */}
                  {onOpenBusinessPortal && (
                    <button
                      onClick={() => {
                        onOpenBusinessPortal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-900 rounded-lg flex items-center gap-2 border-t border-zinc-800/80 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Manage Business Profile</span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-2.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Return to Login)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Welcome Email Modal */}
      <WelcomeEmailModal
        isOpen={welcomeEmailModalOpen}
        onClose={() => setWelcomeEmailModalOpen(false)}
        onSelectPaid={onOpenPaymentModal}
      />
    </header>
  );
};
