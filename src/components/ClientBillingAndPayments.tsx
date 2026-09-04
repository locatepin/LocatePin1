import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Building2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  CreditCard,
  Send,
  FileCheck,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  Smartphone,
  Info,
  DollarSign,
  Download,
  Filter,
  UserCheck,
  Receipt,
  Clock,
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  OFFICIAL_BANK_DETAILS,
  SUBSCRIPTION_PLANS,
  INITIAL_PAYMENT_RECORDS,
  INITIAL_BUSINESS_LISTINGS,
  INITIAL_USER_ACCOUNTS,
} from "../data/bankAndSubscriptionData";
import { BankPaymentRecord } from "../types/analytics";
import { useAnalytics } from "../context/AnalyticsContext";
import { BankPaymentModal } from "./BankPaymentModal";

export const ClientBillingAndPayments: React.FC = () => {
  const { trackCustomEvent } = useAnalytics();

  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "client">("admin");
  const [payments, setPayments] = useState<BankPaymentRecord[]>(INITIAL_PAYMENT_RECORDS);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>("plan-maps-pro");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activePlan, setActivePlan] = useState<string>("plan-maps-pro");

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApprovePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved", notes: "Approved by Admin (Moorthy S L)" } : p))
    );
    trackCustomEvent(`Admin Approved Payment UTR: ${id}`, "/admin/billing", { paymentId: id });
  };

  const totalRevenueSettled = payments
    .filter((p) => p.status === "Approved")
    .reduce((sum, p) => sum + p.amountINR, 0);

  const pendingPaymentsCount = payments.filter((p) => p.status === "Pending Review").length;

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "all") return true;
    return p.status === filterStatus;
  });

  const upiUri = `upi://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&cu=INR`;

  return (
    <div id="client-billing-container" className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#17130a] via-[#0d0d0d] to-[#0a0a0a] border border-[#c5a059]/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#c5a059] text-black uppercase tracking-wider font-mono">
              Official Payment Gateway & Bank Account
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              KVB Direct Settlement Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-white pt-1">
            Client Subscriptions & Direct Bank Settlement
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Accept client payments directly via <strong className="text-zinc-200">Karur Vysya Bank (KVB)</strong> and instant <strong className="text-zinc-200">UPI QR</strong>. Reconcile transaction UTRs for SEO packages and Google Maps rank boosts.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center gap-2 self-start md:self-center relative z-10 bg-black/60 p-1.5 rounded-2xl border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-500 uppercase px-2">View As:</span>
          <button
            type="button"
            onClick={() => setCurrentUserRole("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentUserRole === "admin"
                ? "bg-[#c5a059] text-black font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Admin (Moorthy S L)
          </button>
          <button
            type="button"
            onClick={() => setCurrentUserRole("client")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentUserRole === "client"
                ? "bg-[#c5a059] text-black font-bold shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Client Portal (Pay & Submit)
          </button>
        </div>
      </div>

      {/* 2. Official Bank Details Card (Prominently Styled) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Detailed Bank Transfer Table */}
        <div className="lg:col-span-8 bg-[#0a0a0a] border-2 border-[#c5a059]/50 rounded-3xl p-6 shadow-2xl space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1f1a10] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.25)]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif italic text-white">Karur Vysya Bank (KVB) Settlement Details</h3>
                <p className="text-xs text-zinc-400">Direct account credentials for Client Invoicing & NEFT/IMPS/RTGS transfers</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-[#1f1a10] text-[#c5a059] border border-[#c5a059]/40">
              Verified Beneficiary
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Name */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Account Holder / Beneficiary Name
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-bold text-white tracking-wide">
                  {OFFICIAL_BANK_DETAILS.accountHolderName}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountHolderName, "name")}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                >
                  {copiedField === "name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "name" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Bank Name & Branch */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Bank Name & Branch
              </span>
              <div className="mt-2">
                <span className="text-base font-bold text-white block">
                  {OFFICIAL_BANK_DETAILS.bankName}
                </span>
                <span className="text-xs text-[#c5a059] font-medium block">
                  Branch: {OFFICIAL_BANK_DETAILS.branch}
                </span>
              </div>
            </div>

            {/* Account Number (Highlight) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17130b] to-zinc-950 border-2 border-[#c5a059]/60 sm:col-span-2 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                    Primary Current Account Number
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest mt-1">
                    {OFFICIAL_BANK_DETAILS.accountNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "accNum")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {copiedField === "accNum" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === "accNum" ? "Account No. Copied!" : "Copy Account No."}</span>
                </button>
              </div>
            </div>

            {/* IFSC Code */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                IFSC Code (RTGS / NEFT / IMPS)
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-base font-bold text-emerald-400 tracking-wider">
                  {OFFICIAL_BANK_DETAILS.ifscCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.ifscCode, "ifsc")}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                >
                  {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "ifsc" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Transaction Purpose */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Transaction Purpose / Remarks (Mandatory)
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-base font-extrabold text-[#c5a059] bg-black px-2.5 py-0.5 rounded border border-[#c5a059]/40">
                  {OFFICIAL_BANK_DETAILS.transactionPurpose}
                </span>
                <span className="text-[11px] text-amber-200/80">Enter in bank remarks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Instant Scan UPI QR Card */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#141009] to-[#070707] border border-[#c5a059]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif italic text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#c5a059]" />
                Instant UPI QR Settlement
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                0% Fee
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center mx-auto max-w-[200px]">
              <QRCodeSVG value={upiUri} size={150} level="H" includeMargin={false} />
              <span className="text-[10px] text-zinc-900 font-black uppercase tracking-wider mt-2 font-mono">
                {OFFICIAL_BANK_DETAILS.upiId}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            {/* Direct Google Pay & Paytm 1-click buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tez://upi/pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-blue-500/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span className="text-blue-400 font-bold">GPay</span>
                <span className="text-[11px] text-zinc-300">₹5,000</span>
              </a>
              <a
                href={`paytmmp://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-sky-500/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span className="text-sky-400 font-bold">Paytm</span>
                <span className="text-[11px] text-zinc-300">₹5,000</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.upiId, "upi")}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs transition-all cursor-pointer"
              >
                {copiedField === "upi" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "upi" ? "UPI ID Copied!" : "Copy UPI: moorthysl@kvb"}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Submit Payment Proof / UTR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Subscription Packages (Pricing Models for Clients) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c5a059]" />
              SEO & Traffic Influx Subscription Models
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tiered retainer models for Local Maps Rank Dominance, Organic SERP Surges, and Telemetry
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            Direct settlement to Moorthy S L (KVB)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = activePlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? "bg-gradient-to-b from-[#1c160a] to-[#0c0c0c] border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                    : "bg-[#0a0a0a] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#c5a059] text-black shadow-md">
                    Most Popular for Local Shops
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-serif italic text-white">{plan.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {plan.trafficLimit}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                  <div className="mt-4 pb-4 border-b border-zinc-800 flex items-baseline gap-2">
                    <span className="text-3xl font-serif text-white">₹{plan.priceINR.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ month</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanForModal(plan.id);
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      plan.isPopular
                        ? "bg-[#c5a059] hover:bg-[#d4b57a] text-black shadow-lg"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Pay ₹{plan.priceINR.toLocaleString()} via KVB Bank / UPI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ADMIN & RECONCILIATION SUITE (For Moorthy S L) */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#c5a059]" />
                {currentUserRole === "admin"
                  ? "Admin Payment Settlement & UTR Verification Ledger"
                  : "Your Business Subscription & Payment History"}
              </h3>
              {currentUserRole === "admin" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                  Moorthy S L Access
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reconcile incoming client deposits credited to KVB A/C: 1332153000001791 (Purpose: SEO)
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Total Cleared</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                ₹{totalRevenueSettled.toLocaleString()}
              </span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Pending Review</span>
              <span className="font-mono text-sm font-bold text-amber-400">{pendingPaymentsCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {["all", "Approved", "Pending Review"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-[#c5a059] text-black font-bold border-[#c5a059]"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {st === "all" ? "All Transactions" : st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Record New UTR Payment</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="pb-3 pl-2">Client / Business</th>
                <th className="pb-3">Subscription Plan</th>
                <th className="pb-3">Amount (INR)</th>
                <th className="pb-3">Bank UTR / Transaction ID</th>
                <th className="pb-3">Purpose</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Settlement Status</th>
                {currentUserRole === "admin" && <th className="pb-3 pr-2 text-right">Admin Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredPayments.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 pl-2">
                    <span className="font-semibold text-white block">{item.businessName}</span>
                    <span className="text-[11px] text-zinc-500">{item.clientName} &bull; {item.clientEmail}</span>
                  </td>
                  <td className="py-3 font-medium text-zinc-300">{item.planName}</td>
                  <td className="py-3 font-mono font-bold text-[#c5a059]">₹{item.amountINR.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="font-mono text-xs text-white bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                      {item.utrNumber}
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">{item.paymentMethod}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {item.transactionPurpose}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400 font-mono text-[11px]">{item.timestamp}</td>
                  <td className="py-3">
                    {item.status === "Approved" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Approved & Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Awaiting Verification
                      </span>
                    )}
                  </td>
                  {currentUserRole === "admin" && (
                    <td className="py-3 pr-2 text-right">
                      {item.status === "Pending Review" ? (
                        <button
                          type="button"
                          onClick={() => handleApprovePayment(item.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                        >
                          Verify & Activate
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-500">Verified</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <BankPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlanId={selectedPlanForModal}
        onPaymentSubmitted={(newRec) => {
          setPayments((prev) => [newRec, ...prev]);
        }}
      />
    </div>
  );
};
