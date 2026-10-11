"use client";

import React from "react";
import Link from "next/link";
import {
  TreePine,
  ShieldCheck,
  Image as ImageIcon,
  FolderLock,
  Calendar,
  Lock,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  Activity,
  Users,
  Eye,
  Zap,
  Shield
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import LandingFamilyTreeCanvas from "@/components/tree/LandingFamilyTreeCanvas";

export default function FeaturesPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  const featureDeepDives = [
    {
      badge: "Genealogy Engine",
      title: "Interactive 2D Generational Tree Visualizer",
      description:
        "Trace your lineage with fluid zoom, pan, and dynamic relationship modeling. Parents, children, siblings, and spouses are organized automatically without cluttered lines.",
      points: [
        "Dynamic layout engine with smooth SVG connecting curves",
        "Add relatives living or deceased without requiring email addresses",
        "Instant profile inspection with birth, death, and relationship details",
      ],
      icon: TreePine,
    },
    {
      badge: "Data Integrity",
      title: "Smart Relative Deduplication & Auto-Linking",
      description:
        "Never accidentally create duplicate parents or siblings. Our engine cross-references existing names and emails in real time as you type.",
      points: [
        "Live fuzzy match analysis with immediate visual warnings",
        "Eye preview to verify candidate relatives before linking",
        "1-click linking merges tree branches without duplicate DB rows",
      ],
      icon: ShieldCheck,
    },
    {
      badge: "Memory Vault",
      title: "Milestone Photo Gallery & Lightbox Viewer",
      description:
        "Preserve historic family photographs, milestone celebrations, and childhood moments in high fidelity with full-screen lightbox viewing.",
      points: [
        "Tag specific relatives to auto-link media directly to their tree card",
        "Organize by events, albums, and generational milestones",
        "Optimized image delivery for lightning-fast browsing on any device",
      ],
      icon: ImageIcon,
    },
    {
      badge: "Document Archive",
      title: "100MB Encrypted Document Preservation",
      description:
        "Store high-resolution scans of property deeds, immigration certificates, birth documents, and handwritten recipes safely.",
      points: [
        "Express 100MB payload support for massive multi-page scans",
        "Encrypted multi-tenant isolation per family sanctuary ID",
        "Instant search by document title, category, and date",
      ],
      icon: FolderLock,
    },
    {
      badge: "Kinship Events",
      title: "Family Gatherings & Real-Time RSVP Tracker",
      description:
        "Coordinate annual family reunions, milestone anniversaries, and memorial dates in a private, shared family calendar.",
      points: [
        "Real-time RSVP counters showing attending, maybe, and declined",
        "Location mapping, time zones, and event notes in one place",
        "Automated navbar reminders so relatives never miss a gathering",
      ],
      icon: Calendar,
    },
    {
      badge: "Enterprise Security",
      title: "Zero Public Crawlers & Role Governance",
      description:
        "Unlike public social networks that sell your data, FamilyRoots guarantees strict cryptographic multi-tenancy and granular role permissions.",
      points: [
        "Role-based dashboards for Owner, Admin, Member, and Viewer",
        "Zero ad trackers, algorithms, or public search engine exposure",
        "Invite-only magic links allow simple onboarding for relatives worldwide",
      ],
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] dark:bg-slate-950 text-[#141b2b] dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Unified Global Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section matching Home Page */}
        <section className="relative bg-gradient-to-b from-[#f9f9ff] dark:from-slate-950 via-[#e2dfff]/30 dark:via-indigo-950/20 to-[#f9f9ff] dark:to-slate-950 pt-20 pb-20 px-6 lg:px-12 overflow-hidden transition-colors">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Platform Capabilities</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[60px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight mb-6 max-w-4xl">
              Everything your family needs,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                in one private sanctuary.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mb-10 font-normal leading-relaxed">
              Explore the engineering and architecture behind FamilyRoots: from dynamic 2D genealogical mapping and intelligent deduplication to encrypted 100MB document preservation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardHref}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Go to {dashboardLabel}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Create Your Family</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>View Pricing Plans</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Live Tree Preview Interactive Card */}
        <section className="py-16 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Live Interactive Demonstration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Try The Signature Tree Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Pan, zoom, drag cards, or click to add family members directly in the live canvas below.
              </p>
            </div>

            <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-950 relative">
              <LandingFamilyTreeCanvas variant="fullscreen" readOnly={false} storageKey="features_tree_demo" />
            </div>
          </div>
        </section>

        {/* Detailed Feature Blocks */}
        <section className="py-20 px-6 lg:px-12 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Core Architectural Pillars
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Purpose-built tools designed to celebrate your relatives today while preserving memories for the next hundred years.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureDeepDives.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-5 transition-all hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                      {feat.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Call to Action Banner matching Home */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/30">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-extrabold tracking-tight">Ready to experience these features?</h3>
                <p className="text-sm text-indigo-100 max-w-lg">
                  Set up your family sanctuary in less than 60 seconds. Free forever tier included with full 2D tree mapping.
                </p>
              </div>
              <Link
                href="/signup"
                className="bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-md shrink-0 flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Create Your Sanctuary</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Global Footer */}
      <PublicFooter />
    </div>
  );
}
