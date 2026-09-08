import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount } from "../types/analytics";
import { INITIAL_USER_ACCOUNTS } from "../data/bankAndSubscriptionData";

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  isLoading: boolean;
  isTrialActive: boolean;
  trialSecondsRemaining: number;
  welcomeEmailSent: boolean;
  loginWithGoogle: (email: string, name?: string, avatar?: string) => Promise<void>;
  loginWithCredentials: (email: string, password?: string) => Promise<void>;
  startFreeTrial: (businessName?: string, website?: string) => void;
  activateSubscription: (
    planName: string,
    businessName?: string,
    website?: string,
    utr?: string
  ) => void;
  resendWelcomeEmail: () => Promise<boolean>;
  updateUser: (updates: Partial<UserAccount>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "trafficpulse_authenticated_user_v2";
const ONE_HOUR_MS = 60 * 60 * 1000; // 3,600,000 ms (1 hour)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trialSecondsRemaining, setTrialSecondsRemaining] = useState<number>(0);

  // Initialize from localStorage or default to logged out
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: UserAccount = JSON.parse(stored);
        
        // Special VIP Grant Override: digi.hjb@gmail.com, digitalhkravibatterypoint@gmail.com & dbsc203@gmail.com are 100% Free for 1 Year
        const isHjbVip = parsed.email?.toLowerCase() === "digi.hjb@gmail.com";
        const isRaviVip = parsed.email?.toLowerCase() === "digitalhkravibatterypoint@gmail.com";
        const isDbscVip = parsed.email?.toLowerCase() === "dbsc203@gmail.com";

        if (isHjbVip || isRaviVip || isDbscVip) {
          parsed.hasActiveSubscription = true;
          parsed.subscriptionStatus = "active";
          parsed.activePlan = "Enterprise Multi-Location (1-Year Free VIP Pass)";
          if (isHjbVip) {
            parsed.businessName = parsed.businessName || "HJB Digital Enterprise Hub";
            parsed.website = parsed.website || "https://hjbdigital.com";
            parsed.city = parsed.city || "Chennai (Multi-Location Hub / OMR & Anna Nagar)";
          } else if (isRaviVip) {
            parsed.businessName = parsed.businessName || "HK Ravi Battery Point";
            parsed.website = parsed.website || "https://hkravibatterypoint.com";
            parsed.city = parsed.city || "Chennai (Tambaram / GST Road)";
          } else if (isDbscVip) {
            parsed.businessName = parsed.businessName || "DBSC Enterprise Hub";
            parsed.website = parsed.website || "https://dbsc203.com";
            parsed.city = parsed.city || "Chennai (Central Hub & Multi-Location)";
          }
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
        } else if (parsed.subscriptionStatus === "trial" && parsed.trialExpiresAt) {
          // Check if trial has expired upon load
          const now = Date.now();
          if (now >= parsed.trialExpiresAt) {
            parsed.subscriptionStatus = "expired";
            parsed.hasActiveSubscription = false;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
          }
        }
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trial countdown timer effect
  useEffect(() => {
    if (!user || user.subscriptionStatus !== "trial" || !user.trialExpiresAt) {
      setTrialSecondsRemaining(0);
      return;
    }

    const calculateRemaining = () => {
      const remainingMs = user.trialExpiresAt! - Date.now();
      if (remainingMs <= 0) {
        setTrialSecondsRemaining(0);
        const updated: UserAccount = {
          ...user,
          subscriptionStatus: "expired",
          hasActiveSubscription: false,
        };
        setUser(updated);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } else {
        setTrialSecondsRemaining(Math.ceil(remainingMs / 1000));
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const saveUserSession = (newUser: UserAccount | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const startFreeTrial = (businessName?: string, website?: string) => {
    if (!user) return;
    const now = Date.now();
    const expiresAt = now + ONE_HOUR_MS;
    const updated: UserAccount = {
      ...user,
      subscriptionStatus: "trial",
      hasActiveSubscription: true,
      activePlan: "1-Hour Full Access Free Trial",
      trialStartedAt: now,
      trialExpiresAt: expiresAt,
      businessName: businessName || user.businessName || "THEME AQUARIUM",
      website: website || user.website || "",
    };
    saveUserSession(updated);
  };

  const syncNewUserToAdminDirectory = (newUser: UserAccount) => {
    try {
      const saved = localStorage.getItem("locatepin_admin_members_v3");
      let list: UserAccount[] = saved ? JSON.parse(saved) : [...INITIAL_USER_ACCOUNTS];
      const exists = list.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (!exists) {
        list = [newUser, ...list];
        localStorage.setItem("locatepin_admin_members_v3", JSON.stringify(list));
      }
    } catch (e) {
      console.error("Failed to sync new user to admin directory", e);
    }
  };

  const getExistingUser = (cleanEmail: string): UserAccount | undefined => {
    // Check initial accounts first
    const fromInitial = INITIAL_USER_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (fromInitial) return fromInitial;

    // Check localStorage admin members
    try {
      const saved = localStorage.getItem("locatepin_admin_members_v3");
      if (saved) {
        const list: UserAccount[] = JSON.parse(saved);
        const fromStorage = list.find((u) => u.email.toLowerCase() === cleanEmail);
        if (fromStorage) return fromStorage;
      }
    } catch (e) {
      // ignore
    }
    return undefined;
  };

  const [welcomeEmailSent, setWelcomeEmailSent] = useState<boolean>(true);

  const loginWithGoogle = async (
    email: string,
    name?: string,
    avatar?: string
  ) => {
    setIsLoading(true);
    // Secure simulated network authentication verification
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const existing = getExistingUser(cleanEmail);

    let loggedInUser: UserAccount;
    const isHjbVip = cleanEmail === "digi.hjb@gmail.com";
    const isRaviVip = cleanEmail === "digitalhkravibatterypoint@gmail.com";
    const isDbscVip = cleanEmail === "dbsc203@gmail.com";
    const isVip = isHjbVip || isRaviVip || isDbscVip;

    if (existing) {
      loggedInUser = {
        ...existing,
        email: cleanEmail,
        welcomeEmailSent: true,
        welcomeEmailSentAt: Date.now(),
      };
      if (isVip) {
        loggedInUser.hasActiveSubscription = true;
        loggedInUser.subscriptionStatus = "active";
        loggedInUser.activePlan = "Enterprise Multi-Location (1-Year Free VIP Pass)";
      }
    } else {
      const isAdmin = cleanEmail.includes("moorthy") || cleanEmail.includes("admin");
      
      // Clean readable name derivation from email e.g. "alex.smith" -> "Alex Smith"
      const rawUserPart = cleanEmail.split("@")[0].replace(/[0-9]/g, "").replace(/[._-]/g, " ").trim();
      const fallbackName = rawUserPart ? rawUserPart.replace(/\b\w/g, (l) => l.toUpperCase()) : "Valued Member";
      const derivedName = name?.trim() || (isHjbVip ? "HJB Digital (Enterprise VIP)" : isRaviVip ? "Ravi (HK Ravi Battery Point)" : isDbscVip ? "DBSC Enterprise (1-Year VIP)" : fallbackName);
      
      loggedInUser = {
        id: `user-g-${Date.now()}`,
        name: derivedName,
        email: cleanEmail,
        avatar:
          avatar ||
          `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role: isAdmin ? "admin" : "client",
        businessName: isHjbVip
          ? "HJB Digital Enterprise Hub"
          : isRaviVip
          ? "HK Ravi Battery Point"
          : isDbscVip
          ? "DBSC Enterprise Hub"
          : isAdmin
          ? "Locate Pin AI Network"
          : `${derivedName}'s Business Hub`,
        website: isHjbVip ? "https://hjbdigital.com" : isRaviVip ? "https://hkravibatterypoint.com" : isDbscVip ? "https://dbsc203.com" : undefined,
        city: isHjbVip
          ? "Chennai (Multi-Location Hub / OMR & Anna Nagar)"
          : isRaviVip
          ? "Chennai (Tambaram / GST Road)"
          : isDbscVip
          ? "Chennai (Central Hub & Multi-Location)"
          : "Chennai (Anna Nagar)",
        joinedAt: new Date().toISOString().split("T")[0],
        activePlan: isVip
          ? "Enterprise Multi-Location (1-Year Free VIP Pass)"
          : isAdmin
          ? "Enterprise Master Admin"
          : "1-Hour Free Trial / ₹5,000 Retainer",
        isVerified: true,
        hasActiveSubscription: isAdmin || isVip, // Admins & VIPs auto-active
        subscriptionStatus: isAdmin || isVip ? "active" : "none",
        welcomeEmailSent: true,
        welcomeEmailSentAt: Date.now(),
      };

      // Add newly registered user to directory
      syncNewUserToAdminDirectory(loggedInUser);
    }

    setWelcomeEmailSent(true);
    saveUserSession(loggedInUser);
    setIsLoading(false);
  };

  const loginWithCredentials = async (email: string, _password?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const existing = getExistingUser(cleanEmail);

    let newUser: UserAccount;
    const isHjbVip = cleanEmail === "digi.hjb@gmail.com";
    const isRaviVip = cleanEmail === "digitalhkravibatterypoint@gmail.com";
    const isDbscVip = cleanEmail === "dbsc203@gmail.com";
    const isVip = isHjbVip || isRaviVip || isDbscVip;

    if (existing) {
      newUser = {
        ...existing,
        email: cleanEmail,
        welcomeEmailSent: true,
        welcomeEmailSentAt: Date.now(),
      };
      if (isVip) {
        newUser.hasActiveSubscription = true;
        newUser.subscriptionStatus = "active";
        newUser.activePlan = "Enterprise Multi-Location (1-Year Free VIP Pass)";
      }
    } else {
      const isAdmin = cleanEmail.includes("moorthy") || cleanEmail.includes("admin");
      const rawUserPart = cleanEmail.split("@")[0].replace(/[0-9]/g, "").replace(/[._-]/g, " ").trim();
      const fallbackName = rawUserPart ? rawUserPart.replace(/\b\w/g, (l) => l.toUpperCase()) : "Valued Member";
      const derivedName = isHjbVip ? "HJB Digital (Enterprise VIP)" : isRaviVip ? "Ravi (HK Ravi Battery Point)" : isDbscVip ? "DBSC Enterprise (1-Year VIP)" : fallbackName;
      
      newUser = {
        id: `user-cred-${Date.now()}`,
        name: derivedName,
        email: cleanEmail,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: isAdmin ? "admin" : "client",
        businessName: isHjbVip
          ? "HJB Digital Enterprise Hub"
          : isRaviVip
          ? "HK Ravi Battery Point"
          : isDbscVip
          ? "DBSC Enterprise Hub"
          : isAdmin
          ? "SEO Admin Operations"
          : `${derivedName}'s Business Hub`,
        website: isHjbVip ? "https://hjbdigital.com" : isRaviVip ? "https://hkravibatterypoint.com" : isDbscVip ? "https://dbsc203.com" : undefined,
        city: isHjbVip
          ? "Chennai (Multi-Location Hub / OMR & Anna Nagar)"
          : isRaviVip
          ? "Chennai (Tambaram / GST Road)"
          : isDbscVip
          ? "Chennai (Central Hub & Multi-Location)"
          : "Chennai (Anna Nagar)",
        joinedAt: new Date().toISOString().split("T")[0],
        isVerified: true,
        hasActiveSubscription: isAdmin || isVip,
        subscriptionStatus: isAdmin || isVip ? "active" : "none",
        activePlan: isVip
          ? "Enterprise Multi-Location (1-Year Free VIP Pass)"
          : isAdmin
          ? "Enterprise Master Admin"
          : "1-Hour Free Trial / ₹5,000 Retainer",
        welcomeEmailSent: true,
        welcomeEmailSentAt: Date.now(),
      };

      syncNewUserToAdminDirectory(newUser);
    }
    setWelcomeEmailSent(true);
    saveUserSession(newUser);
    setIsLoading(false);
  };

  const resendWelcomeEmail = async (): Promise<boolean> => {
    if (!user) return false;
    await new Promise((resolve) => setTimeout(resolve, 600));
    const updated: UserAccount = {
      ...user,
      welcomeEmailSent: true,
      welcomeEmailSentAt: Date.now(),
    };
    setWelcomeEmailSent(true);
    saveUserSession(updated);
    return true;
  };

  const activateSubscription = (
    planName: string,
    businessName?: string,
    website?: string,
    _utr?: string
  ) => {
    if (!user) return;
    const updated: UserAccount = {
      ...user,
      hasActiveSubscription: true,
      subscriptionStatus: "active",
      activePlan: planName,
      trialExpiresAt: undefined, // Clear trial expiry upon full paid subscription
      businessName: businessName || user.businessName || "My Verified Business",
      website: website || user.website || "",
    };
    saveUserSession(updated);
  };

  const updateUser = (updates: Partial<UserAccount>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUserSession(updated);
  };

  const logout = () => {
    saveUserSession(null);
  };

  const isTrialActive =
    user?.subscriptionStatus === "trial" &&
    !!user.trialExpiresAt &&
    user.trialExpiresAt > Date.now();

  const hasActiveSubscription =
    !!user &&
    (user.role === "admin" ||
      user.subscriptionStatus === "active" ||
      isTrialActive ||
      user.hasActiveSubscription === true);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasActiveSubscription,
        isLoading,
        isTrialActive,
        trialSecondsRemaining,
        welcomeEmailSent,
        loginWithGoogle,
        loginWithCredentials,
        startFreeTrial,
        activateSubscription,
        resendWelcomeEmail,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
