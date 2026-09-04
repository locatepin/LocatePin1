import {
  VisitorSession,
  PagePerformance,
  ChannelPerformance,
  CountryTraffic,
  FunnelStep,
  GrowthOpportunity,
  AnomalyAlert,
} from "../types/analytics";

export const initialTopPages: PagePerformance[] = [
  {
    path: "/",
    title: "Home - Next-Gen Traffic Intelligence",
    visitors: 8420,
    uniqueVisitors: 6930,
    avgTimeOnPage: "2m 45s",
    bounceRate: 31.2,
    conversionRate: 4.8,
    exitRate: 24.1,
    trend: 14.8,
  },
  {
    path: "/pricing",
    title: "Pricing & Plans - Scale with Confidence",
    visitors: 3940,
    uniqueVisitors: 3210,
    avgTimeOnPage: "3m 18s",
    bounceRate: 24.5,
    conversionRate: 11.2,
    exitRate: 18.3,
    trend: 22.4,
  },
  {
    path: "/features/ai-traffic-generator",
    title: "AI Traffic Generator - Algorithmic Audience Growth",
    visitors: 3150,
    uniqueVisitors: 2780,
    avgTimeOnPage: "4m 02s",
    bounceRate: 28.0,
    conversionRate: 8.6,
    exitRate: 19.5,
    trend: 38.2,
  },
  {
    path: "/docs/quickstart",
    title: "Developer Documentation & Real-time SDK",
    visitors: 2490,
    uniqueVisitors: 1860,
    avgTimeOnPage: "5m 30s",
    bounceRate: 19.4,
    conversionRate: 7.1,
    exitRate: 14.2,
    trend: 8.6,
  },
  {
    path: "/blog/seo-traffic-clustering",
    title: "How to Build Programmatic Topic Hubs in 2026",
    visitors: 2180,
    uniqueVisitors: 1920,
    avgTimeOnPage: "3m 52s",
    bounceRate: 44.1,
    conversionRate: 3.2,
    exitRate: 39.8,
    trend: 45.1,
  },
  {
    path: "/checkout",
    title: "Secure Checkout & Instant Activation",
    visitors: 1240,
    uniqueVisitors: 1180,
    avgTimeOnPage: "1m 45s",
    bounceRate: 18.0,
    conversionRate: 64.2,
    exitRate: 35.8,
    trend: 19.0,
  },
];

export const initialChannels: ChannelPerformance[] = [
  {
    channel: "Organic Search",
    visitors: 8920,
    percentage: 42.5,
    conversionRate: 4.4,
    bounceRate: 33.1,
    avgDuration: "3m 12s",
    revenue: 28400,
    growth: 18.4,
    color: "#3b82f6",
  },
  {
    channel: "Direct",
    visitors: 5120,
    percentage: 24.4,
    conversionRate: 5.8,
    bounceRate: 26.4,
    avgDuration: "3m 48s",
    revenue: 22100,
    growth: 12.1,
    color: "#10b981",
  },
  {
    channel: "Referral & Viral",
    visitors: 3350,
    percentage: 16.0,
    conversionRate: 6.2,
    bounceRate: 29.8,
    avgDuration: "3m 05s",
    revenue: 16800,
    growth: 34.5,
    color: "#8b5cf6",
  },
  {
    channel: "Social Media",
    visitors: 2140,
    percentage: 10.2,
    conversionRate: 2.9,
    bounceRate: 48.6,
    avgDuration: "1m 55s",
    revenue: 6900,
    growth: 27.8,
    color: "#f59e0b",
  },
  {
    channel: "Paid Campaigns",
    visitors: 1450,
    percentage: 6.9,
    conversionRate: 5.1,
    bounceRate: 36.2,
    avgDuration: "2m 30s",
    revenue: 9200,
    growth: -4.2,
    color: "#ef4444",
  },
];

export const initialGeoDistribution: CountryTraffic[] = [
  { country: "United States", code: "US", visitors: 7920, percentage: 38.2, conversions: 380, lat: 37.09, lng: -95.71 },
  { country: "United Kingdom", code: "GB", visitors: 2840, percentage: 13.7, conversions: 142, lat: 55.37, lng: -3.43 },
  { country: "Germany", code: "DE", visitors: 2210, percentage: 10.6, conversions: 118, lat: 51.16, lng: 10.45 },
  { country: "Canada", code: "CA", visitors: 1650, percentage: 7.9, conversions: 84, lat: 56.13, lng: -106.34 },
  { country: "Japan", code: "JP", visitors: 1420, percentage: 6.8, conversions: 79, lat: 36.20, lng: 138.25 },
  { country: "France", code: "FR", visitors: 1190, percentage: 5.7, conversions: 62, lat: 46.22, lng: 2.21 },
  { country: "Australia", code: "AU", visitors: 1050, percentage: 5.0, conversions: 58, lat: -25.27, lng: 133.77 },
  { country: "India", code: "IN", visitors: 980, percentage: 4.7, conversions: 41, lat: 20.59, lng: 78.96 },
  { country: "Netherlands", code: "NL", visitors: 820, percentage: 3.9, conversions: 49, lat: 52.13, lng: 5.29 },
  { country: "Singapore", code: "SG", visitors: 740, percentage: 3.5, conversions: 45, lat: 1.35, lng: 103.81 },
];

export const initialFunnelSteps: FunnelStep[] = [
  { step: 1, name: "Landing Page View", visitors: 21800, dropoffRate: 0, conversionRate: 100, avgDurationSeconds: 45 },
  { step: 2, name: "Feature / Demo Interaction", visitors: 12400, dropoffRate: 43.1, conversionRate: 56.9, avgDurationSeconds: 115 },
  { step: 3, name: "Pricing View", visitors: 5820, dropoffRate: 53.1, conversionRate: 26.7, avgDurationSeconds: 140 },
  { step: 4, name: "Initiate Checkout / Signup", visitors: 1980, dropoffRate: 66.0, conversionRate: 9.1, avgDurationSeconds: 90 },
  { step: 5, name: "Completed Conversion", visitors: 840, dropoffRate: 57.6, conversionRate: 3.85, avgDurationSeconds: 30 },
];

export const initialOpportunities: GrowthOpportunity[] = [
  {
    id: "opp-seo-clusters",
    title: "Scale Long-Tail Keyword Clusters for High-Intent Queries",
    category: "SEO & Organic",
    priority: "Critical",
    projectedTrafficLift: "+44% Organic Traffic",
    projectedRevenueLift: "+$18,500/mo",
    confidenceScore: 94,
    summary: "Machine learning keyword mapping indicates 32 high-intent search terms with low SERP competition currently driving uncaptured search volume.",
    rootCause: "Content gaps on dedicated feature comparison and technical workflow landing pages.",
    recommendedActions: [
      "Publish 8 programmatic comparison guides against legacy analytics providers",
      "Implement automated schema markup for software product and FAQ rich snippets",
      "Optimize Core Web Vitals to achieve Sub-100ms INP across key landing pages",
    ],
    difficulty: "Medium",
    timeToImplement: "5-7 days",
    impactMetrics: [
      { label: "Organic Monthly Search Visits", current: "8,920", target: "12,850" },
      { label: "Keyword Rankings (Top 3)", current: "14", target: "42" },
    ],
  },
  {
    id: "opp-funnel-friction",
    title: "Eliminate Step-3 Checkout Friction & Enable One-Click Auth",
    category: "Conversion Funnel",
    priority: "Critical",
    projectedTrafficLift: "+0% Traffic (Pure Conversion Lift)",
    projectedRevenueLift: "+$24,000/mo",
    confidenceScore: 96,
    summary: "Funnel dropoff analysis reveals a 28.4% user abandonment spike between pricing selection and final account creation.",
    rootCause: "Excessive form fields (7 required inputs) and lack of Google One-Tap authentication on checkout.",
    recommendedActions: [
      "Reduce mandatory form fields from 7 to 2 (Email + Password only)",
      "Embed Google & GitHub 1-click social sign-in above the fold",
      "Add social proof badge and money-back guarantee seal directly beneath CTA",
    ],
    difficulty: "Easy",
    timeToImplement: "2-3 days",
    impactMetrics: [
      { label: "Funnel Completion Rate", current: "3.85%", target: "5.60%" },
      { label: "Cart Abandonment Rate", current: "62.4%", target: "41.0%" },
    ],
  },
  {
    id: "opp-viral-loop",
    title: "Activate In-App Viral Referral Loop & Live Badges",
    category: "Viral & Referral",
    priority: "High",
    projectedTrafficLift: "+28% Compounding Referral Flow",
    projectedRevenueLift: "+$9,800/mo",
    confidenceScore: 89,
    summary: "User sessions originating from product share links display 3.2x higher conversion elasticity than cold paid traffic.",
    rootCause: "No structured referral mechanism or automated 'Powered by TrafficPulse' interactive badge program.",
    recommendedActions: [
      "Incentivize existing power users with tier-upgrade credits for referring active accounts",
      "Deploy lightweight embeddable analytics badge widget for user public dashboard pages",
      "Automate milestone celebration share cards for X/LinkedIn directly upon traffic breakthroughs",
    ],
    difficulty: "Medium",
    timeToImplement: "1 week",
    impactMetrics: [
      { label: "Referral Channel Volume", current: "3,350/mo", target: "5,800/mo" },
      { label: "Viral K-Factor", current: "0.18", target: "0.52" },
    ],
  },
  {
    id: "opp-mobile-retention",
    title: "Eliminate Mobile Viewport Bounce Anomaly on Landing Page",
    category: "Retention",
    priority: "High",
    projectedTrafficLift: "+19% Retained Mobile Visitors",
    projectedRevenueLift: "+$7,400/mo",
    confidenceScore: 91,
    summary: "Mobile visitors experience a 49.2% bounce rate vs 28.1% on desktop, driven by hero layout shift and delayed interactive load.",
    rootCause: "Heavy hero video asset blocking first interactive paint on 4G cellular connections.",
    recommendedActions: [
      "Replace autoplayaing video with optimized WebP animated graphic on mobile breakpoints",
      "Streamline sticky navigation bar with condensed quick-action trigger",
      "Implement responsive touch targets meeting 48px accessibility minimums",
    ],
    difficulty: "Easy",
    timeToImplement: "1-2 days",
    impactMetrics: [
      { label: "Mobile Bounce Rate", current: "49.2%", target: "32.0%" },
      { label: "Mobile Session Duration", current: "1m 12s", target: "2m 45s" },
    ],
  },
];

export const initialAnomalies: AnomalyAlert[] = [
  {
    id: "anom-1",
    type: "surge",
    severity: "warning",
    title: "Viral Referral Spike from Hacker News / TechCrunch",
    metric: "+184% Referral Velocity in last 15m",
    detectedAt: "3 minutes ago",
    description: "Sudden influx of 380 concurrent visitors to /features/ai-traffic-generator originating from news.ycombinator.com.",
    aiDiagnosis: "Organic tech community trending thread. Highly qualified developer audience exhibiting 4.2x above-average time on page.",
    suggestedAction: "Pin developer quickstart CTA banner and spin up edge cache pre-warming.",
    resolved: false,
  },
  {
    id: "anom-2",
    type: "bounce_spike",
    severity: "info",
    title: "Safari iOS Latency Fluctuation Detected",
    metric: "Bounce rate on iOS increased to 41.2%",
    detectedAt: "28 minutes ago",
    description: "Subtle uptick in abandonment during initial font-family hydration on mobile WebKit.",
    aiDiagnosis: "Font display swap setting causing mild layout re-render on low-bandwidth cellular devices.",
    suggestedAction: "Add font-display: optional and inline critical CSS tokens.",
    resolved: true,
  },
];

export const sampleCities = [
  { city: "Chennai (Anna Nagar)", country: "India", code: "IN" },
  { city: "Chennai (Thiruvanmiyur)", country: "India", code: "IN" },
  { city: "Chennai (Besant Nagar)", country: "India", code: "IN" },
  { city: "Chennai (ECR Coastal)", country: "India", code: "IN" },
  { city: "Chennai (OMR Corridor)", country: "India", code: "IN" },
  { city: "Chennai (Adyar)", country: "India", code: "IN" },
  { city: "Bangalore (Indiranagar)", country: "India", code: "IN" },
  { city: "Bangalore (Koramangala)", country: "India", code: "IN" },
  { city: "Bangalore (Whitefield)", country: "India", code: "IN" },
  { city: "Bangalore (HSR Layout)", country: "India", code: "IN" },
  { city: "Bangalore (Jayanagar)", country: "India", code: "IN" },
  { city: "Bangalore (Electronic City)", country: "India", code: "IN" },
  { city: "Bangalore (MG Road)", country: "India", code: "IN" },
  { city: "San Francisco", country: "United States", code: "US" },
  { city: "New York", country: "United States", code: "US" },
  { city: "London", country: "United Kingdom", code: "GB" },
  { city: "Berlin", country: "Germany", code: "DE" },
  { city: "Toronto", country: "Canada", code: "CA" },
  { city: "Tokyo", country: "Japan", code: "JP" },
  { city: "Paris", country: "France", code: "FR" },
  { city: "Sydney", country: "Australia", code: "AU" },
  { city: "Bengaluru", country: "India", code: "IN" },
  { city: "Amsterdam", country: "Netherlands", code: "NL" },
  { city: "Singapore", country: "Singapore", code: "SG" },
  { city: "Stockholm", country: "Sweden", code: "SE" },
  { city: "Austin", country: "United States", code: "US" },
  { city: "Dublin", country: "Ireland", code: "IE" },
];

export const samplePaths = [
  "/",
  "/pricing",
  "/features/ai-traffic-generator",
  "/docs/quickstart",
  "/blog/seo-traffic-clustering",
  "/checkout",
  "/demo/live-sandbox",
  "/enterprise",
];

export const sampleChannels: ('Organic Search' | 'Direct' | 'Social' | 'Referral' | 'Paid Ads' | 'Email')[] = [
  "Organic Search",
  "Direct",
  "Social",
  "Referral",
  "Organic Search",
  "Direct",
  "Paid Ads",
  "Organic Search",
];

export function generateSeedSessions(count: number = 24): VisitorSession[] {
  const sessions: VisitorSession[] = [];
  const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ["Desktop", "Desktop", "Mobile", "Mobile", "Tablet"];
  const browsers: ('Chrome' | 'Safari' | 'Firefox' | 'Edge')[] = ["Chrome", "Chrome", "Safari", "Firefox", "Edge"];
  const osList: ('macOS' | 'Windows' | 'iOS' | 'Android' | 'Linux')[] = ["macOS", "Windows", "iOS", "Android", "Linux"];
  const statuses: ('active' | 'active' | 'idle' | 'converted')[] = ["active", "active", "idle", "converted"];

  for (let i = 0; i < count; i++) {
    const loc = sampleCities[Math.floor(Math.random() * sampleCities.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const path = samplePaths[Math.floor(Math.random() * samplePaths.length)];
    const channel = sampleChannels[Math.floor(Math.random() * sampleChannels.length)];
    const duration = Math.floor(Math.random() * 380) + 15;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const pagesCount = Math.floor(Math.random() * 6) + 1;

    sessions.push({
      id: `ses_${Math.random().toString(36).substr(2, 9)}`,
      ip: `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: loc.country,
      countryCode: loc.code,
      city: loc.city,
      device,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      currentPath: path,
      referrer: channel === "Organic Search" ? "google.com" : channel === "Social" ? "twitter.com" : channel === "Referral" ? "producthunt.com" : "direct",
      channel,
      durationSeconds: duration,
      pageviewsCount: pagesCount,
      status,
      conversionGoal: status === "converted" ? "Pro Plan Trial Signup" : undefined,
      revenue: status === "converted" ? 49 : undefined,
      startedAt: new Date(Date.now() - duration * 1000).toISOString(),
      lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 1000).toISOString(),
      scrollDepth: Math.floor(Math.random() * 65) + 35,
      actions: [
        {
          id: `act_${Math.random().toString(36).substr(2, 6)}`,
          type: "pageview",
          name: `Viewed ${path}`,
          timestamp: new Date(Date.now() - duration * 1000).toISOString(),
          path,
        },
      ],
    });
  }

  return sessions;
}
