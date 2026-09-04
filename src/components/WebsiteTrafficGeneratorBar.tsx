import React, { useState, useEffect } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  Link as LinkIcon,
  Zap,
  Plus,
  X,
  Sparkles,
  Globe,
  Tag,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Search,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Activity,
  Check,
  MapPin,
  Award,
  Navigation,
  Phone,
} from "lucide-react";
import confetti from "canvas-confetti";

interface WebsiteTrafficGeneratorBarProps {
  onGenerated?: () => void;
  onNavigateToMaps?: () => void;
}

export const WebsiteTrafficGeneratorBar: React.FC<WebsiteTrafficGeneratorBarProps> = ({
  onGenerated,
  onNavigateToMaps,
}) => {
  const {
    selectedWebsite,
    setSelectedWebsite,
    loadWebsiteUrl,
    triggerManualTrafficBurst,
    trackCustomEvent,
  } = useAnalytics();

  const [inputUrl, setInputUrl] = useState("https://themeaquarium.com");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([
    "aquarium shop in chennai",
    "theme aquarium 3rd ave",
    "planted aquarium tank chennai",
    "exotic fish store anna nagar",
  ]);
  const [trafficVolume, setTrafficVolume] = useState<number>(5000);
  const [customVolumeInput, setCustomVolumeInput] = useState<string>("5000");
  const [selectedChannel, setSelectedChannel] = useState<string>("Google Maps Local Pack");
  const [selectedCountry, setSelectedCountry] = useState<string>("Chennai, India");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  const [generationLog, setGenerationLog] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [siteInspection, setSiteInspection] = useState<{
    domain: string;
    protocol: string;
    status: number;
    latencyMs: number;
    isSecure: boolean;
    detectedType: string;
  } | null>({
    domain: "themeaquarium.com",
    protocol: "https",
    status: 200,
    latencyMs: 16,
    isSecure: true,
    detectedType: "Aquarium & Marine Livestock Retailer (Chennai)",
  });

  // Validate URL protocol
  useEffect(() => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setIsUrlValid(false);
      return;
    }
    const hasProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://");
    setIsUrlValid(hasProtocol);
  }, [inputUrl]);

  // Suggested keywords
  const suggestedKeywords = [
    "aquarium shop in chennai",
    "aquarium shop in bangalore",
    "aquarium shop thiruvanmiyur",
    "planted tank koramangala",
    "planted tank besant nagar",
    "exotic marine fishes ecr",
    "custom aquarium tank omr",
    "exotic fish store indiranagar",
    "kolathur fish market alternative",
  ];

  // Sample websites
  const sampleWebsites = [
    { name: "THEME AQUARIUM (Chennai)", url: "https://themeaquarium.com", isFeatured: true },
    { name: "Locate Pin Engine", url: "https://locatepin.ai" },
    { name: "AquaScape Hub (Bangalore)", url: "https://aquascapehub.in" },
    { name: "HyperGrowth SaaS", url: "https://hypergrowth.ai" },
  ];

  const handleAddKeyword = (kwToAdd?: string) => {
    const kw = kwToAdd || currentKeyword.trim();
    if (!kw) return;
    if (!keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    if (!kwToAdd) setCurrentKeyword("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  // Inspect & load website link
  const handleInspectAndLoadWebsite = (urlToLoad?: string) => {
    let target = urlToLoad || inputUrl.trim();
    if (!target) return;

    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
      setInputUrl(target);
    }

    setIsLoadingWebsite(true);

    let parsedDomain = target;
    let protocol = "https:";
    try {
      const parsed = new URL(target);
      parsedDomain = parsed.hostname || target;
      protocol = parsed.protocol || "https:";
    } catch (e) {
      parsedDomain = target.replace(/^https?:\/\//, "").split("/")[0] || target;
    }

    // Inspect simulation
    setTimeout(() => {
      setSiteInspection({
        domain: parsedDomain,
        protocol: protocol.replace(":", ""),
        status: 200,
        latencyMs: Math.floor(Math.random() * 20) + 12,
        isSecure: protocol === "https:",
        detectedType: parsedDomain.includes("themeaquarium") || parsedDomain.includes("aquarium") ? "Aquarium & Aquatic Living Systems" :
                      parsedDomain.includes("shop") || parsedDomain.includes("store") ? "E-Commerce Store" : "Web Platform",
      });

      loadWebsiteUrl(target, trafficVolume, selectedChannel, keywords);
      setIsLoadingWebsite(false);
    }, 600);
  };

  const handleStartGeneration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let cleanUrl = inputUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
      setInputUrl(cleanUrl);
    }

    setIsGenerating(true);
    setGenerationLog(`Connecting to ${cleanUrl} and routing ${trafficVolume} high-intent visitors...`);

    // Influx traffic with chosen channel
    loadWebsiteUrl(cleanUrl, trafficVolume, selectedChannel, keywords);

    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#c5a059", "#d4b57a", "#ffffff", "#10b981"],
      });
    } catch (err) {}

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationLog(
        `Successfully generated +${trafficVolume} concurrent visitors for ${cleanUrl} via ${selectedChannel} targeting "${keywords[0] || 'organic query'}"`
      );
      if (onGenerated) onGenerated();
    }, 1200);
  };

  const setSampleUrl = (url: string) => {
    setInputUrl(url);
    if (url.includes("themeaquarium")) {
      setKeywords([
        "aquarium shop in chennai",
        "theme aquarium 3rd ave",
        "planted aquarium tank chennai",
        "exotic fish store anna nagar",
      ]);
      setSelectedChannel("Google Maps Local Pack");
      setSelectedCountry("Chennai, India");
    }
    handleInspectAndLoadWebsite(url);
  };

  const handleLaunchThemeAquariumBoost = () => {
    setInputUrl("https://themeaquarium.com");
    setSelectedWebsite("themeaquarium.com");
    setKeywords([
      "aquarium shop in chennai",
      "theme aquarium 3rd ave",
      "planted aquarium tank chennai",
      "exotic fish store anna nagar",
    ]);
    setSelectedChannel("Google Maps Local Pack");
    setSelectedCountry("Chennai, India");
    loadWebsiteUrl("https://themeaquarium.com", 5000, "Google Maps Local Pack (Chennai)", [
      "aquarium shop in chennai",
      "theme aquarium 3rd ave",
    ]);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#c5a059", "#4285f4", "#34a853", "#ea4335"],
      });
    } catch (e) {}

    if (onNavigateToMaps) {
      onNavigateToMaps();
    }
  };

  return (
    <div
      id="website-traffic-generator-card"
      className="bg-gradient-to-b from-[#15120d] via-[#0a0a0a] to-[#0a0a0a] border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30">
              <Zap className="w-4 h-4 text-[#c5a059]" />
            </span>
            <h3 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
              Website Traffic & Google Maps Local SEO Generator
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Enter any website URL to load live telemetry, or elevate local listings like <strong className="text-[#c5a059]">THEME AQUARIUM</strong> to #1 in Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLaunchThemeAquariumBoost}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-[#c5a059]/20 hover:from-amber-500/30 hover:to-[#c5a059]/30 border border-[#c5a059]/50 text-[#c5a059] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" />
            <span>Make THEME AQUARIUM #1 on Maps</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 1. Exact URL Input Module matching user's reference mockup */}
      <div className="relative z-10 space-y-2">
        {/* Exact Label as requested */}
        <div className="flex items-center justify-between">
          <label className="block text-xs sm:text-sm font-bold text-zinc-100 tracking-wide">
            Enter a valid URL : <span className="text-rose-400 font-bold">*</span>{" "}
            <span className="text-zinc-400 font-normal text-xs sm:text-sm">(with http:// or https://)</span>
          </label>
          
          {inputUrl && (
            <span className={`text-[11px] font-medium flex items-center gap-1 ${isUrlValid ? "text-emerald-400" : "text-amber-400"}`}>
              {isUrlValid ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Valid Protocol</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Missing http:// or https://</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Input Bar: White pill container with dark circular link icon, vertical divider, and 'Enter URL' */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-xl sm:rounded-2xl border border-zinc-200 shadow-sm p-1.5 sm:p-2 transition-all focus-within:ring-2 focus-within:ring-[#c5a059] focus-within:border-transparent">
            {/* Dark circular link icon badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 text-white shadow-sm ml-1">
              <LinkIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </div>

            {/* Vertical Separator */}
            <div className="h-6 w-px bg-zinc-200 mx-3 sm:mx-3.5"></div>

            {/* Input field with 'Enter URL' placeholder */}
            <input
              id="website-url-input"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleStartGeneration();
                }
              }}
              placeholder="Enter URL"
              className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 font-medium text-xs sm:text-sm md:text-base outline-none min-w-0"
            />

            {/* Prefix Helper Buttons if empty or missing protocol */}
            {!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://") && (
              <button
                type="button"
                onClick={() => setInputUrl("https://" + inputUrl.replace(/^\/+/, ""))}
                className="px-2.5 py-1 text-[11px] font-mono bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors mr-1 cursor-pointer"
              >
                +https://
              </button>
            )}

            {/* Inline Load Website button */}
            <button
              type="button"
              id="load-website-btn"
              onClick={() => handleInspectAndLoadWebsite()}
              disabled={isLoadingWebsite}
              className="px-3 sm:px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-[#c5a059] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {isLoadingWebsite ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Load Website</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Generate Traffic Action Button */}
          <button
            type="button"
            id="generate-website-traffic-btn"
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Routing Traffic...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>Generate Traffic</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Links & Protocol Helper */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
              Featured Sites:
            </span>
            {sampleWebsites.map((sample) => (
              <button
                key={sample.url}
                type="button"
                onClick={() => setSampleUrl(sample.url)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                  sample.isFeatured
                    ? "bg-gradient-to-r from-amber-500/20 to-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/50 font-bold"
                    : selectedWebsite === sample.name.toLowerCase() || inputUrl === sample.url
                    ? "bg-[#15120d] text-[#c5a059] border-[#c5a059]/40 font-semibold"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {sample.isFeatured && <MapPin className="w-3 h-3 text-[#c5a059]" />}
                <span>{sample.name}</span>
              </button>
            ))}
          </div>

          <span className="text-[11px] text-zinc-500 font-mono">
            Active Target: <strong className="text-zinc-300">{selectedWebsite}</strong>
          </span>
        </div>
      </div>

      {/* Website Inspection Card (Active Domain Telemetry) */}
      {siteInspection && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center font-bold font-mono text-sm flex-shrink-0">
              {siteInspection.domain.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm font-mono">
                  {siteInspection.domain}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {siteInspection.status} OK
                </span>
                {siteInspection.isSecure && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    HTTPS SSL Valid
                  </span>
                )}
                {siteInspection.domain.includes("themeaquarium") && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-[#c5a059] border border-amber-500/20 font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Google Maps #1 Ranked Shop (Chennai)
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Category: <span className="text-zinc-200">{siteInspection.detectedType}</span> &bull; Telemetry Latency:{" "}
                <span className="text-emerald-400 font-mono">{siteInspection.latencyMs}ms</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {onNavigateToMaps && siteInspection.domain.includes("themeaquarium") && (
              <button
                type="button"
                onClick={onNavigateToMaps}
                className="px-3 py-1.5 rounded-xl bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View Google Maps Rank #1</span>
              </button>
            )}
            <a
              href={inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Target Keyword Clusters Configuration */}
      <div className="space-y-3 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Target Keyword Clusters for Google Maps & Web Influx</span>
          </label>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            {keywords.length} active search vectors
          </span>
        </div>

        {/* Keyword Input & Add button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              id="keyword-input"
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              placeholder="Type target keyword query (e.g. 'aquarium shop in chennai', 'planted tank anna nagar') and press Enter..."
              className="w-full bg-[#050505] border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#c5a059] transition-colors"
            />
          </div>
          <button
            type="button"
            id="add-keyword-btn"
            onClick={() => handleAddKeyword()}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-[#c5a059]" />
            <span>Add Keyword</span>
          </button>
        </div>

        {/* Active Keyword Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-zinc-200 text-xs font-medium shadow-sm hover:border-[#c5a059]/50 transition-colors"
            >
              <span className="font-mono text-[11px] text-[#c5a059]">#</span>
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="p-0.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Keyword Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-zinc-500">
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c5a059]" /> High-CTR Queries:
          </span>
          {suggestedKeywords.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAddKeyword(sug)}
              className="text-[11px] bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>+ {sug}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Traffic Generation Controls & Parameter Filters */}
      <div className="space-y-4 pt-2 border-t border-zinc-800/80">
        {/* Quick Volume Multiplier Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>High-Velocity Traffic Volume Injection</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mr-1">Quick Presets:</span>
            {[500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() => {
                  setTrafficVolume(vol);
                  setCustomVolumeInput(vol.toString());
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                  trafficVolume === vol
                    ? "bg-[#c5a059] text-black font-bold border-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                    : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                +{vol >= 1000 ? `${vol / 1000}k` : vol}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Traffic Volume Selector & Custom Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                Volume Scale ({trafficVolume.toLocaleString()} visitors)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={trafficVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTrafficVolume(val);
                  setCustomVolumeInput(val.toString());
                }}
                className="flex-1 bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059]"
              >
                <option value={500} className="bg-[#0a0a0a]">+500 Local Map Searchers</option>
                <option value={1000} className="bg-[#0a0a0a]">+1,000 High-Intent Influx</option>
                <option value={2500} className="bg-[#0a0a0a]">+2,500 Local Pack Surge Wave</option>
                <option value={5000} className="bg-[#0a0a0a]">+5,000 Blitz Surge Stream (Recommended)</option>
                <option value={10000} className="bg-[#0a0a0a]">+10,000 Hyper-Scale Traffic Wave</option>
                <option value={25000} className="bg-[#0a0a0a]">+25,000 Viral Metro Influx</option>
                <option value={50000} className="bg-[#0a0a0a]">+50,000 Massive Breakout Surge</option>
                <option value={100000} className="bg-[#0a0a0a]">+100,000 Mega Influx Blitz</option>
              </select>
              <input
                type="number"
                min={100}
                max={500000}
                step={500}
                value={customVolumeInput}
                onChange={(e) => {
                  setCustomVolumeInput(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  if (!isNaN(num) && num > 0) {
                    setTrafficVolume(num);
                  }
                }}
                placeholder="Custom"
                className="w-24 bg-[#050505] border border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-mono text-[#c5a059] text-center focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Acquisition Vector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
              Traffic Channel Vector
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059]"
            >
              <option value="Google Maps Local Pack" className="bg-[#0a0a0a]">Google Maps Local 3-Pack</option>
              <option value="Organic Search" className="bg-[#0a0a0a]">Organic Search (Google SERP)</option>
              <option value="Direct Navigation" className="bg-[#0a0a0a]">Direct Store Link</option>
              <option value="Directions & Calls" className="bg-[#0a0a0a]">Google Maps Directions & Calls</option>
              <option value="Social & Viral" className="bg-[#0a0a0a]">Instagram / WhatsApp Referrals</option>
            </select>
          </div>

          {/* Primary Geo Target */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
              Target Geo Region
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059]"
            >
              <optgroup label="Chennai Focus Areas" className="bg-[#0a0a0a] text-[#c5a059] font-bold">
                <option value="Chennai, India" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai (Anna Nagar / 3rd Ave Hub)</option>
                <option value="Chennai - Thiruvanmiyur" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - Thiruvanmiyur (Coastal / South Hub)</option>
                <option value="Chennai - Besant Nagar" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - Besant Nagar (Basent Nagar / Beach)</option>
                <option value="Chennai - ECR" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - ECR (East Coast Road Coastal Belt)</option>
                <option value="Chennai - OMR" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - OMR (IT Expressway & Corridor)</option>
                <option value="Chennai - Adyar & Mylapore" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - Adyar & Mylapore</option>
                <option value="Chennai - T. Nagar & Kilpauk" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - T. Nagar & Kilpauk</option>
                <option value="Chennai - Velachery & Guindy" className="bg-[#0a0a0a] text-zinc-200 font-normal">Chennai - Velachery & Guindy</option>
              </optgroup>
              <optgroup label="Bangalore / Bengaluru Focus Areas" className="bg-[#0a0a0a] text-[#c5a059] font-bold">
                <option value="Bangalore - Central & MG Road" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore (Central / MG Road & Brigade Hub)</option>
                <option value="Bangalore - Indiranagar" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Indiranagar (100ft Rd / CMH Hub)</option>
                <option value="Bangalore - Koramangala" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Koramangala (Startup & Retail Belt)</option>
                <option value="Bangalore - Whitefield" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Whitefield (ITPL & Marathahalli)</option>
                <option value="Bangalore - HSR Layout" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - HSR Layout & BTM</option>
                <option value="Bangalore - Jayanagar" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Jayanagar & JP Nagar</option>
                <option value="Bangalore - Electronic City" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Electronic City Phase 1 & 2</option>
                <option value="Bangalore - Malleshwaram" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Malleshwaram & Rajajinagar</option>
                <option value="Bangalore - Hebbal & Yelahanka" className="bg-[#0a0a0a] text-zinc-200 font-normal">Bangalore - Hebbal & Yelahanka (North Hub)</option>
              </optgroup>
              <optgroup label="Broader Regions" className="bg-[#0a0a0a] text-zinc-400 font-bold">
                <option value="Karnataka State" className="bg-[#0a0a0a] text-zinc-200 font-normal">Karnataka (Statewide / Bengaluru Hub)</option>
                <option value="Tamil Nadu State" className="bg-[#0a0a0a] text-zinc-200 font-normal">Tamil Nadu (Statewide)</option>
                <option value="India Nationwide" className="bg-[#0a0a0a] text-zinc-200 font-normal">India Nationwide</option>
                <option value="United States" className="bg-[#0a0a0a] text-zinc-200 font-normal">United States (Tier 1)</option>
                <option value="Global Distributed" className="bg-[#0a0a0a] text-zinc-200 font-normal">Global Distributed</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Live feedback status */}
      {generationLog && (
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
            <span>{generationLog}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            200 OK
          </span>
        </div>
      )}
    </div>
  );
};
