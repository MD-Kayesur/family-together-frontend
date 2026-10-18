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
import { Language } from "@/lib/i18n/translations";

interface LanguageSwitcherModalProps {
  className?: string;
  variant?: "navbar" | "compact" | "button";
}

// Default 4 primary featured languages requested by user
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
      }, 100);
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

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return supportedLanguages;
    return supportedLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [supportedLanguages, searchQuery]);

  // Featured 4 language objects
  const featuredLanguages = useMemo(() => {
    return DEFAULT_4_LANGUAGES.map((code) =>
      supportedLanguages.find((l) => l.code === code)
    ).filter(Boolean);
  }, [supportedLanguages]);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/30 to-transparent">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>Translate / ভাষা পরিবর্তন</span>
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Choose Language
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select from our top 4 primary languages or search across all 25 supported world languages.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close language modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages (e.g. English, বাংলা, Español, العربية, Urdu)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-5 space-y-6 flex-1">
              {/* Default 4 Primary Languages (when search is empty) */}
              {!searchQuery && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Default & Popular Languages (৪টি মূল ভাষা)
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Quick Select
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {featuredLanguages.map((lang: any) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-600 shadow-sm"
                              : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl leading-none">{lang.flag}</span>
                            <div>
                              <p className={`text-xs font-bold leading-tight ${isSelected ? "text-indigo-900 dark:text-indigo-200" : "text-slate-900 dark:text-white"}`}>
                                {lang.nativeName}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                {lang.name}
                              </p>
                            </div>
                          </div>

                          {isSelected ? (
                            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {lang.code}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Supported Languages (Searchable 25 Languages) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {searchQuery ? "Search Results" : "All Supported Languages (সকল ২৫টি ভাষা)"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {filteredLanguages.length} {filteredLanguages.length === 1 ? "language" : "languages"}
                  </span>
                </div>

                {filteredLanguages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No supported language found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredLanguages.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`px-3 py-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm"
                              : "bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg leading-none shrink-0">{lang.flag}</span>
                            <div className="truncate">
                              <p className="text-xs leading-snug truncate">
                                {lang.nativeName}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
                                {lang.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {lang.direction === "rtl" && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                RTL
                              </span>
                            )}
                            {isSelected && (
                              <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (Geolocation Status & Auto-Detect Reset) */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>
                  {countryName
                    ? `Detected location: ${cityName ? `${cityName}, ` : ""}${countryName}`
                    : "Automatic geolocation active"}
                </span>
              </div>

              {isManualOverride && (
                <button
                  type="button"
                  onClick={async () => {
                    await resetToGeoLocation();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Auto-Detect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
