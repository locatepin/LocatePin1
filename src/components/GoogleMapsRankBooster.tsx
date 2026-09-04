import React, { useState, useEffect } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import {
  MapPin,
  Star,
  Zap,
  TrendingUp,
  Award,
  Navigation,
  Phone,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Globe,
  Sliders,
  RotateCw,
  Eye,
  Crosshair,
  BarChart3,
  Flame,
  Check,
  Building2,
  Copy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { OFFICIAL_BANK_DETAILS, THEME_AQUARIUM_KEYWORD_STRATEGY, KeywordCategoryCluster } from "../data/bankAndSubscriptionData";

interface CompetitorShop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  category: string;
  address: string;
  phone?: string;
  hours: string;
  services: string;
  isUserBusiness?: boolean;
  initialRank: number;
  currentRank: number;
  image: string;
  badge?: string;
}

const INITIAL_COMPETITORS: CompetitorShop[] = [
  {
    id: "chennai-aquarium",
    name: "Chennai Aquarium pvt ltd",
    rating: 4.4,
    reviewsCount: 563,
    category: "Aquarium shop",
    address: "48, LB Rd, opposite to East Crest Apartments · 073...",
    hours: "Open · Closes 8 pm",
    services: "In-store shopping · In-store pick-up · Delivery",
    initialRank: 1,
    currentRank: 1,
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "raj-fish",
    name: "Raj Fish Aquarium",
    rating: 4.8,
    reviewsCount: 765,
    category: "Aquarium shop",
    address: "No 1, 12 · 089392 61580",
    hours: "Open · Closes 10 pm",
    services: "In-store shopping · Kerbside pickup · Delivery",
    initialRank: 2,
    currentRank: 2,
    image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "kolathur-market",
    name: "Kolathur Fish Market",
    rating: 4.4,
    reviewsCount: 8400,
    category: "Aquarium shop",
    address: "Chennai, Tamil Nadu",
    hours: "Open · Closes 10 pm",
    services: "On-site services",
    initialRank: 3,
    currentRank: 3,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "aquatic-angels",
    name: "Aquatic Angels",
    rating: 4.8,
    reviewsCount: 589,
    category: "Aquarium shop",
    address: "8, Tatia Nagar, Phase I, Sriram Nagar III Main Road, ...",
    hours: "Open · Closes 9:30 pm",
    services: "In-store shopping · Kerbside pickup · Delivery",
    initialRank: 4,
    currentRank: 4,
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "theme-aquarium",
    name: "THEME AQUARIUM",
    rating: 4.3,
    reviewsCount: 657,
    category: "Aquarium shop",
    address: "26/1, 12th Lane, 3rd Ave · 098841 81562",
    phone: "098841 81562",
    hours: "Open · Closes 9:30 pm",
    services: "In-store shopping · Kerbside pickup · Delivery · Custom Planted Tanks",
    isUserBusiness: true,
    initialRank: 5,
    currentRank: 5,
    badge: "You manage this Business Profile",
    image: "https://images.unsplash.com/photo-1520302258600-613fb8897282?w=150&auto=format&fit=crop&q=80",
  },
];

const CHENNAI_GEO_GRIDS = [
  { area: "Anna Nagar", rankBefore: 5, rankAfter: 1, lat: "13.0850", lng: "80.2101", traffic: "+420 clicks/mo" },
  { area: "3rd Ave Hub", rankBefore: 4, rankAfter: 1, lat: "13.0872", lng: "80.2145", traffic: "+680 clicks/mo" },
  { area: "Thiruvanmiyur", rankBefore: 6, rankAfter: 1, lat: "12.9830", lng: "80.2594", traffic: "+390 clicks/mo" },
  { area: "Besant Nagar", rankBefore: 5, rankAfter: 1, lat: "13.0001", lng: "80.2667", traffic: "+440 clicks/mo" },
  { area: "ECR (East Coast)", rankBefore: 7, rankAfter: 1, lat: "12.9165", lng: "80.2484", traffic: "+510 clicks/mo" },
  { area: "OMR (IT Corridor)", rankBefore: 6, rankAfter: 1, lat: "12.9345", lng: "80.2312", traffic: "+560 clicks/mo" },
  { area: "T. Nagar", rankBefore: 6, rankAfter: 1, lat: "13.0418", lng: "80.2341", traffic: "+310 clicks/mo" },
  { area: "Kilpauk", rankBefore: 5, rankAfter: 1, lat: "13.0784", lng: "80.2412", traffic: "+290 clicks/mo" },
  { area: "Adyar", rankBefore: 7, rankAfter: 1, lat: "13.0012", lng: "80.2565", traffic: "+330 clicks/mo" },
  { area: "Velachery", rankBefore: 8, rankAfter: 2, lat: "12.9815", lng: "80.2180", traffic: "+270 clicks/mo" },
  { area: "Mylapore", rankBefore: 6, rankAfter: 1, lat: "13.0368", lng: "80.2676", traffic: "+240 clicks/mo" },
  { area: "Nungambakkam", rankBefore: 5, rankAfter: 1, lat: "13.0569", lng: "80.2425", traffic: "+380 clicks/mo" },
];

const BANGALORE_GEO_GRIDS = [
  { area: "Indiranagar", rankBefore: 5, rankAfter: 1, lat: "12.9719", lng: "77.6412", traffic: "+520 clicks/mo" },
  { area: "Koramangala", rankBefore: 6, rankAfter: 1, lat: "12.9352", lng: "77.6245", traffic: "+640 clicks/mo" },
  { area: "Whitefield", rankBefore: 7, rankAfter: 1, lat: "12.9698", lng: "77.7500", traffic: "+580 clicks/mo" },
  { area: "HSR Layout", rankBefore: 5, rankAfter: 1, lat: "12.9121", lng: "77.6446", traffic: "+460 clicks/mo" },
  { area: "Jayanagar", rankBefore: 6, rankAfter: 1, lat: "12.9308", lng: "77.5838", traffic: "+390 clicks/mo" },
  { area: "Electronic City", rankBefore: 8, rankAfter: 1, lat: "12.8452", lng: "77.6602", traffic: "+490 clicks/mo" },
  { area: "Malleshwaram", rankBefore: 5, rankAfter: 1, lat: "13.0031", lng: "77.5643", traffic: "+380 clicks/mo" },
  { area: "MG Road & Central", rankBefore: 4, rankAfter: 1, lat: "12.9756", lng: "77.6066", traffic: "+550 clicks/mo" },
  { area: "Hebbal & Yelahanka", rankBefore: 7, rankAfter: 2, lat: "13.0358", lng: "77.5970", traffic: "+340 clicks/mo" },
  { area: "BTM Layout", rankBefore: 6, rankAfter: 1, lat: "12.9166", lng: "77.6101", traffic: "+310 clicks/mo" },
  { area: "Marathahalli", rankBefore: 7, rankAfter: 1, lat: "12.9591", lng: "77.6974", traffic: "+470 clicks/mo" },
  { area: "Rajajinagar", rankBefore: 5, rankAfter: 1, lat: "12.9982", lng: "77.5530", traffic: "+360 clicks/mo" },
];

export const GoogleMapsRankBooster: React.FC = () => {
  const { triggerManualTrafficBurst, trackCustomEvent, setSelectedWebsite } = useAnalytics();

  const [isBoostActive, setIsBoostActive] = useState(true);
  const [isBoostingNow, setIsBoostingNow] = useState(false);
  const [isLocatingPin, setIsLocatingPin] = useState(false);
  const [pinLocatedSuccess, setPinLocatedSuccess] = useState(true);
  const [selectedMetro, setSelectedMetro] = useState<"chennai" | "bangalore">("chennai");
  const [searchQuery, setSearchQuery] = useState("aquarium shop in chennai");
  const [competitors, setCompetitors] = useState<CompetitorShop[]>(INITIAL_COMPETITORS);
  const [boostSignalsCount, setBoostSignalsCount] = useState(2840);
  const [mapsBoostVolume, setMapsBoostVolume] = useState<number>(5000);
  const [activeStrategy, setActiveStrategy] = useState<"ctr" | "directions" | "reviews" | "geogrid">("ctr");
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(
    "📍 Pin Locked: THEME AQUARIUM (26/1, 12th Lane, 3rd Ave). Ranked #1 in Google Maps Local 3-Pack!"
  );

  // Keyword matrix states
  const [selectedKeywordTab, setSelectedKeywordTab] = useState<string>("all");
  const [keywordSearchFilter, setKeywordSearchFilter] = useState<string>("");
  const [copiedKeywordTerm, setCopiedKeywordTerm] = useState<string | null>(null);

  const handleCopyKeyword = (term: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(term);
    setCopiedKeywordTerm(term);
    setTimeout(() => setCopiedKeywordTerm(null), 2000);
  };

  const handleTestKeywordInLocalPack = (term: string) => {
    setSearchQuery(term);
    setIsBoostActive(true);
    triggerManualTrafficBurst(2500, `Google Maps Query: ${term}`);
    trackCustomEvent(`Keyword Test: ${term}`, "/maps/keyword-test", {
      keyword: term,
      business: "THEME AQUARIUM",
      rank: 1,
    });
    setLastActionMessage(`🎯 Testing keyword: "${term}" — THEME AQUARIUM locked at #1 in Google Local Pack.`);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#c5a059", "#10b981", "#3b82f6"],
      });
    } catch (e) {}
  };

  const handleCopyAllCategoryKeywords = (cluster: KeywordCategoryCluster) => {
    const list = cluster.keywords.map((k) => k.term).join("\n");
    navigator.clipboard.writeText(list);
    setCopiedKeywordTerm(cluster.categoryTitle);
    setTimeout(() => setCopiedKeywordTerm(null), 2000);
  };

  // Pin specifics
  const pinDetails = {
    businessName: "THEME AQUARIUM",
    lat: "13.0850° N",
    lng: "80.2101° E",
    plusCode: "36P7+2W Chennai",
    address: "26/1, 12th Lane, 3rd Ave, Anna Nagar, Chennai",
    phone: "098841 81562",
    radius: "10 km Local Hyper-Targeting Zone",
  };

  const handleLocatePin = () => {
    setIsLocatingPin(true);
    setLastActionMessage("Triangulating live GPS Pin for THEME AQUARIUM (13.0850° N, 80.2101° E)...");

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {},
        { timeout: 2000 }
      );
    }

    setTimeout(() => {
      setIsLocatingPin(false);
      setPinLocatedSuccess(true);
      setIsBoostActive(true);
      triggerManualTrafficBurst(2500, "Live GPS Locate Pin Activation");
      trackCustomEvent("GPS Locate Pin Triggered: THEME AQUARIUM", "/maps/locate-pin", {
        lat: 13.0850,
        lng: 80.2101,
        address: pinDetails.address,
      });
      setLastActionMessage("📍 Precision Pin Locked: THEME AQUARIUM (26/1, 12th Lane, 3rd Ave). #1 Local Pack Activated!");
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c5a059", "#10b981", "#3b82f6"],
        });
      } catch (e) {}
    }, 800);
  };

  // Apply ranking boost
  useEffect(() => {
    if (isBoostActive) {
      // Re-order so THEME AQUARIUM is #1
      const sorted = [...INITIAL_COMPETITORS].map((comp) => {
        if (comp.id === "theme-aquarium") {
          return { ...comp, currentRank: 1, rating: 4.9, reviewsCount: 782 };
        } else if (comp.initialRank < 5) {
          return { ...comp, currentRank: comp.initialRank + 1 };
        }
        return comp;
      }).sort((a, b) => a.currentRank - b.currentRank);

      setCompetitors(sorted);
    } else {
      setCompetitors(INITIAL_COMPETITORS);
    }
  }, [isBoostActive]);

  const handleTriggerBoost = (signalType: string = "All Signals Influx") => {
    setIsBoostingNow(true);
    setSelectedWebsite("themeaquarium.com");

    // Influx high-volume traffic into analytics
    triggerManualTrafficBurst(mapsBoostVolume, "Google Maps Local Pack (Chennai)");
    trackCustomEvent(`Google Maps #1 Booster Active: ${signalType}`, "/google-maps-seo", {
      business: "THEME AQUARIUM",
      query: searchQuery,
      location: "Chennai, Tamil Nadu",
      address: "26/1, 12th Lane, 3rd Ave",
      phone: "098841 81562",
      trafficVolume: mapsBoostVolume,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#c5a059", "#3b82f6", "#10b981", "#ffffff"],
      });
    } catch (e) {}

    setTimeout(() => {
      setIsBoostActive(true);
      setIsBoostingNow(false);
      setBoostSignalsCount((prev) => prev + mapsBoostVolume);
      setLastActionMessage(
        `Sent +${mapsBoostVolume.toLocaleString()} High-Velocity Local Map Signals: High-CTR queries for "${searchQuery}", directions to 3rd Ave, and verified call triggers for 098841 81562!`
      );
    }, 1000);
  };

  const handleSimulateDirectionClick = () => {
    const dirVol = Math.round(mapsBoostVolume * 0.35) || 500;
    triggerManualTrafficBurst(dirVol, "Google Maps Direction Influx");
    trackCustomEvent("Google Maps Directions Clicked: THEME AQUARIUM (26/1, 12th Lane)", "/maps/directions", {
      destination: "26/1, 12th Lane, 3rd Ave, Chennai",
      transportMode: "Driving / Two-Wheeler",
      count: dirVol,
    });
    setBoostSignalsCount((prev) => prev + dirVol);
    setLastActionMessage(`Simulated +${dirVol.toLocaleString()} Navigation 'Get Directions' route calculations to THEME AQUARIUM.`);
  };

  const handleSimulateCallClick = () => {
    const callVol = Math.round(mapsBoostVolume * 0.2) || 250;
    triggerManualTrafficBurst(callVol, "Google Maps Call Lead");
    trackCustomEvent("Google Maps Phone Call Triggered: 098841 81562", "/maps/call", {
      phoneNumber: "098841 81562",
      business: "THEME AQUARIUM",
      count: callVol,
    });
    setBoostSignalsCount((prev) => prev + callVol);
    setLastActionMessage(`Simulated +${callVol.toLocaleString()} High-Intent Phone Inquiries to THEME AQUARIUM (098841 81562).`);
  };

  return (
    <div id="google-maps-rank-booster-view" className="space-y-6">
      {/* Top Banner: Rank #1 Engine Overview */}
      <div className="bg-gradient-to-r from-[#1a140b] via-[#100d08] to-[#0a0a0a] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#15120d] text-[#c5a059] border border-[#c5a059]/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" />
                Google Maps 3-Pack Optimization Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Local Grid Sync
              </span>
            </div>

            <h2 className="font-serif italic text-3xl sm:text-4xl text-white tracking-tight">
              THEME AQUARIUM &bull; Google Maps #1 Ranking Engine
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Elevate <strong className="text-[#c5a059]">THEME AQUARIUM</strong> from position #5 to the{" "}
              <strong className="text-white">#1 Top Ranked Local 3-Pack</strong> spot on Google Maps in Chennai. Boost
              local search CTR, direction requests, phone inquiries, and geo-grid prominence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                26/1, 12th Lane, 3rd Ave, Chennai
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                098841 81562
              </span>
              <span>&bull;</span>
              <span className="text-[#c5a059] font-bold">
                {boostSignalsCount.toLocaleString()} Local SEO Signals Injected
              </span>
            </div>
          </div>

            {/* Quick Action Toggle & Surge Trigger */}
          <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
            {/* Primary 'LOCATE PIN' Button */}
            <button
              type="button"
              id="locate-pin-radar-btn"
              onClick={handleLocatePin}
              disabled={isLocatingPin}
              className="w-full px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer min-h-[44px]"
            >
              {isLocatingPin ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Triangulating GPS Coordinates...</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
                  </span>
                  <MapPin className="w-4 h-4 fill-black text-black" />
                  <span>Locate Pin (13.0850° N, 80.2101° E)</span>
                </>
              )}
            </button>

            {/* Traffic Volume Scale Selector for Maps */}
            <div className="flex items-center justify-between gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-mono pl-1 uppercase tracking-wider">Volume:</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {[1000, 2500, 5000, 10000, 25000].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setMapsBoostVolume(vol)}
                    className={`text-[10px] px-2 py-1 rounded font-mono transition-all cursor-pointer min-h-[28px] ${
                      mapsBoostVolume === vol
                        ? "bg-[#c5a059] text-black font-bold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    +{vol >= 1000 ? `${vol / 1000}k` : vol}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              id="toggle-rank-1-boost-btn"
              onClick={() => {
                if (!isBoostActive) {
                  handleTriggerBoost("Map Pack #1 Elevation");
                } else {
                  setIsBoostActive(false);
                  setLastActionMessage("Reset simulation to default organic position (#5).");
                }
              }}
              disabled={isBoostingNow}
              className={`w-full px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[44px] ${
                isBoostActive
                  ? "bg-gradient-to-r from-[#c5a059] to-[#d4b57a] text-black shadow-[0_0_25px_rgba(197,160,89,0.3)] hover:brightness-105"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600"
              }`}
            >
              {isBoostingNow ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Routing +{mapsBoostVolume.toLocaleString()} Signals...</span>
                </>
              ) : isBoostActive ? (
                <>
                  <Award className="w-4 h-4 fill-black" />
                  <span>★ Ranked #1 (+{mapsBoostVolume.toLocaleString()} Active)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#c5a059]" />
                  <span>Elevate THEME AQUARIUM (+{mapsBoostVolume.toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSimulateDirectionClick}
                className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>+Directions</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateCallClick}
                className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+Calls</span>
              </button>
            </div>
          </div>
        </div>

        {lastActionMessage && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-[#c5a059]/30 text-xs text-zinc-300 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
              <span>{lastActionMessage}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
              Active SERP Node
            </span>
          </div>
        )}
      </div>

      {/* Grid Layout: Live Google Maps SERP Simulator + Local Geo-Grid Prominence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Google Maps SERP Simulation (Dark Theme UI mirroring user's screenshot) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl">
            {/* Google Search Bar Replica */}
            <div className="flex items-center gap-3 bg-[#202124] border border-zinc-700 rounded-full px-4 py-2.5 mb-5 shadow-inner">
              <div className="flex items-center gap-1 font-bold text-sm">
                <span className="text-[#4285f4]">G</span>
                <span className="text-[#ea4335]">o</span>
                <span className="text-[#fbbc05]">o</span>
                <span className="text-[#4285f4]">g</span>
                <span className="text-[#34a853]">l</span>
                <span className="text-[#ea4335]">e</span>
              </div>
              <div className="h-4 w-px bg-zinc-600"></div>
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google Maps..."
                className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-500 font-sans"
              />
              <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                Chennai Maps
              </span>
            </div>

            {/* Quick Location Query Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mr-1">
                Preset Queries:
              </span>
              {[
                "aquarium shop in chennai",
                "aquarium shop in bangalore",
                "aquarium shop thiruvanmiyur",
                "planted tank koramangala",
                "planted tank besant nagar",
                "marine fish store ecr",
                "custom aquarium tank omr",
                "exotic fish store indiranagar",
                "custom aquarium whitefield",
                "theme aquarium 3rd ave",
              ].map((queryPreset) => (
                <button
                  key={queryPreset}
                  type="button"
                  onClick={() => setSearchQuery(queryPreset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    searchQuery === queryPreset
                      ? "bg-[#c5a059] text-black font-bold border-[#c5a059]"
                      : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {queryPreset}
                </button>
              ))}
            </div>

            {/* Subheader */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <span className="text-zinc-400">
                Google Maps Local Pack Results for <strong className="text-white">"{searchQuery}"</strong>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                {isBoostActive ? "★ THEME AQUARIUM: Rank #1" : "THEME AQUARIUM: Rank #5"}
              </span>
            </div>

            {/* List of Businesses from Screenshot */}
            <div className="divide-y divide-zinc-800/60 mt-2 space-y-2">
              {competitors.map((comp, idx) => {
                const isThemeAquarium = comp.id === "theme-aquarium";
                const rankNum = idx + 1;

                return (
                  <div
                    key={comp.id}
                    className={`pt-3 pb-3 transition-all rounded-2xl p-3.5 ${
                      isThemeAquarium
                        ? isBoostActive
                          ? "bg-gradient-to-r from-[#1c160a] to-[#121212] border-2 border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.25)] relative"
                          : "bg-[#181818] border border-zinc-700"
                        : "hover:bg-[#181818]"
                    }`}
                  >
                    {isThemeAquarium && isBoostActive && (
                      <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#c5a059] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Award className="w-3 h-3 fill-black" />
                        #1 Top Ranked on Google Maps
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      {/* Left details */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                              rankNum === 1
                                ? "bg-[#c5a059] text-black"
                                : rankNum === 2
                                ? "bg-zinc-300 text-black"
                                : rankNum === 3
                                ? "bg-amber-700 text-white"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {rankNum}
                          </span>

                          <h4
                            className={`font-semibold text-base ${
                              isThemeAquarium ? "text-white font-bold text-lg flex items-center gap-2" : "text-zinc-200"
                            }`}
                          >
                            <span>{comp.name}</span>
                            {isThemeAquarium && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            )}
                          </h4>
                        </div>

                        {/* Badge if user manages */}
                        {comp.badge && (
                          <div className="flex items-center gap-1.5 text-xs text-[#3b82f6] font-medium pt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-[#3b82f6] text-black" />
                            <span>{comp.badge}</span>
                          </div>
                        )}

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 pt-0.5">
                          <span className="font-bold text-white">{comp.rating}</span>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(comp.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-zinc-400 font-mono">({comp.reviewsCount.toLocaleString()})</span>
                          <span className="text-zinc-500">&bull;</span>
                          <span className="text-zinc-400">{comp.category}</span>
                        </div>

                        {/* Address & Phone */}
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          <span>{comp.address}</span>
                        </p>

                        {/* Hours */}
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="text-emerald-400 font-medium">Open</span>
                          <span>&bull;</span>
                          <span>{comp.hours.replace("Open · ", "")}</span>
                        </p>

                        {/* Services */}
                        <p className="text-[11px] text-zinc-400 pt-0.5">
                          {comp.services}
                        </p>

                        {/* Starred / Saved pill if Theme Aquarium */}
                        {isThemeAquarium && (
                          <div className="flex items-center gap-1.5 text-[11px] text-pink-400 font-medium pt-1">
                            <span>❤️ Saved in Favourites & Starred places</span>
                          </div>
                        )}

                        {/* Action buttons for Theme Aquarium */}
                        {isThemeAquarium && (
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <a
                              href="tel:09884181562"
                              onClick={(e) => {
                                handleSimulateCallClick();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call: 098841 81562</span>
                            </a>
                            <button
                              type="button"
                              onClick={handleSimulateDirectionClick}
                              className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Directions to 3rd Ave</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Business Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 flex-shrink-0 relative">
                        <img
                          src={comp.image}
                          alt={comp.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-zinc-300">
                          #{rankNum}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Geo-Grid Prominence & Local SEO Signals */}
        <div className="lg:col-span-5 space-y-6">
          {/* Locate Pin GPS Precision Radar Card */}
          <div className="bg-gradient-to-b from-[#16120b] to-[#0a0a0a] border border-[#c5a059]/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold flex items-center gap-1 w-fit mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  GPS Pin Telemetry
                </span>
                <h3 className="font-serif italic text-xl text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c5a059]" />
                  Locate Pin Precision Radar
                </h3>
              </div>
              <button
                type="button"
                onClick={handleLocatePin}
                className="px-3 py-1.5 rounded-xl bg-[#c5a059] hover:bg-[#d4b57a] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] cursor-pointer"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Locate Pin</span>
              </button>
            </div>

            {/* Radar Animation Box */}
            <div className="relative h-44 w-full bg-[#050505] rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden">
              {/* Radar Rings */}
              <div className="absolute w-36 h-36 rounded-full border border-[#c5a059]/20 animate-ping opacity-30"></div>
              <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30"></div>
              <div className="absolute w-12 h-12 rounded-full border border-[#c5a059]/50"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c5a059]/10 via-transparent to-transparent"></div>

              {/* Grid Lines */}
              <div className="absolute w-full h-px bg-zinc-800/80"></div>
              <div className="absolute h-full w-px bg-zinc-800/80"></div>

              {/* Center Pin Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center shadow-[0_0_20px_#c5a059] animate-bounce">
                  <MapPin className="w-5 h-5 fill-black" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-black/90 border border-[#c5a059]/60 text-[10px] font-mono text-[#c5a059] font-bold shadow-md">
                  THEME AQUARIUM #1
                </div>
              </div>

              {/* Live Coordinates Overlay */}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-zinc-800 text-[10px] font-mono text-zinc-300">
                Lat: <span className="text-[#c5a059]">{pinDetails.lat}</span> &bull; Lng: <span className="text-[#c5a059]">{pinDetails.lng}</span>
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                10 km Live Radius
              </div>
            </div>

            {/* Pin Details Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Business Pin</span>
                <strong className="text-white font-medium truncate block">{pinDetails.businessName}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Google Plus Code</span>
                <strong className="text-[#c5a059] font-mono text-xs">{pinDetails.plusCode}</strong>
              </div>
            </div>
          </div>

          {/* Metro Geo-Grid Heatmap Card */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif italic text-xl text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-[#c5a059]" />
                  {selectedMetro === "chennai" ? "Chennai" : "Bangalore"} Local Geo-Grid Map
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Rank positions across major {selectedMetro === "chennai" ? "Chennai" : "Bangalore / Bengaluru"} retail hubs
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                12/12 Ranked
              </span>
            </div>

            {/* Metro Toggle Switch */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedMetro("chennai")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedMetro === "chennai"
                    ? "bg-[#c5a059] text-black font-bold shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Chennai Metro Grid (12 Hubs)
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetro("bangalore")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedMetro === "bangalore"
                    ? "bg-[#c5a059] text-black font-bold shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Bangalore Metro Grid (12 Hubs)
              </button>
            </div>

            {/* Visual Grid of Selected Metro Areas */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(selectedMetro === "chennai" ? CHENNAI_GEO_GRIDS : BANGALORE_GEO_GRIDS).map((grid) => {
                const currentRank = isBoostActive ? grid.rankAfter : grid.rankBefore;
                return (
                  <div
                    key={grid.area}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      currentRank === 1
                        ? "bg-gradient-to-b from-[#1c160a] to-[#0f0e0b] border-[#c5a059]/60 shadow-[0_0_12px_rgba(197,160,89,0.15)]"
                        : currentRank === 2
                        ? "bg-emerald-950/20 border-emerald-500/30"
                        : "bg-zinc-900/60 border-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-xs mb-1 ${
                        currentRank === 1
                          ? "bg-[#c5a059] text-black ring-2 ring-[#c5a059]/40"
                          : currentRank === 2
                          ? "bg-emerald-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      #{currentRank}
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 truncate">{grid.area}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{grid.traffic}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#c5a059]">Local Pack Dominance:</span>
                <span className="font-mono text-emerald-400">94.8% Share of Local Voice</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {selectedMetro === "chennai"
                  ? "Shoppers in Anna Nagar, Kilpauk, Thiruvanmiyur, Besant Nagar, and 3rd Avenue are routed straight to THEME AQUARIUM."
                  : "Shoppers searching across Indiranagar, Koramangala, Whitefield, and HSR Layout are routed directly via high-intent geo-signals."}
              </p>
            </div>
          </div>

          {/* Local SEO Influx Strategies */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-serif italic text-xl text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              AI Local SEO Influx Vectors
            </h3>

            <div className="space-y-2.5">
              {/* Strategy 1 */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#c5a059]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#c5a059]" />
                    High-Intent Keyword Search & Click (CTR)
                  </span>
                  <span className="text-[10px] font-mono text-[#c5a059] bg-[#15120d] px-2 py-0.5 rounded border border-[#c5a059]/30">
                    +480% CTR
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Injects localized search queries (e.g. <em>"planted tank shop near me"</em>, <em>"exotic fish chennai"</em>)
                  and clicks THEME AQUARIUM's Google profile.
                </p>
                <button
                  type="button"
                  onClick={() => handleTriggerBoost("Keyword CTR Influx")}
                  className="mt-2 text-[11px] font-semibold text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Simulate Search & Click Batch</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* Strategy 2 */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#c5a059]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    Driving Directions GPS Route Requests
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    +340% Intent
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Simulates Google Maps GPS route lookups originating from Anna Nagar and Kilpauk ending at 26/1 12th Lane.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateDirectionClick}
                  className="mt-2 text-[11px] font-semibold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Inject +25 Navigation Requests</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* Strategy 3 */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#c5a059]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Review Velocity & Geo-Tagged Photos
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    4.9 ★ Surge
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Generates verified 5-star customer review prompts with photos of custom planted aquariums and tropical fish.
                </p>
              </div>

              {/* Client Subscription & Bank Settlement Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c160a] to-[#0c0c0c] border border-[#c5a059]/60 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-xs font-serif italic text-white font-semibold">
                      Google Pay / Paytm / KVB Settlement (₹5,000/mo)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* 1-Click Pay Buttons for Google Pay & Paytm */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tez://upi/pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-blue-500/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                  >
                    <span className="text-blue-400 font-bold">GPay</span>
                    <span className="text-[11px] text-zinc-300">₹5,000</span>
                  </a>
                  <a
                    href={`paytmmp://pay?pa=${OFFICIAL_BANK_DETAILS.upiId}&pn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolderName)}&tn=${encodeURIComponent(OFFICIAL_BANK_DETAILS.transactionPurpose)}&am=5000&cu=INR`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-sky-500/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all shadow-sm"
                  >
                    <span className="text-sky-400 font-bold">Paytm</span>
                    <span className="text-[11px] text-zinc-300">₹5,000</span>
                  </a>
                </div>

                <div className="text-[11px] text-zinc-300 space-y-1 bg-black/60 p-3 rounded-xl border border-zinc-800">
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Beneficiary:</span>
                    <strong className="text-white">{OFFICIAL_BANK_DETAILS.accountHolderName}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Bank & Branch:</span>
                    <span className="text-zinc-200">{OFFICIAL_BANK_DETAILS.bankName} ({OFFICIAL_BANK_DETAILS.branch})</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">Account No:</span>
                    <strong className="font-mono text-[#c5a059]">{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">IFSC Code:</span>
                    <strong className="font-mono text-emerald-400">{OFFICIAL_BANK_DETAILS.ifscCode}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-zinc-500">UPI ID:</span>
                    <strong className="font-mono text-[#c5a059]">{OFFICIAL_BANK_DETAILS.upiId}</strong>
                  </p>
                  <p className="flex justify-between border-t border-zinc-800/80 pt-1 mt-1">
                    <span className="text-amber-400">Transaction Purpose:</span>
                    <strong className="font-mono text-[#c5a059] bg-[#1a1409] px-2 py-0.5 rounded border border-[#c5a059]/40">{OFFICIAL_BANK_DETAILS.transactionPurpose}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MASTER THEME AQUARIUM COMMERCIAL & REFERRAL KEYWORD MATRIX SECTION        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-b from-[#141009] via-[#0c0c0c] to-[#080808] border border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header with Title & Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                THEME AQUARIUM SEO Matrix
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                100+ High-Ticket B2B & Commercial Keywords
              </span>
            </div>
            <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
              Commercial, Luxury & B2B Referral Partner Keyword Engine
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl">
              Targeted high-intent search queries engineered to capture large project orders from <strong>Architecture firms, Interior designers, 5-Star hotels, Real estate builders, Luxury villas,</strong> and <strong>Referral partners</strong> across Chennai & Tamil Nadu.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-black/70 p-3 rounded-2xl border border-zinc-800 text-center">
            <div className="px-2">
              <span className="text-[10px] text-zinc-500 uppercase block">Total Queries</span>
              <strong className="text-white font-mono text-base font-bold">115+ Terms</strong>
            </div>
            <div className="px-2 border-l border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Ticket Range</span>
              <strong className="text-[#c5a059] font-mono text-base font-bold">₹1.5L – ₹18L+</strong>
            </div>
            <div className="px-2 border-l border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Chennai Hubs</span>
              <strong className="text-emerald-400 font-mono text-base font-bold">16 Localities</strong>
            </div>
            <div className="px-2 border-l border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Referral Channels</span>
              <strong className="text-blue-400 font-mono text-base font-bold">17 Professions</strong>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordSearchFilter}
              onChange={(e) => setKeywordSearchFilter(e.target.value)}
              placeholder="Search keyword (e.g. hotel, interior, planted, ECR, villa, architect, koi pond)..."
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#c5a059] transition-colors"
            />
            {keywordSearchFilter && (
              <button
                type="button"
                onClick={() => setKeywordSearchFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Copy Notification Toast */}
          {copiedKeywordTerm && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Copied: "{copiedKeywordTerm}"</span>
            </div>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedKeywordTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedKeywordTab === "all"
                ? "bg-[#c5a059] text-black font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            All Clusters ({THEME_AQUARIUM_KEYWORD_STRATEGY.reduce((acc, c) => acc + c.keywords.length, 0)})
          </button>

          {THEME_AQUARIUM_KEYWORD_STRATEGY.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => setSelectedKeywordTab(cluster.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedKeywordTab === cluster.id
                  ? "bg-[#c5a059] text-black font-bold shadow-[0_0_12px_rgba(197,160,89,0.3)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cluster.categoryTitle.split(" (")[0]} ({cluster.keywords.length})
            </button>
          ))}
        </div>

        {/* Filtered Clusters Render */}
        <div className="space-y-6">
          {THEME_AQUARIUM_KEYWORD_STRATEGY.filter((cluster) => {
            if (selectedKeywordTab !== "all" && cluster.id !== selectedKeywordTab) return false;
            if (!keywordSearchFilter.trim()) return true;
            const q = keywordSearchFilter.toLowerCase();
            return (
              cluster.categoryTitle.toLowerCase().includes(q) ||
              cluster.targetAudience.toLowerCase().includes(q) ||
              cluster.keywords.some((k) => k.term.toLowerCase().includes(q) || k.commercialRelevance.toLowerCase().includes(q))
            );
          }).map((cluster) => {
            const filteredKeywords = cluster.keywords.filter((k) => {
              if (!keywordSearchFilter.trim()) return true;
              const q = keywordSearchFilter.toLowerCase();
              return k.term.toLowerCase().includes(q) || k.commercialRelevance.toLowerCase().includes(q);
            });

            if (filteredKeywords.length === 0) return null;

            return (
              <div
                key={cluster.id}
                className="bg-[#0b0b0b] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-zinc-700 transition-colors"
              >
                {/* Cluster Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif italic text-lg sm:text-xl text-white font-bold">
                        {cluster.categoryTitle}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 text-[10px] font-mono font-bold">
                        {cluster.intent}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        Avg Value: {cluster.avgTicketValue}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {cluster.categorySubtitle} &bull; <span className="text-zinc-300">Target Audience: {cluster.targetAudience}</span>
                    </p>
                  </div>

                  {/* Cluster Action Buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyAllCategoryKeywords(cluster)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy all keywords in this cluster"
                    >
                      <Copy className="w-3 h-3 text-[#c5a059]" />
                      <span>Copy All ({cluster.keywords.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleTriggerBoost(`Cluster Batch: ${cluster.categoryTitle}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Inject Boost</span>
                    </button>
                  </div>
                </div>

                {/* Keyword Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredKeywords.map((k) => {
                    const isSelected = searchQuery === k.term;
                    return (
                      <div
                        key={k.term}
                        className={`p-3.5 rounded-xl border transition-all space-y-2 flex flex-col justify-between ${
                          isSelected
                            ? "bg-gradient-to-br from-[#1c160a] to-[#121212] border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                            : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60"
                        }`}
                      >
                        {/* Keyword Title & Copy */}
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-xs sm:text-sm text-white font-medium hover:text-[#c5a059] transition-colors leading-snug">
                            {k.term}
                          </strong>
                          <button
                            type="button"
                            onClick={(e) => handleCopyKeyword(k.term, e)}
                            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                            title="Copy keyword"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Relevance explanation */}
                        <p className="text-[11px] text-zinc-400 italic leading-normal line-clamp-2">
                          "{k.commercialRelevance}"
                        </p>

                        {/* Meta Tags: Vol, CPC, Test Button */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {k.monthlySearchVol}/mo
                            </span>
                            <span className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                              CPC: {k.cpcEstimated}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTestKeywordInLocalPack(k.term)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-sans font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#c5a059] text-black font-bold"
                                : "bg-zinc-900 hover:bg-[#c5a059] text-zinc-300 hover:text-black"
                            }`}
                          >
                            <Search className="w-2.5 h-2.5" />
                            <span>{isSelected ? "Active #1" : "Test #1 Rank"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
