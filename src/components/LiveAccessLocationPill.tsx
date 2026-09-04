import React, { useState } from "react";
import {
  MapPin,
  Compass,
  Radio,
  RefreshCw,
  Navigation,
  CheckCircle2,
  X,
  Crosshair,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useAccessLocation } from "../context/AccessLocationContext";

interface LiveAccessLocationPillProps {
  className?: string;
  variant?: "header" | "login" | "compact";
}

const POPULAR_HUBS = [
  { city: "Chennai", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Bangalore", region: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "Coimbatore", region: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { city: "Madurai", region: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { city: "Hyderabad", region: "Telangana", lat: 17.3850, lng: 78.4867 },
  { city: "Mumbai", region: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi NCR", region: "Delhi", lat: 28.6139, lng: 77.2090 },
  { city: "Kochi", region: "Kerala", lat: 9.9312, lng: 76.2673 },
];

export const LiveAccessLocationPill: React.FC<LiveAccessLocationPillProps> = ({
  className = "",
  variant = "login",
}) => {
  const {
    location,
    isLocatingGps,
    requestGpsLocation,
    setCustomLocation,
    resetToDetected,
  } = useAccessLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [justUpdated, setJustUpdated] = useState(false);

  const handleSelectCity = (c: { city: string; region: string; lat: number; lng: number }) => {
    setCustomLocation(c.city, c.region, c.lat, c.lng);
    setJustUpdated(true);
    setTimeout(() => {
      setJustUpdated(false);
      setIsModalOpen(false);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setCustomLocation(customInput.trim(), "Custom Region");
    setCustomInput("");
    setJustUpdated(true);
    setTimeout(() => {
      setJustUpdated(false);
      setIsModalOpen(false);
    }, 400);
  };

  const handleGpsClick = async () => {
    await requestGpsLocation();
    setJustUpdated(true);
    setTimeout(() => {
      setJustUpdated(false);
    }, 800);
  };

  return (
    <>
      {/* 1. Main Pill Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`group flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17130b] hover:bg-[#221c0e] border border-[#c5a059]/30 hover:border-[#c5a059]/60 text-[#c5a059] transition-all cursor-pointer shadow-sm ${className}`}
        title="Click to view 10 km live perimeter & location details"
      >
        {/* Animated Radar Pulse Marker */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <MapPin className="w-3.5 h-3.5 text-[#c5a059] group-hover:scale-110 transition-transform flex-shrink-0" />

        <span className="font-mono text-xs whitespace-nowrap font-medium tracking-tight text-[#e6ca85]">
          {location.city} Live &bull; 10 km Radius
        </span>

        <ChevronDown className="w-2.5 h-2.5 text-[#c5a059]/60 group-hover:text-[#c5a059] transition-colors" />
      </button>

      {/* 2. Interactive 10 km Live Radius Modal / Telemetry Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-gradient-to-r from-[#17130b] via-[#0d0d0d] to-[#0d0d0d]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                  <Crosshair className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-serif italic text-base text-white font-bold flex items-center gap-2">
                    Live Access Location &bull; 10 km Perimeter
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Google Maps Local 3-Pack & GPS Route Broadcast
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Active 10 km Status Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1c160a] to-[#0a0a0a] border border-[#c5a059]/40 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                        Live 10 km Radius Active
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white font-serif italic mt-1 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#c5a059] flex-shrink-0" />
                      <span>{location.city}</span>
                      {location.suburb && (
                        <span className="text-xs font-sans not-italic text-zinc-400">
                          ({location.suburb})
                        </span>
                      )}
                    </h4>

                    <p className="text-xs text-zinc-300 mt-1">
                      {location.region ? `${location.region}, ` : ""}
                      {location.country}
                    </p>
                  </div>

                  {/* 10 km Badge */}
                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex flex-col items-end px-3 py-1.5 rounded-lg bg-[#271f0f] border border-[#c5a059]/50 text-[#c5a059]">
                      <span className="font-mono text-sm font-bold leading-tight">10 KM</span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                        Geo-Fence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radar Rings Schematic */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Signal: 100% Full Catchment</span>
                  </div>
                  <div className="text-[#c5a059]">
                    GPS: {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                  </div>
                </div>
              </div>

              {/* 10 km Coverage Zones Description */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">0 - 2.5 KM</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Core Hub</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Instant #1 Rank</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">2.5 - 5 KM</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Commercial Belt</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Local 3-Pack</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181309] border border-[#c5a059]/40">
                  <span className="text-[10px] text-[#c5a059] uppercase font-mono block font-bold">5 - 10 KM</span>
                  <span className="text-xs font-bold text-[#e6ca85] block mt-0.5">Extended Radar</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Route Navigation</span>
                </div>
              </div>

              {/* Detect Exact GPS Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGpsClick}
                  disabled={isLocatingGps}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d4b57a] text-black font-semibold text-xs hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLocatingGps ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Triangulating Live Device GPS Pin...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Detect My Exact Device GPS Location (10 km Live)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Hub Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <label className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
                  <span>Switch 10 km Live Target Metro:</span>
                  <button
                    onClick={resetToDetected}
                    className="text-[10px] text-[#c5a059] hover:underline cursor-pointer"
                  >
                    Reset to auto-detect
                  </button>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {POPULAR_HUBS.map((hub) => {
                    const isSelected = location.city.toLowerCase() === hub.city.toLowerCase();
                    return (
                      <button
                        key={hub.city}
                        type="button"
                        onClick={() => handleSelectCity(hub)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? "bg-[#20180a] border-[#c5a059] text-[#c5a059] font-bold"
                            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <span className="truncate">{hub.city}</span>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-[#c5a059] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom City or Neighborhood Input */}
              <form onSubmit={handleCustomSubmit} className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter city or area name (e.g. Coimbatore, Anna Nagar)..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#c5a059]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition-colors cursor-pointer"
                  >
                    Lock 10 km
                  </button>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#080808] border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#c5a059]" />
                <span>Real-time visitor IP & GPS telemetry sync</span>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
