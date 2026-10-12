"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  ChevronDown,
  Check,
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SupportedLanguageInfo } from "@/lib/i18n/translations";

export default function ProfileLanguageSelector() {
  const {
    currentLanguage,
    setLanguage,
    resetToGeoLocation,
    isManualOverride,
    supportedLanguages,
    countryName,
    cityName,
    isDetectingGeo,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const currentLangObj = supportedLanguages.find((l) => l.code === currentLanguage) || supportedLanguages[0];

  const filteredLanguages = supportedLanguages.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = (lang: SupportedLanguageInfo) => {
    setLanguage(lang.code);
    setIsOpen(false);
    setSearchQuery("");
    setSuccessToast(`Language changed to ${lang.nativeName} (${lang.name}). Applied across all pages!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleResetToGeo = async () => {
    setIsResetting(true);
    await resetToGeoLocation();
    setIsResetting(false);
    setSuccessToast("Reset to automatic location detection! Language updated.");
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Globe className="h-5 w-5" />
            </div>
            <span>Language & Localization Preferences</span>
          </h3>
          <p className="text-xs text-slate-400">
            Automatically set based on your connecting location (or English by default), with full freedom to choose any world language.
          </p>
        </div>

        {/* Location Detection Pill & Auto-Detect Reset */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {countryName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Location: {cityName ? `${cityName}, ` : ""}{countryName}</span>
            </div>
          )}

          {isManualOverride ? (
            <button
              type="button"
              onClick={handleResetToGeo}
              disabled={isResetting || isDetectingGeo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/60 text-[11px] text-indigo-300 font-bold transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
              title="Reset to automatically detect language based on current location"
            >
              <RotateCcw className={`h-3 w-3 ${isResetting ? "animate-spin" : ""}`} />
              <span>Auto-Detect by Location</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[10px] text-emerald-400 font-extrabold">
              <Sparkles className="h-3 w-3" />
              <span>Auto Location Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Selector Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-200">
            Active Display Language
          </label>
          <span className="text-[11px] text-slate-400 font-normal">
            {isManualOverride ? "Custom selection" : "Set by connecting location"}
          </span>
        </div>

        {/* Caret Dropdown Trigger */}
        <div className="relative max-w-md" ref={dropdownRef}>
          <button
            type="button"
            id="profile-language-caret-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 text-white font-medium transition-all shadow-inner cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">{currentLangObj.flag}</span>
              <div className="text-left">
                <p className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {currentLangObj.nativeName}
                </p>
                <p className="text-[11px] text-slate-400 font-normal">
                  {currentLangObj.name} • <span className="uppercase font-semibold text-slate-500">{currentLangObj.code}</span>
                </p>
              </div>
            </div>

            {/* Caret Icon */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 uppercase">
                Active
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-white ${
                  isOpen ? "rotate-180 text-indigo-400" : ""
                }`}
              />
            </div>
          </button>

          {/* Expanded Dropdown Menu with Caret List */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              {/* Search input filter */}
              <div className="p-2 border-b border-slate-800/80">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search world languages..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Scrollable Language List */}
              <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                {filteredLanguages.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500">
                    No matching language found.
                  </div>
                ) : (
                  filteredLanguages.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl leading-none">{lang.flag}</span>
                          <div className="text-left">
                            <p className="leading-tight font-bold text-white">
                              {lang.nativeName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-normal">
                              {lang.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono text-slate-500">
                            {lang.code}
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer info inside dropdown */}
              <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/60 rounded-b-xl flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>25 World Languages Supported</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Instant i18n
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
