import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { generateTrafficCampaign } from "../services/geminiService";
import { TrafficGenerationStrategy } from "../types/analytics";
import {
  Cpu,
  Sparkles,
  Zap,
  Target,
  Search,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Layers,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Rocket,
  Flame,
  ShieldCheck,
  Send,
} from "lucide-react";
import confetti from "canvas-confetti";

export const TrafficGeneratorAI: React.FC = () => {
  const {
    trafficStrategies,
    setTrafficStrategies,
    triggerManualTrafficBurst,
    trackCustomEvent,
    activeVisitors,
    simulationIntensity,
    setSimulationIntensity,
  } = useAnalytics();

  // Campaign generator state
  const [channel, setChannel] = useState("Programmatic SEO & Topic Clusters");
  const [targetAudience, setTargetAudience] = useState("Tech founders, growth engineers, and data-driven marketing leaders");
  const [productDescription, setProductDescription] = useState("Real-time behavioral web analytics with AI traffic creation and conversion optimization");
  const [trafficGoal, setTrafficGoal] = useState("+75,000 monthly unique visitors in 45 days");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<TrafficGenerationStrategy | null>(() => {
    return trafficStrategies.length > 0 ? trafficStrategies[0] : null;
  });

  // Simulator controls
  const [simVolume, setSimVolume] = useState<number>(5000);
  const [simChannel, setSimChannel] = useState<string>("Social");
  const [simPath, setSimPath] = useState<string>("/features/ai-traffic-generator");
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleGenerateCampaign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const strategy = await generateTrafficCampaign(
        channel,
        targetAudience,
        productDescription,
        trafficGoal
      );

      setTrafficStrategies((prev) => [strategy, ...prev]);
      setActiveStrategy(strategy);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#c5a059", "#d4b57a", "#ffffff"],
        });
      } catch (err) {}

      trackCustomEvent(`AI Traffic Campaign Generated: ${strategy.campaignName}`, "/features/ai-traffic-generator");
    } catch (err) {
      console.error("Failed to generate campaign:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    triggerManualTrafficBurst(simVolume, simChannel);
    trackCustomEvent(`AI Traffic Surge: +${simVolume} via ${simChannel}`, simPath);

    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div id="traffic-generator-ai-container" className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#15120d] via-[#0a0a0a] to-[#0a0a0a] border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Machine Learning Traffic Engine & Synthesis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
            AI Traffic Generator & Algorithmic Audience Expander
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Synthesize high-velocity traffic acquisition vectors, reverse-engineer high-intent search clusters, and simulate real-time audience streams before deploying live capital.
          </p>
        </div>
      </div>

      {/* Main Grid: Left = Strategy Blueprint Generator, Right = Traffic Stress Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Campaign Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Builder Form */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#c5a059]" />
                <span>Configure AI Acquisition Blueprint</span>
              </h3>
              <span className="text-[10px] text-[#c5a059] font-mono font-medium bg-[#15120d] px-2.5 py-1 rounded-lg border border-[#c5a059]/30 uppercase tracking-wider">
                Gemini 3.7 Flash Engine
              </span>
            </div>

            <form onSubmit={handleGenerateCampaign} className="space-y-4">
              {/* Acquisition Vector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Primary Acquisition Vector
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="Programmatic SEO & Topic Clusters" className="bg-[#0a0a0a]">Programmatic SEO & Topic Clusters</option>
                  <option value="Viral Developer Syndication & Teardowns" className="bg-[#0a0a0a]">Viral Developer Syndication & Teardowns</option>
                  <option value="X / Twitter Growth & Engineering Threads" className="bg-[#0a0a0a]">X / Twitter Growth & Engineering Threads</option>
                  <option value="Referral Loop & Interactive Embedded Badges" className="bg-[#0a0a0a]">Referral Loop & Interactive Embedded Badges</option>
                  <option value="High-Intent Paid Search Retargeting" className="bg-[#0a0a0a]">High-Intent Paid Search Retargeting</option>
                  <option value="Community Product Launch (ProductHunt + HackerNews)" className="bg-[#0a0a0a]">Community Product Launch (ProductHunt + HackerNews)</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Technical founders, SaaS marketers, analytics engineers..."
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Traffic Volume Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                    Traffic Volume Goal
                  </label>
                  <input
                    type="text"
                    value={trafficGoal}
                    onChange={(e) => setTrafficGoal(e.target.value)}
                    placeholder="+50,000 visitors in 30 days"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                    Product / Value Proposition
                  </label>
                  <input
                    type="text"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Real-time analytics and growth engine..."
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-bold shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Algorithmic Model Synthesizing Growth Campaign...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Generate AI Traffic Creation Blueprint</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Campaign Output */}
          {activeStrategy && (
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-6 animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#15120d] text-[#c5a059] font-semibold border border-[#c5a059]/30">
                      {activeStrategy.channel}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {activeStrategy.expectedTrafficIncrease}
                    </span>
                  </div>
                  <h3 className="text-base font-serif italic text-white mt-1">
                    {activeStrategy.campaignName}
                  </h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  {activeStrategy.estimatedTimeframe}
                </span>
              </div>

              {/* Strategy Overview */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Executive Acquisition Strategy
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  {activeStrategy.strategyOverview}
                </p>
              </div>

              {/* High-Intent Keyword Clusters */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Target Keyword Clusters (Low Competition, High Intent)</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500">Click to copy</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeStrategy.keywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(kw)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{kw}</span>
                      {copiedKeyword === kw ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Angles & Hooks */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>High-Converting Content Angles & Viral Hooks</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeStrategy.contentIdeas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#c5a059] font-bold mb-1 uppercase tracking-wider">
                          <span>Angle #{idx + 1}</span>
                          <span className="text-emerald-400 font-mono">CTR {idea.projectedCTR}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white mb-1.5">
                          "{idea.headline}"
                        </h5>
                        <p className="text-[11px] text-zinc-400 italic mb-2">
                          Hook: {idea.hook}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-zinc-800 text-[11px] text-[#c5a059] font-semibold flex items-center justify-between">
                        <span>CTA: {idea.cta}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phased Execution Roadmap */}
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Distribution & Execution Roadmap
                </h4>
                <div className="space-y-2">
                  {activeStrategy.distributionPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center font-bold text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-zinc-500 font-semibold">Key Real-Time Metrics:</span>
                <div className="flex flex-wrap gap-2">
                  {activeStrategy.kpis.map((kpi, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Real-Time Traffic Simulator & Stress Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulator Panel */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#c5a059]" />
                <span>Traffic Stream Simulator</span>
              </h3>
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Active Sandbox
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Inject synthetic user cohorts directly into the live analytics stream to observe funnel behavior, latency resilience, and real-time conversion elasticity.
            </p>

            <div className="space-y-4">
              {/* Traffic Volume Slider & Presets */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                  <span>Burst Influx Volume</span>
                  <span className="text-[#c5a059] font-mono font-bold">+{simVolume.toLocaleString()} Concurrent Sessions</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={50000}
                  step={250}
                  value={simVolume}
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  className="w-full accent-[#c5a059] bg-zinc-900 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1 mb-2">
                  <span>100</span>
                  <span>10,000</span>
                  <span>25,000</span>
                  <span>50,000</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[500, 1000, 2500, 5000, 10000, 25000, 50000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSimVolume(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono border transition-colors cursor-pointer ${
                        simVolume === preset
                          ? "bg-[#c5a059] text-black font-bold border-[#c5a059]"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      +{preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Simulation Channel Vector
                </label>
                <select
                  value={simChannel}
                  onChange={(e) => setSimChannel(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="Social" className="bg-[#0a0a0a]">Social (X / HackerNews Surge)</option>
                  <option value="Organic Search" className="bg-[#0a0a0a]">Organic Search (Google Blitz)</option>
                  <option value="Referral" className="bg-[#0a0a0a]">Referral (Product Hunt Launch)</option>
                  <option value="Paid Ads" className="bg-[#0a0a0a]">Paid Ads (High-Intent PPC)</option>
                  <option value="Direct" className="bg-[#0a0a0a]">Direct (Newsletter Broadcast)</option>
                </select>
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Destination Target Route
                </label>
                <select
                  value={simPath}
                  onChange={(e) => setSimPath(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059] font-mono"
                >
                  <option value="/features/ai-traffic-generator" className="bg-[#0a0a0a]">/features/ai-traffic-generator</option>
                  <option value="/pricing" className="bg-[#0a0a0a]">/pricing</option>
                  <option value="/" className="bg-[#0a0a0a]">/ (Homepage)</option>
                  <option value="/checkout" className="bg-[#0a0a0a]">/checkout</option>
                  <option value="/docs/quickstart" className="bg-[#0a0a0a]">/docs/quickstart</option>
                </select>
              </div>

              {/* Stream Intensity Mode */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Continuous Stream Intensity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "moderate", "high", "viral_surge"] as const).map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => setSimulationIntensity(intensity)}
                      className={`py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                        simulationIntensity === intensity
                          ? "bg-[#c5a059] text-black font-black shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                          : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800"
                      }`}
                    >
                      {intensity.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Burst Button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-bold shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{isSimulating ? "Injecting Stream..." : `Inject +${simVolume} Live Simulated Visitors Now`}</span>
              </button>
            </div>
          </div>

          {/* Machine Learning Model Diagnostics Card */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Algorithmic Telemetry Engine</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Current Concurrency Load:</span>
                <span className="text-white font-mono font-bold">{activeVisitors} active sessions</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Stream Sampling Rate:</span>
                <span className="text-emerald-400 font-mono font-bold">100% (Lossless)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Predicted Viral Elasticity:</span>
                <span className="text-[#c5a059] font-mono font-bold">3.8x baseline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
