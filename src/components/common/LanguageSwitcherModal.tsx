"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Globe,
  Search,
  Check,
  X,
  MapPin,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language, SupportedLanguageInfo } from "@/lib/i18n/translations";

interface LanguageSwitcherModalProps {
  className?: string;
  variant?: "navbar" | "compact" | "button";
}

// Exactly 4 primary default languages as requested
const DEFAULT_4_LANGUAGES: Language[] = ["en", "bn", "es", "ar"];

export default function LanguageSwitcherModal({
  className = "",
  variant = "navbar",
}: LanguageSwitcherModalProps) {
  const {
    currentLanguage,
    setLanguage,
    resetToGeoLocation,
    supportedLanguages,
    countryName,
    cityName,
    isManualOverride,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const currentLangObj = supportedLanguages.find((l) => l.code === currentLanguage);

  // Core Display Logic:
  // 1. When NO search query is typed: Show ONLY the 4 default languages!
  // 2. When user types in search: Filter across ALL 25 supported languages and show exact match(es)!
  const displayedLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return DEFAULT_4_LANGUAGES.map((code) =>
        supportedLanguages.find((l) => l.code === code)
      ).filter((l): l is SupportedLanguageInfo => Boolean(l));
    }
    return supportedLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [supportedLanguages, searchQuery]);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      {/* Navbar Trigger Button */}
      <button
        type="button"
        id="open-language-modal-btn"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all hover:scale-105 cursor-pointer backdrop-blur-sm ${className}`}
        aria-label="Switch Language / Translate"
        title="Translate / Change Language"
      >
        <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="text-sm leading-none">{currentLangObj?.flag}</span>
        <span className="hidden sm:inline-block font-medium">
          {currentLangObj?.nativeName || currentLangObj?.name}
        </span>
        <span className="sm:hidden font-bold uppercase tracking-wider text-[11px]">
          {currentLangObj?.code}
        </span>
      </button>

      {/* Language Selection Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-modal-title"
          >
            {/* 1. Modal Top Bar / Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 dark:from-indigo-950/40 via-transparent to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h3
                    id="language-modal-title"
                    className="text-base font-extrabold text-slate-900 dark:text-white leading-tight"
                  >
                    Select Language / ভাষা
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {searchQuery
                      ? `Searching all 25 supported languages`
                      : `Default 4 languages or search any language`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="close-language-modal-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 2. Input Field for Search (Above) */}
            <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-indigo-500 dark:text-indigo-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  id="language-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages (e.g. Bangla, Spanish, French, Urdu)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Divider Line */}
            <div className="h-px w-full bg-slate-200/80 dark:bg-slate-800" />

            {/* 4. Language List Area (Below) */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[340px] space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {searchQuery ? "Search Results" : "Featured Languages (৪টি মূল ভাষা)"}
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {searchQuery
                    ? `${displayedLanguages.length} found`
                    : "Default 4"}
                </span>
              </div>

              {displayedLanguages.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No language found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Try searching for Arabic, Bengali, English, French, Hindi, Japanese, Spanish, or Urdu.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {displayedLanguages.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-600 shadow-sm"
                            : "bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/90"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl leading-none shrink-0">
                            {lang.flag}
                          </span>
                          <div className="truncate">
                            <p
                              className={`text-xs font-bold leading-tight truncate ${
                                isSelected
                                  ? "text-indigo-900 dark:text-indigo-200"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {lang.nativeName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                              {lang.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lang.direction === "rtl" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                              RTL
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                            {lang.code}
                          </span>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Footer with Geolocation Status & Reset */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] truncate">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {countryName
                    ? `${cityName ? `${cityName}, ` : ""}${countryName}`
                    : "Auto-detect geolocation active"}
                </span>
              </div>

              {isManualOverride && (
                <button
                  type="button"
                  id="reset-language-geo-btn"
                  onClick={async () => {
                    await resetToGeoLocation();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Auto-Detect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
