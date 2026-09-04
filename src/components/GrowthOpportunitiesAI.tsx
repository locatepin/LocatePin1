import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { fetchGrowthOpportunities } from "../services/geminiService";
import { GrowthOpportunity } from "../types/analytics";
import {
  Sparkles,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const GrowthOpportunitiesAI: React.FC = () => {
  const {
    growthOpportunities,
    setGrowthOpportunities,
    activeVisitors,
    totalVisitorsToday,
    bounceRate,
    conversionRate,
    avgSessionDuration,
    topPages,
    channels,
    funnelSteps,
    trackCustomEvent,
  } = useAnalytics();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "SEO & Organic",
    "Conversion Funnel",
    "Viral & Referral",
    "Retention",
    "Channel Expansion",
    "Paid Performance",
  ];

  const handleRunAudit = async () => {
    setIsLoading(true);
    try {
      const currentMetrics = {
        activeVisitors,
        totalVisitorsToday,
        bounceRate,
        conversionRate,
        avgSessionDuration,
      };

      const opportunities = await fetchGrowthOpportunities(
        currentMetrics,
        topPages,
        channels,
        funnelSteps,
        "High-Growth Digital SaaS Platform",
        "Maximize organic search velocity & eliminate funnel checkout dropoffs"
      );

      setGrowthOpportunities(opportunities);
      trackCustomEvent("Machine Learning Growth Opportunity Audit Executed", "/features/ai-traffic-generator");
    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const filteredOpportunities = growthOpportunities.filter((opp) => {
    if (selectedCategory !== "All" && opp.category !== selectedCategory) return false;
    if (selectedPriority !== "All" && opp.priority !== selectedPriority) return false;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    if (priority === "Critical") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Critical Impact
        </span>
      );
    }
    if (priority === "High") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30">
          High Impact
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-zinc-900 text-zinc-300 border border-zinc-700">
        Medium Impact
      </span>
    );
  };

  return (
    <div id="growth-opportunities-ai-container" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#15120d] via-[#0a0a0a] to-[#0a0a0a] border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Machine Learning Anomaly & Potential Mining</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
            AI Growth Opportunities & Revenue Unlocks
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Algorithmic continuous audit detecting hidden conversion friction, untapped organic search queries, and viral compounding multipliers.
          </p>
        </div>

        <button
          id="run-ml-growth-audit-btn"
          onClick={handleRunAudit}
          disabled={isLoading}
          className="px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-semibold shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Analyzing Behavioral Telemetry...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Deep ML Opportunity Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Aggregate Opportunity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            Total Projected Monthly Lift
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#c5a059]">+$59,700</span>
            <span className="text-xs text-zinc-500">/ month</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Across 4 active prioritized machine learning initiatives
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            Potential Organic Traffic Increase
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white">+68.4%</span>
            <span className="text-xs text-zinc-500">Volume</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Targeting 32 unranked high-intent commercial queries
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            Average Algorithmic Confidence
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#c5a059]">92.5%</span>
            <span className="text-xs text-emerald-400 font-medium">High Certainty</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Trained on real-time multi-cohort session elasticity
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a0a0a] p-3 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-[#c5a059] border border-zinc-700 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-[#c5a059]"
          >
            <option value="All" className="bg-[#0a0a0a]">All Priorities</option>
            <option value="Critical" className="bg-[#0a0a0a]">Critical</option>
            <option value="High" className="bg-[#0a0a0a]">High</option>
            <option value="Medium" className="bg-[#0a0a0a]">Medium</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          return (
            <div
              key={opp.id}
              id={`opportunity-card-${opp.id}`}
              className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4 transition-all"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getPriorityBadge(opp.priority)}
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 font-medium">
                      {opp.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#c5a059] font-medium bg-[#15120d] px-2 py-0.5 rounded border border-[#c5a059]/30">
                      {opp.confidenceScore}% ML Confidence
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif italic text-white tracking-tight">
                    {opp.title}
                  </h3>
                </div>

                {/* Projected Impact Pill */}
                <div className="flex items-center gap-2 self-start sm:self-auto bg-zinc-950 border border-zinc-800 px-3.5 py-2 rounded-xl text-right">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 font-mono block">
                      {opp.projectedRevenueLift}
                    </span>
                    <span className="text-[10px] text-[#c5a059] font-semibold block">
                      {opp.projectedTrafficLift}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnosis Summary */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                {opp.summary}
              </p>

              {/* Root Cause Behavioral Analysis */}
              <div className="flex items-start gap-2.5 text-xs text-zinc-400 bg-rose-500/5 border border-rose-500/20 p-3.5 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 font-semibold block">Root Cause Analysis:</strong>
                  <span>{opp.rootCause}</span>
                </div>
              </div>

              {/* Impact Metric Comparison & Tactical Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Impact Metrics */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Algorithmic Impact Targets</span>
                  </h4>
                  <div className="space-y-2">
                    {opp.impactMetrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/80 last:border-0">
                        <span className="text-zinc-400">{metric.label}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-zinc-600 line-through text-[11px]">{metric.current}</span>
                          <span className="text-emerald-400 font-semibold">&rarr; {metric.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Difficulty: <strong className="text-zinc-300">{opp.difficulty}</strong></span>
                    <span>Timeframe: <strong className="text-zinc-300">{opp.timeToImplement}</strong></span>
                  </div>
                </div>

                {/* Tactical Execution Plan Checklist */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Action Plan Checklist</span>
                  </h4>
                  <div className="space-y-2">
                    {opp.recommendedActions.map((action, idx) => {
                      const taskId = `${opp.id}_task_${idx}`;
                      const isDone = !!completedTasks[taskId];

                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer group hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleTask(taskId)}
                            className="mt-0.5 rounded accent-[#c5a059] bg-zinc-900 border-zinc-700"
                          />
                          <span className={isDone ? "line-through text-zinc-600" : ""}>
                            {action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
