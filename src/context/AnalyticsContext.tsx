import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  VisitorSession,
  VisitorAction,
  PagePerformance,
  ChannelPerformance,
  CountryTraffic,
  FunnelStep,
  GrowthOpportunity,
  TrafficGenerationStrategy,
  AnomalyAlert,
} from "../types/analytics";
import {
  initialTopPages,
  initialChannels,
  initialGeoDistribution,
  initialFunnelSteps,
  initialOpportunities,
  initialAnomalies,
  generateSeedSessions,
  sampleCities,
  samplePaths,
  sampleChannels,
} from "../data/mockAnalytics";
import { sendTrackingEvent } from "../services/geminiService";

interface AnalyticsContextType {
  activeVisitors: number;
  totalVisitorsToday: number;
  pageviewsToday: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenueToday: number;
  trafficVelocity: number[];
  sessions: VisitorSession[];
  filteredSessions: VisitorSession[];
  recentEvents: VisitorAction[];
  topPages: PagePerformance[];
  channels: ChannelPerformance[];
  geoDistribution: CountryTraffic[];
  funnelSteps: FunnelStep[];
  growthOpportunities: GrowthOpportunity[];
  setGrowthOpportunities: React.Dispatch<React.SetStateAction<GrowthOpportunity[]>>;
  trafficStrategies: TrafficGenerationStrategy[];
  setTrafficStrategies: React.Dispatch<React.SetStateAction<TrafficGenerationStrategy[]>>;
  anomalies: AnomalyAlert[];
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  simulationIntensity: 'low' | 'moderate' | 'high' | 'viral_surge';
  setSimulationIntensity: (intensity: 'low' | 'moderate' | 'high' | 'viral_surge') => void;
  selectedSession: VisitorSession | null;
  setSelectedSession: (session: VisitorSession | null) => void;
  // Filters
  filterChannel: string;
  setFilterChannel: (c: string) => void;
  filterCountry: string;
  setFilterCountry: (c: string) => void;
  filterPath: string;
  setFilterPath: (p: string) => void;
  filterDevice: string;
  setFilterDevice: (d: string) => void;
  // Actions
  triggerManualTrafficBurst: (count: number, channel?: string) => void;
  trackCustomEvent: (eventName: string, path: string, metadata?: any) => void;
  resolveAnomaly: (id: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  selectedWebsite: string;
  setSelectedWebsite: (site: string) => void;
  loadWebsiteUrl: (url: string, volume?: number, channel?: string, keywords?: string[]) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVisitors, setActiveVisitors] = useState<number>(482);
  const [totalVisitorsToday, setTotalVisitorsToday] = useState<number>(18450);
  const [pageviewsToday, setPageviewsToday] = useState<number>(54120);
  const [bounceRate, setBounceRate] = useState<number>(31.4);
  const [avgSessionDuration, setAvgSessionDuration] = useState<number>(194); // seconds
  const [conversionRate, setConversionRate] = useState<number>(3.85);
  const [revenueToday, setRevenueToday] = useState<number>(41160);
  
  // 60-point velocity history (representing minute-by-minute concurrency)
  const [trafficVelocity, setTrafficVelocity] = useState<number[]>(() => {
    const arr: number[] = [];
    let current = 420;
    for (let i = 0; i < 60; i++) {
      current = Math.max(280, Math.min(650, current + (Math.random() * 40 - 20)));
      arr.push(Math.round(current));
    }
    return arr;
  });

  const [sessions, setSessions] = useState<VisitorSession[]>(() => generateSeedSessions(28));
  const [recentEvents, setRecentEvents] = useState<VisitorAction[]>([]);
  const [topPages, setTopPages] = useState<PagePerformance[]>(initialTopPages);
  const [channels, setChannels] = useState<ChannelPerformance[]>(initialChannels);
  const [geoDistribution, setGeoDistribution] = useState<CountryTraffic[]>(initialGeoDistribution);
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>(initialFunnelSteps);
  const [growthOpportunities, setGrowthOpportunities] = useState<GrowthOpportunity[]>(initialOpportunities);
  const [trafficStrategies, setTrafficStrategies] = useState<TrafficGenerationStrategy[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(initialAnomalies);

  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [simulationIntensity, setSimulationIntensity] = useState<'low' | 'moderate' | 'high' | 'viral_surge'>('moderate');
  const [selectedSession, setSelectedSession] = useState<VisitorSession | null>(null);

  // Filters
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterPath, setFilterPath] = useState<string>("all");
  const [filterDevice, setFilterDevice] = useState<string>("all");

  const [timeRange, setTimeRange] = useState<string>("Today (Live)");
  const [selectedWebsite, setSelectedWebsite] = useState<string>("app.trafficpulse.ai");

  // Track an event
  const trackCustomEvent = useCallback((eventName: string, pathName: string, metadata?: any) => {
    const action: VisitorAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: eventName.includes("click") ? "click" : eventName.includes("submit") || eventName.includes("signup") ? "signup" : "pageview",
      name: eventName,
      target: pathName,
      timestamp: new Date().toISOString(),
      path: pathName,
    };

    setRecentEvents((prev) => [action, ...prev.slice(0, 49)]);

    // Send to backend ingestion
    sendTrackingEvent({
      event: eventName,
      path: pathName,
      metadata,
      timestamp: action.timestamp,
    });

    // Update active pages & session metrics
    setPageviewsToday((p) => p + 1);
    if (eventName === "Completed Signup / Purchase" || eventName === "signup" || eventName === "purchase") {
      setRevenueToday((r) => r + 49);
      setConversionRate((c) => +(c + 0.02).toFixed(2));
    }
  }, []);

  // Manual burst generator
  const triggerManualTrafficBurst = useCallback((count: number, channelSource?: string) => {
    const newSessions = generateSeedSessions(Math.min(count, 35));
    if (channelSource) {
      newSessions.forEach((s) => {
        s.channel = channelSource as any;
      });
    }

    setSessions((prev) => [...newSessions, ...prev].slice(0, 45));
    setActiveVisitors((v) => v + count);
    setTotalVisitorsToday((t) => t + count);
    setPageviewsToday((p) => p + count * 2);

    // Append to velocity
    setTrafficVelocity((prev) => {
      const next = [...prev.slice(1), prev[prev.length - 1] + count];
      return next;
    });

    // Fire test event
    trackCustomEvent(`Traffic Burst Injected (+${count} sessions)`, "/features/ai-traffic-generator", { channel: channelSource || "AI Simulator" });
  }, [trackCustomEvent]);

  // Load website URL and customize tracking
  const loadWebsiteUrl = useCallback((url: string, volume: number = 50, channelSource: string = "Organic Search", customKeywords: string[] = []) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    let domain = cleanUrl;
    try {
      const parsed = new URL(cleanUrl);
      domain = parsed.hostname || cleanUrl;
    } catch (e) {
      domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0] || cleanUrl;
    }

    setSelectedWebsite(domain);

    // Adapt top pages for this loaded site
    const adaptedPages: PagePerformance[] = [
      { path: "/", title: `${domain} - Official Homepage`, visitors: Math.round(volume * 4.2), uniqueVisitors: Math.round(volume * 3.6), bounceRate: 28.5, avgTimeOnPage: "2m 45s", conversionRate: 4.8, exitRate: 21.0, trend: 18.2 },
      { path: "/pricing", title: "Plans, Pricing & Tier Comparison", visitors: Math.round(volume * 2.8), uniqueVisitors: Math.round(volume * 2.4), bounceRate: 34.0, avgTimeOnPage: "3m 12s", conversionRate: 7.2, exitRate: 29.5, trend: 24.5 },
      { path: "/features", title: "Product Features & Capabilities", visitors: Math.round(volume * 2.1), uniqueVisitors: Math.round(volume * 1.8), bounceRate: 30.2, avgTimeOnPage: "2m 10s", conversionRate: 3.9, exitRate: 25.1, trend: 12.0 },
      { path: "/checkout", title: "Checkout & Onboarding Stream", visitors: Math.round(volume * 1.4), uniqueVisitors: Math.round(volume * 1.2), bounceRate: 22.1, avgTimeOnPage: "1m 55s", conversionRate: 11.4, exitRate: 14.8, trend: 31.0 },
      { path: "/docs/quickstart", title: "Developer Docs & Integration Guide", visitors: Math.round(volume * 1.1), uniqueVisitors: Math.round(volume * 0.95), bounceRate: 19.8, avgTimeOnPage: "4m 20s", conversionRate: 6.5, exitRate: 18.2, trend: 15.4 },
    ];
    setTopPages(adaptedPages);

    // Trigger burst
    triggerManualTrafficBurst(volume, channelSource);

    // Track event
    trackCustomEvent(`Website Loaded & Traffic Streamed: ${cleanUrl}`, "/", {
      url: cleanUrl,
      domain,
      keywords: customKeywords,
      channel: channelSource,
      visitors: volume,
    });
  }, [trackCustomEvent, triggerManualTrafficBurst]);

  // Resolve anomaly
  const resolveAnomaly = useCallback((id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  }, []);

  // Real-time live simulation engine ticker
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalTime =
      simulationIntensity === "viral_surge" ? 800 :
      simulationIntensity === "high" ? 1400 :
      simulationIntensity === "moderate" ? 2400 : 3800;

    const interval = setInterval(() => {
      // 1. Update active visitors with natural random walk proportional to current volume
      const deltaPercent = (Math.random() * 0.02 - 0.009);
      setActiveVisitors((prev) => {
        const delta = Math.round(prev * deltaPercent) || (Math.random() > 0.5 ? 2 : -2);
        const next = Math.max(120, prev + delta);
        return next;
      });

      // 2. Advance velocity chart proportional to current volume
      setTrafficVelocity((prev) => {
        const last = prev[prev.length - 1] || 450;
        const nextVal = Math.max(200, Math.round(last + (last * (Math.random() * 0.025 - 0.012))));
        return [...prev.slice(1), nextVal];
      });

      // 3. Increment daily stats slightly
      setTotalVisitorsToday((t) => t + (Math.random() > 0.4 ? 1 : 0));
      setPageviewsToday((p) => p + Math.floor(Math.random() * 3) + 1);

      // 4. Update session pool (add a new visitor or update an existing session)
      setSessions((prev) => {
        const updated = [...prev];
        
        // Randomly simulate a new visitor joining
        if (Math.random() > 0.3) {
          const loc = sampleCities[Math.floor(Math.random() * sampleCities.length)];
          const path = samplePaths[Math.floor(Math.random() * samplePaths.length)];
          const channel = sampleChannels[Math.floor(Math.random() * sampleChannels.length)];
          const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ["Desktop", "Mobile", "Desktop", "Tablet"];
          
          const newSession: VisitorSession = {
            id: `ses_${Math.random().toString(36).substr(2, 9)}`,
            ip: `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            country: loc.country,
            countryCode: loc.code,
            city: loc.city,
            device: devices[Math.floor(Math.random() * devices.length)],
            browser: "Chrome",
            os: "macOS",
            currentPath: path,
            referrer: channel === "Organic Search" ? "google.com" : channel === "Social" ? "x.com" : channel === "Referral" ? "producthunt.com" : "direct",
            channel,
            durationSeconds: 1,
            pageviewsCount: 1,
            status: "active",
            startedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            scrollDepth: 15,
            actions: [
              {
                id: `act_${Date.now()}`,
                type: "pageview",
                name: `Navigated to ${path}`,
                timestamp: new Date().toISOString(),
                path,
              },
            ],
          };

          // Also record in recentEvents
          setRecentEvents((e) => [newSession.actions[0], ...e.slice(0, 49)]);

          return [newSession, ...updated.slice(0, 34)];
        }

        // Randomly update an active session (user clicks or converts)
        if (updated.length > 0) {
          const idx = Math.floor(Math.random() * updated.length);
          const target = { ...updated[idx] };
          target.durationSeconds += Math.floor(Math.random() * 8) + 2;
          target.lastActiveAt = new Date().toISOString();
          target.scrollDepth = Math.min(100, target.scrollDepth + Math.floor(Math.random() * 15));

          // Chance of route navigation
          if (Math.random() > 0.6) {
            const nextPath = samplePaths[Math.floor(Math.random() * samplePaths.length)];
            target.currentPath = nextPath;
            target.pageviewsCount += 1;
            const newAction: VisitorAction = {
              id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              type: nextPath === "/checkout" ? "click" : "pageview",
              name: nextPath === "/checkout" ? "Initiated Checkout" : `Navigated to ${nextPath}`,
              timestamp: new Date().toISOString(),
              path: nextPath,
            };
            target.actions = [newAction, ...target.actions];
            setRecentEvents((e) => [newAction, ...e.slice(0, 49)]);
          }

          // Chance of conversion
          if (target.currentPath === "/checkout" && target.status !== "converted" && Math.random() > 0.5) {
            target.status = "converted";
            target.conversionGoal = "Pro Subscription Activated ($49/mo)";
            target.revenue = 49;
            setRevenueToday((r) => r + 49);
            
            const convAction: VisitorAction = {
              id: `act_conv_${Date.now()}`,
              type: "purchase",
              name: "Subscription Purchased ($49)",
              timestamp: new Date().toISOString(),
              path: "/checkout",
            };
            target.actions = [convAction, ...target.actions];
            setRecentEvents((e) => [convAction, ...e.slice(0, 49)]);
          }

          updated[idx] = target;
        }

        return updated;
      });

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLiveStreaming, simulationIntensity]);

  // Apply filters
  const filteredSessions = sessions.filter((s) => {
    if (filterChannel !== "all" && s.channel !== filterChannel) return false;
    if (filterCountry !== "all" && s.country !== filterCountry) return false;
    if (filterPath !== "all" && s.currentPath !== filterPath) return false;
    if (filterDevice !== "all" && s.device !== filterDevice) return false;
    return true;
  });

  return (
    <AnalyticsContext.Provider
      value={{
        activeVisitors,
        totalVisitorsToday,
        pageviewsToday,
        bounceRate,
        avgSessionDuration,
        conversionRate,
        revenueToday,
        trafficVelocity,
        sessions,
        filteredSessions,
        recentEvents,
        topPages,
        channels,
        geoDistribution,
        funnelSteps,
        growthOpportunities,
        setGrowthOpportunities,
        trafficStrategies,
        setTrafficStrategies,
        anomalies,
        isLiveStreaming,
        setIsLiveStreaming,
        simulationIntensity,
        setSimulationIntensity,
        selectedSession,
        setSelectedSession,
        filterChannel,
        setFilterChannel,
        filterCountry,
        setFilterCountry,
        filterPath,
        setFilterPath,
        filterDevice,
        setFilterDevice,
        triggerManualTrafficBurst,
        trackCustomEvent,
        resolveAnomaly,
        timeRange,
        setTimeRange,
        selectedWebsite,
        setSelectedWebsite,
        loadWebsiteUrl,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
