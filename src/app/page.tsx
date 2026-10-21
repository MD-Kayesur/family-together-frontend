"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TreePine,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
  Image as ImageIcon,
  FolderLock,
  Sparkles,
  Heart,
  LogIn,
  LogOut,
  UserCheck,
  LayoutDashboard,
  Globe,
  Lock,
  Database,
  Shield,
  CheckCircle2,
  Quote,
  Menu,
  X,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] dark:bg-slate-950 text-[#141b2b] dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Global Unified Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section - Immersive Full-Screen Edge-to-Edge with Deep Text-Side Shadow */}
        <section className="relative w-full min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#f9f9ff] dark:bg-slate-950 transition-colors">
          {/* 1. Full-Screen Edge-to-Edge Background Image (Full Width & Full Height) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <img
              src="/hero-family-showcase.jpg"
              alt="FamilyRoots Digital Sanctuary Showcase"
              className="w-full h-full object-cover object-[75%_center] sm:object-[70%_center] lg:object-right-top scale-100 transform transition-transform duration-1000 ease-out"
            />

            {/* Ambient colorful glowing orbs softly augmenting the image */}
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-indigo-600/30 dark:bg-indigo-600/35 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-12 w-[450px] h-[450px] bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-purple-600/25 dark:bg-purple-600/30 rounded-full blur-3xl" />

            {/* 2. CRITICAL: Left-Side Deep Shadow & Gradient Blur covering the text side */}
            {/* Horizontal gradient: Solid on the left (under the text), smoothly fading to transparent towards the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f9f9ff] via-[#f9f9ff]/95 via-35% sm:via-42% lg:via-48% to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:via-35% dark:sm:via-42% dark:lg:via-50% dark:to-transparent pointer-events-none z-10" />

            {/* Atmospheric extra left-side shadow & subtle blur so text readability is 100% razor sharp */}
            <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-[#f9f9ff]/90 dark:from-slate-950/90 via-[#f9f9ff]/60 dark:via-slate-950/60 to-transparent backdrop-blur-[2px] pointer-events-none z-10" />

            {/* Top and Bottom edge vignettes for seamless blend */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f9f9ff] dark:from-slate-950 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f9f9ff] dark:from-slate-950 to-transparent pointer-events-none z-10" />
          </div>

          {/* 3. Foreground Content Container */}
          <div className="max-w-7xl mx-auto w-full relative z-20 px-6 sm:px-8 lg:px-12 py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Column: Hero Text, Badge & Actions (lg:col-span-7 xl:col-span-6) */}
            <div className="lg:col-span-7 xl:col-span-6 text-left flex flex-col items-start space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t("home.badge")}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[48px] xl:text-[56px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight">
                {t("home.title")}{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("home.titleHighlight")}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow-xs">
                {t("home.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
                {mounted && isAuthenticated && user ? (
                  <Link
                    href={dashboardHref}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>{t("common.goToDashboard", { dashboard: dashboardLabel })}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{t("home.createFamily")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/signin"
                      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>{t("home.exploreDemo")}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges / Highlights */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>100% Private & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>25+ Global Languages</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Glassmorphic Badges on the right of the full screen image */}
            <div className="lg:col-span-5 xl:col-span-6 hidden lg:flex flex-col items-end justify-between h-[calc(100vh-14rem)] max-h-[580px] pointer-events-none relative z-20">
              {/* Top-Right Floating Glass Badge */}
              <div className="pointer-events-auto px-4 py-2 rounded-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border border-white/40 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
                <TreePine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>3+ Generations Connected</span>
              </div>

              {/* Bottom-Right Floating Glass Card */}
              <div className="pointer-events-auto p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-2xl flex items-center justify-between gap-4 max-w-sm hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Family Tree Sanctuary</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict Multi-Tenant Privacy Isolation</p>
                  </div>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Family Tree Canvas (Full-Screen Edge-to-Edge DB Design Canvas) */}
        <section className="w-full h-screen min-h-screen p-0 m-0 overflow-hidden relative">
          <LandingFamilyTreeCanvas variant="fullscreen" readOnly={false} storageKey="landing_tree_v6" />
        </section>

        {/* The Signature Tree Section */}
        <section id="features" className="py-24 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t("tree.signatureTitle")}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("tree.signatureDesc")}
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-800/50">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t("tree.dynamicTitle")}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t("tree.dynamicDesc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t("tree.insightsTitle")}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t("tree.insightsDesc")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View-Only Signature Tree Preview Card (Auto-synced with above interactive canvas) */}
            <div className="w-full relative">
              <LandingFamilyTreeCanvas variant="card" readOnly={true} storageKey="landing_tree_v6" />
            </div>
          </div>
        </section>

        {/* Legacy Vaults Section */}
        <section className="py-24 px-6 lg:px-12 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t("vaults.title")}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("vaults.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Memories */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-indigo-600/20">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t("vaults.memoriesTitle")}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("vaults.memoriesDesc")}
                </p>
              </div>

              {/* Documents */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-purple-600/20">
                  <FolderLock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t("vaults.documentsTitle")}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("vaults.documentsDesc")}
                </p>
              </div>

              {/* Events */}
              <div className="group bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-emerald-600/20">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t("vaults.eventsTitle")}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("vaults.eventsDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy First Section */}
        <section className="py-24 px-6 lg:px-12 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t("privacy.title")}
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                {t("privacy.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                  <Lock className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">{t("privacy.encryptionTitle")}</h4>
                <p className="text-sm text-slate-400">{t("privacy.encryptionDesc")}</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Database className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">{t("privacy.sovereigntyTitle")}</h4>
                <p className="text-sm text-slate-400">{t("privacy.sovereigntyDesc")}</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-white">{t("privacy.sanctuaryTitle")}</h4>
                <p className="text-sm text-slate-400">{t("privacy.sanctuaryDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 relative transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t("pricing.title")}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("pricing.subtitleHome")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Legacy Starter */}
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t("pricing.starterTitle")}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{t("pricing.starterPrice")}</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("pricing.starterPeriod")}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("pricing.starterDesc")}</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{t("pricing.starterFeature1")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{t("pricing.starterFeature2")}</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("pricing.starterBtn")}
                </button>
              </div>

              {/* Growth Premium */}
              <div className="bg-indigo-600 text-white rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-2xl relative border-2 border-indigo-500">
                <span className="absolute -top-3.5 right-8 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t("pricing.growthBadge")}
                </span>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-white">{t("pricing.growthTitle")}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{t("pricing.growthPrice")}</span>
                    <span className="text-sm font-medium text-indigo-200">{t("pricing.growthPeriod")}</span>
                  </div>
                  <p className="text-sm text-indigo-100">{t("pricing.growthDesc")}</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>{t("pricing.growthFeature1")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>{t("pricing.growthFeature2")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white">
                      <CheckCircle2 className="h-5 w-5 text-indigo-200 shrink-0" />
                      <span>{t("pricing.growthFeature3")}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl bg-white text-indigo-600 font-bold text-xs hover:bg-slate-100 transition-colors text-center block shadow-md"
                >
                  {t("pricing.growthBtn")}
                </Link>
              </div>

              {/* Heritage Pro */}
              <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t("pricing.heritageTitle")}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{t("pricing.heritagePrice")}</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("pricing.heritagePeriod")}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("pricing.heritageDesc")}</p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{t("pricing.heritageFeature1")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{t("pricing.heritageFeature2")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{t("pricing.heritageFeature3")}</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("pricing.heritageBtn")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 lg:px-12 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t("faq.questionsBadge")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t("faq.titleMain")}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                {t("faq.subtitleMain")}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { q: t("faq.q1"), a: t("faq.a1") },
                { q: t("faq.q2"), a: t("faq.a2") },
                { q: t("faq.q3"), a: t("faq.a3") },
                { q: t("faq.q4"), a: t("faq.a4") },
                { q: t("faq.q5"), a: t("faq.a5") },
                { q: t("faq.q6"), a: t("faq.a6") },
                { q: t("faq.q7"), a: t("faq.a7") },
                { q: t("faq.q8"), a: t("faq.a8") },
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                      <div className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform ${isOpen ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 whitespace-pre-line bg-slate-50/40 dark:bg-slate-950/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Call to Action Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/30 mt-12">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-extrabold tracking-tight">{t("faq.ctaTitle")}</h3>
                <p className="text-sm text-indigo-100 max-w-lg">
                  {t("faq.ctaSubtitle")}
                </p>
              </div>
              <Link
                href="/signup"
                className="bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-md shrink-0 flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>{t("faq.ctaButton")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Unified Footer */}
      <PublicFooter />
    </div>
  );
}
