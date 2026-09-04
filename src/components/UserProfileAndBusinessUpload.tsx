import React, { useState } from "react";
import {
  User,
  Building2,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  MapPin,
  Globe,
  Phone,
  ShieldCheck,
  CreditCard,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  Send,
  Sliders,
  Store,
  Layers,
  ArrowRight,
  LogIn,
  LogOut,
  Trash2,
} from "lucide-react";
import {
  INITIAL_USER_ACCOUNTS,
  INITIAL_BUSINESS_LISTINGS,
  OFFICIAL_BANK_DETAILS,
  SUBSCRIPTION_PLANS,
} from "../data/bankAndSubscriptionData";
import { BusinessListing, UserAccount } from "../types/analytics";
import { useAnalytics } from "../context/AnalyticsContext";
import { useAuth } from "../context/AuthContext";
import { BankPaymentModal } from "./BankPaymentModal";

export const UserProfileAndBusinessUpload: React.FC = () => {
  const { trackCustomEvent, setSelectedWebsite } = useAnalytics();
  const { user: authUser, updateUser } = useAuth();

  // User state
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => authUser || INITIAL_USER_ACCOUNTS[0]);
  const [businesses, setBusinesses] = useState<BusinessListing[]>(INITIAL_BUSINESS_LISTINGS);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form states for business upload
  const [bizName, setBizName] = useState("");
  const [category, setCategory] = useState("Aquarium & Exotic Pet Store");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Chennai");
  const [area, setArea] = useState("Anna Nagar");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [keywordsText, setKeywordsText] = useState("aquarium shop, planted tank, custom aquarium");
  const [selectedPlan, setSelectedPlan] = useState("Local Maps #1 Pro Dominance (₹9,999/mo)");
  const [utrNumber, setUtrNumber] = useState("");

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    trackCustomEvent(`Switched User Session: ${user.name} (${user.role})`, "/profile");
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !websiteUrl.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const keywords = keywordsText.split(",").map((k) => k.trim()).filter(Boolean);
      const newBiz: BusinessListing = {
        id: `biz-${Date.now()}`,
        userId: currentUser.id,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
        businessName: bizName.trim(),
        category,
        websiteUrl: websiteUrl.startsWith("http") ? websiteUrl.trim() : `https://${websiteUrl.trim()}`,
        phone: phone || currentUser.phone || "+91 98841 81562",
        city,
        area,
        address: address || `${area}, ${city}`,
        googleMapsUrl: googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(bizName)}`,
        targetKeywords: keywords,
        subscriptionPlan: selectedPlan,
        monthlyTrafficTarget: 75000,
        paymentStatus: utrNumber.trim() ? "Paid & Active" : "Pending Verification",
        utrNumber: utrNumber.trim() ? utrNumber.toUpperCase() : undefined,
        submittedAt: new Date().toISOString().split("T")[0],
        verifiedAt: utrNumber.trim() ? new Date().toISOString().split("T")[0] : undefined,
      };

      setBusinesses((prev) => [newBiz, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedWebsite(newBiz.websiteUrl);

      trackCustomEvent(`New Business Uploaded: ${newBiz.businessName}`, "/business/upload", {
        businessId: newBiz.id,
        owner: currentUser.email,
      });

      // Reset form
      setBizName("");
      setWebsiteUrl("");
      setAddress("");
      setUtrNumber("");
    }, 1000);
  };

  const handleDeleteBusiness = (id: string, name: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    trackCustomEvent(`Deleted Business Listing: ${name}`, "/business/delete", { businessId: id });
  };

  return (
    <div id="user-profile-business-container" className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Google Account Profile Card & Session Switcher */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            {/* Google Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#c5a059]/60 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[9px] text-black font-bold">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif italic text-white">{currentUser.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    currentUser.role === "admin"
                      ? "bg-[#c5a059] text-black shadow-sm"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {currentUser.role === "admin" ? "MASTER ADMIN (Moorthy S L)" : "VERIFIED CLIENT"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span>&bull;</span>
                <span className="text-emerald-400">Google OAuth Authenticated</span>
              </p>
            </div>
          </div>

          {/* Quick Account Switcher (Demonstrating Google Auth for Admin & Clients) */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 self-start sm:self-auto">
            <span className="text-[10px] font-bold text-zinc-500 uppercase px-2">Simulate Login:</span>
            {INITIAL_USER_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSwitchUser(acc)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentUser.id === acc.id
                    ? "bg-[#c5a059] text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {acc.role === "admin" ? "Admin (Moorthy)" : acc.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Account Details & Role Permissions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-zinc-500 uppercase font-bold text-[10px] block">Settlement Bank Account</span>
            <p className="font-semibold text-zinc-200 mt-1">KVB (Karur Vysya Bank)</p>
            <span className="text-[11px] font-mono text-[#c5a059]">A/C: {OFFICIAL_BANK_DETAILS.accountNumber}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-zinc-500 uppercase font-bold text-[10px] block">Active Access Role</span>
            <p className="font-semibold text-zinc-200 mt-1">
              {currentUser.role === "admin"
                ? "Full Platform & Payment Administration"
                : "Business Directory & SEO Rank Booster"}
            </p>
            <span className="text-[11px] text-emerald-400">Google Verified</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-zinc-500 uppercase font-bold text-[10px] block">Direct Contact / Support</span>
            <p className="font-semibold text-zinc-200 mt-1">{OFFICIAL_BANK_DETAILS.accountHolderName}</p>
            <span className="text-[11px] font-mono text-zinc-400">{OFFICIAL_BANK_DETAILS.supportPhone}</span>
          </div>
        </div>
      </div>

      {/* 2. Upload Business Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Business Upload Form */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#c5a059]" />
              <h3 className="text-lg font-serif italic text-white">Upload Your Business Listing</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Register your business to inject Google Maps #1 rank signals and start live visitor traffic streams.
            </p>
          </div>

          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Business uploaded and queued for Google Maps local ranking boost!</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadSuccess(false)}
                className="text-zinc-400 hover:text-white text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleBusinessSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Business / Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. THEME AQUARIUM"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                >
                  <option value="Aquarium & Exotic Pet Store">Aquarium & Exotic Pet Store</option>
                  <option value="Custom Planted Aquariums">Custom Planted Aquariums</option>
                  <option value="Marine Fish & Coral Reef Store">Marine Fish & Coral Reef Store</option>
                  <option value="Veterinary & Pet Care">Veterinary & Pet Care</option>
                  <option value="Retail & Specialty Store">Retail & Specialty Store</option>
                  <option value="Tech / SaaS / Professional Services">Tech / SaaS / Professional Services</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Website URL / Store Link *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://themeaquarium.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="098841 81562"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Target City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                >
                  <option value="Chennai">Chennai (Tamil Nadu)</option>
                  <option value="Bangalore">Bangalore / Bengaluru (Karnataka)</option>
                  <option value="Hyderabad">Hyderabad (Telangana)</option>
                  <option value="Mumbai">Mumbai (Maharashtra)</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Neighborhood / Area Hub *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anna Nagar, Thiruvanmiyur, Indiranagar"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                placeholder="e.g. 26/1, 12th Lane, 3rd Ave, Anna Nagar, Chennai - 600040"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Target SEO Commercial Keywords (comma-separated)
              </label>
              <textarea
                rows={2}
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                placeholder="aquarium shop in chennai, planted tank besant nagar, marine fish ecr"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
              />
            </div>

            {/* Payment / UTR verification (Google Pay, Paytm, KVB at ₹5,000/month) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c160a] to-[#0d0d0d] border border-[#c5a059]/50 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                    Monthly Retainer: <strong className="text-[#c5a059] font-serif text-sm">₹5,000 / month</strong>
                  </span>
                  <span className="text-[10px] text-zinc-400 block">
                    Pay on <strong>Google Pay (GPay)</strong> or <strong>Paytm</strong> to <strong>Moorthy S L</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="text-[11px] text-[#c5a059] underline hover:text-[#d4b57a] font-semibold cursor-pointer"
                >
                  View QR & Bank Details &rarr;
                </button>
              </div>

              {/* 1-Click Pay Buttons for Google Pay & Paytm */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tez://upi/pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-blue-500/40 flex items-center justify-between text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-400">GPay</span>
                    <span className="text-[11px] text-zinc-300">Pay ₹5,000</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                </a>

                <a
                  href={`paytmmp://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-sky-500/40 flex items-center justify-between text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-400">Paytm</span>
                    <span className="text-[11px] text-zinc-300">Pay ₹5,000</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-sky-400" />
                </a>
              </div>

              {/* UTR Input Field */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#c5a059] mb-1">
                  Enter Payment Reference (UTR / UPI Transaction ID)
                </label>
                <input
                  type="text"
                  placeholder="Enter 12-digit UTR from Google Pay or Paytm receipt"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-zinc-400 pt-0.5 gap-1">
                <span>Beneficiary: <strong className="text-zinc-200">Moorthy S L</strong> &bull; UPI: <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.upiId}</strong></span>
                <span>Transaction Note: <strong className="text-[#c5a059] font-mono bg-black px-1.5 py-0.5 rounded border border-zinc-800">SEO</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !bizName.trim() || !websiteUrl.trim()}
              className="w-full py-3 rounded-2xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <span>Submitting & Configuring SEO Vectors...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Business & Activate Google Maps #1 Ranking</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 5 cols: Active Registered Businesses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#c5a059]" />
              Directory & Managed Businesses
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              {businesses.length} Listed
            </span>
          </div>

          <div className="space-y-3">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 hover:border-zinc-700 transition-all space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {b.businessName}
                      <span className="text-[10px] font-normal text-zinc-400 font-mono">({b.city})</span>
                    </h4>
                    <span className="text-xs text-[#c5a059] block">{b.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {b.paymentStatus}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{b.address}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-zinc-500" />
                    <span className="font-mono text-zinc-300">{b.websiteUrl}</span>
                  </p>
                </div>

                {/* Keywords Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {b.targetKeywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      {kw}
                    </span>
                  ))}
                  {b.targetKeywords.length > 3 && (
                    <span className="text-[10px] text-zinc-500">+{b.targetKeywords.length - 3} more</span>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-emerald-400 font-semibold">{b.subscriptionPlan.split(" ")[0]} Active</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteBusiness(b.id, b.businessName)}
                    className="flex items-center gap-1 text-zinc-500 hover:text-red-400 text-[11px] px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <BankPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlanId="plan-maps-pro"
        defaultBusinessName={bizName || "My Business"}
      />
    </div>
  );
};
