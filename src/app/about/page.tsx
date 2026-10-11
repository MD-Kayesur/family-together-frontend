"use client";

import React, { useState } from "react";
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
  Lock,
  Database,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDashboardRouteByRole, getDashboardLabelByRole } from "@/lib/utils/roleUtils";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";

export default function AboutPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const dashboardHref = getDashboardRouteByRole(user?.role);
  const dashboardLabel = getDashboardLabelByRole(user?.role);

  const pillars = [
    {
      icon: TreePine,
      title: "Interactive 2D Family Tree",
      color: "from-indigo-500 to-purple-600",
      description:
        "Visualize your lineage fluidly across generations. Drag, pan, zoom, and inspect parent-child and spousal ties in an intuitive canvas.",
    },
    {
      icon: ShieldCheck,
      title: "Real-Time Relative Deduplication",
      color: "from-emerald-500 to-teal-600",
      description:
        "Smart fuzzy matching detects duplicate relative entries before they are saved, keeping your genealogical records immaculate and organized.",
    },
    {
      icon: ImageIcon,
      title: "Milestone Photo & Memory Vault",
      color: "from-rose-500 to-pink-600",
      description:
        "Archive cherished family albums, milestone celebrations, and historical photos with tags, captions, and full-screen lightbox viewing.",
    },
    {
      icon: FolderLock,
      title: "100MB Encrypted Document Archive",
      color: "from-amber-500 to-orange-600",
      description:
        "Safely preserve high-resolution scans of birth records, land deeds, heirloom family recipes, and certificates up to 100MB per file.",
    },
    {
      icon: Calendar,
      title: "Family Gatherings & RSVP Scheduler",
      color: "from-cyan-500 to-blue-600",
      description:
        "Coordinate annual family reunions, memorial days, and birthday dinners with real-time attendee RSVP counters.",
    },
    {
      icon: Lock,
      title: "Multi-Tenant Sanctuary Isolation",
      color: "from-violet-500 to-purple-600",
      description:
        "Your family's data is strictly partitioned. No ads, no public crawlers, and zero algorithm feeds—only verified relatives you invite can enter.",
    },
  ];

  const faqs = [
    {
      q: "Why should our family use FamilyRoots instead of social media or group chats?",
      a: "Social media feeds are public, noisy, and monetize your private data through ads and algorithms. Group chats bury historic photos and certificates under thousands of messages. FamilyRoots provides an ad-free, private digital sanctuary where your tree, photos, documents, and milestones are preserved in order forever.",
    },
    {
      q: "Do deceased ancestors or elderly grandparents require an email address?",
      a: "Not at all. You can add any relative (living or passed) as a genealogical person profile without an email. Only family members who want to actively log in to view and contribute require an email and account.",
    },
    {
      q: "How does the platform protect our family's data privacy?",
      a: "FamilyRoots uses strict multi-tenant isolation. All family records, media, and documents are bound to your sanctuary's unique family ID and never indexed by search engines, sold to advertisers, or accessible to other families.",
    },
    {
      q: "Can I try FamilyRoots for free?",
      a: "Yes! Every family receives our Free Sanctuary tier immediately upon creating an account. It includes up to 25 family members, 500 MB cloud vault storage, full interactive tree access, and event planning with zero credit card required.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] dark:bg-slate-950 text-[#141b2b] dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Unified Global Navbar matching Home page */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        {/* Hero Section matching Home Page Aesthetic */}
        <section className="relative bg-gradient-to-b from-[#f9f9ff] dark:from-slate-950 via-[#e2dfff]/30 dark:via-indigo-950/20 to-[#f9f9ff] dark:to-slate-950 pt-20 pb-20 px-6 lg:px-12 overflow-hidden transition-colors">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dedicated Family Sanctuary</span>
            </div>

            {/* Headline matching Home */}
            <h1 className="text-4xl sm:text-6xl lg:text-[60px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight mb-6 max-w-4xl">
              Preserving your heritage,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                connected forever.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mb-10 font-normal leading-relaxed">
              FamilyRoots is an invite-only private digital sanctuary for multi-generational families. We replace scattered messaging chats and public social feeds with an interactive 2D family tree, encrypted photo and document vaults, and generational preservation.
            </p>

            {/* Call to Actions matching Home Page */}
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
                    href="/#features"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Explore Features</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Philosophy & Purpose Section */}
        <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Why We Built FamilyRoots
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional social platforms were never designed for sacred family memories. Here is how FamilyRoots creates a better way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Problem Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
                  <span>The Status Quo</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Fragmented Chats & Public Feeds
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Family milestones are scattered across messaging groups, email threads, and public social networks. Precious wedding photos from 1975 or scanned property deeds disappear, younger generations lose touch with their lineage, and data is mined for targeted ads.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>No lineage hierarchy or generational relationships</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>Ad-tracking algorithms and public exposure</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>Scattered file formats with zero long-term archiving</span>
                  </li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase">
                  <span>The Sanctuary Solution</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  A Unified, Private Family Vault
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  FamilyRoots provides an all-in-one digital estate. An interactive visual tree maps every generation, duplicate relatives are automatically prevented, encrypted vaults house photos and deeds up to 100MB, and family members can gather across any distance.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Interactive 2D generational mapping for all living & ancestors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>100% private sanctuary with multi-tenant data boundaries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>High-resolution document archiving and real-time event planning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Architectural Pillars Section */}
        <section className="py-20 px-6 lg:px-12 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Core Architectural Pillars
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Engineered with enterprise security, real-time data integrity, and thoughtful genealogical modeling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 transition-all hover:-translate-y-1.5 hover:shadow-xl space-y-4"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3 Simple Steps */}
        <section className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Start preserving your family legacy in 3 effortless steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <span className="inline-block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">01</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Your Sanctuary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sign up in under 30 seconds with your email and give your sanctuary a name. You become the family Owner with full administrative control.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <span className="inline-block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">02</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Map Your Roots & Relatives</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Use our interactive tree tool to add parents, grandparents, siblings, and children. Real-time duplicate validation keeps records clean.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <span className="inline-block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">03</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Preserve Memories & Invite Kin</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload cherished photo albums, schedule family gatherings, archive vital documents, and send 1-click magic links to invite relatives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 lg:px-12 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                Answers for Families
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                Everything you need to know about privacy, memberships, and preserving your family legacy.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
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
                      <div
                        className={`p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform ${
                          isOpen
                            ? "rotate-180 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
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

            {/* Bottom Call to Action Banner matching Home */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/30 mt-12">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-extrabold tracking-tight">Ready to preserve your family legacy?</h3>
                <p className="text-sm text-indigo-100 max-w-lg">
                  Join families around the world building their private digital sanctuary today. Free forever to get started.
                </p>
              </div>
              <Link
                href="/signup"
                className="bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition-all shadow-md shrink-0 flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Create Your Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Global Footer matching Home page */}
      <PublicFooter />
    </div>
  );
}
