import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  MapPin,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Zap,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithCredentials, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState<"google" | "password">("google");
  
  // Google sign in state
  const [gmailId, setGmailId] = useState("");
  const [googleUserName, setGoogleUserName] = useState("");
  const [gmailError, setGmailError] = useState("");

  // Password sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGmailError("");

    const trimmed = gmailId.trim();
    if (!trimmed) {
      setGmailError("Please enter your Gmail or Google Account address.");
      return;
    }

    // Basic email format check
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setGmailError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    await loginWithGoogle(trimmed, googleUserName.trim() || undefined);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await loginWithCredentials(email.trim(), password);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1f1a10] to-[#0a0a0a] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
            <MapPin className="w-5 h-5 text-[#c5a059]" />
          </div>
          <div>
            <span className="font-serif italic text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
              Locate Pin<span className="text-[#c5a059] font-sans font-bold text-sm not-italic">.ai</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-400 block">
              Google Maps #1 & Real-Time Traffic Engine
            </span>
          </div>
        </div>

        {/* Security & Region Badges */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit TLS Secured</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17130b] border border-[#c5a059]/30 text-[#c5a059]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Chennai & Bangalore Live</span>
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Story & Real-time Value */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c160a] border border-[#c5a059]/40 text-[#c5a059] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Maps Local 3-Pack Surge</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-white tracking-tight leading-tight">
                Claim <span className="text-[#c5a059] not-italic font-sans font-black">#1</span> Rank on Google Maps.
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Log in with your Gmail ID to analyze local search impressions, trigger real-time foot-traffic navigation surges, and activate your automated SEO subscription.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Google Maps & Local Search Rank Tracking</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    High-intent GPS route lookups and direct telephone call leads generated across Chennai & Bangalore.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
                <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Beneficiary Settlement via GPay & Paytm</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Official Karur Vysya Bank integration (A/C: 1332153000001791 &bull; Moorthy S L) with automated UTR clearance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Auth Card */}
          <div className="lg:col-span-6 bg-[#0a0a0a]/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative border-t-2 border-t-[#c5a059]/70 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6 text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c160a] border border-[#c5a059]/40 text-[#c5a059] text-[11px] font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Gmail Login &bull; All Existing & New Users</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white">Sign In to Locate Pin</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Enter your Gmail credential to access ranking analytics, Google Maps dominance, and subscription management.
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode("google")}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "google"
                    ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Gmail Credential</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("password")}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "password"
                    ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE (GMAIL) AUTHENTICATION */}
            {authMode === "google" && (
              <form onSubmit={handleGoogleSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Gmail ID / Google Account Email
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Existing & New Users Welcome
                    </span>
                  </div>
                  <div className="relative">
                    {/* Google G Icon */}
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={gmailId}
                      onChange={(e) => {
                        setGmailId(e.target.value);
                        if (gmailError) setGmailError("");
                      }}
                      placeholder="e.g. nandhini.6707@gmail.com or yourname@gmail.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>
                  {gmailError && (
                    <p className="text-[11px] text-red-400 mt-1">{gmailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                    Your Name (Optional for New Users)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={googleUserName}
                      onChange={(e) => setGoogleUserName(e.target.value)}
                      placeholder="e.g. Nandhini / Business Owner Name"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>
                </div>

                {/* Primary Google Auth Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] mt-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {isLoading
                      ? "Verifying Gmail & Setting Up Session..."
                      : "Sign In with Gmail Credential"}
                  </span>
                </button>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>New users automatically get an account + welcome onboarding email on first login.</span>
                </div>
              </form>
            )}

            {/* TAB 2: CREDENTIALS AUTH */}
            {authMode === "password" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. nandhini.6707@gmail.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">
                      Password
                    </label>
                    <span className="text-[10px] text-[#c5a059] hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-[#c5a059]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full py-3 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick One-Click Preset Accounts */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block text-center">
                One-Click Quick Login (Existing & Sample Accounts)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGmailId("moorthysl@gmail.com");
                    setGoogleUserName("Moorthy S L");
                    loginWithGoogle("moorthysl@gmail.com", "Moorthy S L");
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#1f1a10] to-zinc-900 border border-[#c5a059]/40 hover:border-[#c5a059] text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <strong className="text-white text-[11px] block group-hover:text-[#c5a059] truncate">
                      Moorthy S L
                    </strong>
                    <span className="text-[9px] text-zinc-400 font-mono truncate block">
                      moorthysl@gmail.com
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#c5a059] text-black font-bold text-[8px] uppercase flex-shrink-0 ml-1">
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGmailId("nandhini.6707@gmail.com");
                    setGoogleUserName("Nandhini");
                    loginWithGoogle("nandhini.6707@gmail.com", "Nandhini");
                  }}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#c5a059] text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <strong className="text-white text-[11px] block group-hover:text-blue-400 truncate">
                      Nandhini (Aquarium)
                    </strong>
                    <span className="text-[9px] text-zinc-400 font-mono truncate block">
                      nandhini.6707@gmail.com
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[8px] uppercase flex-shrink-0 ml-1">
                    Client
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGmailId("digi.hjb@gmail.com");
                    setGoogleUserName("HJB Digital");
                    loginWithGoogle("digi.hjb@gmail.com", "HJB Digital");
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#1c180d] to-zinc-950 border border-[#c5a059]/60 hover:border-[#c5a059] text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <strong className="text-[#c5a059] text-[11px] block group-hover:underline truncate">
                      HJB Digital (VIP)
                    </strong>
                    <span className="text-[9px] text-zinc-400 font-mono truncate block">
                      digi.hjb@gmail.com
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[8px] uppercase flex-shrink-0 ml-1 border border-emerald-500/30">
                    1-Yr Free
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGmailId("digitalhkravibatterypoint@gmail.com");
                    setGoogleUserName("Ravi");
                    loginWithGoogle("digitalhkravibatterypoint@gmail.com", "Ravi");
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#1c180d] to-zinc-950 border border-[#c5a059]/60 hover:border-[#c5a059] text-left transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <strong className="text-[#c5a059] text-[11px] block group-hover:underline truncate">
                      HK Ravi Battery (VIP)
                    </strong>
                    <span className="text-[9px] text-zinc-400 font-mono truncate block">
                      digitalhkravi...
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[8px] uppercase flex-shrink-0 ml-1 border border-emerald-500/30">
                    1-Yr Free
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Encrypted Session</span>
              </span>
              <span>Karur Vysya Bank Verified</span>
            </div>
          </div>
        </div>
      </main>

      {/* Ticker / Bottom Status */}
      <footer className="w-full border-t border-zinc-800/80 bg-[#080808] py-3 px-6 z-10 text-[11px] text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-Time Concurrency Grid Active</span>
            </span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline text-zinc-500 font-mono">
              Google Pay & Paytm Settlement: moorthysl@kvb
            </span>
          </div>
          <div className="font-mono text-zinc-500">
            <span>Beneficiary: </span>
            <strong className="text-zinc-300">Moorthy S L (KVB A/C: 1332153000001791)</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};
