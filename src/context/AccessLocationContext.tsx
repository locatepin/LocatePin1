import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface AccessLocation {
  city: string;
  region: string;
  country: string;
  suburb?: string;
  lat: number;
  lng: number;
  radiusKm: number;
  isLive: boolean;
  source: "gps" | "ip" | "browser_tz" | "manual";
  accuracyMeters?: number;
  updatedAt: number;
}

interface AccessLocationContextType {
  location: AccessLocation;
  isLoading: boolean;
  isLocatingGps: boolean;
  error: string | null;
  displayPillText: string;
  requestGpsLocation: () => Promise<void>;
  setCustomLocation: (city: string, region?: string, lat?: number, lng?: number) => void;
  resetToDetected: () => void;
}

const DEFAULT_LOCATION: AccessLocation = {
  city: "Chennai",
  region: "Tamil Nadu",
  country: "India",
  suburb: "Anna Nagar",
  lat: 13.0827,
  lng: 80.2707,
  radiusKm: 10,
  isLive: true,
  source: "browser_tz",
  updatedAt: Date.now(),
};

const AccessLocationContext = createContext<AccessLocationContextType | undefined>(undefined);

const STORAGE_KEY = "locatepin_access_location_v1";

export const AccessLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<AccessLocation>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...parsed, radiusKm: 10 }; // Always enforce 10 km radius
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_LOCATION;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist
  const persistLocation = (loc: AccessLocation) => {
    setLocation(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      // ignore
    }
  };

  // Reverse geocode lat/lng to get exact city and suburb
  const reverseGeocode = async (lat: number, lng: number): Promise<{ city: string; region: string; country: string; suburb?: string } | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const city =
          addr.city ||
          addr.town ||
          addr.suburb ||
          addr.village ||
          addr.municipality ||
          addr.city_district ||
          addr.county ||
          "Detected Place";
        const region = addr.state || addr.state_district || "";
        const country = addr.country || "India";
        const suburb = addr.neighbourhood || addr.suburb || addr.residential || "";
        return {
          city: city.replace(/Corporation|District|Division/gi, "").trim(),
          region,
          country,
          suburb,
        };
      }
    } catch (e) {
      console.warn("Reverse geocode failed, falling back to coordinates", e);
    }
    return null;
  };

  // Fetch location via IP
  const fetchIpLocation = async (): Promise<AccessLocation | null> => {
    try {
      const res = await fetch("https://ipwho.is/");
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.success) {
        return {
          city: data.city || "Chennai",
          region: data.region || "Tamil Nadu",
          country: data.country || "India",
          lat: data.latitude || 13.0827,
          lng: data.longitude || 80.2707,
          radiusKm: 10,
          isLive: true,
          source: "ip",
          updatedAt: Date.now(),
        };
      }
    } catch (e) {
      console.warn("IP geolocation fallback error", e);
    }
    return null;
  };

  // Request browser GPS position
  const requestGpsLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocatingGps(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const geoInfo = await reverseGeocode(latitude, longitude);

        const newLoc: AccessLocation = {
          city: geoInfo?.city || location.city || "Current Location",
          region: geoInfo?.region || location.region || "",
          country: geoInfo?.country || location.country || "India",
          suburb: geoInfo?.suburb,
          lat: latitude,
          lng: longitude,
          radiusKm: 10,
          isLive: true,
          source: "gps",
          accuracyMeters: Math.round(accuracy),
          updatedAt: Date.now(),
        };

        persistLocation(newLoc);
        setIsLocatingGps(false);
      },
      (err) => {
        console.warn("GPS access denied or timed out:", err.message);
        setError("GPS permission denied or unavailable. Using network location.");
        setIsLocatingGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, [location.city, location.region, location.country]);

  // Set manual / selected location
  const setCustomLocation = (city: string, region: string = "", lat: number = 13.0827, lng: number = 80.2707) => {
    const newLoc: AccessLocation = {
      city,
      region,
      country: "India",
      lat,
      lng,
      radiusKm: 10,
      isLive: true,
      source: "manual",
      updatedAt: Date.now(),
    };
    persistLocation(newLoc);
  };

  // Reset to auto-detected
  const resetToDetected = () => {
    localStorage.removeItem(STORAGE_KEY);
    detectInitialLocation();
  };

  // Initial detection routine
  const detectInitialLocation = async () => {
    setIsLoading(true);

    // 1. Try IP detection first for rapid zero-delay accuracy
    const ipLoc = await fetchIpLocation();
    if (ipLoc) {
      persistLocation(ipLoc);
    }

    // 2. Try HTML5 geolocation if permission is already allowed
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const geoInfo = await reverseGeocode(latitude, longitude);
          if (geoInfo) {
            persistLocation({
              city: geoInfo.city,
              region: geoInfo.region,
              country: geoInfo.country,
              suburb: geoInfo.suburb,
              lat: latitude,
              lng: longitude,
              radiusKm: 10,
              isLive: true,
              source: "gps",
              accuracyMeters: Math.round(accuracy),
              updatedAt: Date.now(),
            });
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 4000,
          maximumAge: 180000,
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectInitialLocation();
  }, []);

  // Display text: e.g. "Chennai Live • 10 km Radius"
  const displayPillText = `${location.city} Live • 10 km Radius`;

  return (
    <AccessLocationContext.Provider
      value={{
        location,
        isLoading,
        isLocatingGps,
        error,
        displayPillText,
        requestGpsLocation,
        setCustomLocation,
        resetToDetected,
      }}
    >
      {children}
    </AccessLocationContext.Provider>
  );
};

export const useAccessLocation = () => {
  const context = useContext(AccessLocationContext);
  if (!context) {
    throw new Error("useAccessLocation must be used within an AccessLocationProvider");
  }
  return context;
};
