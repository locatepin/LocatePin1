import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  Users,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  ArrowUpDown,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const BehaviorAnalytics: React.FC = () => {
  const { funnelSteps, topPages, sessions, trackCustomEvent } = useAnalytics();
  const [sortField, setSortField] = useState<string>("visitors");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [pageSearch, setPageSearch] = useState<string>("");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedPages = [...topPages]
    .filter((p) => p.path.toLowerCase().includes(pageSearch.toLowerCase()) || p.title.toLowerCase().includes(pageSearch.toLowerCase()))
    .sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

  // Calculate device distribution
  const deviceCounts = sessions.reduce(
    (acc, s) => {
      acc[s.device] = (acc[s.device] || 0) + 1;
      return acc;
    },
    { Desktop: 0, Mobile: 0, Tablet: 0 } as Record<string, number>
  );
  const totalDev = sessions.length || 1;
  const desktopPct = Math.round((deviceCounts.Desktop / totalDev) * 100);
  const mobilePct = Math.round((deviceCounts.Mobile / totalDev) * 100);
  const tabletPct = Math.round((deviceCounts.Tablet / totalDev) * 100);

  return (
    <div id="behavior-analytics-container" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Interactive Conversion Funnel */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c5a059]" />
                <span>Multi-Step Conversion Funnel & Dropoff Leakage</span>
              </h3>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                3.85% End-to-End Conv
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Visualizes step-by-step visitor progression from initial landing to final transaction
            </p>
          </div>

          <button
            onClick={() => trackCustomEvent("Checkout Funnel Step 4 Test Hit", "/checkout", { type: "test" })}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold self-start sm:self-auto cursor-pointer transition-colors"
          >
            Simulate Conversion Step &rarr;
          </button>
        </div>

        {/* Funnel Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {funnelSteps.map((step, idx) => {
            const widthPct = Math.max(20, Math.round((step.visitors / funnelSteps[0].visitors) * 100));

            return (
              <div
                key={step.step}
                className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-500 font-medium font-mono text-[10px] uppercase">Step {step.step}</span>
                    <span className="text-[#c5a059] font-bold">{step.conversionRate}%</span>
                  </div>
                  <h4 className="text-xs font-serif italic text-white truncate mb-2" title={step.name}>
                    {step.name}
                  </h4>
                  <div className="text-xl font-serif text-white tracking-tight">
                    {step.visitors.toLocaleString()}
                  </div>
                </div>

                {/* Progress bar representing funnel width */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#c5a059] rounded-full"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>

                  {step.dropoffRate > 0 ? (
                    <div className="flex items-center justify-between text-[10px] text-rose-400 font-medium">
                      <span>Dropoff:</span>
                      <span className="font-mono">-{step.dropoffRate}%</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Entry Point (100%)
                    </div>
                  )}
                  <span className="text-[10px] text-zinc-600 font-mono block mt-1">
                    Avg time: {step.avgDurationSeconds}s
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Funnel Diagnosis Callout */}
        <div className="p-4 rounded-xl bg-[#15120d] border border-[#c5a059]/30 flex items-start gap-3 text-xs">
          <Sparkles className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
          <div className="text-zinc-300">
            <strong className="text-[#c5a059] font-semibold block mb-0.5">
              AI Algorithmic Funnel Diagnosis:
            </strong>
            <span>
              The largest leakage vector occurs between <strong>Step 3 (Pricing View)</strong> and <strong>Step 4 (Checkout Initiation)</strong>, with a 66% dropoff. Implementing seamless SSO auth and displaying security badges is projected to recover <strong>+$24,000 in monthly recurring revenue</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Pages Deep Dive Table */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <span>Page Performance & Behavioral Telemetry</span>
              <span className="text-xs font-mono text-zinc-500">({sortedPages.length} routes)</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Comprehensive analysis of time on page, bounce rate, and exit probabilities
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search route or title..."
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-semibold text-[10px] uppercase tracking-widest">
                <th className="pb-3 cursor-pointer" onClick={() => handleSort("path")}>
                  <div className="flex items-center gap-1">
                    <span>Page Path & Title</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3 text-right cursor-pointer" onClick={() => handleSort("visitors")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Visitors</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3 text-right cursor-pointer" onClick={() => handleSort("avgTimeOnPage")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Avg Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3 text-right cursor-pointer" onClick={() => handleSort("bounceRate")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Bounce Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3 text-right cursor-pointer" onClick={() => handleSort("conversionRate")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Conv Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sortedPages.map((page) => (
                <tr key={page.path} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3">
                    <div>
                      <span className="font-mono font-semibold text-zinc-200 block text-xs">
                        {page.path}
                      </span>
                      <span className="text-[11px] text-zinc-500 truncate block max-w-sm">
                        {page.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-white font-semibold">
                    {page.visitors.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-zinc-400">
                    {page.avgTimeOnPage}
                  </td>
                  <td className="py-3 text-right font-mono">
                    <span className={page.bounceRate > 40 ? "text-rose-400" : "text-emerald-400"}>
                      {page.bounceRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">
                    <span className="font-bold text-[#c5a059]">{page.conversionRate}%</span>
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-400 text-xs">
                    +{page.trend}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Scroll Depth & Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scroll Depth Engagement */}
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-serif italic text-white mb-1">
            Scroll Depth & Viewport Retention
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Percentage of visitors reaching key page milestones
          </p>

          <div className="space-y-3.5">
            {[
              { label: "Top of Fold (0 - 25%)", percent: 100 },
              { label: "Feature Highlights (25 - 50%)", percent: 84 },
              { label: "Interactive Demo & Pricing (50 - 75%)", percent: 62 },
              { label: "Footer & FAQ (75 - 100%)", percent: 38 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">{item.label}</span>
                  <span className="font-mono text-white font-bold">{item.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c5a059] rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Hardware Metrics */}
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-serif italic text-white mb-1">
            Device & Platform Distribution
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Breakdown across desktop, mobile, and tablet viewports
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
              <Laptop className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Desktop</span>
              <span className="text-lg font-serif text-white">{desktopPct}%</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
              <Smartphone className="w-5 h-5 text-[#c5a059] mx-auto mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Mobile</span>
              <span className="text-lg font-serif text-[#c5a059]">{mobilePct}%</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
              <Tablet className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Tablet</span>
              <span className="text-lg font-serif text-white">{tabletPct}%</span>
            </div>
          </div>

          <div className="text-xs text-zinc-500 flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span>Primary Browsers:</span>
            <span className="text-zinc-300 font-medium">Chrome (64%) &bull; Safari (22%) &bull; Firefox (8%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
