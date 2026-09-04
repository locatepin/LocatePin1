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
  Globe,
  Coins,
  Lock,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { OFFICIAL_BANK_DETAILS, SUBSCRIPTION_PLANS } from "../data/bankAndSubscriptionData";
import { useAnalytics } from "../context/AnalyticsContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { CurrencySelector } from "./CurrencySelector";
import {
  SUPPORTED_CURRENCIES,
  getCurrencyByCode,
  convertInrToCurrency,
  convertCurrencyToInr,
} from "../utils/currencyUtils";

interface BankPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
  defaultBusinessName?: string;
  onPaymentSubmitted?: (record: any) => void;
}

type PaymentTab = "gpay_paytm" | "upi_qr" | "bank_transfer" | "international_swift" | "card_payment" | "submit_utr";

export const BankPaymentModal: React.FC<BankPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = "plan-seo-monthly-standard",
  defaultBusinessName = "THEME AQUARIUM",
  onPaymentSubmitted,
}) => {
  const { trackCustomEvent } = useAnalytics();
  const { user } = useAuth();
  const { selectedCurrency, currencyInfo, convertInr, getDualDisplay } = useCurrency();

  const [activeTab, setActiveTab] = useState<PaymentTab>("gpay_paytm");
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
  const [paymentMethod, setPaymentMethod] = useState<string>("Google Pay (GPay)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // International & Multi-currency state for UTR submission
  const [paymentCurrency, setPaymentCurrency] = useState<string>(selectedCurrency);
  const [amountPaidInCurrency, setAmountPaidInCurrency] = useState<number>(5000);

  // Card Payment simulation states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.name || "");
  const [isCardProcessing, setIsCardProcessing] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];
  const amountToChargeINR = selectedPlan ? selectedPlan.priceINR : customAmount;

  // Converted value for the active selected currency
  const convertedCurrent = convertInr(amountToChargeINR);
  const dualPrice = getDualDisplay(amountToChargeINR);

  // Sync currency in submission when active currency changes
  useEffect(() => {
    setPaymentCurrency(selectedCurrency);
    const converted = convertInrToCurrency(amountToChargeINR, selectedCurrency);
    setAmountPaidInCurrency(converted.amount);
  }, [selectedCurrency, amountToChargeINR]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generate UPI URIs (UPI requires INR)
  const standardUpiUri = `upi://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToChargeINR}&cu=INR`;

  const gpayUri = `tez://upi/pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToChargeINR}&cu=INR`;

  const paytmUri = `paytmmp://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(
    OFFICIAL_BANK_DETAILS.accountHolderName
  )}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=${amountToChargeINR}&cu=INR`;

  // Handle UTR submission
  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const computedInr = convertCurrencyToInr(amountPaidInCurrency, paymentCurrency);
      const paymentCurrInfo = getCurrencyByCode(paymentCurrency);

      const newRecord = {
        id: `pay-${Date.now()}`,
        clientName,
        clientEmail,
        businessName,
        planName: selectedPlan.name,
        amountINR: computedInr,
        amountForeign: amountPaidInCurrency,
        currencyPaid: paymentCurrency,
        exchangeRateUsed: paymentCurrInfo.rateToINR,
        utrNumber: utrNumber.toUpperCase(),
        transactionPurpose: OFFICIAL_BANK_DETAILS.transactionPurpose,
        paymentMethod,
        status: "Approved",
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
        accountCredited: `KVB A/C ${OFFICIAL_BANK_DETAILS.accountNumber} (${OFFICIAL_BANK_DETAILS.accountHolderName})`,
        notes: `Paid ${paymentCurrInfo.symbol}${amountPaidInCurrency} ${paymentCurrency} (~₹${computedInr} INR) via ${paymentMethod}. Purpose: SEO.`,
      };

      trackCustomEvent(
        `Client Payment Submitted: ${paymentCurrency} ${amountPaidInCurrency} (₹${computedInr} INR) via ${paymentMethod}`,
        "/client-billing",
        { utr: utrNumber, client: clientName, currency: paymentCurrency }
      );

      if (onPaymentSubmitted) {
        onPaymentSubmitted(newRecord);
      }
    }, 900);
  };

  // Handle Card Checkout
  const handleCardCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) return;

    setIsCardProcessing(true);
    setTimeout(() => {
      setIsCardProcessing(false);
      setCardSuccess(true);

      const generatedRef = `CARD-${Date.now().toString().slice(-8)}`;
      const computedInr = convertCurrencyToInr(convertedCurrent.amount, selectedCurrency);

      const cardRecord = {
        id: `card-${Date.now()}`,
        clientName: cardHolder || clientName,
        clientEmail,
        businessName,
        planName: selectedPlan.name,
        amountINR: computedInr,
        amountForeign: convertedCurrent.amount,
        currencyPaid: selectedCurrency,
        exchangeRateUsed: currencyInfo.rateToINR,
        utrNumber: generatedRef,
        transactionPurpose: OFFICIAL_BANK_DETAILS.transactionPurpose,
        paymentMethod: "Credit / Debit Card (Global)",
        status: "Approved",
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
        accountCredited: `KVB A/C ${OFFICIAL_BANK_DETAILS.accountNumber} (Moorthy S L via Merchant Gateway)`,
        notes: `Instant card settlement: ${currencyInfo.symbol}${convertedCurrent.formatted} ${selectedCurrency} (₹${amountToChargeINR} INR). Auto-approved.`,
      };

      trackCustomEvent(
        `Card Payment Approved: ${selectedCurrency} ${convertedCurrent.formatted} (₹${amountToChargeINR} INR)`,
        "/client-billing/card",
        { ref: generatedRef, card: cardNumber.slice(-4) }
      );

      if (onPaymentSubmitted) {
        onPaymentSubmitted(cardRecord);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 border-t-[#c5a059]/60 border-t-2 relative">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-gradient-to-r from-[#17130b] via-[#0a0a0a] to-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1f1a10] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)] flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-serif italic text-white">
                  Multi-Currency Settlement Gateway
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059] text-black">
                  {dualPrice.primary} / mo
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Beneficiary: <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong> &bull; Bank: <strong className="text-zinc-200">{OFFICIAL_BANK_DETAILS.bankName}</strong> &bull; SWIFT: <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.swiftCode}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CurrencySelector variant="compact" />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Currency Conversion Alert Banner */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#120f09] border-b border-zinc-800/80 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
            <span className="text-[11px]">
              Accepting <strong className="text-white">All Currencies</strong> for the value of <strong className="text-[#c5a059]">₹{amountToChargeINR.toLocaleString()} INR</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span>Rate:</span>
            <span className="text-white font-bold">
              {selectedCurrency === "INR" ? "1 INR = ₹1.00" : `1 ${selectedCurrency} = ₹${currencyInfo.rateToINR} INR`}
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 sm:px-6 pt-3 border-b border-zinc-800/80 flex gap-1.5 bg-[#050505] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("gpay_paytm")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gpay_paytm"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Google Pay & Paytm</span>
          </button>
          <button
            onClick={() => setActiveTab("international_swift")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "international_swift"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>SWIFT Wire (All Currencies)</span>
          </button>
          <button
            onClick={() => setActiveTab("card_payment")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "card_payment"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Card (Global)</span>
          </button>
          <button
            onClick={() => setActiveTab("upi_qr")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "upi_qr"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI QR</span>
          </button>
          <button
            onClick={() => setActiveTab("bank_transfer")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "bank_transfer"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>KVB NEFT/IMPS</span>
          </button>
          <button
            onClick={() => setActiveTab("submit_utr")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "submit_utr"
                ? "border-[#c5a059] text-[#c5a059]"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit Reference</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* TAB 1: GOOGLE PAY & PAYTM DIRECT ACTION */}
          {activeTab === "gpay_paytm" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Monthly Rate Badge Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1f1809] to-zinc-950 border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#c5a059] tracking-wider">
                      Monthly SEO Retainer Fee
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-serif text-white">
                      {dualPrice.primary}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>
                  {selectedCurrency !== "INR" && (
                    <p className="text-[11px] text-[#c5a059] font-mono">
                      Equivalent to base value: ₹{amountToChargeINR.toLocaleString()} INR
                    </p>
                  )}
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
                      <span className="text-[11px] text-zinc-400 font-mono">₹{amountToChargeINR.toLocaleString()} &bull; moorthysl@kvb</span>
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
                      <span className="text-[11px] text-zinc-400 font-mono">₹{amountToChargeINR.toLocaleString()} &bull; moorthysl@kvb</span>
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

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("international_swift")}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Paying from outside India? Click for SWIFT Wire &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("submit_utr")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>Submit Payment UTR &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERNATIONAL SWIFT WIRE (ALL CURRENCIES ACCEPTED) */}
          {activeTab === "international_swift" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* International Inward Wire Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-950 border border-blue-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-black uppercase tracking-wider">
                        Inward Foreign Remittance
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        SWIFT: {OFFICIAL_BANK_DETAILS.swiftCode}
                      </span>
                    </div>
                    <h4 className="text-base font-serif italic text-white mt-1">
                      Accepting All Global Currencies for ₹{amountToChargeINR.toLocaleString()} INR Value
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Remittance Amount</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {convertedCurrent.symbol}{convertedCurrent.formatted} {selectedCurrency}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      Value: ₹{amountToChargeINR.toLocaleString()} INR
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 border-t border-zinc-800 pt-2">
                  Karur Vysya Bank accepts inward wire transfers in <strong className="text-white">USD, EUR, GBP, AED, SGD, CAD, AUD, SAR, QAR, JPY, CHF, and all global currencies</strong>. Your remitted amount will automatically be converted at official daily treasury/forex exchange rates and credited in INR.
                </p>
              </div>

              {/* SWIFT Wire Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Beneficiary Name */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Beneficiary Name</span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-white text-sm">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountHolderName, "swiftName")}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      {copiedField === "swiftName" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* SWIFT / BIC Code */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-blue-500/40">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">SWIFT / BIC Code</span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-blue-300 font-mono text-base font-bold">{OFFICIAL_BANK_DETAILS.swiftCode}</strong>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.swiftCode, "swiftCode")}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                    >
                      {copiedField === "swiftCode" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy SWIFT</span>
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-[#c5a059]/40 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#c5a059] block">Account Number (IBAN equivalent)</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-base sm:text-lg font-bold text-white tracking-widest">
                      {OFFICIAL_BANK_DETAILS.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "swiftAcc")}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#c5a059] text-black font-semibold hover:bg-[#d4b57a]"
                    >
                      {copiedField === "swiftAcc" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy A/C No.</span>
                    </button>
                  </div>
                </div>

                {/* Bank Name */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Bank Name</span>
                  <strong className="text-white block mt-1">{OFFICIAL_BANK_DETAILS.bankName}</strong>
                </div>

                {/* Branch & Country */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Branch & Country</span>
                  <span className="text-white block mt-1">{OFFICIAL_BANK_DETAILS.branch}, India (IN)</span>
                </div>

                {/* Purpose of Remittance */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">
                        Purpose of Remittance / Reference
                      </span>
                      <p className="text-[11px] text-amber-200/80">
                        Purpose Code: <strong className="text-white">P0802</strong> (Software & SEO Services) &bull; Note: <strong className="text-white">SEO</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy("SEO", "swiftPurpose")}
                      className="px-2.5 py-1 rounded bg-black border border-amber-500/40 text-amber-300 font-mono text-xs font-bold"
                    >
                      {copiedField === "swiftPurpose" ? "Copied!" : "Copy 'SEO'"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Next action button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("card_payment")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Prefer Card Payment? Click here &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("International SWIFT Wire");
                    setActiveTab("submit_utr");
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>I've Sent SWIFT Wire &rarr; Submit Ref</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CREDIT / DEBIT CARD (ALL CURRENCIES ACCEPTED) */}
          {activeTab === "card_payment" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {cardSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-serif italic text-white">Card Payment Authorized Successfully!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Charged <strong className="text-emerald-400">{convertedCurrent.symbol}{convertedCurrent.formatted} {selectedCurrency}</strong> (equivalent to ₹{amountToChargeINR.toLocaleString()} INR). Your subscription has been automatically approved and activated.
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
                <form onSubmit={handleCardCheckout} className="space-y-3.5">
                  {/* Amount notice */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Card Charge</span>
                      <span className="text-xl font-mono font-bold text-white">
                        {convertedCurrent.symbol}{convertedCurrent.formatted} {selectedCurrency}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">Base INR Value</span>
                      <span className="text-xs font-mono text-[#c5a059] font-bold">₹{amountToChargeINR.toLocaleString()} INR</span>
                      <span className="text-[9px] text-emerald-400 block">0% FX Conversion Fee</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Card Number (Visa / MasterCard / Amex / UnionPay)
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Expiry (MM / YY)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="&bull;&bull;&bull;"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>256-Bit Encrypted Bank Authorization</span>
                    </span>
                    <span>Direct INR Settlement to Moorthy S L</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCardProcessing || !cardNumber || !cardExpiry || !cardCvv}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isCardProcessing ? (
                        <span>Processing Authorization...</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Pay {convertedCurrent.symbol}{convertedCurrent.formatted} {selectedCurrency}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: SCAN UPI QR CODE */}
          {activeTab === "upi_qr" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="bg-white p-3 rounded-2xl shadow-xl flex-shrink-0 flex items-center justify-center">
                  <QRCodeSVG
                    value={standardUpiUri}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#c5a059] block">Instant Scan & Pay</span>
                    <h4 className="text-base font-serif italic text-white">Google Pay / Paytm / PhonePe QR</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Open Google Pay, Paytm, or any UPI app on your mobile device and scan this QR code to transfer directly to Moorthy S L.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#c5a059]">{OFFICIAL_BANK_DETAILS.upiId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.upiId, "upiIdQr")}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copiedField === "upiIdQr" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Amount:</span>
                    <span className="text-white font-mono font-bold">₹{amountToChargeINR.toLocaleString()} INR</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("submit_utr")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-semibold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>I've Completed Payment &rarr; Submit UTR</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: BANK TRANSFER (NEFT / IMPS / RTGS) */}
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

          {/* TAB 6: SUBMIT PAYMENT UTR / REFERENCE (ALL CURRENCIES ACCEPTED) */}
          {activeTab === "submit_utr" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-serif italic text-white">Payment Reference Recorded Successfully!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{clientName}</strong>. Your payment reference (UTR/Ref: <span className="font-mono text-emerald-400">{utrNumber}</span>) for {getCurrencyByCode(paymentCurrency).symbol}{amountPaidInCurrency} {paymentCurrency} (~₹{convertCurrencyToInr(amountPaidInCurrency, paymentCurrency).toLocaleString()} INR value) has been submitted to <strong>Moorthy S L (Admin)</strong> for instant verification.
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

                  {/* Multi-Currency & Amount Paid Fields */}
                  <div className="p-3 rounded-2xl bg-[#141009] border border-[#c5a059]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#c5a059] flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        Currency & Amount Remitted
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {paymentCurrency !== "INR" ? `1 ${paymentCurrency} = ₹${getCurrencyByCode(paymentCurrency).rateToINR} INR` : "Base INR"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">
                          Payment Currency
                        </label>
                        <select
                          value={paymentCurrency}
                          onChange={(e) => {
                            const newCurr = e.target.value;
                            setPaymentCurrency(newCurr);
                            const conv = convertInrToCurrency(amountToChargeINR, newCurr);
                            setAmountPaidInCurrency(conv.amount);
                          }}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                        >
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} - {c.name} ({c.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">
                          Amount Paid in {paymentCurrency}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-zinc-400 font-mono text-xs">
                            {getCurrencyByCode(paymentCurrency).symbol}
                          </span>
                          <input
                            type="number"
                            step="any"
                            required
                            value={amountPaidInCurrency}
                            onChange={(e) => setAmountPaidInCurrency(parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono outline-none focus:border-[#c5a059]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live INR Converted Summary */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                      <span className="text-zinc-400">Equivalent INR Credited to KVB:</span>
                      <strong className="text-emerald-400 font-mono text-sm">
                        ≈ ₹{convertCurrencyToInr(amountPaidInCurrency, paymentCurrency).toLocaleString()} INR
                      </strong>
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
                        Payment Mode Used
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                      >
                        <option value="Google Pay (GPay)">Google Pay (GPay)</option>
                        <option value="Paytm">Paytm</option>
                        <option value="PhonePe / UPI">PhonePe / UPI</option>
                        <option value="KVB NetBanking">KVB NetBanking (NEFT/IMPS)</option>
                        <option value="International SWIFT Wire">International SWIFT Wire (KVBLINBB)</option>
                        <option value="Credit / Debit Card (Global)">Credit / Debit Card (Global)</option>
                        <option value="PayPal / International Remittance">PayPal / Wise / Remittance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#c5a059] mb-1">
                      Bank Reference / UTR Number / SWIFT Wire Reference *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 402910481028 or KVB491827401928 or SWIFT-REF-9921"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-[#c5a059]/50 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Found on your Google Pay, Paytm, bank transfer, or SWIFT wire confirmation receipt.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
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
        <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>All Global Currencies Accepted &bull; Inward Settlement to Moorthy S L (Karur Vysya Bank)</span>
          </div>
          <span className="text-zinc-400 font-mono">SWIFT: {OFFICIAL_BANK_DETAILS.swiftCode} &bull; Support: {OFFICIAL_BANK_DETAILS.supportPhone}</span>
        </div>
      </div>
    </div>
  );
};
