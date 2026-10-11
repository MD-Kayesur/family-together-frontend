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
const STORAGE_GEO_KEY = "family_roots_geo_cache";
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>("en");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [isDetectingGeo, setIsDetectingGeo] = useState<boolean>(true);
  const [hasAutoSwitched, setHasAutoSwitched] = useState<boolean>(false);

  // Initialize and perform Geolocation Detection
  useEffect(() => {
    let isMounted = true;

    async function initializeLanguage() {
      try {
        // 1. Check if user already has an explicit preference in localStorage
        const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Language | null;
        if (savedLang === "en" || savedLang === "bn") {
          if (isMounted) {
            setCurrentLanguageState(savedLang);
            setIsDetectingGeo(false);
          }
          return;
        }

        // 2. Check if we have a valid 24h cached geolocation result
        const cachedGeoJson = localStorage.getItem(STORAGE_GEO_KEY);
        if (cachedGeoJson) {
          try {
            const cached: GeoCacheData = JSON.parse(cachedGeoJson);
            const now = Date.now();
            if (now - cached.timestamp < GEO_CACHE_TTL_MS) {
              if (isMounted) {
                setCountryCode(cached.countryCode);
                setCountryName(cached.countryName);
                setCityName(cached.cityName);
                setCurrentLanguageState(cached.suggestedLanguage);
                setHasAutoSwitched(cached.suggestedLanguage !== "en");
                setIsDetectingGeo(false);
              }
              return;
            }
          } catch {
            localStorage.removeItem(STORAGE_GEO_KEY);
          }
        }

        // 3. Fetch Geolocation from /api/geo
        const res = await fetch("/api/geo", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            const suggested: Language = data.suggestedLanguage || "en";
            setCountryCode(data.countryCode || null);
            setCountryName(data.countryName || null);
            setCityName(data.cityName || null);

            // Apply suggested language if user hasn't explicitly overridden it
            setCurrentLanguageState(suggested);
            if (suggested !== "en") {
              setHasAutoSwitched(true);
            }

            // Cache geolocation details
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
      } catch (err) {
        console.warn("[LanguageProvider] Geolocation lookup error:", err);
      } finally {
        if (isMounted) {
          setIsDetectingGeo(false);
        }
      }
    }

    initializeLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    setHasAutoSwitched(false);
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
