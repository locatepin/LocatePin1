import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { VisitorSession } from "../types/analytics";
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Filter,
  Layers,
  ChevronRight,
  X,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const RealTimeOverview: React.FC = () => {
  const {
    activeVisitors,
    totalVisitorsToday,
    pageviewsToday,
    bounceRate,
    avgSessionDuration,
    conversionRate,
    revenueToday,
    trafficVelocity,
    filteredSessions,
    topPages,
    geoDistribution,
    selectedSession,
    setSelectedSession,
    filterChannel,
    setFilterChannel,
    filterPath,
    setFilterPath,
    triggerManualTrafficBurst,
    trackCustomEvent,
  } = useAnalytics();

  const [searchQuery, setSearchQuery] = useState("");

  // Format velocity data for recharts
  const velocityChartData = trafficVelocity.map((val, idx) => ({
    minute: `${60 - idx}m ago`,
    visitors: val,
  }));

  const maxVelocity = Math.max(...trafficVelocity, 100);

  // Filtered session list with text search
  const visibleSessions = filteredSessions.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.ip.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.currentPath.toLowerCase().includes(q) ||
      s.channel.toLowerCase().includes(q)
    );
  });

  const getDeviceIcon = (device: string) => {
    if (device === "Mobile") return <Smartphone className="w-3.5 h-3.5 text-zinc-500" />;
    if (device === "Tablet") return <Tablet className="w-3.5 h-3.5 text-zinc-500" />;
    return <Laptop className="w-3.5 h-3.5 text-zinc-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "converted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" /> Converted
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span> Active
          </span>
        );
      case "idle":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
            Idle
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Bounced
          </span>
        );
    }
  };

  return (
    <div id="realtime-overview-container" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Visitors Right Now */}
        <div id="metric-active-visitors" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Active Visitors Now
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif text-white tracking-tight">
              {activeVisitors}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Live concurrent sessions on site right now
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Peak: <strong className="text-[#c5a059] font-mono">{maxVelocity + 80}</strong></span>
            <button
              onClick={() => triggerManualTrafficBurst(20)}
              className="text-[11px] text-[#c5a059] hover:text-[#d4b57a] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-[#c5a059]" /> +20 Burst
            </button>
          </div>
        </div>

        {/* Card 2: Total Visitors Today */}
        <div id="metric-total-visitors" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Total Visitors Today
            </span>
            <Users className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif text-white tracking-tight">
              {totalVisitorsToday.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +28.5%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Across {pageviewsToday.toLocaleString()} pageviews (2.93/user)
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Direct + Search: <strong className="text-zinc-300">66.9%</strong></span>
            <span>Est. EOD: <strong className="text-zinc-300 font-mono">22.4k</strong></span>
          </div>
        </div>

        {/* Card 3: Real-Time Conversion Rate & Revenue */}
        <div id="metric-conversion-rate" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Conversion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-[#c5a059]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif text-[#c5a059] tracking-tight">
              {conversionRate}%
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +0.4%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Today's revenue: <strong className="text-white font-mono font-medium">${revenueToday.toLocaleString()}</strong>
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Goal: Pro Signups</span>
            <span className="text-emerald-400 font-medium">840 Converted</span>
          </div>
        </div>

        {/* Card 4: Avg Duration & Bounce Rate */}
        <div id="metric-duration-bounce" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Avg. Session & Retention
            </span>
            <Clock className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-serif text-white tracking-tight">
              {Math.floor(avgSessionDuration / 60)}m {avgSessionDuration % 60}s
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18s
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Bounce rate: <strong className="text-zinc-300 font-mono">{bounceRate}%</strong> (healthy)
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Scroll Depth: <strong className="text-zinc-300">68%</strong></span>
            <span>Exit Rate: <strong className="text-zinc-300">21%</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Velocity Graph & Top Active URLs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concurrency Velocity Timeline (2 cols) */}
        <div id="concurrency-velocity-card" className="lg:col-span-2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
                <span>Real-Time Traffic Velocity</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Packets and concurrent sessions stream updated every second
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                Peak: <strong className="text-[#c5a059]">{maxVelocity}</strong> users
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="minute"
                  tick={{ fill: "#52525b", fontSize: 10 }}
                  interval={9}
                  axisLine={{ stroke: "#27272a" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#52525b", fontSize: 10 }}
                  axisLine={{ stroke: "#27272a" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  }}
                  labelStyle={{ color: "#a1a1aa" }}
                  formatter={(value: any) => [`${value} Concurrent Visitors`, "Live Traffic"]}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#c5a059"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVelocity)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c5a059]"></span> Live Stream Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 0.02ms Ingestion
              </span>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">Lossless concurrency capture</span>
          </div>
        </div>

        {/* Top Active Pages Heat (1 col) */}
        <div id="top-active-pages-card" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif italic text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#c5a059]" />
                <span>Active URLs Heat</span>
              </h3>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Top Routes
              </span>
            </div>

            <div className="space-y-3.5">
              {topPages.slice(0, 5).map((page) => {
                const totalTopVisitors = topPages.reduce((acc, p) => acc + p.visitors, 0);
                const percent = Math.round((page.visitors / totalTopVisitors) * 100);

                return (
                  <div key={page.path} className="group cursor-pointer" onClick={() => setFilterPath(filterPath === page.path ? "all" : page.path)}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-zinc-300 truncate max-w-[170px] group-hover:text-[#c5a059] transition-colors">
                        {page.path}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400">{page.visitors.toLocaleString()}</span>
                        <span className="text-[10px] font-semibold text-emerald-400">{page.conversionRate}%</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c5a059] rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>High Intent: <strong className="text-white font-mono">/pricing</strong></span>
            <button
              onClick={() => trackCustomEvent("Simulated Landing Click", "/features/ai-traffic-generator")}
              className="text-[11px] text-[#c5a059] hover:text-[#d4b57a] font-medium"
            >
              Test Route Hit &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. Geographic Distribution & Live Visitor Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geo Distribution (1 col) */}
        <div id="geo-distribution-card" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c5a059]" />
              <span>Global Visitor Heat</span>
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Top Nodes</span>
          </div>

          <div className="space-y-3.5">
            {geoDistribution.slice(0, 6).map((item) => (
              <div key={item.code} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-[120px]">
                  <span className="text-sm">{getCountryFlag(item.code)}</span>
                  <span className="text-xs font-medium text-zinc-300">{item.country}</span>
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c5a059] rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-zinc-400 font-semibold">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <div>
              <span className="text-zinc-200 font-medium block">Tier-1 Regions (US & EU)</span>
              <span className="text-[11px] text-zinc-500">Drive 72.5% of total high-value conversions</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">$34.2k</span>
          </div>
        </div>

        {/* Live Visitor Stream (2 cols) */}
        <div id="live-visitor-stream-card" className="lg:col-span-2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Visitor Stream</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {visibleSessions.length} sessions
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Click any visitor session to inspect clickstream, scroll depth, and trajectory
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter IP, city, path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                />
                {filterPath !== "all" && (
                  <button
                    onClick={() => setFilterPath("all")}
                    className="text-[11px] text-[#c5a059] bg-[#15120d] px-2 py-1 rounded border border-[#c5a059]/30 flex items-center gap-1"
                  >
                    <span>Clear Path</span> <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-semibold text-[10px] uppercase tracking-widest">
                    <th className="pb-3">Visitor & Location</th>
                    <th className="pb-3">Device</th>
                    <th className="pb-3">Current URL</th>
                    <th className="pb-3">Channel</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {visibleSessions.slice(0, 7).map((session) => (
                    <tr
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`hover:bg-zinc-900/50 cursor-pointer transition-colors group ${
                        selectedSession?.id === session.id ? "bg-zinc-900" : ""
                      }`}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getCountryFlag(session.countryCode)}</span>
                          <div>
                            <span className="font-medium text-zinc-200 block truncate max-w-[110px]">
                              {session.city}, {session.countryCode}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-500">
                              {session.ip}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 text-zinc-400">
                          {getDeviceIcon(session.device)}
                          <span className="text-[11px]">{session.browser}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-zinc-300 font-medium truncate block max-w-[130px]" title={session.currentPath}>
                          {session.currentPath}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-zinc-400">
                          {session.channel}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-zinc-500 text-[11px]">
                        {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s
                      </td>
                      <td className="py-3">
                        {getStatusBadge(session.status)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSession(session);
                          }}
                          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-[#c5a059] text-zinc-300 hover:text-black text-[10px] font-semibold transition-colors border border-zinc-800 cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>Showing active user cohort</span>
            <button
              onClick={() => triggerManualTrafficBurst(10, "Referral")}
              className="text-[11px] text-[#c5a059] hover:text-[#d4b57a] font-medium"
            >
              + Simulate Influx &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4. Session Clickstream Detail Drawer (if selected) */}
      {selectedSession && (
        <div id="session-detail-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif italic text-white text-base flex items-center gap-2">
                    <span>Session Telemetry:</span>
                    <span className="font-mono text-sm text-[#c5a059] not-italic">{selectedSession.ip}</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {selectedSession.city}, {selectedSession.country} &bull; {selectedSession.device} ({selectedSession.browser} on {selectedSession.os})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Key Session Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Channel</span>
                  <span className="text-xs font-bold text-white block mt-1">{selectedSession.channel}</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Duration</span>
                  <span className="text-xs font-bold text-white block mt-1 font-mono">{selectedSession.durationSeconds}s</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Scroll Depth</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-1 font-mono">{selectedSession.scrollDepth}%</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Pageviews</span>
                  <span className="text-xs font-bold text-[#c5a059] block mt-1 font-mono">{selectedSession.pageviewsCount}</span>
                </div>
              </div>

              {/* Referrer & Current Page */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Referrer Source:</span>
                  <span className="font-mono text-zinc-300">{selectedSession.referrer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Current Active Path:</span>
                  <span className="font-mono text-[#c5a059] font-semibold">{selectedSession.currentPath}</span>
                </div>
                {selectedSession.conversionGoal && (
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="text-emerald-400 font-semibold">Conversion Achieved:</span>
                    <span className="font-bold text-emerald-300">{selectedSession.conversionGoal}</span>
                  </div>
                )}
              </div>

              {/* Clickstream Event History */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Chronological Event Stream
                </h4>
                <div className="space-y-2">
                  {selectedSession.actions.map((act, i) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{act.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(act.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-zinc-400 block mt-0.5">
                          Path: {act.path}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-zinc-950 px-6 py-3 border-t border-zinc-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getCountryFlag(countryCode: string) {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    GB: "🇬🇧",
    DE: "🇩🇪",
    CA: "🇨🇦",
    JP: "🇯🇵",
    FR: "🇫🇷",
    AU: "🇦🇺",
    IN: "🇮🇳",
    NL: "🇳🇱",
    SG: "🇸🇬",
    SE: "🇸🇪",
    IE: "🇮🇪",
  };
  return flags[countryCode] || "🌐";
}
