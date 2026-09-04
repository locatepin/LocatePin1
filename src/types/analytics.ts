export interface VisitorSession {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge';
  os: 'macOS' | 'Windows' | 'iOS' | 'Android' | 'Linux';
  currentPath: string;
  referrer: string;
  channel: 'Organic Search' | 'Direct' | 'Social' | 'Referral' | 'Paid Ads' | 'Email';
  utmCampaign?: string;
  durationSeconds: number;
  pageviewsCount: number;
  status: 'active' | 'idle' | 'converted' | 'bounced';
  conversionGoal?: string;
  revenue?: number;
  startedAt: string;
  lastActiveAt: string;
  scrollDepth: number; // 0 - 100%
  actions: VisitorAction[];
}

export interface VisitorAction {
  id: string;
  type: 'pageview' | 'click' | 'scroll' | 'form_submit' | 'purchase' | 'signup' | 'download';
  name: string;
  target?: string;
  timestamp: string;
  path: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  timeframe: string;
  description: string;
  sparkline: number[];
}

export interface PagePerformance {
  path: string;
  title: string;
  visitors: number;
  uniqueVisitors: number;
  avgTimeOnPage: string;
  bounceRate: number;
  conversionRate: number;
  exitRate: number;
  trend: number;
}

export interface ChannelPerformance {
  channel: string;
  visitors: number;
  percentage: number;
  conversionRate: number;
  bounceRate: number;
  avgDuration: string;
  revenue: number;
  growth: number;
  color: string;
}

export interface CountryTraffic {
  country: string;
  code: string;
  visitors: number;
  percentage: number;
  conversions: number;
  lat: number;
  lng: number;
}

export interface FunnelStep {
  step: number;
  name: string;
  visitors: number;
  dropoffRate: number;
  conversionRate: number;
  avgDurationSeconds: number;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  category: 'SEO & Organic' | 'Conversion Funnel' | 'Channel Expansion' | 'Retention' | 'Viral & Referral' | 'Paid Performance';
  priority: 'High' | 'Critical' | 'Medium';
  projectedTrafficLift: string;
  projectedRevenueLift: string;
  confidenceScore: number; // 0-100
  summary: string;
  rootCause: string;
  recommendedActions: string[];
  difficulty: 'Easy' | 'Medium' | 'Complex';
  timeToImplement: string;
  impactMetrics: {
    label: string;
    current: string;
    target: string;
  }[];
}

export interface TrafficGenerationStrategy {
  id: string;
  campaignName: string;
  targetPersona: string;
  channel: string;
  strategyOverview: string;
  keywords: string[];
  contentIdeas: {
    headline: string;
    hook: string;
    cta: string;
    projectedCTR: string;
  }[];
  distributionPlan: string[];
  expectedTrafficIncrease: string;
  estimatedTimeframe: string;
  kpis: string[];
}

export interface AnomalyAlert {
  id: string;
  type: 'surge' | 'drop' | 'bounce_spike' | 'conversion_leak' | 'geo_shift';
  severity: 'high' | 'warning' | 'info';
  title: string;
  metric: string;
  detectedAt: string;
  description: string;
  aiDiagnosis?: string;
  suggestedAction?: string;
  resolved: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'client';
  phone?: string;
  businessName?: string;
  website?: string;
  city?: string;
  joinedAt: string;
  activePlan?: string;
  isVerified?: boolean;
  hasActiveSubscription?: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: 'active' | 'pending' | 'trial' | 'expired' | 'none';
  trialStartedAt?: number;
  trialExpiresAt?: number;
  welcomeEmailSent?: boolean;
  welcomeEmailSentAt?: number;
}

export interface BusinessListing {
  id: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  businessName: string;
  category: string;
  websiteUrl: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  googleMapsUrl?: string;
  targetKeywords: string[];
  subscriptionPlan: string;
  monthlyTrafficTarget: number;
  paymentStatus: 'Paid & Active' | 'Pending Verification' | 'Awaiting Payment' | 'Expired';
  utrNumber?: string;
  submittedAt: string;
  verifiedAt?: string;
}

export interface BankPaymentRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  businessName: string;
  planName: string;
  amountINR: number;
  amountForeign?: number;
  currencyPaid?: string;
  exchangeRateUsed?: number;
  utrNumber: string;
  transactionPurpose: string;
  paymentMethod: 'UPI' | 'NEFT / RTGS / IMPS' | 'NetBanking' | 'Google Pay (GPay)' | 'Paytm' | 'PhonePe' | 'KVB NetBanking / NEFT' | 'International SWIFT Wire' | 'Credit / Debit Card (Global)' | 'PayPal / International Remittance' | 'Admin VIP Grant (Super Admin Moorthy S L)' | string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
  timestamp: string;
  accountCredited: string;
  notes?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceINR: number;
  billingPeriod: 'monthly' | 'quarterly' | 'annual';
  trafficLimit: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

export interface RealTimeAnalyticsState {
  activeVisitors: number;
  totalVisitorsToday: number;
  pageviewsToday: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenueToday: number;
  trafficVelocity: number[]; // minute by minute
  visitorSessions: VisitorSession[];
  recentActions: VisitorAction[];
  topPages: PagePerformance[];
  channelDistribution: ChannelPerformance[];
  geoDistribution: CountryTraffic[];
  funnelSteps: FunnelStep[];
  anomalies: AnomalyAlert[];
  isLiveSimulating: boolean;
  simulationIntensity: 'low' | 'moderate' | 'high' | 'viral_surge';
}
