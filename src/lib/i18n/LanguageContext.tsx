"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Language,
  SUPPORTED_LANGUAGES,
  SupportedLanguageInfo,
  TranslationKey,
  getTranslation,
} from "./translations";

interface GeoCacheData {
  countryCode: string;
  countryName: string;
  cityName: string;
  suggestedLanguage: Language;
  timestamp: number;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  resetToGeoLocation: () => Promise<void>;
  isManualOverride: boolean;
  countryCode: string | null;
  countryName: string | null;
  cityName: string | null;
  isDetectingGeo: boolean;
  hasAutoSwitched: boolean;
  supportedLanguages: SupportedLanguageInfo[];
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = "family_roots_lang";
const STORAGE_MANUAL_KEY = "family_roots_lang_manual";
const STORAGE_GEO_KEY = "family_roots_geo_cache";
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>("en");
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [isDetectingGeo, setIsDetectingGeo] = useState<boolean>(true);
  const [hasAutoSwitched, setHasAutoSwitched] = useState<boolean>(false);

  // Apply lang and direction to <html> document element
  const applyHtmlAttributes = (lang: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === "ar" || lang === "ur" || lang === "fa") ? "rtl" : "ltr";
    }
  };

  // Perform Geolocation Detection and Language Resolution
  const initializeLanguage = async (forceRefreshGeo = false) => {
    try {
      setIsDetectingGeo(true);

      // 0. Check URL query parameter ?lang= (e.g. /pricing?lang=bn)
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get("lang") as Language | null;
        if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
          setIsManualOverride(true);
          setCurrentLanguageState(urlLang);
          applyHtmlAttributes(urlLang);
          localStorage.setItem(STORAGE_LANG_KEY, urlLang);
          localStorage.setItem(STORAGE_MANUAL_KEY, "true");
          setIsDetectingGeo(false);
          return;
        }
      }

      // 1. Check if user has an explicit manual override in localStorage
      const manualFlag = typeof window !== "undefined" && localStorage.getItem(STORAGE_MANUAL_KEY) === "true";
      const savedLang = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_LANG_KEY) as Language | null) : null;
      const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === savedLang);

      if (!forceRefreshGeo && manualFlag && savedLang && isSupported) {
        setIsManualOverride(true);
        setCurrentLanguageState(savedLang);
        applyHtmlAttributes(savedLang);
        setIsDetectingGeo(false);
        return;
      }

      // 2. Check 24-hour cached geolocation result if not force refreshed
      if (!forceRefreshGeo && typeof window !== "undefined") {
        const cachedGeoJson = localStorage.getItem(STORAGE_GEO_KEY);
        if (cachedGeoJson) {
          try {
            const cached: GeoCacheData = JSON.parse(cachedGeoJson);
            const now = Date.now();
            if (now - cached.timestamp < GEO_CACHE_TTL_MS) {
              setCountryCode(cached.countryCode);
              setCountryName(cached.countryName);
              setCityName(cached.cityName);
              setCurrentLanguageState(cached.suggestedLanguage);
              applyHtmlAttributes(cached.suggestedLanguage);
              setHasAutoSwitched(cached.suggestedLanguage !== "en");
              setIsDetectingGeo(false);
              return;
            }
          } catch {
            localStorage.removeItem(STORAGE_GEO_KEY);
          }
        }
      }

      // 3. Fetch real-time Geolocation from /api/geo
      const res = await fetch("/api/geo", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // If the location is English (US, UK, CA, AU, NZ) or unmapped, default to 'en'
          const suggested: Language = data.suggestedLanguage || "en";

          setCountryCode(data.countryCode || null);
          setCountryName(data.countryName || null);
          setCityName(data.cityName || null);
          setCurrentLanguageState(suggested);
          applyHtmlAttributes(suggested);

          if (suggested !== "en") {
            setHasAutoSwitched(true);
          }

          // Cache geolocation details
          if (typeof window !== "undefined") {
            const cachePayload: GeoCacheData = {
              countryCode: data.countryCode || "",
              countryName: data.countryName || "",
              cityName: data.cityName || "",
              suggestedLanguage: suggested,
              timestamp: Date.now(),
            };
            localStorage.setItem(STORAGE_GEO_KEY, JSON.stringify(cachePayload));
          }
        }
      }
    } catch (err) {
      console.warn("[LanguageProvider] Geolocation lookup error:", err);
    } finally {
      setIsDetectingGeo(false);
    }
  };

  useEffect(() => {
    initializeLanguage();
  }, []);

  // User manually chooses a language from Profile or Language Modal
  const setLanguage = (lang: Language) => {
    setCurrentLanguageState(lang);
    setIsManualOverride(true);
    setHasAutoSwitched(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      localStorage.setItem(STORAGE_MANUAL_KEY, "true");
      // Seamlessly sync URL query parameter without full-page reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        console.warn("[LanguageContext] Failed to update URL lang param:", e);
      }
    }
    applyHtmlAttributes(lang);
  };

  // Revert back to auto-detecting language based on connecting location
  const resetToGeoLocation = async () => {
    setIsManualOverride(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_MANUAL_KEY);
      localStorage.removeItem(STORAGE_GEO_KEY);
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("lang");
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        console.warn("[LanguageContext] Failed to clear URL lang param:", e);
      }
    }
    await initializeLanguage(true);
  };

  const t = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, string | number>) =>
      getTranslation(currentLanguage, key, params);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        resetToGeoLocation,
        isManualOverride,
        countryCode,
        countryName,
        cityName,
        isDetectingGeo,
        hasAutoSwitched,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  return { t, currentLanguage, setLanguage };
}
