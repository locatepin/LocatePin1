import React from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  PieChart,
  Search,
  ExternalLink,
  TrendingUp,
  Share2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Sparkles,
} from "lucide-react";

export const AcquisitionChannels: React.FC = () => {
  const { channels } = useAnalytics();

  const keywords = [
    { keyword: "real time website traffic analytics", volume: "14.2k", rank: "#2", ctr: "18.4%", conv: "6.2%", intent: "High Commercial" },
    { keyword: "website traffic generator ai", volume: "22.8k", rank: "#1", ctr: "29.1%", conv: "8.4%", intent: "High Commercial" },
    { keyword: "user behavior tracking dashboard", volume: "9.5k", rank: "#3", ctr: "14.0%", conv: "5.1%", intent: "Commercial" },
    { keyword: "live visitor event stream api", volume: "4.1k", rank: "#2", ctr: "21.6%", conv: "9.8%", intent: "Developer Intent" },
    { keyword: "predictive growth machine learning tool", volume: "6.8k", rank: "#4", ctr: "11.2%", conv: "4.5%", intent: "Enterprise" },
    { keyword: "privacy first google analytics alternative", volume: "18.1k", rank: "#3", ctr: "16.8%", conv: "7.0%", intent: "High Commercial" },
  ];

  const referrals = [
    { domain: "news.ycombinator.com", visitors: 1840, conv: "7.4%", status: "Surging" },
    { domain: "producthunt.com", visitors: 1120, conv: "8.9%", status: "Featured" },
    { domain: "github.com", visitors: 890, conv: "11.2%", status: "Organic Repo" },
    { domain: "twitter.com / x.com", visitors: 780, conv: "4.1%", status: "Viral Thread" },
    { domain: "medium.com", visitors: 420, conv: "3.8%", status: "Guest Article" },
  ];

  return (
    <div id="acquisition-channels-container" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Multi-Channel Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.channel}
            className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif italic text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color === '#3b82f6' ? '#c5a059' : ch.color }}></span>
                  {ch.channel}
                </span>
                <span className={`text-xs font-medium flex items-center ${ch.growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {ch.growth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(ch.growth)}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-serif text-white">
                  {ch.visitors.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500">({ch.percentage}%)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Conv. Rate:</span>
                <strong className="text-emerald-400 font-mono">{ch.conversionRate}%</strong>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Revenue Generated:</span>
                <strong className="text-[#c5a059] font-mono">${ch.revenue.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Bounce Rate:</span>
                <strong className="text-zinc-300 font-mono">{ch.bounceRate}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Organic Search Keywords Intelligence */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#c5a059]" />
              <span>Organic Search & Keyword Intelligence</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              High-ranking commercial keywords driving organic acquisition
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 font-semibold font-mono">
            42 Keywords in Top 3
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-semibold text-[10px] uppercase tracking-widest">
                <th className="pb-2.5">Search Query / Term</th>
                <th className="pb-2.5">Intent Category</th>
                <th className="pb-2.5 text-right">Search Volume</th>
                <th className="pb-2.5 text-right">SERP Rank</th>
                <th className="pb-2.5 text-right">CTR</th>
                <th className="pb-2.5 text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {keywords.map((kw, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-2.5 font-mono text-zinc-200 font-medium">
                    {kw.keyword}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {kw.intent}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-zinc-400">
                    {kw.volume}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                    {kw.rank}
                  </td>
                  <td className="py-2.5 text-right font-mono text-[#c5a059]">
                    {kw.ctr}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-white">
                    {kw.conv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Top Referral Sites */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-serif italic text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#c5a059]" />
          <span>Referral Multipliers & Domain Flow</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {referrals.map((ref, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-200 font-semibold block">{ref.domain}</span>
                <span className="text-[11px] text-zinc-500">{ref.visitors.toLocaleString()} visitors &bull; {ref.conv} conv</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 uppercase tracking-wider">
                {ref.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
