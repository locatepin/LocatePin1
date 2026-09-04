import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Building2,
  Copy,
  Check,
  Zap,
  MapPin,
  Lock,
  LogOut,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  Mail,
  ExternalLink,
  Globe,
  Coins,
} from "lucide-react";
import { OFFICIAL_BANK_DETAILS } from "../data/bankAndSubscriptionData";
import { WelcomeEmailModal } from "./WelcomeEmailModal";
import { Logo } from "./Logo";
import { LiveAccessLocationPill } from "./LiveAccessLocationPill";
import { useCurrency } from "../context/CurrencyContext";
import { CurrencySelector } from "./CurrencySelector";
import { BankPaymentModal } from "./BankPaymentModal";

export const SubscriptionModelPage: React.FC = () => {
  const { user, activateSubscription, startFreeTrial, logout } = useAuth();

  const userEmail = user?.email?.toLowerCase() || "";
  const isHjbVipUser = userEmail === "digi.hjb@gmail.com";
  const isRaviVipUser = userEmail === "digitalhkravibatterypoint@gmail.com";
  const isVipUser = isHjbVipUser || isRaviVipUser;

  const defaultBizName = isHjbVipUser
    ? "HJB Digital Enterprise Hub"
    : isRaviVipUser
    ? "HK Ravi Battery Point"
    : "THEME AQUARIUM";

  const defaultWebsite = isHjbVipUser
    ? "https://hjbdigital.com"
    : isRaviVipUser
    ? "https://hkravibatterypoint.com"
    : "https://themeaquarium.com";

  const defaultCity = isHjbVipUser
    ? "Chennai (Multi-Location Hub / OMR & Anna Nagar)"
    : isRaviVipUser
    ? "Chennai (Tambaram / GST Road & Multi-Location)"
    : "Chennai (Anna Nagar)";

  const defaultUtr = isHjbVipUser
    ? "VIP-1YR-ENTERPRISE-HJB-DIGI"
    : isRaviVipUser
    ? "VIP-1YR-ENTERPRISE-GRANT-2026"
    : "";

  const [selectedPlan, setSelectedPlan] = useState<string>(
    isVipUser
      ? "Enterprise Multi-Location (1-Year Free VIP Pass)"
      : "Google Pay & Paytm Monthly SEO (₹5,000/mo)"
  );
  const [businessName, setBusinessName] = useState(
    user?.businessName || defaultBizName
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    user?.website || defaultWebsite
  );
  const [targetCity, setTargetCity] = useState(
    user?.city || defaultCity
  );
  const [utrNumber, setUtrNumber] = useState(defaultUtr);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isWelcomeEmailOpen, setIsWelcomeEmailOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { selectedCurrency, currencyInfo, getDualDisplay } = useCurrency();

  const proPriceDual = getDualDisplay(5000);
  const entPriceDual = getDualDisplay(15000);

  const isTrialExpired = user?.subscriptionStatus === "expired";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStartTrial = () => {
    setIsActivating(true);
    setTimeout(() => {
      startFreeTrial(
        businessName.trim() || defaultBizName,
        websiteUrl.trim() || defaultWebsite
      );
      setIsActivating(false);
    }, 400);
  };

  const handleActivatePaid = (planToActivate?: string) => {
    setIsActivating(true);
    const plan = planToActivate || selectedPlan;
    setTimeout(() => {
      activateSubscription(
        plan,
        businessName.trim() || defaultBizName,
        websiteUrl.trim() || defaultWebsite,
        utrNumber.trim() || (isVipUser ? defaultUtr : undefined)
      );
      setIsActivating(false);
    }, 600);
  };

  const plans = [
    {
      id: "trial-1h",
      name: "1-Hour Full-Access Free Trial",
      price: "₹0",
      period: "for 1 hour",
      trafficTarget: "10,000 live signals",
      features: [
        "1 Hour of unlimited Google Maps #1 rank simulation",
        "Live Locate Pin precision GPS radar & coordinates lock",
        "Instant concurrent visitor traffic burst generator",
        "Chennai & Bangalore geo-grid prominence view",
        "Zero payment & zero credit card needed to test",
      ],
      badge: "Free Instant Access",
      popular: false,
      isTrial: true,
      isVipFree: false,
    },
    {
      id: "pro",
      name: "Google Pay & Paytm Monthly SEO",
      price: proPriceDual.primary,
      period: "/ month",
      originalPrice: selectedCurrency !== "INR" ? proPriceDual.secondary : undefined,
      trafficTarget: "50,000 visits/mo",
      features: [
        "#1 Google Maps Dominance in Chennai & Bangalore 24/7",
        "Continuous high-intent GPS route directions generator",
        "Automated daily AI keyword indexing & rank lock",
        "Direct settlement via Google Pay & Paytm",
        "Karur Vysya Bank instant UTR clearance (Moorthy S L)",
        "VIP support & instant local anomaly auto-healing",
        selectedCurrency !== "INR" ? `Payable in ${selectedCurrency} at bank forex rate` : "Accepts all global currencies (USD, EUR, etc.)",
      ],
      badge: "Official Retainer & Unlimited",
      popular: !isVipUser,
      isTrial: false,
      isVipFree: false,
    },
    {
      id: "enterprise",
      name: "Enterprise Multi-Location",
      price: isVipUser ? "₹0" : entPriceDual.primary,
      period: isVipUser ? "for 1 Full Year (VIP Free Grant)" : "/ month",
      originalPrice: isVipUser ? "₹15,000/mo (₹1,80,000/yr)" : (selectedCurrency !== "INR" ? entPriceDual.secondary : undefined),
      trafficTarget: "150,000 visits/mo",
      features: [
        "Multi-branch & franchise ranking grid",
        "Unlimited custom high-intent keywords",
        "Real-time concurrent visitor influx API",
        "Dedicated SEO account executive",
        "Corporate NEFT / RTGS & SWIFT Wire invoicing",
        ...(isVipUser
          ? [
              "365 Days 100% Free VIP Enterprise Access Granted",
              "Super Admin Moorthy S L Authorized",
            ]
          : []),
      ],
      badge: isVipUser ? "🎉 1-Year Free VIP Grant" : "Enterprise",
      popular: isVipUser,
      isTrial: false,
      isVipFree: isVipUser,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Subtle Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between z-10 border-b border-zinc-800/80 bg-[#080808]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="sm" imageOnly={true} />
          <div>
            <span className="font-serif italic text-lg tracking-tight text-white flex items-center gap-1 font-bold">
              LocatePin<span className="text-[#c5a059] font-sans font-bold text-sm not-italic">.ai</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-400 block">
              Step 2 of 2: Subscription & Activation
            </span>
          </div>
        </div>

        {/* User Authenticated Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LiveAccessLocationPill />
          </div>

          <CurrencySelector variant="pill" />

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "User"}
              className="w-5 h-5 rounded-full object-cover border border-zinc-700"
            />
            <span className="text-white font-medium truncate max-w-[100px] sm:max-w-[130px]">
              {user?.email}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline">
              Verified
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Sign out & switch account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-8 z-10 space-y-6">
        
        {/* Welcome Email Dispatched Notification Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-zinc-900/40 border border-blue-500/30 text-blue-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Mail className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white text-xs sm:text-sm font-bold">
                  Welcome Email Dispatched to {user?.email}
                </strong>
                <span className="px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[9px] border border-blue-500/30">
                  Sent
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                We've delivered your welcome packet, account details, and subscription plan options directly to your inbox.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWelcomeEmailOpen(true)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Welcome Mail</span>
          </button>
        </div>

        {/* Trial Expired Alert Banner (if expired) */}
        {isTrialExpired && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <strong className="block text-sm text-white font-bold">1-Hour Free Trial Expired</strong>
                <span>Your 60-minute test period has completed. Select the ₹5,000/month plan to activate permanent 24/7 access.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-mono text-[10px] uppercase font-bold border border-red-500/30 whitespace-nowrap">
              Action Required
            </span>
          </div>
        )}

        {/* 1-Year Free Enterprise VIP Grant Banner for digi.hjb@gmail.com & digitalhkravibatterypoint@gmail.com */}
        {isVipUser && (
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#241a08] via-[#1a1406] to-[#0c0903] border-2 border-[#c5a059] shadow-[0_0_35px_rgba(197,160,89,0.3)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059] text-[#c5a059] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Year Free VIP Enterprise Grant Active</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white">
                Welcome {isHjbVipUser ? "HJB Digital (Enterprise VIP)" : isRaviVipUser ? "Ravi (HK Ravi Battery Point)" : user?.name || "VIP Member"}!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                Super Admin <strong className="text-white">Moorthy S L</strong> has approved a <strong className="text-[#c5a059]">100% Free 1-Year Enterprise Multi-Location Subscription</strong> (₹1,80,000 Annual Value Waived). Unlimited keywords and 150,000 visits/mo quota are unlocked.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleActivatePaid("Enterprise Multi-Location (1-Year Free VIP Pass)")}
              disabled={isActivating}
              className="w-full md:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#c5a059] to-[#dfc082] hover:from-[#d4b57a] hover:to-[#ebcf99] text-black font-bold text-sm shadow-[0_0_25px_rgba(197,160,89,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 min-h-[48px]"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Enter Dashboard (Free 1-Yr VIP) &rarr;</span>
            </button>
          </div>
        )}

        {/* 1-Hour Free Trial Hero Callout (If not yet expired and not VIP) */}
        {!isTrialExpired && !isVipUser && (
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-950/50 via-[#101915] to-[#0a0a0a] border-2 border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Instant 1-Hour Free Trial Available</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white">
                Try Locate Pin Free for 1 Hour
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                Get full instant access to Google Maps #1 rank booster, live GPS Locate Pin radar, and real-time visitor influx immediately. No credit card or UTR required.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartTrial}
              disabled={isActivating}
              className="w-full md:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 min-h-[48px]"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Start 1-Hour Free Trial &rarr;</span>
            </button>
          </div>
        )}

        {/* Global Multi-Currency Acceptance Notice */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#17120a] via-[#0d0d0d] to-[#0d0d0d] border border-[#c5a059]/40 shadow-[0_0_30px_rgba(197,160,89,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059] text-black uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Global Multi-Currency Active
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {selectedCurrency === "INR" ? "Base Currency: Indian Rupee (₹)" : `1 ${selectedCurrency} ≈ ₹${currencyInfo.rateToINR} INR`}
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                SWIFT: {OFFICIAL_BANK_DETAILS.swiftCode}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-serif italic text-white">
              Accepting All World Currencies for INR Subscription Retainer
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Pay the ₹5,000/mo retainer in your home currency (<strong className="text-zinc-200">USD, EUR, GBP, AED, SGD, CAD, AUD, SAR, QAR, JPY</strong> & all 35+ global currencies). Inward wire remittances settle directly into Karur Vysya Bank via SWIFT Code: <span className="font-mono text-[#c5a059] font-bold">{OFFICIAL_BANK_DETAILS.swiftCode}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#c5a059] to-[#dfc082] hover:from-[#d4b57a] hover:to-[#ebcf99] text-black font-bold text-xs shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Open Payment Gateway (All Currencies) &rarr;</span>
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c160a] border border-[#c5a059]/40 text-[#c5a059] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Google Maps & SEO Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-white tracking-tight">
            Choose Your Growth & Retainer Model
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Official monthly retainer ₹5,000 with direct Karur Vysya Bank, Google Pay & Paytm settlement to Moorthy S L.
          </p>
        </div>

        {/* 1. Subscription Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isSelected = selectedPlan.includes(plan.name);
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(`${plan.name} (${plan.price}${plan.period.includes("month") ? "/mo" : ""})`)}
                className={`relative rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? "bg-[#120e08] border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)] ring-1 ring-[#c5a059]"
                    : plan.isTrial
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60"
                    : "bg-[#0a0a0a]/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c5a059] text-black font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}
                {plan.isTrial && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#c5a059] bg-[#c5a059] text-black"
                          : "border-zinc-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-white font-mono">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through font-mono">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400 font-mono">{plan.period}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Target: {plan.trafficTarget}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.isTrial ? "text-emerald-400" : "text-[#c5a059]"}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60">
                  {plan.isVipFree ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivatePaid("Enterprise Multi-Location (1-Year Free VIP Pass)");
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#c5a059] to-[#dfc082] hover:from-[#d4b57a] hover:to-[#ebcf99] text-black shadow-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                      <span>Claim 1-Year Free VIP Pass &rarr;</span>
                    </button>
                  ) : plan.isTrial ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTrial();
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-all cursor-pointer min-h-[40px]"
                    >
                      Start 1-Hour Trial Free &rarr;
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all min-h-[40px] ${
                        isSelected
                          ? "bg-[#c5a059] text-black shadow-md"
                          : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected Plan" : "Select Plan"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Business Details & Instant Activation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Left: Business Linking Form */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Building2 className="w-4 h-4 text-[#c5a059]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Step 2: Connect Your Business & Website
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. THEME AQUARIUM"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Website URL / Google Maps Link
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://themeaquarium.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Target Geo Area
              </label>
              <input
                type="text"
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                placeholder="e.g. Chennai (Anna Nagar / 3rd Ave) or Bangalore"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Optional: Google Pay / Paytm UTR Reference Number
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. KVB491827401928 or UPI 12-digit Ref"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#c5a059] font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Official Settlement Account: Karur Vysya Bank (Moorthy S L &bull; A/C: 1332153000001791)
              </span>
            </div>

            {/* Launch & Activate Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                disabled={isActivating}
                onClick={() => handleActivatePaid()}
                className={`w-full sm:flex-1 py-3.5 px-5 rounded-2xl text-black font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] min-h-[44px] ${
                  isVipUser
                    ? "bg-gradient-to-r from-[#c5a059] to-[#dfc082] hover:from-[#d4b57a] hover:to-[#ebcf99]"
                    : "bg-[#c5a059] hover:bg-[#d4b57a]"
                }`}
              >
                {isActivating ? (
                  <span>Activating Account...</span>
                ) : (
                  <>
                    <span>
                      {isVipUser
                        ? "Claim 1-Year Free Enterprise Access & Enter Dashboard"
                        : `Confirm ${selectedPlan.includes("₹") ? selectedPlan.split(" (")[0] : "Selected Plan"} & Enter Dashboard`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isTrialExpired && !isVipUser && (
                <button
                  type="button"
                  disabled={isActivating}
                  onClick={handleStartTrial}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
                >
                  Start 1-Hour Free Trial &rarr;
                </button>
              )}
            </div>
          </div>

          {/* Right: Direct KVB & UPI Settlement Box */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-[#c5a059] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Beneficiary Settlement</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Official KVB
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Beneficiary Name</span>
                  <strong className="text-white font-medium">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong>
                </div>
                <button
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountHolderName, "name")}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  {copiedField === "name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">KVB Account Number</span>
                  <strong className="text-white font-mono">{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
                </div>
                <button
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "acc")}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Google Pay & Paytm UPI ID</span>
                  <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.upiId}</strong>
                </div>
                <button
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.upiId, "upi")}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  {copiedField === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Transaction Name Required</span>
                  <strong className="text-emerald-400 font-mono">SEO</strong>
                </div>
                <button
                  onClick={() => handleCopy("SEO", "purpose")}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  {copiedField === "purpose" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* International SWIFT Code */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-950/20 border border-blue-500/30">
                <div>
                  <span className="text-[10px] text-blue-400 uppercase font-bold block">SWIFT Code (All Currencies)</span>
                  <strong className="text-blue-200 font-mono font-bold">{OFFICIAL_BANK_DETAILS.swiftCode}</strong>
                </div>
                <button
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.swiftCode, "swift")}
                  className="p-1.5 rounded text-blue-400 hover:text-white hover:bg-blue-900/40"
                >
                  {copiedField === "swift" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Action Button to Open Payment Gateway Modal */}
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfc082] hover:from-[#d4b57a] hover:to-[#ebcf99] text-black font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay via GPay / SWIFT / Card &rarr;</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Instant Bank-Grade Clearance</span>
              </span>
              <span>IFSC: {OFFICIAL_BANK_DETAILS.ifscCode}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-[#080808] py-3 px-6 z-10 text-[11px] text-zinc-500 text-center">
        <span>Locate Pin &bull; Official Retainer: ₹5,000/month &bull; Beneficiary Moorthy S L (Karur Vysya Bank) &bull; Accepting All Global Currencies</span>
      </footer>

      {/* Multi-Currency Bank Payment Modal */}
      <BankPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlanId="plan-seo-monthly-standard"
        defaultBusinessName={businessName}
        onPaymentSubmitted={(record) => {
          setUtrNumber(record.utrNumber);
          handleActivatePaid();
        }}
      />

      {/* Welcome Email Modal */}
      <WelcomeEmailModal
        isOpen={isWelcomeEmailOpen}
        onClose={() => setIsWelcomeEmailOpen(false)}
        onSelectTrial={handleStartTrial}
        onSelectPaid={() => {
          setSelectedPlan("Google Pay & Paytm Monthly SEO (₹5,000/mo)");
        }}
      />
    </div>
  );
};
