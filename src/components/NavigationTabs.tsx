import React from "react";
import {
  Activity,
  Cpu,
  Sparkles,
  Users,
  PieChart,
  Code2,
  MapPin,
  Building2,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useAnalytics } from "../context/AnalyticsContext";
import { useAuth } from "../context/AuthContext";

export type TabType =
  | "realtime"
  | "google-maps-seo"
  | "admin-panel"
  | "bank-billing"
  | "business-portal"
  | "traffic-generator"
  | "growth-opportunities"
  | "behavior"
  | "acquisition"
  | "live-tracker";

interface NavigationTabsProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const { activeVisitors, growthOpportunities } = useAnalytics();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.email?.toLowerCase().includes("moorthy");

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: "realtime",
      label: "Live Dashboard",
      icon: <Activity className="w-4 h-4" />,
      badge: `${activeVisitors} live`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: "admin-panel",
      label: "Admin Subscriptions",
      icon: <ShieldCheck className="w-4 h-4 text-[#c5a059]" />,
      badge: isAdmin ? "Moorthy Admin" : "Admin Panel",
      badgeColor: "bg-gradient-to-r from-amber-500 to-[#c5a059] text-black font-bold border-[#c5a059] shadow-sm",
    },
    {
      id: "google-maps-seo",
      label: "Locate Pin & Maps #1",
      icon: <MapPin className="w-4 h-4 text-[#c5a059]" />,
      badge: "Theme Aquarium #1",
      badgeColor: "bg-gradient-to-r from-amber-500/20 to-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40 font-bold",
    },
    {
      id: "bank-billing",
      label: "Bank Pay & Retainer",
      icon: <Building2 className="w-4 h-4" />,
      badge: "₹5,000 Active",
      badgeColor: "bg-[#1f1a10] text-[#c5a059] border-[#c5a059]/50 font-bold",
    },
    {
      id: "business-portal",
      label: "Upload Business Listing",
      icon: <Store className="w-4 h-4" />,
      badge: "Google Login",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    {
      id: "traffic-generator",
      label: "Growth Engine & Traffic",
      icon: <Cpu className="w-4 h-4" />,
      badge: "AI Synthesizer",
      badgeColor: "bg-[#15120d] text-[#c5a059] border-[#c5a059]/30",
    },
    {
      id: "growth-opportunities",
      label: "AI Opportunities",
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${growthOpportunities.length} ready`,
      badgeColor: "bg-[#15120d] text-[#c5a059] border-[#c5a059]/30",
    },
    {
      id: "behavior",
      label: "Funnels & User Behavior",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "acquisition",
      label: "Campaigns & SEO Channels",
      icon: <PieChart className="w-4 h-4" />,
    },
    {
      id: "live-tracker",
      label: "Telemetry SDK & Sandbox",
      icon: <Code2 className="w-4 h-4" />,
    },
  ];

  return (
    <div id="navigation-tabs-container" className="border-b border-zinc-800 bg-[#0a0a0a]/90 sticky top-[57px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex space-x-1.5 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-[#c5a059] border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <div className={`w-1 h-3 rounded-full transition-colors ${isActive ? 'bg-[#c5a059]' : 'bg-transparent'}`}></div>
                <span className={isActive ? "text-[#c5a059]" : "text-zinc-500"}>
                  {tab.icon}
                </span>
                <span className={isActive ? "font-semibold text-white" : ""}>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${tab.badgeColor || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
