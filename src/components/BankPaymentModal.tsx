import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Building2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  CreditCard,
  Send,
  X,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Info,
  Sparkles,
  Zap,
  CheckCircle,
} from "lucide-react";
import { OFFICIAL_BANK_DETAILS, SUBSCRIPTION_PLANS } from "../data/bankAndSubscriptionData";
import { useAnalytics } from "../context/AnalyticsContext";
import { useAuth } from "../context/AuthContext";

interface BankPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
  defaultBusinessName?: string;
  onPaymentSubmitted?: (record: any) => void;
}

export const BankPaymentModal: React.FC<BankPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = "plan-seo-monthly-standard",
  defaultBusinessName = "THEME AQUARIUM",
  onPaymentSubmitted,
}) => {
  const { trackCustomEvent } = useAnalytics();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"gpay_paytm" | "upi_qr" | "bank_transfer" | "submit_utr">("gpay_paytm");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states for submitting UTR - populated from authenticated user
  const [clientName, setClientName] = useState(user?.name || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [businessName, setBusinessName] = useState(defaultBusinessName);

  useEffect(() => {
    if (user) {
      if (!clientName && user.name) setClientName(user.name);
      if (!clientEmail && user.email) setClientEmail(user.email);
    }
  }, [user]);
  const [planId, setPlanId] = useState(selectedPlanId);
  const [customAmount, setCustomAmount] = useState<number>(5000);
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Google Pay (GPay)" | "Paytm" | "PhonePe / UPI" | "KVB NetBanking">("Google Pay (GPay)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generate UPI URIs
  const amountToCharge = selectedPlan ? selectedPlan.priceINR : customAmount;
  const standardUpiUri = `upi://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToCharge}&cu=INR`;

  const gpayUri = `tez://upi/pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToCharge}&cu=INR`;

  const paytmUri = `paytmmp://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToCharge}&cu=INR`;

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const newRecord = {
        id: `pay-${Date.now()}`,
        clientName,
        clientEmail,
        businessName,
        planName: selectedPlan.name,
        amountINR: amountToCharge,
        utrNumber: utrNumber.toUpperCase(),
        transactionPurpose: OFFICIAL_BANK_DETAILS.transactionPurpose,
        paymentMethod,
        status: "Approved",
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
        accountCredited: `KVB A/C ${OFFICIAL_BANK_DETAILS.accountNumber} (${OFFICIAL_BANK_DETAILS.accountHolderName})`,
        notes: `Paid ₹${amountToCharge}/month via ${paymentMethod}. Transaction Purpose: SEO.`,
      };

      trackCustomEvent(
        `Client Payment Submitted: ₹${amountToCharge} (${selectedPlan.name}) via ${paymentMethod}`,
        "/client-billing",
        { utr: utrNumber, client: clientName }
      );

      if (onPaymentSubmitted) {
        onPaymentSubmitted(newRecord);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border-t-[#c5a059]/50 border-t-2 relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-gradient-to-r from-[#17130b] via-[#0a0a0a] to-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1f1a10] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif italic text-white">Google Pay & Paytm Settlement Gateway</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059] text-black">
                  ₹5,000 / Month Retainer
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Beneficiary: <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong> &bull; Bank: <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.bankName}</strong> &bull; UPI: <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.upiId}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 pt-4 border-b border-zinc-800/80 flex gap-2 bg-[#050505] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("gpay_paytm")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gpay_paytm"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#c5a059]" />
            <span>Google Pay & Paytm (₹5,000)</span>
          </button>
          <button
            onClick={() => setActiveTab("upi_qr")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "upi_qr"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan UPI QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab("bank_transfer")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "bank_transfer"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>KVB Bank Details</span>
          </button>
          <button
            onClick={() => setActiveTab("submit_utr")}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "submit_utr"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Submit Payment UTR</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* TAB 1: GOOGLE PAY & PAYTM DIRECT ACTION */}
          {activeTab === "gpay_paytm" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Monthly Rate Badge Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1f1809] to-zinc-950 border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#c5a059] tracking-wider">
                      Monthly SEO Retainer Fee
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Standard Plan
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif text-white">₹5,000</span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Includes Google Maps #1 Local 3-Pack rank elevation + 50,000 monthly target visitors
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-zinc-800 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Transfer To:</span>
                  <span className="text-sm font-bold text-white block">{OFFICIAL_BANK_DETAILS.accountHolderName}</span>
                  <span className="text-xs font-mono text-[#c5a059] font-bold block">{OFFICIAL_BANK_DETAILS.upiId}</span>
                </div>
              </div>

              {/* 1-Click Pay Buttons for Google Pay & Paytm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Pay Button */}
                <a
                  href={gpayUri}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    trackCustomEvent("User clicked Google Pay (GPay) button", "/payment/gpay");
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0c1017] border border-blue-500/40 hover:border-blue-400 flex items-center justify-between group transition-all shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-zinc-900 shadow-md">
                      <span className="text-blue-600 font-black text-sm">G</span>
                      <span className="text-red-500 font-black text-sm">P</span>
                      <span className="text-amber-500 font-black text-sm">a</span>
                      <span className="text-green-500 font-black text-sm">y</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-blue-300">
                        Pay on Google Pay
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">₹5,000 &bull; moorthysl@kvb</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-400" />
                </a>

                {/* Paytm Button */}
                <a
                  href={paytmUri}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    trackCustomEvent("User clicked Paytm button", "/payment/paytm");
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#132238] to-[#08111c] border border-sky-500/40 hover:border-sky-400 flex items-center justify-between group transition-all shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002e6e] border border-sky-400/40 flex items-center justify-center font-bold text-white shadow-md">
                      <span className="text-sky-300 font-black text-xs tracking-tighter">Paytm</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-sky-300">
                        Pay on Paytm
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">₹5,000 &bull; moorthysl@kvb</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
                </a>
              </div>

              {/* UPI ID & Purpose Reference Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    UPI ID for GPay / Paytm / PhonePe
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.upiId, "upiId")}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-[#c5a059] text-black font-bold hover:bg-[#d4b57a] transition-all cursor-pointer"
                  >
                    {copiedField === "upiId" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "upiId" ? "Copied!" : "Copy UPI ID"}</span>
                  </button>
                </div>

                <div className="font-mono text-base font-bold text-white bg-black p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <span>{OFFICIAL_BANK_DETAILS.upiId}</span>
                  <span className="text-xs text-zinc-500 font-sans font-normal">Beneficiary: Moorthy S L</span>
                </div>

                {/* Mandatory Transaction Purpose */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-amber-300 block">Transaction Note / Name:</span>
                    <span className="text-[11px] text-amber-200/70">
                      Enter <strong className="text-white">"SEO"</strong> in remarks when paying via Google Pay or Paytm.
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold bg-black px-2.5 py-1 rounded text-[#c5a059] border border-[#c5a059]/40">
                    {OFFICIAL_BANK_DETAILS.transactionPurpose}
                  </span>
                </div>
              </div>

              {/* Next Step Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-zinc-400">
                  After completing payment on Google Pay or Paytm:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("submit_utr")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Payment Reference (UTR)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INSTANT UPI QR */}
          {activeTab === "upi_qr" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gradient-to-br from-[#141009] to-[#070707] border border-[#c5a059]/30">
                {/* QR Code Container */}
                <div className="bg-white p-3.5 rounded-2xl shadow-xl flex flex-col items-center justify-center flex-shrink-0">
                  <QRCodeSVG
                    value={standardUpiUri}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[10px] text-zinc-900 font-bold uppercase tracking-wider mt-2 font-mono">
                    Scan on GPay or Paytm
                  </span>
                </div>

                {/* Details & Quick Copy */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      Direct UPI VPA ID
                    </span>
                    <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 mt-1">
                      <span className="font-mono text-sm font-bold text-white tracking-wide">
                        {OFFICIAL_BANK_DETAILS.upiId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.upiId, "upiId")}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#c5a059] text-black font-semibold hover:bg-[#d4b57a] transition-all cursor-pointer"
                      >
                        {copiedField === "upiId" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "upiId" ? "Copied!" : "Copy UPI"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Required Transaction Name / Note */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-300">Transaction Name / Note:</span>
                      <span className="font-mono font-bold text-sm bg-black px-2 py-0.5 rounded text-[#c5a059] border border-[#c5a059]/40">
                        {OFFICIAL_BANK_DETAILS.transactionPurpose}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/70">
                      *Please write <strong className="text-white">"SEO"</strong> in the payment remarks/notes for instant algorithmic verification.
                    </p>
                  </div>

                  {/* Quick Payment Apps */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                    <Smartphone className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Works with Google Pay, Paytm, PhonePe, and KVB NetBanking.</span>
                  </div>
                </div>
              </div>

              {/* Amount and Plan info */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 block">Monthly Retainer:</span>
                  <span className="font-semibold text-zinc-200">Google Pay & Paytm Monthly SEO</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block">Settlement Amount:</span>
                  <span className="font-mono text-base font-bold text-[#c5a059]">₹5,000 / month</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("submit_utr")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>I Have Completed Payment &rarr; Submit UTR</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BANK TRANSFER (NEFT / IMPS / RTGS) */}
          {activeTab === "bank_transfer" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Account Name */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Account Holder Name</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-white">{OFFICIAL_BANK_DETAILS.accountHolderName}</span>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountHolderName, "accName")}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Copy Name"
                    >
                      {copiedField === "accName" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Bank Name */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Bank Name</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{OFFICIAL_BANK_DETAILS.bankName}</span>
                </div>

                {/* Account Number */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-[#c5a059]/40 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#c5a059] block">Account Number</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-base sm:text-lg font-bold text-white tracking-widest">
                      {OFFICIAL_BANK_DETAILS.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "accNum")}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#c5a059] text-black font-semibold hover:bg-[#d4b57a] transition-all cursor-pointer"
                    >
                      {copiedField === "accNum" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "accNum" ? "Copied!" : "Copy Account No."}</span>
                    </button>
                  </div>
                </div>

                {/* IFSC Code */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">IFSC Code</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-sm font-bold text-emerald-400">{OFFICIAL_BANK_DETAILS.ifscCode}</span>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.ifscCode, "ifsc")}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Branch */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Branch</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{OFFICIAL_BANK_DETAILS.branch}</span>
                </div>

                {/* Transaction Purpose */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Transaction Reference / Purpose</span>
                      <span className="text-xs text-zinc-400">Add this exact word in Google Pay / Paytm transfer remarks:</span>
                    </div>
                    <span className="font-mono text-sm font-bold bg-[#1a1409] text-[#c5a059] px-3 py-1 rounded-lg border border-[#c5a059]/40">
                      {OFFICIAL_BANK_DETAILS.transactionPurpose}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("submit_utr")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>Submit Payment Reference (UTR)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SUBMIT UTR & PROOF */}
          {activeTab === "submit_utr" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-serif italic text-white">Payment Reference Recorded Successfully!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{clientName}</strong>. Your payment reference (UTR: <span className="font-mono text-emerald-400">{utrNumber}</span>) for ₹{amountToCharge.toLocaleString()}/month has been submitted to <strong>Moorthy S L (Admin)</strong> for instant verification.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 rounded-xl bg-[#c5a059] text-black font-semibold text-xs hover:bg-[#d4b57a] transition-all cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitUtr} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Client / Contact Name
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Payment App Used
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e: any) => setPaymentMethod(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                      >
                        <option value="Google Pay (GPay)">Google Pay (GPay)</option>
                        <option value="Paytm">Paytm</option>
                        <option value="PhonePe / UPI">PhonePe / UPI</option>
                        <option value="KVB NetBanking">KVB NetBanking (NEFT/IMPS)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#c5a059] mb-1">
                      Bank Reference / UTR Number / UPI Transaction ID (Google Pay / Paytm) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 402910481028 or KVB491827401928"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-[#c5a059]/50 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Found in your Google Pay / Paytm payment confirmation receipt.
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-zinc-500">Credited To:</span>
                      <p className="font-semibold text-zinc-200">
                        {OFFICIAL_BANK_DETAILS.accountHolderName} ({OFFICIAL_BANK_DETAILS.bankName})
                      </p>
                      <span className="text-[11px] font-mono text-[#c5a059]">{OFFICIAL_BANK_DETAILS.upiId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500">Retainer Amount:</span>
                      <p className="font-mono font-bold text-[#c5a059] text-base">₹5,000 / month</p>
                      <span className="text-[10px] text-amber-300">Purpose: SEO</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !utrNumber.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Verifying Reference...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Payment for Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>Direct Google Pay / Paytm / KVB Settlement to Moorthy S L (₹5,000/month)</span>
          </div>
          <span className="text-zinc-400 font-mono">Support: {OFFICIAL_BANK_DETAILS.supportPhone}</span>
        </div>
      </div>
    </div>
  );
};
