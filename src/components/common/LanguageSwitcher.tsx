"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";

export default function LanguageSwitcher() {
  const {
    currentLanguage,
    setLanguage,
    supportedLanguages,
    countryName,
    cityName,
    hasAutoSwitched,
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj = supportedLanguages.find((l) => l.code === currentLanguage);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer"
        aria-label="Switch platform language"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm leading-none">{currentLangObj?.flag}</span>
        <span className="uppercase tracking-wider text-[11px] font-bold">
          {currentLangObj?.code}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Language / ভাষা
            </span>
          </div>

          <div className="py-1 space-y-0.5 px-1.5">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="text-left">
                      <p className="leading-tight">{lang.nativeName}</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        {lang.name}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>

          {/* Geolocation indicator footer */}
          {countryName && (
            <div className="mt-1 px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 rounded-b-xl flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">
                Detected: {cityName ? `${cityName}, ` : ""}{countryName}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
