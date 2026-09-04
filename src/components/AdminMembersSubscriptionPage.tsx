import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Building2,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  CreditCard,
  Mail,
  Send,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Lock,
  Copy,
  Check,
  X,
  Store,
  Phone,
  Calendar,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  OFFICIAL_BANK_DETAILS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_BUSINESS_LISTINGS,
  INITIAL_PAYMENT_RECORDS,
} from "../data/bankAndSubscriptionData";
import { UserAccount, BusinessListing, BankPaymentRecord } from "../types/analytics";
import { WelcomeEmailModal } from "./WelcomeEmailModal";
import { GoDaddyDNSModal } from "./GoDaddyDNSModal";

export const AdminMembersSubscriptionPage: React.FC = () => {
  const { user } = useAuth();

  // Local state for interactive administration
  const [members, setMembers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("locatepin_admin_members_v3") || localStorage.getItem("locatepin_admin_members_v2");
    if (saved) {
      try {
        let parsed: UserAccount[] = JSON.parse(saved);
        // Clean out any legacy test records
        let updated = parsed.filter((m) => !m.email.toLowerCase().includes("nandhini"));
        // Ensure VIP members (digi.hjb@gmail.com & digitalhkravibatterypoint@gmail.com) are always present in admin list
        const vipEmails = ["digi.hjb@gmail.com", "digitalhkravibatterypoint@gmail.com"];
        for (const vEmail of vipEmails) {
          if (!updated.some((m) => m.email.toLowerCase() === vEmail)) {
            const vipUser = INITIAL_USER_ACCOUNTS.find((u) => u.email.toLowerCase() === vEmail);
            if (vipUser) {
              updated = [vipUser, ...updated];
            }
          }
        }
        localStorage.setItem("locatepin_admin_members_v3", JSON.stringify(updated));
        return updated;
      } catch (e) {
        return INITIAL_USER_ACCOUNTS;
      }
    }
    return INITIAL_USER_ACCOUNTS;
  });

  const [businesses, setBusinesses] = useState<BusinessListing[]>(() => {
    const saved = localStorage.getItem("locatepin_admin_businesses_v3") || localStorage.getItem("locatepin_admin_businesses_v2");
    if (saved) {
      try {
        let parsed: BusinessListing[] = JSON.parse(saved);
        // Clean out any legacy test records
        let updated = parsed.filter((b) => !b.ownerEmail?.toLowerCase().includes("nandhini"));
        const vipEmails = ["digi.hjb@gmail.com", "digitalhkravibatterypoint@gmail.com"];
        for (const vEmail of vipEmails) {
          if (!updated.some((b) => b.ownerEmail?.toLowerCase() === vEmail)) {
            const vipBiz = INITIAL_BUSINESS_LISTINGS.find((b) => b.ownerEmail?.toLowerCase() === vEmail);
            if (vipBiz) {
              updated = [vipBiz, ...updated];
            }
          }
        }
        localStorage.setItem("locatepin_admin_businesses_v3", JSON.stringify(updated));
        return updated;
      } catch (e) {
        return INITIAL_BUSINESS_LISTINGS;
      }
    }
    return INITIAL_BUSINESS_LISTINGS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "trial" | "pending" | "expired">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("+91 ");
  const [newMemberBusiness, setNewMemberBusiness] = useState("");
  const [newMemberCity, setNewMemberCity] = useState("Chennai (Anna Nagar)");
  const [newMemberPlan, setNewMemberPlan] = useState("Google Pay & Paytm Monthly SEO (₹5,000/mo)");

  // Selected Member for Email Preview
  const [previewEmailMember, setPreviewEmailMember] = useState<UserAccount | null>(null);

  const saveMembers = (updated: UserAccount[]) => {
    setMembers(updated);
    localStorage.setItem("locatepin_admin_members_v3", JSON.stringify(updated));
  };

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Actions
  const handleApproveUTR = (memberId: string, memberEmail: string) => {
    const updated = members.map((m) => {
      if (m.id === memberId || m.email.toLowerCase() === memberEmail.toLowerCase()) {
        return {
          ...m,
          hasActiveSubscription: true,
          subscriptionStatus: "active" as const,
          activePlan: "Google Pay & Paytm Monthly SEO (₹5,000/mo)",
        };
      }
      return m;
    });
    saveMembers(updated);
    showNotification(`Approved ₹5,000/mo retainer for ${memberEmail}. #1 Google Maps boost enabled.`);
  };

  const handleExtendTrial = (memberId: string, memberEmail: string) => {
    const updated = members.map((m) => {
      if (m.id === memberId || m.email.toLowerCase() === memberEmail.toLowerCase()) {
        const now = Date.now();
        return {
          ...m,
          hasActiveSubscription: true,
          subscriptionStatus: "trial" as const,
          trialStartedAt: now,
          trialExpiresAt: now + 3600000, // +60 mins
          activePlan: "1-Hour Full Access Free Trial",
        };
      }
      return m;
    });
    saveMembers(updated);
    showNotification(`Extended 1-Hour Free Trial for ${memberEmail} (+60 minutes).`);
  };

  const handleRevokeSubscription = (memberId: string, memberEmail: string) => {
    const updated = members.map((m) => {
      if (m.id === memberId || m.email.toLowerCase() === memberEmail.toLowerCase()) {
        return {
          ...m,
          hasActiveSubscription: false,
          subscriptionStatus: "expired" as const,
        };
      }
      return m;
    });
    saveMembers(updated);
    showNotification(`Revoked active subscription for ${memberEmail}.`);
  };

  const handleResendWelcomeMail = (memberEmail: string) => {
    const updated = members.map((m) => {
      if (m.email.toLowerCase() === memberEmail.toLowerCase()) {
        return {
          ...m,
          welcomeEmailSent: true,
          welcomeEmailSentAt: Date.now(),
        };
      }
      return m;
    });
    saveMembers(updated);
    showNotification(`Dispatched formal Welcome & Subscription choices mail to ${memberEmail}.`);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    const cleanEmail = newMemberEmail.trim().toLowerCase();
    const isTrial = newMemberPlan.includes("Trial");
    const now = Date.now();

    const newAcc: UserAccount = {
      id: `user-manual-${Date.now()}`,
      name: newMemberName.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "client",
      phone: newMemberPhone.trim() || undefined,
      businessName: newMemberBusiness.trim() || "Local Business Listing",
      city: newMemberCity.trim() || "Chennai",
      joinedAt: new Date().toISOString().split("T")[0],
      activePlan: newMemberPlan,
      isVerified: true,
      hasActiveSubscription: !newMemberPlan.includes("pending"),
      subscriptionStatus: isTrial ? "trial" : "active",
      trialStartedAt: isTrial ? now : undefined,
      trialExpiresAt: isTrial ? now + 3600000 : undefined,
      welcomeEmailSent: true,
      welcomeEmailSentAt: now,
    };

    const updated = [newAcc, ...members];
    saveMembers(updated);

    // Also add business listing
    if (newMemberBusiness.trim()) {
      const newBiz: BusinessListing = {
        id: `biz-${Date.now()}`,
        userId: newAcc.id,
        ownerName: newAcc.name,
        ownerEmail: cleanEmail,
        businessName: newMemberBusiness.trim(),
        category: "Retail / Local Services",
        websiteUrl: `https://${newMemberBusiness.toLowerCase().replace(/[^a-z0-9]/g, "")}.in`,
        phone: newMemberPhone,
        city: newMemberCity,
        area: "Anna Nagar / Central",
        address: `${newMemberBusiness.trim()}, ${newMemberCity}`,
        targetKeywords: [`best in ${newMemberCity}`, `${newMemberBusiness.toLowerCase()} chennai`],
        subscriptionPlan: newMemberPlan,
        monthlyTrafficTarget: isTrial ? 10000 : 50000,
        paymentStatus: isTrial ? "Paid & Active" : "Paid & Active",
        submittedAt: new Date().toISOString().split("T")[0],
        verifiedAt: new Date().toISOString().split("T")[0],
      };
      setBusinesses([newBiz, ...businesses]);
      localStorage.setItem("locatepin_admin_businesses_v3", JSON.stringify([newBiz, ...businesses]));
    }

    setIsAddModalOpen(false);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberBusiness("");
    showNotification(`New member ${cleanEmail} registered and Welcome Email dispatched!`);
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.businessName && m.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.city && m.city.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === "active") return m.subscriptionStatus === "active";
    if (filterStatus === "trial") return m.subscriptionStatus === "trial";
    if (filterStatus === "pending") return m.subscriptionStatus === "pending";
    if (filterStatus === "expired") return m.subscriptionStatus === "expired";
    return true;
  });

  // Calculate high-level financial & subscriber metrics
  const activePaidMembers = members.filter((m) => m.subscriptionStatus === "active" && m.role !== "admin");
  const activeTrialMembers = members.filter((m) => m.subscriptionStatus === "trial");
  const pendingMembers = members.filter((m) => m.subscriptionStatus === "pending");
  const totalMRR = activePaidMembers.reduce((acc, m) => {
    if (m.activePlan?.includes("15,000")) return acc + 15000;
    return acc + 5000;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Admin Top Authority Banner */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#17130b] via-[#100d08] to-[#070707] border-2 border-[#c5a059]/60 shadow-[0_0_40px_rgba(197,160,89,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059] text-black font-bold text-xs tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Authority Panel</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>moorthysl@gmail.com</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
              <Building2 className="w-3 h-3" />
              <span>KVB A/C: 1332153000001791</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
            Members & Subscription Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Live overview of all registered businesses, 1-Hour Free Trials, ₹5,000/mo monthly retainers, KVB bank clearances, and automated welcome email logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => setIsDnsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#c5a059]/60 text-[#c5a059] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
          >
            <Globe className="w-4 h-4 text-[#c5a059]" />
            <span>GoDaddy DNS for locatepin.com</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member / Client</span>
          </button>

          <button
            onClick={() => {
              saveMembers(INITIAL_USER_ACCOUNTS);
              showNotification("Reset all member and subscriber registries to official seed data.");
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Reload initial records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Sync DB</span>
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Admin Financial & Subscriber Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Recurring Revenue */}
        <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-zinc-800 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Monthly Retainers (MRR)</span>
            <Building2 className="w-4 h-4 text-[#c5a059]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            ₹{totalMRR.toLocaleString("en-IN")}
            <span className="text-xs text-zinc-500 font-sans font-normal ml-1">/mo</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>{activePaidMembers.length} Active Paid Clients</span>
          </div>
        </div>

        {/* Metric 2: 1-Hour Free Trials */}
        <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-zinc-800 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">1-Hour Free Trials</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {activeTrialMembers.length}
            <span className="text-xs text-zinc-500 font-sans font-normal ml-1">Testing</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Real-time GPS Radar access</span>
          </div>
        </div>

        {/* Metric 3: Pending UTR Clearances */}
        <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-zinc-800 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pending UTR Approvals</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
            {pendingMembers.length}
            <span className="text-xs text-zinc-500 font-sans font-normal ml-1">Awaiting</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
            <span>KVB Beneficiary: Moorthy S L</span>
          </div>
        </div>

        {/* Metric 4: Welcome Emails Dispatched */}
        <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-zinc-800 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Welcome Mails Sent</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
            {members.filter((m) => m.welcomeEmailSent).length} / {members.length}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Onboarding Dispatch</span>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & Status Filter Tabs */}
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member name, Gmail ID, business name, or city..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#c5a059]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          {[
            { id: "all", label: "All Members", count: members.length },
            { id: "active", label: "Active Retainer (₹5k)", count: activePaidMembers.length },
            { id: "trial", label: "1-Hour Trial", count: activeTrialMembers.length },
            { id: "pending", label: "Pending UTR", count: pendingMembers.length },
            { id: "expired", label: "Expired", count: members.filter((m) => m.subscriptionStatus === "expired").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? "bg-[#17130b] text-[#c5a059] border border-[#c5a059]/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Members & Subscriptions Master Table */}
      <div className="rounded-3xl bg-[#0a0a0a] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c5a059]" />
            <h3 className="text-sm font-bold text-white">
              Registered Members & Subscription Registry
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 font-mono text-[10px] border border-zinc-800">
              {filteredMembers.length} Members
            </span>
          </div>

          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            KVB Settlement Master: Moorthy S L
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-medium text-white">No members matching current criteria.</p>
            <p className="text-xs">Try resetting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4">Member / Gmail</th>
                  <th className="py-3.5 px-4">Business / City</th>
                  <th className="py-3.5 px-4">Subscription Plan</th>
                  <th className="py-3.5 px-4">Live Status</th>
                  <th className="py-3.5 px-4">Welcome Mail</th>
                  <th className="py-3.5 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredMembers.map((member) => {
                  const isSuperAdmin = member.role === "admin" || member.email.includes("moorthy");
                  const biz = businesses.find((b) => b.ownerEmail.toLowerCase() === member.email.toLowerCase());
                  const isTrial = member.subscriptionStatus === "trial";
                  const isPending = member.subscriptionStatus === "pending";
                  const isExpired = member.subscriptionStatus === "expired";
                  const isActive = member.subscriptionStatus === "active" || isSuperAdmin;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-zinc-950/60 transition-colors group"
                    >
                      {/* 1. Member Profile & Email */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                            alt={member.name}
                            className="w-9 h-9 rounded-xl object-cover border border-zinc-700 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <strong className="text-white text-xs font-semibold block">
                                {member.name}
                              </strong>
                              {isSuperAdmin && (
                                <span className="px-1.5 py-0.2 rounded bg-[#c5a059] text-black font-bold text-[8px] uppercase">
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-400 font-mono block">
                              {member.email}
                            </span>
                            {member.phone && (
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" />
                                <span>{member.phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Business Listing & Location */}
                      <td className="py-4 px-4">
                        <div>
                          <strong className="text-white text-xs flex items-center gap-1">
                            <Store className="w-3 h-3 text-[#c5a059]" />
                            <span>{member.businessName || biz?.businessName || "Local Business"}</span>
                          </strong>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-zinc-500" />
                            <span>{member.city || biz?.city || "Chennai"}</span>
                          </span>
                          {biz?.websiteUrl && (
                            <a
                              href={biz.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>{biz.websiteUrl.replace("https://", "")}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 3. Subscription Plan */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-white block">
                            {member.email.toLowerCase() === "digi.hjb@gmail.com" || member.email.toLowerCase() === "digitalhkravibatterypoint@gmail.com"
                              ? "Enterprise Multi-Location (1-Year Free VIP)"
                              : member.activePlan || (isTrial ? "1-Hour Free Trial" : "₹5,000/mo Retainer")}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono block">
                            {member.email.toLowerCase() === "digi.hjb@gmail.com" || member.email.toLowerCase() === "digitalhkravibatterypoint@gmail.com"
                              ? "₹0 / 365 Days (₹1,80,000 Waived by Moorthy S L)"
                              : member.activePlan?.includes("15,000")
                              ? "₹15,000 / month"
                              : isTrial
                              ? "₹0 (60-Min Test Period)"
                              : "₹5,000 / month (KVB Retainer)"}
                          </span>
                        </div>
                      </td>

                      {/* 4. Live Status Badge */}
                      <td className="py-4 px-4">
                        {member.email.toLowerCase() === "digi.hjb@gmail.com" || member.email.toLowerCase() === "digitalhkravibatterypoint@gmail.com" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c160a] border border-[#c5a059] text-[#c5a059] font-bold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>1-Yr VIP Active</span>
                          </span>
                        ) : isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Active Retainer</span>
                          </span>
                        ) : isTrial ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-[11px]">
                            <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                            <span>1-Hour Trial Active</span>
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pending UTR Verification</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-[11px]">
                            <X className="w-3 h-3" />
                            <span>Trial Expired</span>
                          </span>
                        )}
                      </td>

                      {/* 5. Welcome Mail Sent Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewEmailMember(member)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Preview Sent Welcome Email"
                          >
                            <Mail className="w-3 h-3" />
                            <span className="text-[10px]">Preview</span>
                          </button>

                          <button
                            onClick={() => handleResendWelcomeMail(member.email)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Re-dispatch Welcome Email"
                          >
                            <Send className="w-3 h-3 text-[#c5a059]" />
                          </button>
                        </div>
                      </td>

                      {/* 6. Admin Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleApproveUTR(member.id, member.email)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                              title="Approve UTR and activate ₹5,000 retainer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve UTR</span>
                            </button>
                          )}

                          {isExpired && (
                            <button
                              onClick={() => handleExtendTrial(member.id, member.email)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              title="Grant another 60 minutes trial"
                            >
                              <Zap className="w-3 h-3" />
                              <span>+60m Trial</span>
                            </button>
                          )}

                          {!isActive && !isPending && (
                            <button
                              onClick={() => handleApproveUTR(member.id, member.email)}
                              className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-[#c5a059] hover:text-black border border-zinc-700 text-zinc-300 text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              Activate ₹5k
                            </button>
                          )}

                          {isActive && !isSuperAdmin && (
                            <button
                              onClick={() => handleRevokeSubscription(member.id, member.email)}
                              className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-red-950/50 hover:text-red-300 border border-zinc-800 text-zinc-400 text-[10px] transition-colors cursor-pointer"
                            >
                              Pause
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Bank Reconciliation & UTR Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Karur Vysya Bank Clearing Master */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0a0a0a] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Karur Vysya Bank (KVB) Beneficiary Registry</h3>
                <span className="text-[10px] text-zinc-400 font-mono">A/C: 1332153000001791 &bull; Moorthy S L</span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Live Gateway
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Account Holder Name:</span>
              <strong className="text-white">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">KVB Account Number:</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-[#c5a059] font-mono">{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
                <button
                  onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "acc")}
                  className="text-zinc-500 hover:text-white"
                >
                  {copiedField === "acc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">IFSC Code & Branch:</span>
              <strong className="text-white font-mono">{OFFICIAL_BANK_DETAILS.ifscCode} ({OFFICIAL_BANK_DETAILS.branch})</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Google Pay & Paytm UPI:</span>
              <strong className="text-white font-mono">{OFFICIAL_BANK_DETAILS.upiId}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Mandatory Purpose Code:</span>
              <strong className="text-emerald-400 font-mono">SEO</strong>
            </div>
          </div>
        </div>

        {/* Right: Recent Payment Records & Clearance Log */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0a0a0a] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Recent Settlement & UTR Log</h3>
                <span className="text-[10px] text-zinc-400 font-mono">Verified in Moorthy S L KVB Ledger</span>
              </div>
            </div>

            <span className="text-[10px] text-zinc-500 font-mono">Auto-Synced</span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_PAYMENT_RECORDS.map((pay) => (
              <div
                key={pay.id}
                className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">{pay.businessName}</strong>
                  <span className="text-emerald-400 font-bold font-mono">₹{pay.amountINR.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono text-zinc-500">UTR: {pay.utrNumber}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono">
                    {pay.status}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 block">
                  Method: {pay.paymentMethod} &bull; Purpose: {pay.transactionPurpose} &bull; {pay.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c5a059]" />
                <h3 className="text-sm font-bold text-white">Add New Member / Subscriber</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Member / Owner Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Ramesh Chandran"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Gmail / Email Address (Receives Welcome Mail)
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. ramesh.business@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="+91 98841..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                    City & Area
                  </label>
                  <input
                    type="text"
                    value={newMemberCity}
                    onChange={(e) => setNewMemberCity(e.target.value)}
                    placeholder="Chennai (Anna Nagar)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  value={newMemberBusiness}
                  onChange={(e) => setNewMemberBusiness(e.target.value)}
                  placeholder="e.g. Royal Aquatics & Pet Superstore"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Subscription Plan Assignment
                </label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#c5a059]"
                >
                  <option value="Google Pay & Paytm Monthly SEO (₹5,000/mo)">Google Pay & Paytm Monthly SEO (₹5,000/mo)</option>
                  <option value="1-Hour Full Access Free Trial">1-Hour Full Access Free Trial (₹0)</option>
                  <option value="Enterprise Multi-Location (₹15,000/mo)">Enterprise Multi-Location (₹15,000/mo)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register & Mail Welcome</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Preview Member Welcome Email Modal */}
      {previewEmailMember && (
        <WelcomeEmailModal
          isOpen={!!previewEmailMember}
          onClose={() => setPreviewEmailMember(null)}
        />
      )}

    </div>
  );
};
