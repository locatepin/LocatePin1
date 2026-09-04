import React, { useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  Code2,
  Copy,
  Check,
  Zap,
  Terminal,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Globe,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";

export const LiveTrackerSandbox: React.FC = () => {
  const {
    selectedWebsite,
    trackCustomEvent,
    triggerManualTrafficBurst,
    activeVisitors,
  } = useAnalytics();

  const [copiedCode, setCopiedCode] = useState(false);
  const [testEventName, setTestEventName] = useState("Demo CTA Clicked");
  const [testPath, setTestPath] = useState("/pricing");
  const [testProperties, setTestProperties] = useState('{\n  "plan": "Enterprise Pro",\n  "billing": "annual",\n  "intent_score": 94\n}');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isFiring, setIsFiring] = useState(false);

  const trackerSnippet = `<!-- TrafficPulse AI Real-Time Behavioral Telemetry SDK -->
<script
  src="https://cdn.trafficpulse.ai/telemetry.v2.min.js"
  data-website-id="${selectedWebsite}"
  data-ai-optimization="true"
  data-lossless-stream="true"
  async
></script>

<script>
  // Optional: Track custom conversion events & funnel steps
  window.tp = window.tp || function() { (tp.q = tp.q || []).push(arguments) };
  tp('track', 'Signup Started', { plan: 'Enterprise Pro', source: 'header_cta' });
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackerSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFireEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFiring(true);

    let parsedProps = {};
    try {
      parsedProps = JSON.parse(testProperties);
    } catch (err) {
      parsedProps = { raw: testProperties };
    }

    trackCustomEvent(testEventName, testPath, parsedProps);

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] 200 OK: Event '${testEventName}' ingested at route '${testPath}' (0.02ms latency)`;

    setSimulationLog((prev) => [logEntry, ...prev.slice(0, 7)]);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#c5a059", "#d4b57a", "#ffffff"],
      });
    } catch (err) {}

    setTimeout(() => {
      setIsFiring(false);
    }, 400);
  };

  return (
    <div id="live-tracker-sandbox-container" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#15120d] via-[#0a0a0a] to-[#0a0a0a] border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 text-[10px] uppercase tracking-widest font-semibold mb-3">
          <Code2 className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Real-Time Ingestion SDK & Telemetry Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
          Telemetry SDK & Interactive Event Sandbox
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Embed the ultra-lightweight (&lt;1.8KB) lossless tracking snippet on your web properties to stream real-time visitor interactions, funnel transitions, and algorithmic anomaly triggers with sub-millisecond propagation.
        </p>
      </div>

      {/* Grid: Left = Tracking Snippet, Right = Event Simulator Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Embed SDK Code (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#c5a059]" />
                  <span>Client-Side Telemetry Snippet</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Paste before the closing <code className="text-[#c5a059] font-mono">&lt;/head&gt;</code> tag
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            {/* Code block */}
            <div className="relative">
              <pre className="bg-[#050505] p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto leading-relaxed">
                <code>{trackerSnippet}</code>
              </pre>
            </div>

            {/* Features Checklist */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block">
                SDK Architecture Features
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>1.8KB Zero-Dependency Script</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>GDPR / CCPA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Beacon API Lossless Buffering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Automated UTM Attribution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick API Verification Status */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Ingestion Pipeline Active
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Target: {selectedWebsite} &bull; 0.02ms latency
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#c5a059] bg-[#15120d] px-2.5 py-1 rounded border border-[#c5a059]/30">
              100% SLA
            </span>
          </div>
        </div>

        {/* Right Column: Custom Event Ingestion Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#c5a059]" />
                <span>Simulate Real-Time Custom Events</span>
              </h3>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Interactive
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Trigger instant test events to verify real-time stream ingestion and conversion telemetry.
            </p>

            <form onSubmit={handleFireEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={testEventName}
                  onChange={(e) => setTestEventName(e.target.value)}
                  placeholder="e.g. Completed Checkout, Demo Clicked, Form Submitted..."
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Page Route / URL Path
                </label>
                <input
                  type="text"
                  value={testPath}
                  onChange={(e) => setTestPath(e.target.value)}
                  placeholder="/pricing"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#c5a059] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1.5">
                  Event Metadata (JSON Properties)
                </label>
                <textarea
                  value={testProperties}
                  onChange={(e) => setTestProperties(e.target.value)}
                  rows={3}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono placeholder-zinc-600 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                disabled={isFiring}
                className="w-full py-3 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black text-xs font-bold shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>{isFiring ? "Streaming Event..." : "Send Test Telemetry Event Now"}</span>
              </button>
            </form>

            {/* Ingestion Stream Console Logs */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Live Ingestion Console
                </span>
                {simulationLog.length > 0 && (
                  <button
                    onClick={() => setSimulationLog([])}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300"
                  >
                    Clear Logs
                  </button>
                )}
              </div>
              <div className="bg-[#050505] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] min-h-[100px] max-h-[140px] overflow-y-auto space-y-1">
                {simulationLog.length === 0 ? (
                  <span className="text-zinc-600 italic">
                    No custom events fired yet. Click "Send Test Telemetry Event Now" above.
                  </span>
                ) : (
                  simulationLog.map((log, idx) => (
                    <div key={idx} className="text-emerald-400">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
