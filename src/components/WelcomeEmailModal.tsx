import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  X,
  Check,
  Copy,
  Sparkles,
  Zap,
  Building2,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  MapPin,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { OFFICIAL_BANK_DETAILS } from "../data/bankAndSubscriptionData";
import { Logo } from "./Logo";

interface WelcomeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrial?: () => void;
  onSelectPaid?: () => void;
}

export const WelcomeEmailModal: React.FC<WelcomeEmailModalProps> = ({
  isOpen,
  onClose,
  onSelectTrial,
  onSelectPaid,
}) => {
  const { user, resendWelcomeEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleResend = async () => {
    setIsResending(true);
    await resendWelcomeEmail();
    setIsResending(false);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleCopyEmailText = () => {
    const text = `
Locate Pin AI - Welcome & Subscription Selection
Recipient: ${user.email}
Account: ${user.name}

Welcome to Locate Pin! You can now choose your growth tier:
1. 1-Hour Full-Access Free Trial (₹0)
2. Official Monthly Retainer (₹5,000/month)
3. Enterprise Multi-Location (₹15,000/month)

Official Beneficiary Settlement:
- Name: ${OFFICIAL_BANK_DETAILS.accountHolderName}
- Bank: Karur Vysya Bank (KVB)
- A/C No: ${OFFICIAL_BANK_DETAILS.accountNumber}
- IFSC: ${OFFICIAL_BANK_DETAILS.ifscCode}
- UPI ID: ${OFFICIAL_BANK_DETAILS.upiId} (GPay/Paytm)
- Transaction Purpose: SEO
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHjbVip = user.email?.toLowerCase() === "digi.hjb@gmail.com";
  const isRaviVip = user.email?.toLowerCase() === "digitalhkravibatterypoint@gmail.com";
  const isVip = isHjbVip || isRaviVip;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-zinc-700/80 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Email Client Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Inbox &bull; Dispatched Welcome Notification
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Auto-generated for {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmailText}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors flex items-center gap-1"
              title="Copy Email Content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px] hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Meta Envelope */}
        <div className="p-4 sm:p-5 bg-[#121212]/80 border-b border-zinc-800/80 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Logo size="sm" imageOnly={true} />
              <div>
                <span className="font-bold text-white block">
                  Locate Pin Onboarding &lt;support@locatepin.ai&gt;
                </span>
                <span className="text-zinc-400 text-[11px]">
                  to <strong className="text-zinc-200">{user.name}</strong> ({user.email})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                Delivered
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">Just now</span>
            </div>
          </div>

          <div className="pt-1 text-sm font-semibold text-white font-serif italic flex items-center gap-1.5">
            <span>
              {isVip
                ? `Subject: 🎉 1-Year Free VIP Enterprise Subscription Activated for ${isHjbVip ? "HJB Digital" : "HK Ravi Battery Point"}!`
                : "Subject: Welcome to Locate Pin! Select Your Google Maps & SEO Subscription"}
            </span>
          </div>
        </div>

        {/* Scrollable Email Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
          
          {/* Welcome Letter Intro */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-white">
              Dear {user.name || "Valued Business Member"},
            </p>
            {isVip ? (
              <div className="p-4 rounded-2xl bg-[#1c160a] border border-[#c5a059] space-y-2">
                <div className="flex items-center gap-2 text-[#c5a059] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>VIP Authorization by Super Admin Moorthy S L</span>
                </div>
                <p className="text-zinc-200">
                  Congratulations! Super Admin <strong className="text-white">Moorthy S L</strong> has approved a <strong className="text-[#c5a059]">100% Free 1-Year Enterprise Multi-Location Plan</strong> for {isHjbVip ? "HJB Digital Enterprise Hub (digi.hjb@gmail.com)" : "HK Ravi Battery Point (digitalhkravibatterypoint@gmail.com)"}.
                </p>
                <p className="text-[11px] text-zinc-400">
                  • 365 Days Active Enterprise License (₹1,80,000 Annual Value Waived)<br />
                  • 150,000 visits/month Google Maps Local Pack Target<br />
                  • Multi-branch high-intent prominence keyword booster & priority indexing
                </p>
              </div>
            ) : (
              <>
                <p>
                  Welcome to <strong className="text-[#c5a059]">Locate Pin</strong> — the real-time Google Maps #1 rank booster, GPS route traffic generator, and localized keyword dominance engine.
                </p>
                <p>
                  Your account (<span className="text-[#c5a059] font-mono">{user.email}</span>) has been authenticated. To start boosting your business ranking across Chennai, Bangalore, and all target regions, please choose your preferred plan below:
                </p>
              </>
            )}
          </div>

          {/* Subscription Options Inside Email */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-[#c5a059] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Subscription Plans</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Free Trial */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs font-bold">1-Hour Free Trial</strong>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-bold text-[9px] uppercase">
                      ₹0 Free
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1">
                    60 minutes full access to Google Maps #1 rank simulator, live GPS Locate Pin radar, and real-time traffic bursts.
                  </p>
                </div>
                {onSelectTrial && (
                  <button
                    onClick={() => {
                      onSelectTrial();
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>Start 1-Hour Free Trial</span>
                  </button>
                )}
              </div>

              {/* 2. Monthly Retainer / VIP Grant */}
              <div className="p-3.5 rounded-2xl bg-[#17130b] border border-[#c5a059]/40 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs font-bold">
                      {isVip ? "Enterprise 1-Year VIP" : "Monthly Retainer"}
                    </strong>
                    <span className="px-2 py-0.5 rounded-full bg-[#c5a059] text-black font-bold text-[9px] uppercase">
                      {isVip ? "₹0 (1-Yr Free)" : "₹5,000 / mo"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1">
                    {isVip
                      ? "Enterprise Multi-Location granted 100% free for 1 full year by Moorthy S L."
                      : "Permanent 24/7 Google Maps dominance, automated daily keyword ranking, and Karur Vysya Bank / GPay clearance."}
                  </p>
                </div>
                {onSelectPaid && (
                  <button
                    onClick={() => {
                      onSelectPaid();
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isVip ? "Enter Dashboard (1-Yr Free)" : "Select ₹5,000 Plan"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Official Bank Account Information in Email */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Official Beneficiary Settlement Coordinates</span>
              </span>
              <span className="text-[10px] font-mono text-blue-400">KVB Direct</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500 block">Beneficiary Name:</span>
                <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Bank Name & Branch:</span>
                <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.bankName} ({OFFICIAL_BANK_DETAILS.branch})</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Account Number:</span>
                <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">IFSC Code:</span>
                <strong className="text-zinc-200 font-mono">{OFFICIAL_BANK_DETAILS.ifscCode}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Google Pay & Paytm UPI:</span>
                <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.upiId}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Transaction Purpose:</span>
                <strong className="text-emerald-400 font-mono">SEO</strong>
              </div>
            </div>
          </div>

          {/* Sign off */}
          <div className="pt-2 border-t border-zinc-800/80 text-zinc-400 space-y-1">
            <p>If you have any questions, reply directly to this mail or contact our priority support desk.</p>
            <p className="text-white font-medium">Warm regards,</p>
            <p className="text-[#c5a059] font-serif italic">Locate Pin Core Operations Team</p>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-5 py-3.5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-[#c5a059]" />
              <span>{isResending ? "Dispatching..." : "Resend Email"}</span>
            </button>
            {resendSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sent to {user.email}!</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Continue to Plan Selection &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
